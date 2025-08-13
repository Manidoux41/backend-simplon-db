# API Backend avec Architecture MVC

API REST sécurisée avec double authentification (Prisma + Supabase) et architecture MVC claire.

## 🏗️ Architecture

```
src/
├── app.js                 # Configuration Express et routes
├── server.js              # Point d'entrée du serveur
├── controllers/           # Logique des endpoints
│   ├── authController.js     # Auth locale (Prisma)
│   ├── supabaseAuthController.js # Auth Supabase
│   ├── adminController.js    # Administration
│   └── userController.js     # Endpoints utilisateurs
├── middleware/            # Middleware réutilisables
│   ├── auth.js              # Authentification
│   ├── roles.js             # Gestion des rôles
│   └── validation.js        # Validation et rate limiting
├── services/              # Logique métier
│   ├── authService.js       # Service auth Prisma
│   └── supabaseService.js   # Service Supabase
├── routes/                # Définition des routes
│   ├── authRoutes.js        # Routes auth locale
│   ├── supabaseRoutes.js    # Routes Supabase
│   ├── adminRoutes.js       # Routes admin
│   └── userRoutes.js        # Routes utilisateurs
└── utils/                 # Utilitaires
    └── validation.js        # Schémas Zod
```

## 🚀 Installation

1. **Cloner et installer**
```bash
npm install
```

2. **Configuration**
```bash
cp .env.example .env
# Éditer .env avec vos valeurs
```

3. **Base de données**
```bash
npx prisma migrate dev
npx prisma generate
```

4. **Démarrer**
```bash
npm start        # Production
npm run dev      # Développement
```

## 🔐 Authentification Double

### 1. Authentification Locale (Prisma)
- JWT avec Argon2id pour le hashing
- Routes: `/auth/*`
- Base de données PostgreSQL via Prisma

### 2. Authentification Supabase
- JWT natif Supabase avec JWKS
- Routes: `/supabase/*`
- Gestion des rôles via user_metadata

## 📍 Endpoints

### Publics
```
GET  /health                # Status API
GET  /db-test              # Test connexion DB
GET  /api/users/public     # Endpoint test public
```

### Authentification Locale
```
POST /auth/register        # Inscription
POST /auth/login          # Connexion
GET  /auth/profile        # Profil utilisateur complet
PUT  /auth/profile        # Mise à jour profil (nom, prénom, téléphone, permis)
PUT  /auth/password       # Changement mot de passe
```

### Authentification Supabase
```
POST /supabase/register   # Inscription
POST /supabase/login      # Connexion
POST /supabase/refresh    # Renouvellement token
POST /supabase/logout     # Déconnexion
GET  /supabase/profile    # Profil utilisateur
```

### Utilisateurs (Auth requise)
```
GET  /api/users/protected # Endpoint protégé (auth flexible)
GET  /api/users/stats     # Statistiques (Supabase auth)
GET  /api/users/moderator # Modérateur+ (Supabase auth)
```

### Administration (Admin Supabase requis)
```
GET    /admin/users         # Liste utilisateurs
DELETE /admin/users/:id     # Supprimer utilisateur
PUT    /admin/users/:id/role # Modifier rôle
```

## 🛡️ Sécurité

- **Rate Limiting**: 100 req/15min global, 10 req/15min auth
- **CORS**: Configuré pour le développement
- **Validation**: Schémas Zod sur tous les endpoints
- **Hashing**: Argon2id avec paramètres renforcés
- **JWT**: Vérification JWKS pour Supabase, HS256 pour local

## 🔧 Technologies

- **Backend**: Express.js, Node.js
- **ORM**: Prisma (PostgreSQL)
- **Auth**: Supabase Auth + JWT local
- **Validation**: Zod
- **Sécurité**: Argon2id, express-rate-limit
- **Database**: PostgreSQL (Supabase)
