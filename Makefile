.PHONY: dev dev-d prod prod-d down down-v logs logs-front logs-back logs-nginx ps build-dev build-prod clean \
        migrate migrate-new migrate-rollup fixtures

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

migrate:
	docker compose exec backend php /var/www/html/bin/console doctrine:migrations:migrate --no-interaction

migrate-new:
	docker compose exec backend php /var/www/html/bin/console make:migration

migrate-rollup:
	docker compose exec backend php /var/www/html/bin/console doctrine:migrations:migrate $(version)

fixtures:
	docker compose exec backend php /var/www/html/bin/console doctrine:fixtures:load --no-interaction
