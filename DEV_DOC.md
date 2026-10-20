# DEV DOC

## Frontend :

### Summary

1. **[Tech Stack](#tech-stack)**
2. **[Project Structure](#project-structure)**
3. **[Architecture](#architecture)**
4. **[Configuration](#configuration)**
5. **[Troubleshooting](#troubleshooting)**
6. **[Security Considerations](#security-considerations)**

### Tech Stack

The following language have been use :
- **JavaScript**
- **TypeScript**
- **CSS**

Also we've use theses framework to keep JavaScript from driving us completly crazy :
- **[Next.js](https://nextjs.org/docs)**
- **[Tailwindcss](https://tailwindcss.com/)**
- **[React](https://react.dev/)**

### Project Structure
```
frontend/
├── Dockerfile
├── lib/ # Contain somes types definitions or list declarations
├── components/
│   ├── admin/ # Contain component about admin stuff, like user list
│   ├── auth/ # Contain component about Login and Authentication
│   ├── dashboard/ # Contain every components about at the Dashboard
│   ├── layout/ # Contain more complex or specific components (Header, ThemeSwitch..)
│   └── ui/ # Contain every basic components (Button, Input, Spinner...)
└── app/
    ├── (app)/
	│   ├── admin/
	│   │   └── page.tsx
	│   ├── user/
	│   │   └── page.tsx
	│   └── layout.tsx
    ├── (auth)/
    │   └── login/
	│   	└── page.tsx
    ├── action/ # Contain the files that directly modify the database.
    ├── global.css
    ├── layout.tsx
	└── page.tsx
```
The great part of components come from [shadcn.com](https://ui.shadcn.com/docs/components), if you wan't more informations about it, or take somes components, I invite you to go on their website.

### Architecture
> TO DEVELOPP ON DOCKER / NGINX

### Configuration
Configuration values should be adapted to the deployement environment.  
Examples include : 
- The frontend's listening port.
- The backend API address.
- The Nginx routing configuration.
Sensitive information must never be stored in frontend source files because files edlivered to the browser are publicly accessible.

### Troubleshooting
**The page cannot be accessed**
- Check that the frontend container is running.
- Verify the exposed port in the Docker Compose configuration.
- Inspect the Nginx logs.

**API requests fail**
- Verify that the backend is running.
- Check the Docker network configuration.
- Inspect the browser and check for cached files.

**Changes are not visible**
- Rebuild the image if the source files are copied during the build.
- Refresh the browser and check for cached files.

### Security Considerations
- Do not expose secrets or private credentials in frontend code.
- Validate data on the backend even when client-side validation exist.
- Use HTTPS in production.
- Configure appropriate security headers in Nginx.
- Avoid inserting untrusted user input directly into the DOM.

## Backend :

The full API (routes, bodies, responses) is at `/api/docs`.

| Method | Route | Who |
|---|---|---|
| POST | `/api/auth/signup` | anyone |
| POST | `/api/auth/login` | anyone |
| POST | `/api/auth/logout` | anyone |
| GET | `/api/auth/42/login` | anyone |
| GET | `/api/auth/me` | logged in |
| PATCH | `/api/auth/me` | logged in |
| GET | `/api/users` | admin |
| POST | `/api/users` | admin |
| GET | `/api/users/{user_id}` | admin |
| PATCH | `/api/users/{user_id}` | admin |
| DELETE | `/api/users/{user_id}` | admin |
| WS | `/api/ws/terminal` | logged in |

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

### On roles images

* At the bottom of roles Dockerfile, we can find LABEL silk_space.role=. It's there so the list_roles() function can read this label to fill the HR dropdown.

### On the Makefile

* The Makefile build the workspace images. It runs before `docker compose up`. So the idea is that compose does not build these, the backend starts them on demand.

### On the docker-compose
