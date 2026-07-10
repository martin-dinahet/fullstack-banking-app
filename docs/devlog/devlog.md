# Journal de développement: MyBank

## Avancées quotidiennes

### Vendredi 10/07/2026
- preparation du deploiement VPS et du workflow CD:
  - VPS OVHcloud identifie avec le hostname `vps-cb604562.vps.ovh.net`;
  - resolution de l'IP publique `51.255.165.107`;
  - choix d'une architecture multi-applications avec Traefik et un reseau Docker externe `proxy`;
  - ajout de `compose.prod.yaml`, `deploy/reverse-proxy/compose.yaml`, `scripts/server-bootstrap.sh`, `scripts/deploy.sh` et `.github/workflows/deploy.yaml`;
  - ajout de la documentation `docs/deploiement-vps.md`;
  - generation d'une cle SSH dediee `mybank_vps`;
  - installation de Docker, creation de l'utilisateur `deploy`, configuration UFW et creation du reseau Docker `proxy`;
  - premier deploiement manuel realise sur `https://vps-cb604562.vps.ovh.net`;
  - verification HTTPS OK et API `/api/health` OK;
  - installation d'un runner GitHub Actions auto-heberge `mybank-vps` sur le VPS;
  - choix securite: conservation des secrets de production sur le VPS, sans ajout de cle SSH privee ni de mots de passe dans GitHub Actions Secrets;
  - reste a pousser les fichiers de deploiement pour activer le workflow CD cote GitHub.
- audit de l'application par rapport au brief projet:
  - verification de l'inscription, de la connexion et du dashboard;
  - verification de la creation d'une operation avec categorie;
  - verification responsive mobile et tablette;
  - identification de l'absence d'actions de modification et suppression dans l'interface.
- ajout de la modification et de la suppression des operations dans le dashboard:
  - reutilisation du formulaire de transaction pour l'ajout et l'edition;
  - ajout de boutons d'action edit/delete sur chaque transaction;
  - ajout d'une confirmation avant suppression;
  - invalidation des requetes TanStack Query apres modification ou suppression;
  - correction d'un overlay decoratif qui interceptait les clics sur le dashboard.
- verification:
  - `npm run typecheck` dans le conteneur frontend;
  - `npm run lint` dans le conteneur frontend;
  - `npm run test` dans le conteneur frontend;
  - test manuel de modification et suppression dans le navigateur.
- production du livrable de conception:
  - creation d'un dossier de conception Markdown;
  - generation de captures d'ecran de l'application;
  - creation d'un fichier Figma pour les zonings, wireframes et maquettes;
  - blocage rencontre: quota Figma MCP atteint sur le plan Starter avant verification finale complete;
  - decision: assumer cette limite dans le dossier de conception et poursuivre les elements realisables hors Figma.

### Lundi 27/04/2026
- ajout de la page dashboard avec gestion des transactions:
  - liste des opérations avec catégorie et montant
  - ajout de catégories aux opérations (relation many-to-many)
  - formulaire d'ajout d'opération
  - affichage du solde total
- refactorisation de la structure API:
  - extraction des types API dans des fichiers types.ts centralisés par feature
  - renommage de category_id en category_ids pour supporter plusieurs catégories
- corrections et améliorations:
  - vidage du cache des requêtes lors du login/logout
  - mise à jour immédiate de l'état d'authentification via setQueryData
  - gestion de la réponse 204 du logout
  - rechargement de la page après déconnexion
  - ajout de messages d'erreur appropriés
- ajout des tests pour les composants frontend
- suppression d'une page inutilisée
- formatage du code avec Biome
- implémentation du système d'authentification complet:
  - ajout des endpoints API pour login, register et logout
  - création des hooks et composants pour les formulaires de connexion et inscription
  - mise en place du contexte d'authentification avec TanStack Query
  - création des guards (GuestGuard, AuthGuard) pour protéger les routes
  - ajout de la gestion du token JWT dans les requêtes API
  - ajout de toasts pour les actions de login, register et logout
  - inscription automatique après création de compte
  - mise en forme du code avec Biome

### Lundi 30/03/2026
- prise de connaissance du projet et du brief
- mise en place du projet
- mise en place du dépôt GitHub
- configuration Docker

### Mardi 31/03/2026
- installation et configuration des dépendances frontend
- implémentation de la charte graphique dans le frontend
- mise en place d'une première suite de tests avec Vitest
- mise en place d'une pipeline CI/CD avec GitHub Actions

