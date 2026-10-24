import asyncio
import json
import logging
import uuid

from aiodocker.containers import DockerContainer
from aiodocker.exceptions import DockerError
from aiodocker.execs import Exec
from aiodocker.stream import Stream
from config import settings
from docker.workspace import ImageNotBuilt, start_workspace
from fastapi import APIRouter, WebSocket, status
from fastapi.concurrency import run_in_threadpool
from fastapi.websockets import WebSocketState
from security import SESSION_COOKIE, user_from_token

router = APIRouter(prefix="/ws", tags=["websocket"])
logger = logging.getLogger("uvicorn.error")


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
                await shell.resize(w=cols, h=rows)


async def hangup(container: DockerContainer, pidfile: str):
    # docker does not kill an exec when the client leaves so we do what a real
    # terminal does on close: SIGHUP the shell, it forwards it to its jobs
    kill = await container.exec(
        ["sh", "-c", f'kill -HUP "$(cat {pidfile})"; rm -f {pidfile}'],
        stdout=True,
        stderr=True,
    )
    async with kill.start() as stream:
        while await stream.read_out() is not None:
            pass


@router.websocket("/terminal")
async def terminal(ws: WebSocket):
    if ws.headers.get("origin") != settings.frontend_url:
        await ws.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    user = await run_in_threadpool(user_from_token, ws.cookies.get(SESSION_COOKIE))
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
    shell = await container.exec(
        ["sh", "-c", f"echo $$ > {pidfile}; exec bash -l"], stdin=True, tty=True
    )
    try:
        async with shell.start() as stream:
            tasks = {
                asyncio.create_task(pump_output(ws, stream)),
                asyncio.create_task(pump_input(ws, stream, shell)),
            }
            _, pending = await asyncio.wait(tasks, return_when=asyncio.FIRST_COMPLETED)
            for task in pending:
                task.cancel()
    finally:
        await hangup(container, pidfile)
    if ws.client_state == WebSocketState.CONNECTED:
        await ws.close(reason="Session ended")
