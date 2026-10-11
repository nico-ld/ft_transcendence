FROM debian:trixie-slim

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    TERM=xterm-256color

RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      bash bash-completion ca-certificates less nano procps tini \
 && rm -rf /var/lib/apt/lists/*

RUN printf '%s\n' \
      'HISTCONTROL=ignoreboth' \
      'HISTSIZE=5000' \
      'shopt -s histappend checkwinsize' \
      "alias ls='ls --color=auto'" \
      "alias ll='ls -lah'" \
      "alias grep='grep --color=auto'" \
    > /etc/skel/.bashrc

RUN groupadd --gid 1000 workspace \
 && useradd --uid 1000 --gid 1000 --create-home \
      --home-dir /home/workspace --shell /bin/bash workspace

RUN mkdir -p /etc/workspace.d \
 && printf '%s\n' \
      '' \
      '# silk_space: per-role settings' \
      'for f in /etc/workspace.d/*.sh; do [ -r "$f" ] && . "$f"; done' \
      'export PS1="\[\e[1;36m\]${WORKSPACE_ROLE:-workspace}\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]\$ "' \
    >> /etc/bash.bashrc

RUN { find / -xdev -perm /6000 -type f -exec chmod a-s {} + || true; }

LABEL silk_space.image="workspace-base"

USER 1000:1000
WORKDIR /home/workspace

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["sleep", "infinity"]