### Mercredi 01/04/2026
- réalisation des diagrammes UML de conception
- mise en place des entités dans le backend
- création et application d'une migration dans le backend
- implémentation des endpoints nécessaires dans le backend


## Problèmes rencontrés

- Les requêtes API pour récupérer l'utilisateur échouaient sans le token JWT.
  Solution: stockage du token dans une variable globale et ajout dans
  l'en-tête Authorization des requêtes.
- Les appels à /api/me étaient relancés plusieurs fois, ce qui ralentissait
  la redirection. Solution: désactivation du retry pour cette requête.
- Utilisation de React Router en mode déclaratif avec des actions de formulaire
  via useTransition.

- Problème pendant la mise en place de Docker pour le projet: la configuration
  donnée pendant le cours ne fonctionnait pas. Mise en place d'une configuration
  personnalisée, avec Nginx et un mode dev et prod.
- Problème pendant la mise en place des tests: TypeScript ne reconnaissait pas
  la méthode `.toBeInTheDocument()`. Débogage et mise à jour de la
  configuration.

## Documentation CI/CD

### Installation de Docker

Docker est utilise dans ce projet pour fournir un environnement reproductible et rapide a lancer.
Il permet d'executer les services necessaires a l'application sans installer manuellement chaque dependance sur la machine de developpement.

Services conteneurises:

- frontend React/Vite;
- backend Symfony/PHP-FPM;
- base de donnees MySQL;
- serveur Nginx reverse proxy.

Installation selon le systeme:

- Windows: installer Docker Desktop depuis le site officiel Docker, puis activer WSL 2 si Docker le demande.
- macOS: installer Docker Desktop depuis le site officiel Docker.
- Linux: installer Docker Engine et Docker Compose via le gestionnaire de paquets de la distribution, puis ajouter l'utilisateur au groupe `docker` si necessaire.

Verification apres installation:

```sh
docker --version
docker compose version
```

### Lancement du projet avec Docker

Lancement en mode developpement:

```sh
make dev
```

Lancement en mode detache:

```sh
make dev-d
```

Arret des conteneurs:

```sh
make down
```

Consultation des logs:

```sh
make logs
```

Application exposee en local:

```txt
http://localhost:8080
```

### Pipeline CI/CD avec GitHub Actions

Un pipeline CI/CD est une suite d'etapes automatisees executees a chaque changement de code.
Dans ce projet, la CI sert a verifier automatiquement la qualite du code et les tests avant integration.

Le fichier de configuration est:

```txt
.github/workflows/ci.yaml
```

Declencheurs:

- push sur `main` et `develop`;
- pull request vers `main` et `develop`.

Jobs principaux:

1. `quality`
   - checkout du depot;
   - installation de Node.js;
   - installation des dependances frontend;
   - execution de Biome lint;
   - execution du typecheck TypeScript.

2. `test`
   - checkout du depot;
   - installation de Node.js;
   - installation des dependances frontend;
   - execution des tests Vitest.

3. `test-backend`
   - checkout du depot;
   - installation de PHP 8.4;
   - demarrage d'un service MySQL;
   - installation Composer;
   - creation de la base de test;
   - execution des migrations Doctrine;
   - execution de PHPUnit.

### Deploiement continu

Statut actuel: a completer.

Le projet contient une integration continue, mais le workflow de deploiement continu n'est pas encore complet.
Le brief demande un deploiement automatique apres validation des tests.

Procedure cible recommandee:

1. lancer la CI;
2. construire les images Docker;
3. publier les images dans un registre Docker;
4. se connecter au serveur de staging ou production;
5. recuperer les dernieres images;
6. redemarrer les services via Docker Compose;
7. verifier que l'application repond correctement.

Exemple d'etapes a ajouter dans GitHub Actions:

```txt
build Docker images -> push registry -> SSH server -> docker compose pull -> docker compose up -d
```

### Tests d'integration

Les tests d'integration doivent verifier que les parties principales de l'application fonctionnent ensemble:

- frontend;
- backend;
- base de donnees.

Scenario recommande:

1. demarrer l'environnement Docker;
2. ouvrir l'application;
3. creer un compte;
4. se connecter;
5. creer une categorie;
6. creer une operation depuis le frontend;
7. verifier que l'operation est envoyee au backend;
8. verifier que l'operation est stockee en base;
9. modifier l'operation;
10. supprimer l'operation.

Outil recommande:

- Playwright ou Cypress.

Statut actuel:

- les tests unitaires et composants frontend existent;
- les tests backend sont prevus dans la CI;
- un test end-to-end complet frontend/backend/base de donnees reste a ajouter.
