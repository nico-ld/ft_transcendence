import asyncio

from config import settings
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, status
from fastapi.concurrency import run_in_threadpool
from realtime import manager
from routers.websocket import SESSION_CHECK_SECONDS, close
from security import SESSION_COOKIE, user_from_token

router = APIRouter(prefix="/ws", tags=["websocket"])

LOGGED_OUT = (4401, "You were logged out")


async def close_on_logout(ws: WebSocket, token: str | None):
    # same check as the terminal -> logging out or deleting the account ends it
    while True:
        await asyncio.sleep(SESSION_CHECK_SECONDS)
        if await run_in_threadpool(user_from_token, token) is None:
            break
    await close(ws, *LOGGED_OUT)


@router.websocket("/events")
async def events(ws: WebSocket):
    """Who is online and friend requests, open on every page"""
    if ws.headers.get("origin") != settings.frontend_url:
        await ws.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    token = ws.cookies.get(SESSION_COOKIE)
    user = await run_in_threadpool(user_from_token, token)
    if user is None:
        await ws.close(code=status.WS_1008_POLICY_VIOLATION)
        return
    await ws.accept()
    came_online = manager.connect(user.id, ws)
    watcher = asyncio.create_task(close_on_logout(ws, token))
    try:
        await ws.send_json({"type": "presence", "online": manager.online()})
        if came_online:
            await manager.broadcast({"type": "online", "userId": user.id})
        # the browser sends nothing, reading is how we see it leave
        while (await ws.receive())["type"] != "websocket.disconnect":
            pass
    except WebSocketDisconnect:
        pass  # it left while we were sending
    finally:
        watcher.cancel()
        if manager.disconnect(user.id, ws):
            await manager.broadcast({"type": "offline", "userId": user.id})
