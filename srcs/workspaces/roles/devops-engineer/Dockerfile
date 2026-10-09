FROM workspace-base

USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      git ansible-core openssh-client curl jq vim \
 && rm -rf /var/lib/apt/lists/* \
 && { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }

RUN printf '%s\n' \
      'export WORKSPACE_ROLE=devops-engineer' \
      'export EDITOR=vim' \
    > /etc/workspace.d/role.sh

LABEL silk_space.role="devops-engineer"

USER 1000:1000
WORKDIR /home/workspace
