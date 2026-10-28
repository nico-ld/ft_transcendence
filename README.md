*This project has been created as part of the 42 curriculum by nile-dai, amartel, mmansier, tseche, jdessoli*

## Description :

This project, ft_silk_space, is about easing the hiring, promotion and departure processes of employees inside of a company.
Thanks to an easy-to-use interface, even a non-technical user can now easily create a new work session for an employee, and modify or delete said session when needed.
To understand how we achieve this, please read the rest of this document.

## Instructions :

To run the project, copy-paste the following command in your terminal :

```
make ft_silk_space
```

Thanks to the use of Docker, we handle all the prerequisites for you. Said prerequisites are :

- NextJS
- Python
- FastAPI
- Docker

## Resources :

### On NextJS:
  https://nextjs.org/
  https://peaks.fr/next-js-simplifie-le-developpement-web/ 

### On Python:
  https://www.python.org/
  https://realpython.com/tutorials/databases/
  
### On FastAPI:
  https://fastapi.tiangolo.com/tutorial/
  https://www.geeksforgeeks.org/python/fastapi-tutorial/
  
### On Docker:
  https://docs.docker.com/get-started/
  https://hub.docker.com/
  
### On AI:
  AI was used in this project to help with research, perform code audits, and troubleshoot problems to keep ft_silk_space running smoothly.

• Team Information:
For each team member mentioned at the top of the README.md, you must pro-
vide:
◦ Assigned role(s): PO, PM, Tech Lead, Developers, etc.
◦ Brief description of their responsibilities.

## Team information :

### Product owner (PO) : *jdessoli*

As the product owner for ft_silk_space, *jdessoli* supervised the core project idea, features, and the selection of a coherent technical stack regarding the goal.  

### Project manager (PM) : *nile-dai*

As the project manager for ft_silk_space, *nile-dai* worked to ensure the completion of the project within a previously set up deadline.

*nile-dai* created a GitHub repository as well as a Discord server.

*jdessoli* and *tseche* also helped with project management: *jdessoli* created a Trello to facilitate work division, and *tseche* helped ensure the communication flow kept running smoothly, so the tools reflected the real state of the project at each stage.

### Tech lead : *mmansier*

As the tech lead, *mmansier* chose the technical stack for both the front and the back end with the team, proposed FastAPI, trained the team on the back-end, and performed code review on every part of the project.

*amartel* also took part in the technical choices: he proposed Next.js, trained the team on the front-end, and set up automations to facilitate a proper workflow.

### Developers : *amartel* and *tseche*

As the subject asks, every member of the team also worked as a developer:

*nile-dai* mostly worked alongside *amartel* on the front-end side of the project, spending a lot of time on the design choices and implementation.

*amartel* piloted the front-end development.

*mmansier* piloted the back-end development.

*tseche* mostly worked alongside *mmansier* on the back-end. 

*jdessoli* mostly worked on Docker and documentation.

## Project Management :

  The initial project conception, roles and task distribution were done by *jdessoli*.
  
  The meetings were organized by *nile-dai*. They kept the whole team up to date with the state of each part of the project.

  The communication was mostly done through the Discord thanks to *nile-dai*, the Github thanks to *amartel* and *mmansier*, and the updated Trello thanks to *tseche*.

• Technical Stack:
◦ Frontend technologies and frameworks used.
◦ Backend technologies and frameworks used.
◦ Database system and why it was chosen.
◦ Any other significant technologies or libraries.
◦ Justification for major technical choices.

## Technical Stack :

### Frontend technologies :

* TypeScript (NextJS)

### Backend technologies :

* Python (FastAPI)
* Docker
* Nginx (as a reverse proxy to forward traffic to NextJS, FastAPI, and handle WebSocket)

### Database system

* PostgreSQL, chosen because of its popularity in the industry

/*** STILL LEFT TO DO ***/

• Database Schema:
◦ Visual representation or description of the database structure.
◦ Tables/collections and their relationships.
◦ Key fields and data types.

## Database Schema :

• Features List:
◦ Complete list of implemented features.
◦ Which team member(s) worked on each feature.
◦ Brief description of each feature’s functionality.

