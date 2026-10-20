import asyncio
from collections import defaultdict

from aiodocker.containers import DockerContainer
from aiodocker.docker import Docker
from aiodocker.exceptions import DockerError
from aiodocker.networks import DockerNetwork
from aiodocker.volumes import DockerVolume
from config import settings
from db import Job

_locks: defaultdict[int, asyncio.Lock] = defaultdict(asyncio.Lock)


class ImageNotBuilt(Exception):
    pass


def container_name(user_id: int) -> str:
    return f"silk-ws-{user_id}"


def network_name(user_id: int) -> str:
    return f"silk-ws-net-{user_id}"


def volume_name(user_id: int) -> str:
    return f"silk-ws-home-{user_id}"


def image_name(job: Job) -> str:
    return f"workspace-{job.value}"


def labels(user_id: int, job: Job) -> dict:
    return {"silk_space.user_id": str(user_id), "silk_space.job": job.value}


async def image_exists(docker: Docker, job: Job) -> bool:
    try:
        await docker.images.inspect(image_name(job))
    except DockerError as e:
        if e.status == 404:
            return False
        raise
    return True


async def ensure_volume(docker: Docker, user_id: int, job: Job) -> DockerVolume:
    return await docker.volumes.create(
        {"Name": volume_name(user_id), "Labels": labels(user_id, job)}
    )


async def ensure_network(docker: Docker, user_id: int, job: Job) -> DockerNetwork:
    try:
        return await docker.networks.get(network_name(user_id))
    except DockerError as e:
        if e.status != 404:
            raise
    try:
        return await docker.networks.create(
            {
                "Name": network_name(user_id),
                "Driver": "bridge",
                "Labels": labels(user_id, job),
            }
        )
    except DockerError as e:
        if e.status != 409:
            raise
    return await docker.networks.get(network_name(user_id))


def container_config(user_id: int, job: Job) -> dict:
    memory = settings.workspace_memory_mb * 1024 * 1024
    return {
        "Image": image_name(job),
        "Hostname": job.value,
        "Labels": labels(user_id, job),
        "HostConfig": {
            "Memory": memory,
            "MemorySwap": memory,
            "NanoCpus": int(settings.workspace_cpus * 1_000_000_000),
            "PidsLimit": settings.workspace_pids,
            "CapDrop": ["ALL"],
            "SecurityOpt": ["no-new-privileges"],
            "NetworkMode": network_name(user_id),
            "Mounts": [
                {
                    "Type": "volume",
                    "Source": volume_name(user_id),
                    "Target": "/home/workspace",
                }
            ],
        },
    }


async def ensure_container(docker: Docker, user_id: int, job: Job) -> DockerContainer:
    name = container_name(user_id)
    try:
        container = await docker.containers.get(name)
    except DockerError as e:
        if e.status != 404:
            raise
        container = None

    if container is not None:
        info = await container.show()
        if info["Config"]["Labels"].get("silk_space.job") != job.value:
            await container.delete(force=True)
        elif not info["State"]["Running"]:
            await container.start()
            return container
        else:
            return container

    try:
        await docker.containers.create(container_config(user_id, job), name=name)
    except DockerError as e:
        if e.status != 409:
            raise
    container = await docker.containers.get(name)
    await container.start()
    return container


async def start_workspace(docker: Docker, user_id: int, job: Job) -> DockerContainer:
    async with _locks[user_id]:
        if not await image_exists(docker, job):
            raise ImageNotBuilt(image_name(job))
        await ensure_network(docker, user_id, job)
        await ensure_volume(docker, user_id, job)
        return await ensure_container(docker, user_id, job)
