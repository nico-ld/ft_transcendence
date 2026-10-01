# DEV DOC

## Frontend :

## Backend :

### On Nginx :

* Regarding the config file, we set the worker_connections at 1024, considering our project scale. We won't reach near having the worker thread opening 1024 simulatenous connexion.

* On the http bloc, mime.types is a config file linked to nginx that match extensions. This allow to execute, for exemple, a JS file instead of displaying row code. Regarding setting default_type to octet-stream, it allows to treat an unknow extension as something to be downloaded instead of displayed on the screen as row code.

* on the server bloc, we only expose port 80, and forward to location / (front) or location /api (back) depending on the request. Hot-Reload is supported for NextJS (proxy_http_version 1.1; and below)
