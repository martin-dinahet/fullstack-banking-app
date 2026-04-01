# Journal de développement: MyBank

## Avancées quotidiennes

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

- Problème pendant la mise en place de Docker pour le projet: la configuration
  donnée pendant le cours ne fonctionnait pas. Mise en place d'une configuration
  personnalisée, avec Nginx et un mode dev et prod.
- Problème pendant la mise en place des tests: TypeScript ne reconnaissait pas
  la méthode `.toBeInTheDocument()`. Débogage et mise à jour de la
  configuration.
