# Spotikill

## Introduction

Dans ce module, on vous demande d'implémenter l'API de SpotiSkill.

Pour cela, vous aurez à disposition une documentation API et une base de données, que vous devrez utiliser comme base.

Il n'y a pas d’authentification de demandée.
Une validation des inputs est demandée (required, format, etc...).

Dans les grandes lignes, les tâches et fonctionnalités à réaliser sont :

- Permettre avec un appel API de créer une nouvelle demande d'inscription.
- Permettre avec un appel API de récupérer une liste de demandes d'inscription.
- Permettre avec un appel API d'accepter/refuser une demande d'inscription.
- Permettre avec un appel API de récupérer une liste de chansons.
- Permettre avec un appel API d'ajouter une nouvelle chanson.
- Permettre avec un appel API de récupérer une chanson.
- Permettre avec un appel API de récupérer une liste de playlists.
- Permettre avec un appel API de créer une nouvelle playlist.
- Permettre avec un appel API de récupérer tous les albums.
- Permettre avec un appel API de créer un nouvel album.
- Permettre avec un appel API de récupérer des statistiques sur l'utilisation.

## Instructions

- Dans le répertoire `STARTER`, vous trouverez un fichier `database.sql` qui sera la base de données à utiliser pour votre API (il est impossible de changer la structure de la base de données)
- Vous trouverez également un fichier `openapi.yaml` avec la doc au format OpenAPI.
- Un dossier `markingtests` est aussi présent et vous permet de tester votre API.
- L'URL de la documentation de l'API vous sera donnée avant le début du module.
- Vous pouvez utiliser PHP ou NodeJS, avec ou sans framework parmi la liste fournie.
- La documentation ou les tests font foi en cas de conflit avec les instructions.
- Si la documentation et les tests sont en conflit, vous pouvez choisir de suivre la doc ou les tests.

## Description des tâches

### API "Signup"

Gère les demandes d'inscription des utilisateurs au service de streaming musical. Permet de créer une nouvelle demande d'inscription, accepter une demande existante et rejeter une demande existante.

La liste des demandes doit être triée par ordre d'enregistrement décroissant (la plus récente d'abord).

### API "Songs"

Gère les chansons disponibles sur le service de streaming musical. Permet de récupérer une liste de toutes les chansons, d'ajouter une nouvelle chanson à la bibliothèque musicale, et de récupérer une chanson spécifique par son identifiant unique.

La liste des chansons doit être triée par ordre alphabétique par titre.

### API "Playlists"

Gère les playlists disponibles sur le service de streaming musical. Permet de récupérer une liste de toutes les playlists, de créer une nouvelle playlist en fournissant les informations nécessaires telles que le titre, l'auteur et la liste des chansons de la playlist.

La liste des playlists doit être triée par ordre d'enregistrement croissant (plus ancien d'abord)

### API "Albums"

Gère les albums disponibles sur le service de streaming musical. Permet de récupérer une liste de tous les albums et des titres associés, et de créer un nouvel album en fournissant les informations nécessaires telles que le titre, l'artiste et la date de sortie de l'album.

Les albums doivent être par ordre de date de sortie décroissante (plus récent d'abord)
Les chansons doivent être triées dans l'ordre alphabétique, par titre.

### API "Stats"

Permet de récupérer des statistiques sur l'utilisation du service de streaming musical : le top 3 des artistes, chansons, albums ou encore le nombre de secondes écoutées au total.
Les statistiques sont récupérées en spécifiant le type de statistique souhaité et éventuellement l'identifiant de l'utilisateur concerné ainsi que les tranches de date (from, to).

## Livrables

- L'application fonctionnelle dans le répertoire `/module-b` de votre serveur Web.
