
#check if image exist
# NO
	# cd srcs/workspace
	# make $ROLE
#docker run --name my_container <image>
#connect shell
# 
import docker
import struct
from docker.api import image
from docker.client import DockerClient
import subprocess

from docker.models.images import Image
import workspace

from app.db import Role, User

client = docker.from_env()

class docker_request(DockerClient):
	def __init__(self, *args, **kwargs) -> None:
		super().__init__(*args, **kwargs)

	def build_image(self, volume: str, tag: str, user: User) -> Image|None:
		"""Create an image whose filesystem contains the volume's data."""
		vol: workspace.Volume_workspace|None
		match (user.role):
			case (Role.ACCOUNTANT):
				vol = workspace.Vaccountant
			case (Role.ADMIN):
				vol = None
			case (Role.DATA):
				vol = workspace.Vdata_analyst
			case (Role.DEVOPS_INGE):
				vol = workspace.Vdevops
			case (Role.SOFTWARE_INGE):
				vol = workspace.Vsoftware_engineer
			case (Role.TECH_WRITER):
				vol = workspace.Vtechnical_writer
			case (_):
				vol = None
		if (vol == None):
			return None
		if (vol.from_ == None or vol.working_dir == None or vol.user == None or vol.labels == None):
			return None
		container = client.containers.run(
    		vol.from_,
      		command=vol.command,
        	detach=True,
         	volumes={volume: {"bind": "/data", "mode": "ro"}},
          	working_dir= vol.working_dir,
           	user= vol.user,
            labels= vol.labels
		)
		container.wait()
		image = container.commit(tag=tag, changes=[f"CMD [\"/bin/sh\"]"])
		container.remove()
		return image

"""
def create_workspace(user_id: int, role: str) -> None:
Create volume + idle container.
def update_workspace(user_id: int, role: str) -> None:
Recreate the container from another role image. Volume unchanged.
def delete_workspace(user_id: int) -> None:
Remove container and volume.
def list_roles() -> list[str]:
Role names available, for the HR form dropdown.
def open_terminal(user_id: int) -> TerminalSession:
Start a shell in the user's workspace.
class TerminalSession:
def read(self) -> bytes: ... # blocks until output is available
def write(self, data: bytes) -> None: ...
def resize(self, cols: int, rows: int) -> None: ...
def close(self) -> None: ...
"""