# DEV DOC

## Frontend :

## Backend :

## Nginx :

* Regarding the config file, we set the worker_connections at 1024, considering our project scale. We won't reach near having the worker thread opening 1024 simulatenous connexion.

* On the http bloc, mime.types is a config file linked to nginx that match extensions. This allow to execute, for exemple, a JS file instead of displaying row code. Regarding setting default_type to octet-stream, it allows to treat an unknow extension as something to be downloaded instead of displayed on the screen as row code.

* on the server bloc, we only expose port 80, and forward to location / (front) or location /api (back) depending on the request. Hot-Reload is supported for NextJS (proxy_http_version 1.1; and below)

## Workspace :

### On base :

* Base is the where every role image starts from. It sets up the shared user, shell and idle process; roles only add their tools.

* First RUN update, download the terminal and system tools, then clean up the tmp installation files. ca-certificates allows the container to make secure HTTPS connections by trusting standard security certificates. procps adds standard system process management tools like ps and top. tini is a lightweight process supervisor (an init system) that runs as Process ID 1 (PID 1) (this is to avoid zombie processes after a docker exec -> closing terminal). 

* The second RUN creates a custom .bashrc config, for the terminal. It's linked to /etc/skel/ because that's what's used to create a new terminal, and the user still have the option to change it's own .basrch file.

* The third RUN creates a user group named workspace and give it a group id (GID) 1000 (1000 is the standard on Linux). It then create a user account, same ID, link it to the group. Finally, it sets up a home directory for them, and assigns /bin/bash as their default terminal shell. Without that, Docker give by default root to a user, so it's slightly dangerous.

* The 4th RUN sets up a dynamic system-wide configuration folder (/etc/workspace.d/) and appends startup logic to /etc/bash.bashrc so that every terminal session automatically loads role configurations and sets a custom colorized prompt. The for loop checks for any .sh in workspace.d, to set up, and the export PS1 is for the colors in terminal.

* The 5th RUN is to avoid having setuid and setgid accessed by the user, as they can allow to change password among other security related things.

* The rest of the file is to set metadata for the container image, switches execution to the unprivileged user, and configures the container to start up cleanly and remain running indefinitely in the background so terminal sessions can attach to it as needed.
