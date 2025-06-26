
ENV_FILE := .env
define read_env_variable
    $(shell grep -E "^$(1)=" $(ENV_FILE) | cut -d '=' -f2)
endef
up:
	docker compose up -d
build:
	docker compose build
stop:
	docker compose stop
down:
	docker compose down --remove-orphans
destroy:
	docker compose down --rmi all --volumes --remove-orphans
restart:
	@make down
	@make up
remake:
	@make destroy
	@make init
app:
	docker compose exec app bash
