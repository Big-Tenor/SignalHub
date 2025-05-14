📑 Cahier des Charges — Plateforme de Signalement et de Navigation Urbaine en Guinée

Stack : React, React Native, Mapbox, Turborepo, Supabase
1. Contexte & Objectifs
Contexte

La Guinée est confrontée à divers défis urbains : routes endommagées, coupures d’électricité fréquentes, insalubrité, etc. Ces problèmes affectent directement la mobilité, la sécurité et le quotidien des citoyens.
Cette plateforme vise à offrir un outil participatif et cartographique, permettant aux habitants et visiteurs de signaler les problèmes en temps réel et d’accéder à une carte interactive à jour, afin de contribuer à une meilleure gestion des infrastructures et services publics.
Objectifs

    Permettre aux utilisateurs de signaler des incidents urbains (type, description, photo, géolocalisation).

    Offrir une carte interactive (Mapbox) pour visualiser les zones problématiques.

    Fournir aux autorités un dashboard d’analyse pour faciliter la prise de décision.

    Exploiter Supabase pour simplifier la gestion de l’authentification, des données et des flux en temps réel.

2. Architecture Technique
Organisation Monorepo avec Turborepo

Le projet est structuré comme suit :

apps/
├── web/           → Application Web (React)
├── mobile/        → Application Mobile (React Native avec Expo)
├── api/           → Backend personnalisé (optionnel)

packages/
└── shared/        → Composants, utilitaires et styles communs

Détail de chaque app
apps/web/ – Application Web

    public/ : Fichiers statiques

    src/components/ : Composants React

    src/pages/ : Pages principales

    src/utils/ : Fonctions utilitaires

    src/styles/ : Configuration Tailwind CSS

    App.js / index.js : Entrées principales

apps/mobile/ – Application Mobile

    assets/ : Icônes, images et fichiers statiques

    src/components/ : Composants réutilisables

    src/screens/ : Écrans de navigation

    src/utils/ : Outils JS communs

    App.js / index.js : Entrées principales

apps/api/ – API (optionnel)

    src/controllers/ : Logique métier

    src/models/ : Modèles de données

    src/routes/ : Endpoints REST ou RPC

    src/utils/ : Fonctions d’aide

    index.js : Entrée de l’API

packages/shared/

    src/components/ : Composants UI communs

    src/utils/ : Fonctions partagées

    index.js : Entrée du package

Stack Technique
Couche	Technologies
Frontend Web	React, Tailwind CSS, Mapbox GL JS
Mobile	React Native (Expo), Mapbox (expo-mapbox-gl ou équivalent)
Backend	Supabase : Auth, PostgreSQL, Realtime, Edge Functions
Monorepo	Turborepo (Nx-style repo pour apps et packages)
3. Fonctionnalités
A. Application Web (React)
✅ Authentification

    Inscription, connexion via Supabase Auth

    Support des providers OAuth (optionnel)

📝 Signalement

    Formulaire contenant :

        Type de problème (sélection)

        Description textuelle

        Photo (via Supabase Storage ou Cloudinary)

        Géolocalisation (via navigateur)

    Enregistrement dans la table reports

🗺️ Carte interactive (Mapbox)

    Affichage des signalements (markers + clustering)

    Données mises à jour en temps réel (Realtime Supabase)

📊 Dashboard (optionnel dans MVP)

    Liste des signalements (avec filtres)

    Vue analytique (statistiques par zone, type, etc.)

B. Application Mobile (React Native)
🔐 Authentification

    Identique à la version web via Supabase Auth

📸 Signalement rapide

    Interface fluide : photo + type + description

    Géolocalisation via GPS natif

    Envoi immédiat des données vers Supabase

🗺️ Carte interactive

    Intégration Mapbox

    Affichage des signalements existants en temps réel

C. Backend & Base de Données (Supabase)
📂 Tables principales

    users :
    id, name, email, role (citoyen/admin), created_at

    reports :
    id, user_id, type, description, latitude, longitude, photo_url, status (nouveau, en cours, résolu), created_at

⚙️ Fonctionnalités Supabase

    Auth : Inscription, connexion, sécurité des accès

    Realtime : Mise à jour automatique de la carte

    Storage : Stockage des photos de signalement

    Edge Functions (optionnel) : automatisations (ex : notifications)

4. Plan de Développement (7h en solo)
Temps	Tâches
0h – 1h	Mise en place de Turborepo, initialisation des apps, création du projet Supabase
1h – 2h	Intégration de Supabase Auth (web & mobile), tests de connexion
2h – 3h	Développement du formulaire de signalement (web) avec image, type, géolocalisation
3h – 4h	Intégration de la carte Mapbox sur le web, affichage des signalements, clustering
4h – 5h	Construction de l’interface mobile pour signalement rapide et envoi
5h – 6h	Synchronisation Realtime : web/mobile avec Supabase
6h – 7h	Phase de test, débogage, amélioration UX, préparation de la démo
5. Livrables (MVP)
✅ Frontend Web

    Authentification

    Formulaire de signalement

    Carte interactive (Mapbox)

✅ Application Mobile

    Signalement rapide avec géolocalisation et photo

    Carte des signalements en temps réel

✅ Backend Supabase

    Tables users et reports configurées

    Authentification opérationnelle

    Storage et Realtime actifs

✅ Documentation & Démo

    Documentation technique légère (structure + setup + endpoints)

    Démo live ou screencast montrant les principales fonctionnalités