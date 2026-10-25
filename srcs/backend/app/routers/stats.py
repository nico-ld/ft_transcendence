import logging
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from aiodocker.exceptions import DockerError
from config import settings
from db.terminal_sessions import terminal_sessions_db
from docker.workspace import HOME_PATH, memory_used
from fastapi import APIRouter, Request
from fastapi.concurrency import run_in_threadpool
from schemas import LogTimeOut, MemoryOut, StatsOut
from security import CurrentUser

router = APIRouter(prefix="/stats", tags=["stats"])
logger = logging.getLogger("uvicorn.error")

# invalid timezone = fail at startup
TIMEZONE = ZoneInfo(settings.timezone)

Interval = tuple[datetime, datetime]


def merge(intervals: list[Interval]) -> list[Interval]:
    # two terminals open at the same time count once
    merged: list[Interval] = []
    for start, end in sorted(intervals):
        if merged and start <= merged[-1][1]:
            merged[-1] = (merged[-1][0], max(merged[-1][1], end))
        else:
            merged.append((start, end))
    return merged


def time_between(
    intervals: list[Interval], start: datetime, end: datetime
) -> timedelta:
    total = timedelta()
    for s, e in intervals:
        if s < end and e > start:
            total += min(e, end) - max(s, start)
    return total


def hours_minutes(delta: timedelta) -> str:
    minutes = int(delta.total_seconds()) // 60
    return f"{minutes // 60}h{minutes % 60:02d}"


@router.get("/me")
async def my_stats(request: Request, user: CurrentUser) -> StatsOut:
    """RAM of the user's workspace and the time they spent with a terminal open"""
    now = datetime.now(TIMEZONE)
    today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)

    intervals = merge(
        await run_in_threadpool(
            terminal_sessions_db.intervals, user.id, min(week_start, month_start)
        )
    )
    # the 8 midnights from this monday to the next one
    midnights = [week_start + timedelta(days=i) for i in range(8)]
    daily = [time_between(intervals, midnights[i], midnights[i + 1]) for i in range(7)]

    try:
        used = await memory_used(request.app.state.docker, user.id)
    except DockerError:
        logger.exception(
            "Failed to read the memory of the workspace of user %s", user.id
        )
        used = 0

    return StatsOut(
        memory=MemoryOut(
            used_gb=round(used / 1024**3, 2),
            total_gb=round(settings.workspace_memory_mb / 1024, 2),
            path=HOME_PATH,
        ),
        log_time=LogTimeOut(
            week=hours_minutes(time_between(intervals, week_start, now)),
            month=hours_minutes(time_between(intervals, month_start, now)),
        ),
        daily=[round(day.total_seconds() / 3600, 2) for day in daily],
    )
