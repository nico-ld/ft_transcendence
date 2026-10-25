import logging

from aiodocker.exceptions import DockerError
from docker.workspace import ImageNotBuilt, start_workspace
from fastapi import APIRouter
from fastapi.exceptions import HTTPException
from fastapi.requests import Request
from security import CurrentUser
from starlette import status

logger = logging.getLogger("uvicorn.error")
router = APIRouter(prefix="/workspace", tags=["workspace"])


@router.post("/start")
async def start(request: Request, user: CurrentUser):
    if user.job is None:
        raise HTTPException(status.HTTP_409_CONFLICT, "No workspace assigned")
    try:
        await start_workspace(request.app.state.docker, user.id, user.job)
    except ImageNotBuilt:
        raise HTTPException(
            status.HTTP_503_SERVICE_UNAVAILABLE, "Workspace image unavailable"
        ) from None
    except DockerError:
        logger.exception("Couldn't start workspace for user %s", user.id)
        raise HTTPException(
            status.HTTP_502_BAD_GATEWAY, "Couldn't start the workspace"
        ) from None
    return {"status": "running"}
