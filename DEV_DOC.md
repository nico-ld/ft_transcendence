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

### On Nginx :

* Regarding the config file, we set the worker_connections at 1024, considering our project scale. We won't reach near having the worker thread opening 1024 simulatenous connexion.

* On the http bloc, mime.types is a config file linked to nginx that match extensions. This allow to execute, for exemple, a JS file instead of displaying row code. Regarding setting default_type to octet-stream, it allows to treat an unknow extension as something to be downloaded instead of displayed on the screen as row code.

* on the server bloc, we only expose port 80, and forward to location / (front) or location /api (back) depending on the request. Hot-Reload is supported for NextJS (proxy_http_version 1.1; and below)
