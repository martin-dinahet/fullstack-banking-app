#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

if [ ! -f .env.production ]; then
  echo "Missing .env.production. Copy .env.production.example and fill production values."
  exit 1
fi

if [ ! -f deploy/reverse-proxy/.env ]; then
  echo "Missing deploy/reverse-proxy/.env. Copy deploy/reverse-proxy/.env.example and set TRAEFIK_ACME_EMAIL."
  exit 1
fi

mkdir -p deploy/runtime/jwt deploy/reverse-proxy
touch deploy/reverse-proxy/acme.json
chmod 600 deploy/reverse-proxy/acme.json

docker network create proxy >/dev/null 2>&1 || true

docker compose --env-file deploy/reverse-proxy/.env -f deploy/reverse-proxy/compose.yaml up -d

docker compose --env-file .env.production -f compose.prod.yaml build
docker compose --env-file .env.production -f compose.prod.yaml up -d db
docker compose --env-file .env.production -f compose.prod.yaml run --rm backend php bin/console lexik:jwt:generate-keypair --skip-if-exists --no-interaction
docker compose --env-file .env.production -f compose.prod.yaml run --rm backend php bin/console doctrine:migrations:migrate --no-interaction
docker compose --env-file .env.production -f compose.prod.yaml up -d --remove-orphans

docker compose --env-file .env.production -f compose.prod.yaml ps
