
from dataclasses import dataclass


@dataclass
class Volume_workspace:
	from_: str
	command: list[str]
	working_dir: str
	user: str
	labels: dict[str, str]

Vaccountant = Volume_workspace(
	from_= "workspace-base",
	command=[
		"RUN apt-get update \
		&& apt-get install -y --no-install-recommends \
      	visidata sqlite3 bc ledger \
       	&& rm -rf /var/lib/apt/lists/* \
        && { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }",
       	"printf '%s\n' \
        'export WORKSPACE_ROLE=accountant' \
        'export LEDGER_FILE=\"$HOME/main.ledger\"' \
        > /etc/workspace.d/role.sh"
    ],
	labels= {"silkspace.role" : "acccountant"},
	user="1000:1000",
	working_dir="/home/workspace",
)
Vdata_analyst = Volume_workspace(
	from_= "workspace-base",
	command= [
			"apt-get update \
				&& apt-get install -y --no-install-recommends \
      			python3 python3-pandas sqlite3 visidata \
         		&& rm -rf /var/lib/apt/lists/* \
        		&& { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }",
          "printf '%s\n' \
                'export WORKSPACE_ROLE=data-analyst' \
              > /etc/workspace.d/role.sh"
		],
		labels= {"silkspace" : {"role" : "data-analyst"}},
		user="1000:1000",
		working_dir="/home/workspace",
)
Vdevops = Volume_workspace(
	from_= "workspace-base",
	command= [
			"apt-get update \
			&& apt-get install -y --no-install-recommends \
      		git ansible-core openssh-client curl jq vim \
        	&& rm -rf /var/lib/apt/lists/* \
         	&& { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }",
          	"printf '%s\n' \
           	'export WORKSPACE_ROLE=devops-engineer' \
            'export EDITOR=vim' \
            > /etc/workspace.d/role.sh"
		],
		labels= {"silkspace" : {"role" : "devops-engineer"}},
		user="1000:1000",
		working_dir="/home/workspace",
)
Vsoftware_engineer = Volume_workspace(
	from_= "workspace-base",
	command= [
			"apt-get update \
			&& apt-get install -y --no-install-recommends \
      		git gcc libc6-dev make python3 vim \
        	&& rm -rf /var/lib/apt/lists/* \
         	&& { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }",
          	"printf '%s\n' \
           'export WORKSPACE_ROLE=software-engineer' \
           'export EDITOR=vim' \
           > /etc/workspace.d/role.sh"
		],
		labels= {"silkspace" : {"role" : "software-engineer"}},
		user="1000:1000",
		working_dir="/home/workspace",
)
Vtechnical_writer = Volume_workspace(
	from_= "workspace-base",
	command= [
			"apt-get update \
			&& apt-get install -y --no-install-recommends \
      		pandoc git vim aspell aspell-en aspell-fr \
        	&& rm -rf /var/lib/apt/lists/* \
         	&& { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }",
          "printf '%s\n' \
          'export WORKSPACE_ROLE=technical-writer' \
          'export EDITOR=vim' \
          > /etc/workspace.d/role.sh"
		],
		labels= {"silkspace" : {"role" : "software-engineer"}},
		user="1000:1000",
		working_dir="/home/workspace",
)