Features list :

• Modules:
◦ List of all chosen modules (Major and Minor).
◦ Point calculation (Major = 2pts, Minor = 1pt).
◦ Justification for each module choice, especially for custom "Modules of
choice".
◦ How each module was implemented.
◦ Which team member(s) worked on each module.

## Modules :

| Module | Category | Type | Points |
|---|---|---|---|
| Use a framework for both the frontend and backend | Web | Major | 2 |
| Isolated Linux workspaces with a web terminal | Modules of choice | Major | 2 |
| Advanced permissions system | User Management | Major | 2 |
| Use an ORM for the database | Web | Minor | 1 |
| Server-Side Rendering (SSR) | Web | Minor | 1 |
| Advanced search with filters, sorting and pagination | Web | Minor | 1 |
| Support for multiple languages | Accessibility and Internationalization | Minor | 1 |
| Support for additional browsers | Accessibility and Internationalization | Minor | 1 |
| Remote authentication with OAuth 2.0 | User Management | Minor | 1 |
| **Total** | | | **12** |

### Major: Use a framework for both the frontend and backend (2 pts)

*Worked on by:* TODO

**Why:** both frameworks give us routing, validation and a structure every member can follow, so the team could split the work between the front and the back end without reinventing the basics. Next.js renders pages on the server (see the SSR module) and has a clear place for everything; FastAPI checks every request against typed schemas and documents the API by itself.

**How it works:**
- **Frontend: Next.js 16 (React 19)**, in `srcs/frontend`. One folder per page under `app/[locale]/`, server components that read the session and call the backend before sending the page, server actions for the forms (`actions/`), shared components in `components/`.
- **Backend: FastAPI**, in `srcs/backend/app`. One router per domain in `routers/` (`auth`, `oauth42`, `users`, `stats`, `workspace`, `websocket`), pydantic schemas that refuse any invalid or unexpected field (`schemas.py`), and dependencies that require a valid session or the admin role (`security.py`).
- **How they talk:** the browser only talks to nginx, which sends `/api/` to FastAPI and the rest to Next.js. On the server, Next.js calls FastAPI on the Docker network with the user's session cookie (`srcs/frontend/lib/backend.ts`).

### Major (module of choice): Isolated Linux workspaces with a web terminal (2 pts)

*Worked on by:* TODO

**Why we chose it:** it is what Silk Space is for. When an HR user gives an employee a job, the employee gets a Linux environment with the tools of that job (software engineer, data analyst, DevOps engineer, accountant or technical writer), which they open in their browser. Changing their job changes their tools and keeps their files; deleting their account deletes everything. No module in the list covers this.

**Technical challenges:**
- **Driving Docker from the backend.** FastAPI talks to the Docker API through the Docker socket (aiodocker, `srcs/backend/app/docker/workspace.py`). Each user gets their own container, private network and persistent home volume, created on first use from the image of their job (`srcs/workspaces/`: a common base image and one image per job).
- **Isolation and limits.** The shell runs as a regular user, without any Linux capabilities and unable to gain privileges. Memory, CPU and number of processes are capped per container, and each user's private network keeps the workspaces apart.
- **Lifecycle.** A job change replaces the container but keeps the home volume, so the files survive. Deleting a user removes their container, network and volume. A broken container is recreated instead of failing forever, and a lock per user stops two requests from creating the same workspace twice.
- **The terminal.** xterm.js in the browser, a WebSocket through nginx to FastAPI, then a bash with a TTY inside the container (`routers/websocket.py`, `components/workspace/`). Keystrokes and output go as raw bytes in both directions, the terminal size follows the window, and closing the page hangs up the shell like a real terminal.
- **Security of the connection.** Only our own site may open the WebSocket, it needs a valid session, and the session is checked again every 5 seconds: a logout or a deleted account closes the open terminals.
- **Every failure explained.** No job yet, image not built, Docker error, session ended, connection lost: each one shows a translated message with a way out (reconnect, log in again, back to the dashboard).
- **Log time.** Each terminal session is recorded (`db/terminal_sessions.py`) and feeds the user's statistics.

