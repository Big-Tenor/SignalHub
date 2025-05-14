# 🌍 SignalHub - Plateforme de Signalement et Navigation Urbaine

SignalHub est une plateforme collaborative permettant aux citoyens de signaler et visualiser les problèmes d'infrastructure urbaine en Guinée en temps réel.

## 🚀 Fonctionnalités

- 📱 Application web responsive
- 🗺️ Carte interactive avec Mapbox
- 📸 Signalement de problèmes avec photos
- 🔐 Authentification sécurisée
- ⚡ Mises à jour en temps réel
- 📊 Tableau de bord analytique

## 🛠️ Stack Technique

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **Cartographie**: Mapbox GL JS
- **Gestion de Projet**: Turborepo (Monorepo)

## 📁 Structure du Projet

```
apps/
├── web/           → Application Web (React)
├── api/           → Backend personnalisé
└── mobile/        → Application Mobile (en développement)

packages/
├── ui/            → Composants UI partagés
├── shared/        → Utilitaires partagés
└── types/         → Types TypeScript partagés
```

## 🚀 Démarrage Rapide

1. **Installation des dépendances**
   ```bash
   npm install
   ```

2. **Configuration des variables d'environnement**
   ```bash
   cp .env.example .env
   ```
   Remplissez les variables nécessaires dans le fichier `.env`

3. **Lancement du développement**
   ```bash
   npm run dev
   ```

## 📦 Scripts Disponibles

- `npm run dev` - Lance l'environnement de développement
- `npm run build` - Construit le projet pour la production
- `npm run start` - Lance la version de production
- `npm run lint` - Vérifie la qualité du code
- `npm run test` - Execute les tests

## 🤝 Contribution

1. Forkez le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue ou à contacter l'équipe.

---

Fait avec ❤️ pour améliorer la vie urbaine en Guinée
