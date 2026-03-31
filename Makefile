.PHONY: dev prod down logs ps build clean

dev:
	docker compose -f compose.yaml -f compose.dev.yaml up --build

dev-d:
	docker compose -f compose.yaml -f compose.dev.yaml up --build -d

prod:
	docker compose up --build

prod-d:
	docker compose up --build -d

down:
	docker compose down

down-v:
	docker compose down -v

logs:
	docker compose logs -f

logs-front:
	docker compose logs -f frontend

logs-back:
	docker compose logs -f backend

logs-nginx:
	docker compose logs -f nginx

ps:
	docker compose ps

build-dev:
	docker compose -f compose.yaml -f compose.dev.yaml build

build-prod:
	docker compose build

clean:
	docker compose down -v --rmi all --remove-orphans
