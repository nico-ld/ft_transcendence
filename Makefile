# ft_transcendence
#
# The stack is described in srcs/docker by one base file plus one overlay per
# environment:
#   dev  : docker-compose.yml + docker-compose.dev.yml   (sources mounted, hot reload)
#   prod : docker-compose.yml + docker-compose.prod.yml  (baked images, restart policies)
#
# compose resolves every relative path in every -f file against the base file's
# directory, not against the file that contains the path. all three files live
# in srcs/docker so that the two rules coincide, don't move the overlays into
# subdirectories or their paths will silently shift up a level.
#
# Both environments use a distinct compose project, so they have their own
# containers, networks and volumes and can run side by side.

DOCKER  := docker
COMPOSE := $(DOCKER) compose

DOCKER_DIR := srcs/docker
BASE_FILE  := $(DOCKER_DIR)/docker-compose.yml
DEV_FILE   := $(DOCKER_DIR)/docker-compose.dev.yml
PROD_FILE  := $(DOCKER_DIR)/docker-compose.prod.yml

# values interpolated into the compose files themselves (GRAFANA_ADMIN_PASSWORD,
# DOCKER_SOCKET). without --env-file compose would read $(DOCKER_DIR)/.env, since
# it defaults to the directory of the base file.
ENV_FILE := srcs/.env

COMPOSE_DEV  := $(COMPOSE) -p ft_silk_dev  --env-file $(ENV_FILE) -f $(BASE_FILE) -f $(DEV_FILE)
COMPOSE_PROD := $(COMPOSE) -p ft_silk_prod --env-file $(ENV_FILE) -f $(BASE_FILE) -f $(PROD_FILE)

# compose never builds the workspace images, the backend starts them on demand
WORKSPACES := $(MAKE) -C $(DOCKER_DIR)/workspaces

.DEFAULT_GOAL := help

help:
	@echo "make dev        start the development stack (hot reload)"
	@echo "make prod       start the production stack"
	@echo "make dev-down   stop the development stack"
	@echo "make prod-down  stop the production stack"
	@echo "make dev-logs   follow the development logs"
	@echo "make prod-logs  follow the production logs"
	@echo "make dev-re     rebuild and restart the development stack"
	@echo "make dev-reload-nginx  apply srcs/docker/nginx/nginx.conf to the dev stack"
	@echo "make prod-re    rebuild and restart the production stack"
	@echo "make workspaces build the workspace role images"
	@echo "make config     render the merged compose files (dev and prod)"
	@echo "make clean      stop both stacks and drop their volumes"
	@echo "make fclean     clean + remove the workspace images"

dev:
	$(COMPOSE_DEV) up --build -d

prod: workspaces
	$(COMPOSE_PROD) up --build -d

dev-down:
	$(COMPOSE_DEV) down
prod-down:
	$(COMPOSE_PROD) down

dev-reload-nginx:
	$(COMPOSE_DEV) exec nginx nginx -s reload

dev-logs:
	$(COMPOSE_DEV) logs -f

prod-logs:
	$(COMPOSE_PROD) logs -f

dev-re: dev-down dev

prod-re: prod-down prod

workspaces:
	$(WORKSPACES) images


config:
	@$(COMPOSE_DEV) config -q && echo "dev  config ok"
	@$(COMPOSE_PROD) config -q && echo "prod config ok"

clean:
	-$(COMPOSE_DEV) down -v --remove-orphans
	-$(COMPOSE_PROD) down -v --remove-orphans

fclean: clean
	-$(WORKSPACES) clean-images

.PHONY: help dev prod dev-down prod-down dev-logs prod-logs dev-re prod-re \
        dev-reload-nginx workspaces config clean fclean
