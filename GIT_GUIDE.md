# Guide Git pour le projet Transport API

## 📁 Structure du projet

```
backend/                    # Projet principal (repository Git)
├── .gitignore             # Configuration Git
├── .env.example           # Template des variables d'env
├── package.json           # Dépendances npm
├── src/                   # Code source (versionné)
├── prisma/               # Configuration DB (versionné)
│   ├── schema.prisma     # Schéma de base
│   ├── migrations/       # Migrations versionnées
│   └── seed*.mjs         # Scripts de données d'exemple
└── README.md             # Documentation
```

## 🚀 **Initialisation Git**

```bash
# Se placer dans le dossier backend
cd backend

# Initialiser le repo Git
git init

# Ajouter tous les fichiers (sauf ceux dans .gitignore)
git add .

# Premier commit
git commit -m "🎉 Initial commit: Transport API with Prisma & Supabase"

# Ajouter l'origine remote
git remote add origin <your-repo-url>

# Push initial
git push -u origin main
```

## 📝 **Workflow recommandé**

1. **Développement** : Travailler sur des branches features
```bash
git checkout -b feature/new-feature
```

2. **Commit** : Messages clairs avec émojis
```bash
git commit -m "✨ Add vehicle management endpoints"
git commit -m "🐛 Fix user authentication bug"
git commit -m "📝 Update API documentation"
```

3. **Merge** : Via pull request pour review

## 📋 **Types de commits suggérés**
- ✨ `:sparkles:` - Nouvelle fonctionnalité
- 🐛 `:bug:` - Correction de bug
- 📝 `:memo:` - Documentation
- 🔧 `:wrench:` - Configuration
- 🔒 `:lock:` - Sécurité
- ⚡ `:zap:` - Performance
- 🧹 `:broom:` - Nettoyage code
