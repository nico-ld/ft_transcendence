import asyncio
import json
import logging
import uuid

from aiodocker.containers import DockerContainer
from aiodocker.exceptions import DockerError
from aiodocker.execs import Exec
from aiodocker.stream import Stream
from config import settings
from db.terminal_sessions import terminal_sessions_db
from docker.workspace import ImageNotBuilt, start_workspace
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from fastapi.concurrency import run_in_threadpool
from fastapi.websockets import WebSocketState
from security import SESSION_COOKIE, user_from_token

router = APIRouter(prefix="/ws", tags=["websocket"])
logger = logging.getLogger("uvicorn.error")

# watcher interval
SESSION_CHECK_SECONDS = 5

# (close code, reason) sent to the client when the terminal ends
ENDED = (status.WS_1000_NORMAL_CLOSURE, "Session ended")
FAILED = (status.WS_1011_INTERNAL_ERROR, "Terminal error")
REVOKED = (4401, "You were logged out, log in again to use the terminal")


async def pump_output(ws: WebSocket, stream: Stream):
    while True:
        msg = await stream.read_out()
        if msg is None:
            return
        await ws.send_bytes(msg.data)


async def pump_input(ws: WebSocket, stream: Stream, shell: Exec):
    while True:
        message = await ws.receive()
        if message["type"] == "websocket.disconnect":
            return
        # keystrokes come as binary frames
        if message.get("bytes") is not None:
            await stream.write_in(message["bytes"])
            continue
        # text frames are json control messages
        try:
            data = json.loads(message.get("text") or "")
        except ValueError:  # not json
            continue
        if not isinstance(data, dict):
            continue
        if data.get("type") == "resize":
            cols, rows = data.get("cols"), data.get("rows")
            if (
                isinstance(cols, int)
                and isinstance(rows, int)
                and cols > 0
                and rows > 0
            ):
                try:
                    await shell.resize(w=cols, h=rows)
                except DockerError:
                    # the shell exited pump_output ends the session
                    pass


async def watch_session(token: str | None, terminal_id: int):
    # watcher that checks every x seconds the cookie to
    # gracefully close the terminals after cookie expiry
    while True:
        await asyncio.sleep(SESSION_CHECK_SECONDS)
        if await run_in_threadpool(user_from_token, token) is None:
            return
        # count log time of the terminal
        await run_in_threadpool(terminal_sessions_db.touch, terminal_id)


async def run_session(
    ws: WebSocket, stream: Stream, shell: Exec, token: str | None, terminal_id: int
) -> tuple[int, str]:
    """Pipe the shell and the socket until one of them or the session ends.

    Returns:
        tuple[int, str]: the close code and reason to send to the client.
    """
    watcher = asyncio.create_task(watch_session(token, terminal_id))
    tasks = [
        asyncio.create_task(pump_output(ws, stream)),
        asyncio.create_task(pump_input(ws, stream, shell)),
        watcher,
    ]
    try:
        done, _ = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
    finally:
        for task in tasks:
            task.cancel()
        # wait for both to really stop and collect their errors so asyncio
        # doesnt log Task exception was never retrieved
        results = await asyncio.gather(*tasks, return_exceptions=True)
    failed = False
    for result in results:
        # stopped by us -> the client left while we were sending
        if isinstance(result, (asyncio.CancelledError, WebSocketDisconnect)):
            continue
        if isinstance(result, BaseException):
            logger.error("Terminal session failed", exc_info=result)
            failed = True
    if failed:
        return FAILED
    if watcher in done:
        return REVOKED
    return ENDED


async def hangup(container: DockerContainer, pidfile: str):
    # docker does not kill an exec when the client leaves so we do what a real
    # terminal does on close: SIGHUP the shell, it forwards it to its jobs
    try:
        kill = await container.exec(
            ["sh", "-c", f'kill -HUP "$(cat {pidfile})"; rm -f {pidfile}'],
            stdout=True,
            stderr=True,
        )
        async with kill.start() as stream:
            while await stream.read_out() is not None:
                pass
    except DockerError as e:
        # 404 removed, 409 stopped: the shell died with the container
        if e.status not in (404, 409):
            logger.warning("Couldn't hang up %s: %s", pidfile, e)


async def close(
    ws: WebSocket, code: int = status.WS_1000_NORMAL_CLOSURE, reason: str = ""
):
    # nothing to close if the client left or we already closed
    if (
        ws.client_state != WebSocketState.CONNECTED
        or ws.application_state != WebSocketState.CONNECTED
    ):
        return
    try:
        await ws.close(code=code, reason=reason)
    except WebSocketDisconnect:
        pass  # the client left


@router.websocket("/terminal")
async def terminal(ws: WebSocket):
    if ws.headers.get("origin") != settings.frontend_url:
        await ws.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    token = ws.cookies.get(SESSION_COOKIE)
    user = await run_in_threadpool(user_from_token, token)
    if user is None:
        await ws.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    await ws.accept()
    if user.job is None:
        await ws.close(code=4009, reason="No workspace assigned")
        return
    try:
        container = await start_workspace(ws.app.state.docker, user.id, user.job)
    except ImageNotBuilt:
        await ws.close(code=4503, reason="Workspace image unavailable")
        return
    except DockerError:
        logger.exception("Couldn't start workspace for user %s", user.id)
        await ws.close(code=status.WS_1011_INTERNAL_ERROR)
        return
    pidfile = f"/tmp/.term-{uuid.uuid4().hex}"
    try:
        shell = await container.exec(
            ["sh", "-c", f"echo $$ > {pidfile}; exec bash -l"], stdin=True, tty=True
        )
        async with shell.start() as stream:
            terminal_id = await run_in_threadpool(terminal_sessions_db.open, user.id)
            code, reason = await run_session(ws, stream, shell, token, terminal_id)
    except DockerError:
        # the container died (out of memory, del by admin, etc)
        logger.exception("Terminal of user %s failed", user.id)
        code, reason = FAILED
    finally:
        await hangup(container, pidfile)
    await close(ws, code, reason)
