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

Modules :

### Minor: Remote authentication with OAuth 2.0 (1 pt)

*Worked on by:* TODO

**Why:** employees log in with the 42 account they already have, with no new password to create and remember. 42 vouches for the email address, so an account an admin created with that email is linked to the 42 account on its first 42 login.

**How it works:** the OAuth 2.0 authorization code flow, in `srcs/backend/app/routers/oauth42.py` with the authlib library.

1. "Log in with 42" opens `/api/auth/42/login`. The backend redirects the browser to the 42 intra with our `client_id`, the `redirect_uri`, `scope=public` and a random `state`, which it also keeps in a signed `oauth_state` cookie for 10 minutes.
2. The user accepts on the intra, which sends the browser back to `/api/auth/42/callback` with a `code` and the same `state`.
3. The backend checks that the `state` matches the cookie, so a login this browser didn't start is refused (CSRF protection). It then trades the `code` and our client secret for an access token, server to server: the secret never reaches the browser.
4. With that token it reads the profile from `/v2/me` (id, login, email, names, picture), then drops the token. Nothing from 42 is stored besides those fields.
5. It finds the account: the one with the same 42 id, or else the one with the same email (now linked to this 42 account), or else a new account with the `user` role and no job, so no workspace until an admin assigns one.
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
