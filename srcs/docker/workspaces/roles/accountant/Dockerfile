FROM workspace-base

USER root
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      visidata sqlite3 bc ledger \
 && rm -rf /var/lib/apt/lists/* \
 && { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }

RUN printf '%s\n' \
      'export WORKSPACE_ROLE=accountant' \
      'export LEDGER_FILE="$HOME/main.ledger"' \
    > /etc/workspace.d/role.sh

LABEL silk_space.role="accountant"

USER 1000:1000
WORKDIR /home/workspace
