.DEFAULT_GOAL := help

PNPM ?= pnpm
COMPOSE ?= docker compose
BASE ?= http://localhost:3000

.PHONY: help setup install env dev build db-up db-migrate api-docker smoke down check

help: ## List targets
	@awk 'BEGIN {FS = ":.*##"; printf "Usage: make <target>\n\nTargets:\n"} \
		/^[a-zA-Z0-9_.-]+:.*##/ { printf "  %-14s %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

setup: env install db-up db-migrate ## Bootstrap .env, deps, Postgres, migrations

install: ## pnpm install
	$(PNPM) install

env: ## Copy .env.example → .env if missing
	@test -f .env || cp .env.example .env

dev: ## Run web, admin, and api (turbo)
	$(PNPM) dev

build: ## Build all apps
	$(PNPM) build

db-up: ## Start PostgreSQL (docker compose)
	$(COMPOSE) up -d postgres
	@echo "Waiting for Postgres..."
	@for i in 1 2 3 4 5 6 7 8 9 10; do \
		$(COMPOSE) exec -T postgres pg_isready -U memor >/dev/null 2>&1 && exit 0; \
		sleep 1; \
	done; \
	echo "Postgres not ready; check: $(COMPOSE) ps"; exit 1

db-migrate: ## Apply Drizzle migrations
	$(PNPM) db:migrate

api-docker: ## Start Postgres + API containers
	$(COMPOSE) up -d postgres api

smoke: ## Run API smoke script (API must be up)
	BASE="$(BASE)" ./scripts/smoke.sh

down: ## Stop compose services
	$(COMPOSE) down

check: build ## Validate build and compose file
	$(COMPOSE) config
