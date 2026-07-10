# Deploiement VPS myBank

## Objectif

Deployer myBank sur un VPS OVHcloud Ubuntu 24.04 LTS avec Docker, un reverse proxy partage et un workflow de deploiement continu GitHub Actions.

Cette approche n'utilise pas de plateforme cle en main de type Vercel. Le serveur est administre directement : SSH, firewall, Docker, reverse proxy, certificats HTTPS, migrations et deploiement automatise.

## Architecture retenue

- VPS Ubuntu 24.04 LTS.
- Docker et Docker Compose installees sur le serveur.
- Un reverse proxy Traefik commun expose les ports `80` et `443`.
- Un reseau Docker externe `proxy` permet de brancher plusieurs applications au meme reverse proxy.
- myBank tourne dans son propre projet Compose :
  - `frontend` : build React servi par Nginx ;
  - `backend` : Symfony PHP-FPM ;
  - `db` : MySQL 8 ;
  - `nginx` : point d'entree HTTP interne pour le frontend et l'API.

## Pourquoi cette architecture permet plusieurs applications

Le reverse proxy est independant de myBank. Chaque future application pourra avoir :

- son propre dossier, par exemple `/opt/apps/portfolio` ou `/opt/apps/api-demo` ;
- son propre `compose.yaml` ;
- son propre reseau interne ;
- une connexion au reseau externe `proxy` ;
- des labels Traefik avec un domaine different.

Exemple de routage :

- `mybank.example.com` -> conteneur Nginx de myBank ;
- `portfolio.example.com` -> conteneur Nginx d'une autre app ;
- `api.example.com` -> conteneur API d'un autre projet.

## Fichiers ajoutes au projet

- `.env.production.example` : modele de variables de production.
- `compose.prod.yaml` : orchestration Docker de production pour myBank.
- `deploy/reverse-proxy/compose.yaml` : reverse proxy Traefik partage.
- `deploy/reverse-proxy/.env.example` : email Let's Encrypt.
- `scripts/server-bootstrap.sh` : preparation initiale du VPS.
- `scripts/deploy.sh` : deploiement de l'application sur le VPS.
- `.github/workflows/deploy.yaml` : workflow CD GitHub Actions execute par un runner auto-heberge sur le VPS.

## Preparation initiale du VPS

Distribution choisie :

```txt
Ubuntu 24.04 LTS
```

Serveur loue :

```txt
Hostname OVH : vps-cb604562.vps.ovh.net
IP publique : 51.255.165.107
URL HTTPS : https://vps-cb604562.vps.ovh.net
```

Connexion initiale :

```sh
ssh root@ADRESSE_IP_DU_VPS
```

Pour ce projet :

```sh
ssh root@51.255.165.107
```

Cle publique preparee pour l'acces SSH :

```txt
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAsQFH3O6mKegTCj2LgJpge5eqzkKfKaHrocqIq5J3JT mybank-vps
```

Cette cle doit etre ajoutee dans `/root/.ssh/authorized_keys` lors de la premiere connexion, puis dans `/home/deploy/.ssh/authorized_keys` pour l'utilisateur de deploiement.

Copier ou cloner le depot sur le serveur, puis executer :

```sh
sudo APP_USER=deploy bash scripts/server-bootstrap.sh
```

Le script :

- installe Git, Docker et Docker Compose ;
- cree l'utilisateur `deploy` si necessaire ;
- ajoute `deploy` au groupe Docker ;
- active UFW ;
- ouvre les ports `22`, `80` et `443` ;
- cree le reseau Docker externe `proxy` ;
- prepare le dossier `/opt/apps`.

Apres execution, se reconnecter avec l'utilisateur `deploy`.

## Variables de production

Sur le VPS, dans `/opt/apps/mybank/.env.production` :

```sh
cp .env.production.example .env.production
```

Puis remplir les valeurs :

- `MYBANK_HOST` : domaine ou hostname public ;
- `APP_SECRET` : secret Symfony fort ;
- `MYSQL_PASSWORD` : mot de passe MySQL applicatif ;
- `MYSQL_ROOT_PASSWORD` : mot de passe root MySQL ;
- `JWT_PASSPHRASE` : phrase de passe JWT ;
- `CORS_ALLOW_ORIGIN` : origine HTTPS autorisee.

Pour Traefik :

```sh
cp deploy/reverse-proxy/.env.example deploy/reverse-proxy/.env
```

Puis renseigner :

```txt
TRAEFIK_ACME_EMAIL=email@example.com
```

## Deploiement manuel

Depuis le VPS :

```sh
cd /opt/apps/mybank
./scripts/deploy.sh
```

Le script :

- cree le fichier ACME de Traefik ;
- cree le reseau `proxy` si absent ;
- demarre le reverse proxy ;
- build les images myBank ;
- demarre MySQL ;
- genere les cles JWT si elles n'existent pas ;
- execute les migrations Doctrine ;
- demarre tous les services.

Verification :

```sh
docker compose --env-file .env.production -f compose.prod.yaml ps
curl -I https://MYBANK_HOST
```

Verification realisee le 10/07/2026 :

```sh
curl -I https://vps-cb604562.vps.ovh.net
curl https://vps-cb604562.vps.ovh.net/api/health
```

Resultat :

- HTTPS valide avec reponse `HTTP/2 200` ;
- API disponible avec `{"status":"OK"}` ;
- redirection HTTP vers HTTPS active ;
- conteneurs `frontend`, `backend`, `db`, `nginx` et `traefik` demarres.

## Secrets GitHub Actions pour le CD

Le CD ne stocke pas les secrets de production dans GitHub Actions Secrets.

Choix de securite retenu :

- installer un runner GitHub Actions auto-heberge directement sur le VPS ;
- executer le deploiement localement sur le serveur avec l'utilisateur `deploy` ;
- conserver les secrets dans `/opt/apps/mybank/.env.production` et `/opt/apps/mybank/deploy/reverse-proxy/.env` ;
- ne jamais transmettre la cle SSH privee ni les mots de passe de production a GitHub.

Runner installe :

```txt
Nom : mybank-vps
Labels : self-hosted, linux, mybank-vps
Service systemd : actions.runner.martin-dinahet-fullstack-banking-app.mybank-vps.service
Utilisateur : deploy
```

## Deploiement continu

Le workflow `.github/workflows/deploy.yaml` se lance :

- automatiquement apres une CI reussie sur `main` ;
- manuellement via `workflow_dispatch`.

Etapes du workflow :

1. s'execute sur le runner auto-heberge `mybank-vps` ;
2. checkout le commit GitHub a deployer ;
3. synchronise les fichiers applicatifs vers `/opt/apps/mybank` avec `rsync` ;
4. conserve les fichiers sensibles deja presents sur le VPS ;
5. lance `scripts/deploy.sh`.

Statut actuel :

- la procedure serveur et le premier deploiement sont realises ;
- le runner auto-heberge est installe et actif ;
- le workflow CD est ecrit dans le depot local ;
- l'activation finale necessite le push des fichiers de deploiement sur GitHub, puis un lancement manuel ou une CI reussie sur `main`.

## Points de vigilance

- Ne jamais commiter `.env.production`.
- Ne jamais commiter les cles JWT generees.
- Ne pas stocker la cle SSH privee de deploiement dans GitHub.
- Garder le port MySQL non expose publiquement.
- Utiliser des mots de passe forts pour MySQL, Symfony et JWT.
- Verifier que le domaine pointe vers le VPS avant de demander un certificat Let's Encrypt.
- Pour ajouter une autre application, reutiliser le reseau `proxy` et declarer un nouveau host Traefik.
