"""
Live events to the browsers of logged in users through /ws/events

A user is online while at least one of their tabs is connected
"""

import asyncio
import json
from collections.abc import Iterable
from typing import Any

from fastapi import WebSocket, WebSocketDisconnect


async def send_text(ws: WebSocket, message: str) -> None:
    try:
        await ws.send_text(message)
    except (WebSocketDisconnect, RuntimeError):
        pass  # the tab is closing its handler removes it


async def send_all(sockets: Iterable[WebSocket], event: dict[str, Any]) -> None:
    # encoded once then sent to every tab at the same time
    message = json.dumps(event)
    await asyncio.gather(*(send_text(ws, message) for ws in sockets))


class ConnectionManager:
    def __init__(self) -> None:
        # every open tab of each connected user
        self.sockets: dict[int, set[WebSocket]] = {}

    def online(self) -> list[int]:
        """Ids of the connected users"""
        return list(self.sockets)

    def connect(self, user_id: int, ws: WebSocket) -> bool:
        """Returns:
        bool: True if it is the user's first tab so they just arrived online
        """
        tabs = self.sockets.setdefault(user_id, set())
        tabs.add(ws)
        return len(tabs) == 1

    def disconnect(self, user_id: int, ws: WebSocket) -> bool:
        """Returns:
        bool: True if it was the user's last tab, so they are offline now
        """
        tabs = self.sockets.get(user_id)
        if tabs is None:
            return False
        tabs.discard(ws)
        if tabs:
            return False
        del self.sockets[user_id]
        return True

    async def send(self, user_id: int, event: dict[str, Any]) -> None:
        """Send an event to every tab of a user, nothing if they are offline"""
        await send_all(self.sockets.get(user_id, set()), event)

    async def broadcast(self, event: dict[str, Any]) -> None:
        """Send an event to every connected tab"""
        await send_all([ws for tabs in self.sockets.values() for ws in tabs], event)


manager = ConnectionManager()
