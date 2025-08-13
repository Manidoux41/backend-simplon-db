# 🚀 Guide de déploiement Vercel

## 📋 Prérequis

1. **Compte Vercel** : [https://vercel.com](https://vercel.com)
2. **CLI Vercel installé** :
```bash
npm i -g vercel
```

## 🔧 Étapes de déploiement

### 1. Se connecter à Vercel
```bash
vercel login
```

### 2. Déployer depuis le dossier backend
```bash
cd backend
vercel
```

### 3. Configuration lors du premier déploiement
- **Setup and deploy**: Yes
- **Link to existing project**: No
- **Project name**: transport-api (ou votre choix)
- **Directory**: `./` (current directory)
- **Override settings**: No

### 4. Configurer les variables d'environnement
Sur le dashboard Vercel ou via CLI :

```bash
# Variables de base
vercel env add NODE_ENV
# Entrer: production

vercel env add JWT_SECRET
# Entrer: votre_secret_jwt_de_32_caracteres_minimum

# Variables Supabase
vercel env add SUPABASE_URL
# Entrer: https://votre-projet.supabase.co

vercel env add SUPABASE_ANON_KEY
# Entrer: votre_clé_anon

vercel env add SUPABASE_SERVICE_ROLE_KEY
# Entrer: votre_clé_service_role

# Variables base de données
vercel env add DATABASE_URL
# Entrer: postgresql://postgres:password@db.votre-projet.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&pool_timeout=60&sslmode=require

vercel env add DIRECT_URL
# Entrer: postgresql://postgres:password@db.votre-projet.supabase.co:5432/postgres?sslmode=require
```

### 5. Redéployer avec les variables
```bash
vercel --prod
```

## 🔗 URLs après déploiement

- **Preview**: `https://transport-api-xxx.vercel.app`
- **Production**: `https://transport-api.vercel.app`

## 🧪 Tester le déploiement

```bash
# Test de santé
curl https://transport-api.vercel.app/health

# Test d'authentification (remplacer par votre URL)
curl -X POST https://transport-api.vercel.app/supabase/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## ⚠️ Points importants

1. **Base de données** : Supabase est déjà configuré pour la production
2. **CORS** : Peut nécessiter une configuration pour votre frontend
3. **Rate limiting** : Activé automatiquement
4. **Logs** : Disponibles dans le dashboard Vercel

## 🔄 Déploiements futurs

```bash
# Déploiement automatique à chaque push
git add .
git commit -m "Update API"
git push origin main

# Ou déploiement manuel
vercel --prod
```

## 🐛 Dépannage

### Erreur de connexion base de données
- Vérifier les variables `DATABASE_URL` et `DIRECT_URL`
- S'assurer que Supabase autorise les connexions Vercel

### Erreur Prisma
```bash
# Régénérer le client Prisma
vercel env add PRISMA_GENERATE_DATAPROXY
# Entrer: true
```

### Erreur de timeout
- Les fonctions Vercel ont un timeout de 30s maximum
- Optimiser les requêtes lentes

## 📊 Monitoring

- **Dashboard Vercel** : Analytics et logs
- **Supabase Dashboard** : Métriques base de données
- **Endpoints à surveiller** :
  - `/health` - Status API
  - `/api/users/stats` - Statistiques