**Value for the project:** without it, Silk Space would only be a list of users. With it, an HR action has a real effect within seconds: an employee is hired, promoted or leaves, and their working environment follows.

**Why it deserves Major status:** it touches every layer of the project (container infrastructure, asynchronous backend, real-time browser terminal and security), and is comparable in size to the listed Major modules such as real-time features with WebSockets or a backend as microservices.

### Major: Advanced permissions system (2 pts)

*Worked on by:* TODO

**Why:** Silk Space is run by HR admins. They create the accounts, give each employee a job (and with it a workspace) and delete the accounts of the people who leave. Employees only see and change their own account.

**Roles:**
- **Admin:** the admin dashboard, with the system overview and every account. An admin can create users and other admins, change anyone's names, username, job and role, and delete accounts.
- **User:** their own dashboard and statistics, their workspace, and their profile, where they can change their names, username and password, but not their job or role.

**How it works:**
- **Checked by the backend on every request.** Every `/users` route requires the admin role (`require_admin` in `srcs/backend/app/security.py`), and anyone else gets a 403. The role is read from the database each time, so a promotion or a demotion takes effect on the user's next request.
- **CRUD on users** (`srcs/backend/app/routers/users.py`): list, read, create with a role, edit (names, username, job, role) and delete. Deleting an account also deletes its workspace (container, network and volume) and its sessions, so it is logged out everywhere. If Docker can't remove the workspace, the account is kept and the admin can try again.
- **Always one admin left.** An admin can't remove their own admin role or delete their own account. The sign-up form and the profile page refuse any role or job sent to them.
- **Different views per role.** The server sends each role to its own dashboard (`/admin` or `/user`) and away from the other one. In the admin panel (`srcs/frontend/components/admin/`), admins have an Admin badge in the list, the create and edit forms have a role choice, and every account but the admin's own has a delete button with a confirmation.

### Minor: Use an ORM for the database (1 pt)

*Worked on by:* TODO

**Why:** the tables are defined once, as typed Python classes, and the queries are written in Python instead of SQL strings: values always travel as parameters, so they can't be used for SQL injection.

**How it works:** SQLAlchemy 2 with PostgreSQL (psycopg). The tables are Python classes in `srcs/backend/app/db/`: users (with a role and a job, and a check that every account has a password or a 42 login), login sessions, and terminal sessions, linked to users by foreign keys. The queries go through `Session` and `select` in `db/requests.py`, and the tables are created when the backend starts.

### Minor: Server-Side Rendering (1 pt)

*Worked on by:* TODO

**Why:** pages arrive with their content already in the HTML. The dashboards come with the user's data in place, without a loading flash, and a visitor who isn't logged in is sent to the login page straight away. The public pages are fast and readable by search engines.

**How it works:** Next.js server components. The dashboards and the profile and workspace pages read the session cookie on the server, call the backend and render at request time (`getCurrentUser` in `srcs/frontend/lib/backend.ts`). With `cacheComponents`, the static part of these pages is prerendered and the user's part is streamed into it. The landing, legal and documentation pages are prerendered at build time in each language (`generateStaticParams`), and the legal and documentation pages have their own titles and descriptions (`generateMetadata`).

### Minor: Advanced search with filters, sorting and pagination (1 pt)

*Worked on by:* TODO

**Why:** admins run every account from one list. Search, filters and pages keep it usable as the company grows, and find anyone in a few keystrokes.

**How it works:** in the admin panel (`srcs/frontend/components/admin/`), on the list of accounts the server sends with the page.
- **Search:** username, email, and first and last name in either order, ignoring case and accents ("elodie" finds "Élodie").
- **Filters:** by role and by job, "no workspace" included, from the funnel menu. Each choice shows how many users it would leave given the search and the other filter, and a dot on the funnel shows that a filter is on.
- **Sorting:** by creation date, username or email, ascending or descending.
- **Pagination:** 10 users per page, with the number of results. A new search, filter or sort starts again from the first page.
- The roles come from one list (`ROLES` in `srcs/frontend/types/User.ts`), shared by the role filter and the role picker, so a new role shows up in both.

