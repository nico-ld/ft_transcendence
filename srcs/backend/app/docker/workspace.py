from aiodocker.docker import Docker
from aiodocker.exceptions import DockerError
from aiodocker.networks import DockerNetwork
from aiodocker.volumes import DockerVolume
from db import Job


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
        await docker.networks.get(network_name(user_id))
    except DockerError as e:
        if e.status != 404:
            raise
    try:
        await docker.networks.create(
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
