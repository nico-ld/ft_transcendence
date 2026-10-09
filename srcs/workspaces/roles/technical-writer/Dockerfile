FROM workspace-base

USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      pandoc git vim aspell aspell-en aspell-fr \
 && rm -rf /var/lib/apt/lists/* \
 && { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }

RUN printf '%s\n' \
      'export WORKSPACE_ROLE=technical-writer' \
      'export EDITOR=vim' \
    > /etc/workspace.d/role.sh

LABEL silk_space.role="technical-writer"

USER 1000:1000
WORKDIR /home/workspace
