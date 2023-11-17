# MERCADONA

## Introduction

Le projet est divisé en trois parties. Un frontend, un backend et un dossier de test pour le backend.
Un guide d'utilisation est fournit avec la livraison de l'application.

## Prérequis

Frontend : 
- Node.js v14+
Backend :
- C# .NET v7

Base de données : PostgreSQL v15

## Installation

# Backend : 

Naviguer à la racine du backend avec la commande cd ./backend

Dans un premier temps vous devez créer un fichier .env pour les variables d'environnement. Il y en a 4 a initialiser dans le backend: 
SecretToken=
ConnectionStrings__DefaultConnection=
DefaultAccount=
AllowedHosts=

La variable "SecretToken=" est la signature du JWT.
La variable "ConnectionStrings__DefaultConnection=" est la chaine de connexion à la base de données.
La variable "DefaultAccount=" correspond au mot de passe par défaut du super utilisateur qui sera créer au lancement du backend
La variable "AllowedHosts=" correspond à toutes les URL autorisés pour le CORS.

Pour restaurer les dépendances utiliser la commande : dotnet restore
Pour construire le projet utiliser la commande : dotnet build
Enfin, pour lancer le backend utiliser la commande dotnet run

# Frontend : 

Naviguer à la racine du frontend avec la commande cd ./frontend

Dans un premier temps vous devez créer un fichier .env.local pour les variables d'environnement. Il y en a 1 à initialiser dans le frontends: 
NEXT_PUBLIC_API_URL=

La variable  "NEXT_PUBLIC_API_URL=" est l'URL du backend pour les call api.

Ensuite vous pouvez installer les dépendances du projet avec la commande npm install.
Une fois les dépendances installées vous pouvez lancer le projet avec la commande npm run start

# Test :

Naviguer à la racine du dossier Tests avec la commade cd ./Tests

Pour lancer les tests vous devez restaurer les packages avec : dotnet restore
Puis pour lancer les tests la commande : dotnet test 

Si vous voulez lancer les tests avec un coverage de l'application lancer la commande : dotnet test /p:CollectCoverage=true
