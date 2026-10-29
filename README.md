*This project has been created as part of the 42 curriculum by nile-dai, amartel, mmansier, tseche, jdessoli*

## Description :

This project, ft_silk_space, is about easing the hiring, promotion and departure processes of employees inside of a company.
Thanks to an easy-to-use interface, even a non-technical user can now easily create a new work session for an employee, and modify or delete said session when needed.
To understand how we achieve this, please read the rest of this document.

## Instructions :

To run the project, copy-paste the following command in your terminal :

```
make prod
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

## Technical Stack :

### Frontend technologies :

* TypeScript (NextJS)

### Backend technologies :

* Python (FastAPI)
* Docker
* Nginx (as a reverse proxy to forward traffic to NextJS, FastAPI, and handle WebSocket)

### Database system

* PostgreSQL, chosen because of its popularity in the industry

## Database Schema

### Visual Representation

![Database Schema](srcs/db_schema.svg)

### Tables Overview

| Table | Purpose | Key Fields | Relationships |
|-------|---------|------------|---------------|
| `users` | User accounts with authentication info | id, email, password_hash, ft_id, username, first_name, last_name, avatar, role, job, created_at | Parent table |
| `sessions` | Login/browser sessions | id, user_id, created_at, expires_at | Child of users (ON DELETE CASCADE) |
| `terminal_sessions` | Terminal usage tracking | id, user_id, started_at, last_seen_at | Child of users (ON DELETE CASCADE) |
| `friend_requests` | Friend requests, a pair asked both ways is a friendship | user_id, friend_id (primary key: the pair) | Both columns are children of users (ON DELETE CASCADE) |

### Key Features

- **Multi-authentication support**: Users can log in via email/password OR 42 OAuth (ft_id)
- **Cascade deletion**: Deleting a user automatically cleans up their sessions
- **Auto-cleanup**: Terminal sessions deleted after 62 days
- **Constraint**: Every user must have at least one login method (password_hash OR ft_id)

## Features List:
- Complete list of implemented features.
- Which team member(s) worked on each feature.
- Brief description of each feature’s functionality.

## Modules :

| Module | Category | Type | Points |
|---|---|---|---|
| Module | Category | Type | Points |
|---|---|---|---|
| [Use a framework for both the frontend and backend](#major-use-a-framework-for-both-the-frontend-and-backend-2-pts) | Web | Major | 2 |
|[ Implement real-time features using WebSockets](#major-implement-real-time-features-using-websockets-or-similar-technology-2-pts)| Web | Major | 2 |
|[ Setup with xterm.js web terminal](#major-module-of-choice-setup-with-xtermjs-web-terminal-2-pts)| Modules of choice | Major | 2 |
|[ Advanced permissions system](#major-advanced-permissions-system-2-pts)| User Management | Major | 2 |
|[ Standard user management and authentication](#major-standard-user-management-and-authentication-2-pts)| User Management | Major | 2 |
|[ Monitoring system with Prometheus and Grafana](#major-monitoring-system-with-prometheus-and-grafana-2-pts)| Devops | Major | 2 |
|[ Use an ORM for the database](#minor-use-an-orm-for-the-database-1-pt)| Web | Minor | 1 |
|[ CI/CD with conventional commits and PR reviews](#minor-module-of-choice-cicd-with-conventional-commits-and-pr-reviews-1-pt)| Modules of choice | Minor | 1 |
|[ Server-Side Rendering](#minor-server-side-rendering-1-pt)(SSR) | Web | Minor | 1 |
|[ Custom-made design system with reusable components](#minor-custom-made-design-system-with-reusable-components-1-pt)| Web | Minor | 1 |
|[ Advanced search with filters, sorting and pagination](#minor-advanced-search-with-filters-sorting-and-pagination-1-pt) | Web | Minor | 1 |
|[ Support for multiple languages](#minor-support-for-multiple-languages-1-pt)| Accessibility and Internationalization | Minor | 1 |
|[ Support for additional browsers](#minor-support-for-additional-browsers-1-pt)| Accessibility and Internationalization | Minor | 1 |
|[ Remote authentication with OAuth](#minor-remote-authentication-with-oauth-20-1-pt)2.0 | User Management | Minor | 1 |
|[ User activity analytics and insights dashboard](#minor)| User Management | Minor | 1 |
|[A complete notification system](#minor-a-complete-notification-system-1-pt)| Web | Minor | 1 |
| **Total** | | | **24** |

### Major: Use a framework for both the frontend and backend (2 pts)

*Worked on by:* the whole team

**Why:** both frameworks give us routing, validation and a structure every member can follow, so the team could split the work between the front and the back end without reinventing the basics. Next.js renders pages on the server (see the SSR module) and has a clear place for everything; FastAPI checks every request against typed schemas and documents the API by itself.

**How it works:**
- **Frontend: Next.js 16 (React 19)**, in `srcs/frontend`. One folder per page under `app/[locale]/`, server components that read the session and call the backend before sending the page, server actions for the forms (`actions/`), shared components in `components/`.
- **Backend: FastAPI**, in `srcs/backend/app`. One router per domain in `routers/` (`auth`, `oauth42`, `users`, `stats`, `workspace`, `websocket`), pydantic schemas that refuse any invalid or unexpected field (`schemas.py`), and dependencies that require a valid session or the admin role (`security.py`).
- **How they talk:** the browser only talks to nginx, which sends `/api/` to FastAPI and the rest to Next.js. On the server, Next.js calls FastAPI on the Docker network with the user's session cookie (`srcs/frontend/lib/backend.ts`).

### Major: Implement real-time features using WebSockets or similar technology (2 pts)

*Worked on by:* mmansier

**Why:** real-time communication is essential for the terminal experience and any feature requiring instant updates across clients. WebSockets provide full-duplex, low-latency communication channels that enable responsive user experiences.

**How it works:**
- **Real-time updates across clients:** WebSocket connections allow the server to push updates to all connected clients instantly, enabling features like terminal output streaming and live collaboration indicators.
- **Handle connection/disconnection gracefully:** the backend tracks all active WebSocket connections and manages their lifecycle. When a client disconnects (intentionally or due to network issues), the server cleans up resources and notifies other clients if needed. Reconnection logic ensures users can resume their sessions seamlessly.
- **Efficient message broadcasting:** messages can be broadcast to all connected clients, specific users, or user groups. The system uses connection pooling and optimized data serialization to handle multiple concurrent connections efficiently.
- **Implementation:** built with FastAPI's WebSocket support (`routers/websocket.py`), with nginx as a reverse proxy handling WebSocket protocol upgrades. The frontend uses the native WebSocket API with xterm.js for the terminal interface.

### Major (module of choice): Setup with xterm.js web terminal (2 pts)

*Worked on by:* jdessoli, mmansier

**Why we chose it:** xterm.js provides a fully-featured terminal emulator in the browser, enabling users to interact with their Linux workspaces through a real-time, responsive terminal interface. This was essential to deliver the core feature of Silk Space: browser-based access to isolated Linux environments.

**Technical implementation:**
- **xterm.js integration:** the terminal runs in the browser using xterm.js (`srcs/frontend/components/workspace/`), providing a feature-rich terminal experience with support for themes, fonts, and terminal customization.
- **WebSocket connection:** the terminal connects through nginx to FastAPI via WebSocket (`routers/websocket.py`), establishing a persistent, bidirectional connection for real-time terminal I/O.
- **TTY allocation:** each terminal session gets its own TTY inside the container, ensuring proper terminal behavior including line editing, history, and signal handling.
- **Terminal features:** support for resizing (terminal size follows window), copy/paste, keyboard shortcuts, and proper handling of control characters.
- **Session management:** terminal sessions are tracked (`db/terminal_sessions.py`) with start/end times and activity logging for user analytics.
- **Security:** WebSocket connections require valid authentication, are bound to the user's session, and are re-validated every 5 seconds to ensure only authorized users maintain access.

**Value for the project:** xterm.js was the key component that enabled the browser-based terminal experience, making Linux workspace access seamless and intuitive for end users.

**Why it deserves Major status:** implementing a production-grade web terminal required deep integration of frontend (xterm.js), backend (WebSocket routing), and container infrastructure (TTY allocation), comparable in complexity to other Major modules.

### Minor (module of choice): CI/CD with conventional commits and PR reviews (1 pt)

*Worked on by:* jdessoli, amartel

**Why we chose it:** maintaining code quality and consistency across a team requires automated workflows and clear commit conventions. This module ensures every change is reviewed and follows established patterns.

**How it works:**
- **Conventional commits:** all commits follow the conventional commit specification (feat, fix, docs, refactor, etc.) with scope and breaking change indicators when needed. This enables automated changelog generation and semantic versioning.
- **PR workflow:** every feature branch must open a Pull Request on GitHub. PRs require at least one approval from another team member before merging.
- **Automated checks:** GitHub Actions run on every PR: linting (ESLint, Ruff), type checking (TypeScript), unit tests, and build verification.
- **Commitlint:** a commitlint configuration (`commitlint.config.js`) enforces conventional commit message format, rejecting pushes with non-compliant messages via Husky git hooks.
- **Branch protection:** the main branch is protected, preventing direct pushes and requiring status checks to pass before merging.
- **Code review culture:** team members systematically review each other's work, providing feedback on implementation, style, and adherence to project standards.

### Major: Standard user management and authentication (2 pts)

*Worked on by:* mmansier, tseche

**Why:** every employee needs a secure account to log in, see their dashboard, and use their workspace. Admins need to create, edit and delete these accounts as people join, change roles or leave the company.

**How it works:**
- **Authentication:** users can log in with email and password, or with their 42 account through OAuth 2.0. Passwords are hashed and never stored in plain text.
- **User creation:** Users can sign up with their 42 account or with email/password, creating a guest role account (waiting administation job assignment).
- **Profile management:** users can edit their own profile (names, username, password, avatar). Admins can edit any user's information, including role and job.
- **Account deletion:** admins can delete user accounts. This triggers cascade deletion of the user's sessions, workspace (container, network and volume), and all related data.
- **Security:** sessions are managed with secure cookies, and user data is protected with proper validation on both frontend and backend.

### Major: Advanced permissions system (2 pts)

*Worked on by:* jdessoli, mmansier, tseche

**Why:** Silk Space is run by HR admins. They create the accounts, give each employee a job (and with it a workspace) and delete the accounts of the people who leave. Employees only see and change their own account.

**Roles:**
- **Admin:** the admin dashboard, with the system overview and every account. An admin can create users and other admins, change anyone's names, username, job and role, and delete accounts.
- **User:** their own dashboard and statistics, their workspace, and their profile, where they can change their names, username and password, but not their job or role.

**How it works:**
- **Checked by the backend on every request.** Every `/users` route requires the admin role (`require_admin` in `srcs/backend/app/security.py`), and anyone else gets a 403. The role is read from the database each time, so a promotion or a demotion takes effect on the user's next request.
- **CRUD on users** (`srcs/backend/app/routers/users.py`): list, read, create with a role, edit (names, username, job, role) and delete. Deleting an account also deletes its workspace (container, network and volume) and its sessions, so it is logged out everywhere. If Docker can't remove the workspace, the account is kept and the admin can try again.
- **Always one admin left.** An admin can't remove their own admin role or delete their own account. The sign-up form and the profile page refuse any role or job sent to them.
- **Different views per role.** The server sends each role to its own dashboard (`/admin` or `/user`) and away from the other one. In the admin panel (`srcs/frontend/components/admin/`), admins have an Admin badge in the list, the create and edit forms have a role choice, and every account but the admin's own has a delete button with a confirmation.

### Major: Monitoring system with Prometheus and Grafana (2 pts)

*Worked on by:* tseche, mmansier

**Why:** system health and performance need to be visible at a glance. Monitoring helps catch issues early, track resource usage, and ensure the platform runs smoothly for all users.

**How it works:**
- **Prometheus** scrapes metrics from the Docker containers, storing time-series data about CPU, memory, network, request rates and error rates.
- **Grafana** provides a visual dashboard that displays these metrics in real-time graphs and charts, with alerts configured for critical thresholds.
- **Monitored components:** backend API response times and error rates, frontend page load times, Docker container resource usage (CPU, memory, disk I/O), and database query performance.
- **Access:** the Grafana dashboard is accessible to admins, showing system-wide health and allowing them to investigate performance bottlenecks.

### Major: Advanced analytics dashboard with data visualization (2 pts)

*Worked on by:* mmansier, tseche

**Why:** HR admins need insights into how employees use the platform. Usage patterns, workspace activity and login statistics help manage resources and understand user behavior.

**How it works:**
- **Data collection:** every user action is tracked—logins, workspace sessions, terminal commands, and API calls—with timestamps and user identifiers.
- **Visualization:** an analytics dashboard displays aggregated data through interactive charts and graphs, showing metrics like active users, session durations, workspace usage by job role, and terminal activity over time.
- **Filtering:** admins can filter data by date ranges, user roles, jobs, or specific users to drill down into particular areas of interest.
- **Export:** analytics data can be exported for further analysis or reporting.

### Minor: Use an ORM for the database (1 pt)

*Worked on by:* tseche

**Why:** the tables are defined once, as typed Python classes, and the queries are written in Python instead of SQL strings: values always travel as parameters, so they can't be used for SQL injection.

**How it works:** SQLAlchemy 2 with PostgreSQL (psycopg). The tables are Python classes in `srcs/backend/app/db/`: users (with a role and a job, and a check that every account has a password or a 42 login), login sessions, and terminal sessions, linked to users by foreign keys. The queries go through `Session` and `select` in `db/requests.py`, and the tables are created when the backend starts.

### Minor: Custom-made design system with reusable components (1 pt)

*Worked on by:* nile-dai, amartel, tseche

**Why:** a consistent and maintainable UI is essential for a professional user experience. A design system ensures visual coherence across all pages, speeds up development, and makes the interface more accessible.

**How it works:**
- **Component library:** reusable UI components (buttons, forms, cards, modals, tables, toast notifications) are built in `srcs/frontend/components/ui/`, following consistent design tokens for colors, typography, spacing, and shadows.
- **Styling:** Tailwind CSS v4 provides utility classes for rapid styling, with a custom theme defined in `srcs/frontend/tailwind.config.ts` that includes the design tokens (primary/secondary colors, font families, border radii).
- **Theming:** supports light and dark modes, with a toggle in the user menu that persists the user's choice in their profile. The theme applies across all components automatically.
- **Accessibility:** components follow accessibility best practices: proper ARIA labels, keyboard navigation, focus states, and color contrast ratios that meet WCAG standards.
- **Usage:** components are imported and composed to build pages, ensuring visual consistency. Shared layouts (dashboard, admin panel) use these components to maintain a unified look and feel.

### Minor: A complete notification system (1 pt)

*Worked on by:* mmansier

**Why:** every action that creates, changes or deletes something gets a clear confirmation, so nobody wonders whether a click worked.

**How it works:** toasts from the Base UI toast manager (`srcs/frontend/components/ui/toast.tsx`), shown on every page by the `<Toaster />` of the root layout, in the user's language (`Toast` and the forms' texts in `messages/*.json`).
- **Creation:** a new account after sign-up, and a new user from the admin panel.
- **Update:** the profile, the avatar and the password, and a user edited from the admin panel.
- **Deletion:** a user deleted from the admin panel, and an avatar removed from the profile.
- A toast only appears once the server has confirmed the action. Errors stay next to the field or the form they concern.

### Minor: Server-Side Rendering (1 pt)

*Worked on by:* nile-dai, amartel

**Why:** pages arrive with their content already in the HTML. The dashboards come with the user's data in place, without a loading flash, and a visitor who isn't logged in is sent to the login page straight away. The public pages are fast, and search engines get everything from the HTML: the content, a title and description in the page's language, the same page in the other languages, and the list of public pages.

**How it works:** Next.js server components, and the metadata Next.js puts in each page's `<head>`.
- **Rendering:** the dashboards and the profile, workspace and friends pages read the session cookie on the server, call the backend and render at request time (`getCurrentUser` in `srcs/frontend/lib/backend.ts`). With `cacheComponents`, the static part of these pages is prerendered and the user's part is streamed into it. The landing, sign-up, legal and documentation pages are prerendered at build time in each language (`generateStaticParams`).
- **Titles and descriptions:** every page has its own, in its language (`generateMetadata`, with the texts in `Metadata` in `srcs/frontend/messages/*.json` and `pageMetadata` in `srcs/frontend/lib/metadata.ts`). The root layout gives the site's description and a template that adds the site's name after each title: "Log in · Silk Space". The language comes from the route (`next/root-params`), not from the request, so the metadata doesn't stop a page from being prerendered.
- **Languages:** each public page (landing, login, sign-up, legal, docs) has a canonical link to itself and `hreflang` links to the same page in English, French and Spanish. `x-default` points to the address without a language, which sends visitors to their browser's language.
- **Private pages:** the pages behind a login are marked `noindex, nofollow` (the `(app)` layout) and disallowed in `/robots.txt`, in every language.
- **`/sitemap.xml` and `/robots.txt`:** the sitemap lists every public page in every language, with its language links (`srcs/frontend/app/sitemap.ts`), and robots.txt points to it (`srcs/frontend/app/robots.ts`). Both are built at build time.
- The absolute links use `SITE_URL`, read at build time, which defaults to `https://localhost:6767`, where nginx serves the site.

**How to check it:** view a page's source (Ctrl+U): its text is in the HTML before any script runs, and its `<head>` has the page's title, description, canonical and language links. https://localhost:6767/sitemap.xml and https://localhost:6767/robots.txt list the public and private pages.

### Minor: Advanced search with filters, sorting and pagination (1 pt)

*Worked on by:* jdessoli, mmansier

**Why:** admins run every account from one list. Search, filters and pages keep it usable as the company grows, and find anyone in a few keystrokes.

**How it works:** in the admin panel (`srcs/frontend/components/admin/`), on the list of accounts the server sends with the page.
- **Search:** username, email, and first and last name in either order, ignoring case and accents ("elodie" finds "Élodie").
- **Filters:** by role and by job, "no workspace" included, from the funnel menu. Each choice shows how many users it would leave given the search and the other filter, and a dot on the funnel shows that a filter is on.
- **Sorting:** by creation date, username or email, ascending or descending.
- **Pagination:** 10 users per page, with the number of results. A new search, filter or sort starts again from the first page.
- The roles come from one list (`ROLES` in `srcs/frontend/types/User.ts`), shared by the role filter and the role picker, so a new role shows up in both.

### Minor: Support for multiple languages (1 pt)

*Worked on by:* nile-dai, jdessoli

**Why:** the team and the first users speak French, English is the default, and Spanish makes the third language.

**How it works:** next-intl, in English, French and Spanish.
- The language is part of the address (`/en`, `/fr`, `/es`, set in `srcs/frontend/i18n/routing.ts`), and visitors arriving on `/` are sent to their browser's language.
- Every text shown to the user, labels read by screen readers included, lives in `srcs/frontend/messages/{en,fr,es}.json`. The backend's English error messages are never shown as they are: the frontend turns them into translated messages.
- The language can be changed from the landing page footer and from the user menu. Dates follow the chosen language.
- The privacy policy, the terms of service and the documentation are written in each language (`srcs/frontend/content/legal/` and `srcs/frontend/content/docs/`), and a page keeps its address from one language to another.

### Minor: Remote authentication with OAuth 2.0 (1 pt)

*Worked on by:* mmansier

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

*Worked on by:* jdessoli

**Supported browsers:** Google Chrome (required by the subject), Chromium and Firefox, in their current versions. The real minimum comes from Next.js 16 and Tailwind CSS v4: Chrome and Chromium 111+, Firefox 128+.

**How we checked it:** every existing feature was driven in Chromium by an automated browser pass (landing, docs, login, dashboard menus, admin dialogs, and the terminal against a stand-in shell). The checklist in DEV_DOC.md runs the same features by hand in each browser.

**What it fixed:**
- The light theme used each browser's default font (a broken `--font-sans` variable), so the pages looked different from one browser to another. It now uses Geist Sans everywhere.
- A failed login emptied the email and password fields.

**Known limitations:**
- The HTTPS certificate is self-signed, so each browser shows its own warning on the first visit. Chrome and Chromium: Advanced → Proceed to localhost. Firefox: Advanced → Accept the Risk and Continue.
- In the terminal, the shortcuts browsers keep for themselves (Ctrl+W, Ctrl+T, Ctrl+N, Ctrl+Tab) act on the browser tabs and never reach the shell.