### Minor: Support for multiple languages (1 pt)

*Worked on by:* TODO

**Why:** the team and the first users speak French, English is the default, and Spanish makes the third language.

**How it works:** next-intl, in English, French and Spanish.
- The language is part of the address (`/en`, `/fr`, `/es`, set in `srcs/frontend/i18n/routing.ts`), and visitors arriving on `/` are sent to their browser's language.
- Every text shown to the user, labels read by screen readers included, lives in `srcs/frontend/messages/{en,fr,es}.json`. The backend's English error messages are never shown as they are: the frontend turns them into translated messages.
- The language can be changed from the landing page footer and from the user menu. Dates follow the chosen language.
- The privacy policy and terms of service are written in each language (`srcs/frontend/content/legal/`).

**Still to do:** the documentation pages (`srcs/frontend/content/docs/`) only exist in English for now.

### Minor: Remote authentication with OAuth 2.0 (1 pt)

*Worked on by:* TODO

**Why:** employees log in with the 42 account they already have, with no new password to create and remember. 42 vouches for the email address, so an account an admin created with that email is linked to the 42 account on its first 42 login.

**How it works:** the OAuth 2.0 authorization code flow, in `srcs/backend/app/routers/oauth42.py` with the authlib library.

1. "Log in with 42" opens `/api/auth/42/login`. The backend redirects the browser to the 42 intra with our `client_id`, the `redirect_uri`, `scope=public` and a random `state`, which it also keeps in a signed `oauth_state` cookie for 10 minutes.
2. The user accepts on the intra, which sends the browser back to `/api/auth/42/callback` with a `code` and the same `state`.
3. The backend checks that the `state` matches the cookie, so a login this browser didn't start is refused (CSRF protection). It then trades the `code` and our client secret for an access token, server to server: the secret never reaches the browser.
4. With that token it reads the profile from `/v2/me` (id, login, email, names, picture), then drops the token. Nothing from 42 is stored besides those fields.
5. It finds the account: the one with the same 42 id, or else the one with the same email, or else a new account with the `user` role and no job, so no workspace until an admin assigns one. An account found by its email is now linked to this 42 account: its password is removed and every browser logged in to it is logged out, because 42 has proven that the email belongs to this person while anyone can sign up with any email. From then on, it logs in with 42 only.
6. It opens a session like a password login does (our own `session` cookie) and sends the browser to its dashboard (`/admin` or `/user`), in the language the user picked.

If anything fails (the user cancels, the login took too long, 42 is unreachable, the email belongs to an account linked to another 42 account), the browser goes back to the login page, which says why in the user's language.

### Minor: Support for additional browsers (1 pt)

*Worked on by:* TODO

**Supported browsers:** Google Chrome (required by the subject), Chromium and Firefox, in their current versions. The real minimum comes from Next.js 16 and Tailwind CSS v4: Chrome and Chromium 111+, Firefox 128+.

**How we checked it:** every existing feature was driven in Chromium by an automated browser pass (landing, docs, login, dashboard menus, admin dialogs, and the terminal against a stand-in shell). The checklist in DEV_DOC.md runs the same features by hand in each browser.

**What it fixed:**
- The light theme used each browser's default font (a broken `--font-sans` variable), so the pages looked different from one browser to another. It now uses Geist Sans everywhere.
- A failed login emptied the email and password fields.

**Known limitations:**
- The HTTPS certificate is self-signed, so each browser shows its own warning on the first visit. Chrome and Chromium: Advanced → Proceed to localhost. Firefox: Advanced → Accept the Risk and Continue.
- In the terminal, the shortcuts browsers keep for themselves (Ctrl+W, Ctrl+T, Ctrl+N, Ctrl+Tab) act on the browser tabs and never reach the shell.

• Individual Contributions:
◦ Detailed breakdown of what each team member contributed.
◦ Specific features, modules, or components implemented by each person.
◦ Any challenges faced and how they were overcome.
Any other useful or relevant information is welcome (usage documentation, known
limitations, license, credits, etc.).

Individual contributions :
