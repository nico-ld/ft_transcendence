from config import settings
from fastapi import APIRouter, WebSocket, status
from fastapi.concurrency import run_in_threadpool
from security import SESSION_COOKIE, user_from_token

router = APIRouter(prefix="/ws", tags=["websocket"])


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
