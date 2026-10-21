import logging

from aiodocker.exceptions import DockerError
from config import settings
from docker.workspace import ImageNotBuilt, start_workspace
from fastapi import APIRouter, WebSocket, status
from fastapi.concurrency import run_in_threadpool
from security import SESSION_COOKIE, user_from_token

router = APIRouter(prefix="/ws", tags=["websocket"])
logger = logging.getLogger("uvicorn.error")


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
    shell = await container.exec(["bash", "-l"], stdin=True, tty=True)
    async with shell.start() as stream:
        while True:
            msg = await stream.read_out()
            if msg is None:  # bash exited
                break
            await ws.send_bytes(msg.data)
    await ws.close()
