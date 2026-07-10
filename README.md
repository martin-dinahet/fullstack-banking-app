# myBank

Application web de gestion de finances personnelles realisee pour le projet DevOps CDA 3eme annee.

myBank permet a un utilisateur de creer un compte, de se connecter, puis de visualiser, creer, modifier et supprimer ses operations financieres. Les operations peuvent etre classees par categories afin de suivre les depenses et revenus.

## Stack technique

- Frontend: React 19, TypeScript, Vite, React Router, TanStack Query
- UI: Tailwind CSS 4, shadcn/ui, Montserrat
- Backend: Symfony, PHP 8.4, Doctrine ORM
- Authentification: JWT avec LexikJWTAuthenticationBundle
- Base de donnees: MySQL 8
- Infrastructure: Docker Compose, Nginx reverse proxy
- Qualite: Biome, TypeScript, Vitest, PHPUnit via CI

## Prerequis

- Git
- Docker
- Docker Compose
- Make

Verifier l'installation :

```sh
docker --version
docker compose version
make --version
```

## Installation

Cloner le depot :

```sh
git clone https://github.com/martin-dinahet/fullstack-banking-app.git
cd fullstack-banking-app
```

## Configuration backend

Creer le fichier `backend/.env` si absent :

```dotenv
APP_ENV=dev
APP_SECRET=change_me
DATABASE_URL="mysql://mybank:secret@db:3306/mybank?serverVersion=8.0"
DEFAULT_URI=http://localhost:8080
CORS_ALLOW_ORIGIN='^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=change_me
```

Generer les cles JWT :

```sh
mkdir -p backend/config/jwt
openssl genrsa -out backend/config/jwt/private.pem -aes256 -passout pass:change_me 4096
openssl rsa -pubout -in backend/config/jwt/private.pem -passin pass:change_me -out backend/config/jwt/public.pem
```

La valeur de `JWT_PASSPHRASE` doit correspondre au mot de passe utilise pendant la generation des cles.

## Lancement avec Docker

Lancer l'environnement de developpement :

```sh
make dev
```

Ou en arriere-plan :

```sh
make dev-d
```

L'application est ensuite disponible sur :

```txt
http://localhost:8080
```

Le frontend Vite reste accessible directement sur :

```txt
http://localhost:5173
```

## Initialisation de la base de donnees

Appliquer les migrations Doctrine :

```sh
make migrate
```

## Commandes utiles

Voir les conteneurs :

```sh
make ps
```

Afficher les logs :

```sh
make logs
```

Afficher uniquement les logs frontend :

```sh
make logs-front
```

Afficher uniquement les logs backend :

```sh
make logs-back
```

Arreter les conteneurs :

```sh
make down
```

Arreter et supprimer les volumes :

```sh
make down-v
```

## Tests et qualite

Les commandes frontend s'executent dans le dossier `frontend`.

Avec Docker :

```sh
docker compose exec frontend npm run lint
docker compose exec frontend npm run typecheck
docker compose exec frontend npm run test
```

En local, si les dependances Node sont installees :

```sh
cd frontend
npm install
npm run lint
npm run typecheck
npm run test
```

Tests backend dans le conteneur :

```sh
docker compose exec backend php /var/www/html/bin/phpunit --testdox
```

## CI GitHub Actions

Le workflow CI se trouve dans :

```txt
.github/workflows/ci.yaml
```

Il s'execute sur les branches `main` et `develop`, au push et en pull request.

Jobs principaux :

- `quality`: lint Biome et typecheck TypeScript ;
- `test`: suite Vitest frontend ;
- `test-backend`: PHPUnit avec service MySQL et migrations Doctrine.

## Deploiement continu

Statut actuel :

- VPS configure et premier deploiement manuel effectue ;
- application disponible en HTTPS sur `https://vps-cb604562.vps.ovh.net` ;
- runner GitHub Actions auto-heberge installe sur le VPS ;
- workflow CD prepare dans le depot et executable depuis le runner `mybank-vps`.

Le workflow CD se trouve dans :

```txt
.github/workflows/deploy.yaml
```

Il se lance automatiquement apres une CI reussie sur `main`, ou manuellement depuis GitHub Actions.

Le CD utilise un runner auto-heberge sur le VPS. Les secrets de production restent sur le serveur dans `/opt/apps/mybank/.env.production` et ne sont pas stockes dans GitHub Actions Secrets.

La procedure de deploiement VPS est documentee dans :

```txt
docs/deploiement-vps.md
```

Architecture cible :

- VPS Ubuntu 24.04 LTS ;
- Docker et Docker Compose ;
- Traefik comme reverse proxy partage ;
- reseau Docker externe `proxy` pour heberger plusieurs applications sur le meme serveur ;
- myBank deploye via `compose.prod.yaml`.

Verification de production :

```sh
curl -I https://vps-cb604562.vps.ovh.net
curl https://vps-cb604562.vps.ovh.net/api/health
```

## Fonctionnalites

- Creation de compte
- Connexion
- Deconnexion
- Dashboard financier
- Visualisation du solde, revenus et depenses
- Creation d'operations
- Modification d'operations
- Suppression d'operations avec confirmation
- Creation de categories depuis le formulaire d'operation
- Repartition des operations par categorie
- Interface responsive
- Theme clair/sombre

## API principale

Authentification :

```txt
POST /api/register
POST /api/login
POST /api/logout
GET  /api/me
```

Categories :

```txt
GET    /api/categories
POST   /api/categories
GET    /api/categories/{id}
PATCH  /api/categories/{id}
DELETE /api/categories/{id}
```

Operations :

```txt
GET    /api/operations
POST   /api/operations
GET    /api/operations/summary
GET    /api/operations/{id}
PATCH  /api/operations/{id}
DELETE /api/operations/{id}
```

Exemple de creation d'operation :

```sh
curl -X POST http://localhost:8080/api/operations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{
    "label": "Weekly groceries",
    "amount": -45.50,
    "date": "2026-07-10",
    "category_ids": [1]
  }'
```

## Documentation projet

Le dossier `docs/` contient :

- `docs/dossier-conception/dossier-conception.md` : dossier de conception ;
- `docs/devlog/devlog.md` : journal de developpement ;
- `docs/diagrammes/` : diagrammes UML ;
- `docs/screenshots/` : captures d'ecran de l'application.

Fichier Figma du dossier de conception :

<https://www.figma.com/design/HLG1xiVYfVRPLx4u644AnR>
