# 🔐 Guide d'Authentification Supabase

## ✅ Configuration Complète

Votre API est maintenant configurée avec l'authentification Supabase native ! Voici comment l'utiliser :

## 🚀 Démarrage Rapide

### 1. Créer des utilisateurs de test
```bash
node scripts/create_supabase_users.js
```

### 2. Démarrer l'API
```bash
npm run dev
```

### 3. Tester l'authentification
```bash
# Inscription
curl -X POST http://localhost:3001/supabase-auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","role":"USER"}'

# Connexion
curl -X POST http://localhost:3001/supabase-auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@supabase.test","password":"password123"}'
```

## 📡 Endpoints Disponibles

### Authentication Routes (`/supabase-auth/`)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/supabase-auth/register` | Inscription | `{email, password, role?}` |
| POST | `/supabase-auth/login` | Connexion | `{email, password}` |
| POST | `/supabase-auth/refresh` | Renouveler token | `{refresh_token}` |
| POST | `/supabase-auth/logout` | Déconnexion | Header: `Authorization: Bearer <token>` |

### Protected Routes (Supabase Auth)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/supabase/me` | User | Profil utilisateur |
| GET | `/supabase/admin/users` | Admin | Liste tous les utilisateurs |
| GET | `/supabase/mod/stats` | Moderator+ | Statistiques |

### Legacy Routes (Prisma Auth)

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| GET | `/me` | User | Profil (Prisma) |
| GET | `/admin/users` | Admin | Utilisateurs (Prisma) |
| GET | `/mod/stats` | Moderator+ | Stats (Prisma) |

## 🔑 Utilisateurs de Test

| Email | Mot de passe | Rôle | Type |
|-------|-------------|------|------|
| `admin@supabase.test` | password123 | ADMIN | Supabase |
| `alice@supabase.test` | password123 | USER | Supabase |
| `bob@supabase.test` | password123 | MODERATOR | Supabase |
| `carol@supabase.test` | password123 | USER | Supabase |

## 💡 Utilisation Pratique

### 1. Connexion et récupération du token
```bash
# Connexion
TOKEN=$(curl -s -X POST http://localhost:3001/supabase-auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@supabase.test","password":"password123"}' \
  | jq -r '.session.access_token')

echo "Token: $TOKEN"
```

### 2. Utilisation du token pour accéder aux routes protégées
```bash
# Profil utilisateur
curl -X GET http://localhost:3001/supabase/me \
  -H "Authorization: Bearer $TOKEN"

# Liste des utilisateurs (admin seulement)
curl -X GET http://localhost:3001/supabase/admin/users \
  -H "Authorization: Bearer $TOKEN"

# Statistiques (moderator+)
curl -X GET http://localhost:3001/supabase/mod/stats \
  -H "Authorization: Bearer $TOKEN"
```

### 3. Gestion des rôles
```bash
# Créer un nouvel admin
curl -X POST http://localhost:3001/supabase-auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newadmin@test.com","password":"password123","role":"ADMIN"}'
```

## 🔧 Configuration des Variables d'Environnement

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# API
PORT=3001
NODE_ENV=development
```

## 🛡️ Sécurité

### Hiérarchie des Rôles
- **USER** (niveau 1) : Accès de base
- **MODERATOR** (niveau 2) : Accès modérateur + user
- **ADMIN** (niveau 3) : Accès complet

### Middleware de Sécurité
- **Rate limiting** : 5 tentatives par 15 minutes sur l'auth
- **Validation Zod** : Validation des données d'entrée
- **JWT sécurisé** : Tokens Supabase avec expiration
- **Rôles dans metadata** : Stockage sécurisé des permissions

## 🔄 Migration depuis Prisma

Si vous utilisez déjà l'auth Prisma, les deux systèmes coexistent :

- **Routes Prisma** : `/auth/*`, `/me`, `/admin/users`, `/mod/stats`
- **Routes Supabase** : `/supabase-auth/*`, `/supabase/me`, `/supabase/admin/users`, `/supabase/mod/stats`

## 🎯 Prochaines Étapes

1. **Tester l'API** avec les endpoints Supabase
2. **Créer vos propres utilisateurs** via l'endpoint register
3. **Intégrer dans votre frontend** avec les tokens JWT
4. **Personnaliser les rôles** selon vos besoins

## 🐛 Dépannage

### Token invalide
- Vérifiez que le token n'est pas expiré
- Utilisez `/supabase-auth/refresh` pour renouveler

### Permissions insuffisantes
- Vérifiez le rôle de l'utilisateur dans `user_metadata`
- Les rôles sont hiérarchiques (ADMIN > MODERATOR > USER)

### Erreur de connexion
- Vérifiez les variables d'environnement Supabase
- Testez avec les utilisateurs de test créés

---

🎉 **Votre authentification Supabase est prête !**
