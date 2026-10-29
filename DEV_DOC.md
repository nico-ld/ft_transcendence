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

### Browser test checklist
Run it in every supported browser (Chrome, Chromium, Firefox), with an admin and a user account:
1. Open https://localhost and accept the self-signed certificate: the landing page loads.
2. The light theme uses Geist Sans; the dark switch turns on the dark theme (mono font).
3. "Resources" shows the docs links; footer Language → Français translates the page.
4. Docs: the sidebar, "On this page" and Next/Previous links work; in a narrow window, the "Documentation" menu opens and closes.
5. Wrong password: the message shows and the email stays filled in.
6. Password login lands on `/user` with your name; the stats render.
7. Header menu: dark/light mode, Language → Español (stays on the dashboard), Log out → `/login`, and Back doesn't show the dashboard.
8. Log in with 42 lands on `/user`; cancelling on the intra shows the "cancelled" message.
9. Admin: search, sort by email, clicking a user opens the edit panel, the red icon asks for confirmation.
10. Admin: the green + creates a user (job picked in the dropdown) and the dialog closes.
11. Admin: the user list scrolls with the mouse wheel.
12. Workspace: the terminal connects; typing, accents (é, ✓) and resizing the window work.
13. The landing page, `/login` and `/user` look the same as in Chrome.
14. No red errors in the console (F12).

## Backend :

The full API (routes, bodies, responses) is at `/api/docs`.

| Method | Route | Who |
|---|---|---|
| POST | `/api/auth/signup` | anyone |
| POST | `/api/auth/login` | anyone |
| POST | `/api/auth/logout` | anyone |
| GET | `/api/auth/42/login` | anyone |
| GET | `/api/auth/42/callback` | 42 (sends the browser back here) |
| GET | `/api/auth/me` | logged in |
| PATCH | `/api/auth/me` | logged in |
| PATCH | `/api/auth/me/password` | logged in, with a password (not 42-only) |
| GET | `/api/users` | admin |
| POST | `/api/users` | admin |
| GET | `/api/users/{user_id}` | admin |
| PATCH | `/api/users/{user_id}` | admin |
| DELETE | `/api/users/{user_id}` | admin |
| GET | `/api/friends` | logged in |
| GET | `/api/friends/search?q=` | logged in |
| POST | `/api/friends/{user_id}` | logged in |
| DELETE | `/api/friends/{user_id}` | logged in |
| WS | `/api/ws/terminal` | logged in |
| WS | `/api/ws/events` | logged in |

### Sign up :

* `POST /api/auth/signup`, in `routers/auth.py`. The body is checked by `SignupIn` in `schemas.py`:

| Field | Rule |
|---|---|
| `email` | a valid email, saved in lowercase, not used by another account |
| `username` | 3 to 20 letters, digits, `_` or `-` (spaces around it are removed). Two accounts can have the same one: it's a display name, the email is what identifies an account |
| `firstName`, `lastName` | 1 to 100 characters |
| `password` | 8 to 128 characters, saved as an argon2 hash |

* Any other field (`role`, `id`...) is refused. A new account is always a `user` with no job, so it has no workspace until an admin assigns one.

| Answer | When |
|---|---|
| `201` with a session cookie | the account was created, and the user is logged in |
| `409` | the email is already used. The database checks it, so two sign-ups at the same moment can't both get it |
| `422` | a field breaks a rule above, or an unknown field was sent |

* The same username rule applies when an admin creates or edits a user (`/api/users`) and on the profile page (`PATCH /api/auth/me`).

### Log in with 42 (OAuth 2.0) :

* `routers/oauth42.py`, with the authlib library. `/api/auth/42/login` sends the browser to the 42 intra, which sends it back to `/api/auth/42/callback`. The callback logs the user in and redirects to `/admin` or `/user` without a locale: next-intl adds the one the user picked. The full flow is explained in the README, Modules section.

* Setup: create an app on the intra (https://profile.intra.42.fr/oauth/applications/new) with the redirect URI **exactly** `https://localhost/api/auth/42/callback`, then put its UID and secret in `srcs/backend/.env` as `FT_CLIENT_ID` and `FT_CLIENT_SECRET`.

* When the login fails, the callback redirects to `/login?error=<code>` and the login page shows a translated message (`Login.errors` in `messages/*.json`). The codes are a fixed list, in `FtLoginError` (backend) and `OAUTH_ERRORS` (`frontend/types/LoginError.ts`). Anything else in the URL is ignored.

| Code | When |
|---|---|
| `oauth_cancelled` | the user clicked "Cancel" on the intra |
| `oauth_expired` | the `state` doesn't match (the `oauth_state` cookie expired after 10 minutes, or this browser didn't start the login), or the code expired or was already used |
| `oauth_unavailable` | 42 is unreachable or answers with an error, `FT_CLIENT_SECRET` is wrong, or the profile can't be read |
| `oauth_conflict` | the email belongs to an account already linked to another 42 account |

* The redirect URI is built from the address the browser used, through the `Host` header that nginx forwards (`proxy_set_header Host $host`). So:
  * open the site on https://localhost, not https://127.0.0.1: 42 refuses a redirect URI that isn't registered on the app, and the session cookie would end up on the wrong address anyway.
  * `$host` has no port, so this only works on 443. To publish on another port, use `$http_host` in nginx.conf and register the redirect URI with that port on the intra.

* If every 42 login suddenly ends with `oauth_unavailable`, check the app on the intra: its secret may have been replaced or have expired.

### Live events :

* `/api/ws/events`, in `routers/events.py` and `realtime.py`. The front opens it once and keeps it open on every page. A user is online while at least one of their tabs is connected. The socket closes with `4401` when the session ends (logout, account deleted).

* The browser sends nothing, the server sends JSON:

| Event | Sent to | When |
|---|---|---|
| `{"type": "presence", "online": [1, 2]}` | the tab that connects | on connect: everyone online right now |
| `{"type": "online", "userId": 1}` | everyone | a user opened their first tab |
| `{"type": "offline", "userId": 1}` | everyone | a user closed their last tab |
| `{"type": "friend_request", "userId": 1, "username": "alice"}` | the user asked | `POST /api/friends/{user_id}`, a new request |
| `{"type": "friend_accepted", "userId": 1, "username": "alice"}` | the user who asked | `POST /api/friends/{user_id}`, the request was accepted |
| `{"type": "friend_removed", "userId": 1}` | the other user | `DELETE /api/friends/{user_id}` |

* An account found by its email (created by an admin, or through sign up) is linked to the 42 account on its first 42 login. Its password is then removed and every browser logged in to it is logged out: 42 has proven that the email belongs to this person, while anyone can sign up with any email. From then on, that account logs in with 42 only.

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
