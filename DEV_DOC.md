# DEV DOC

## Frontend :

## Backend :

### On Nginx :

Regarding the config file, we set the worker_connections at 1024, considering our project scale. We won't reach near having the worker thread opening 1024 simulatenous connexion.
