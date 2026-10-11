FROM workspace-base

USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      git gcc libc6-dev make python3 vim \
 && rm -rf /var/lib/apt/lists/* \
 && { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }

RUN printf '%s\n' \
      'export WORKSPACE_ROLE=software-engineer' \
      'export EDITOR=vim' \
    > /etc/workspace.d/role.sh

LABEL silk_space.role="software-engineer"

USER 1000:1000
WORKDIR /home/workspace
