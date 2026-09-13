# 🚀 Guide de Déploiement Hetzner pour IA / Agent SSH (`panyem.com`)

Ce document est un **prompt d'instructions système complet** prêt à être donné à une IA (ou exécuté directement sur le serveur SSH) pour déployer la marketplace **Panyem** sur un serveur Hetzner Cloud.

---

## 📋 INFORMATIONS PROJET & ARCHITECTURE

- **Nom de domaine principal (Client)** : `panyem.com` (et `www.panyem.com`)
- **Nom de domaine Admin & API** : `manage.panyem.com`
- **Architecture Docker Compose** :
  1. `frontend` (Port 80) : Vue 3 SPA + Nginx (Site E-commerce client)
  2. `backend` (Port 3001) : Node.js Express API + Interface Admin Vue 3
  3. `db` (PostgreSQL 15 Alpine) : Base de données principale
  4. `redis` (Redis 7 Alpine) : Cache & file d'attente
  5. `meilisearch` (v1.3) : Moteur de recherche rapide
  6. `npm` (Nginx Proxy Manager - Ports 81, 80, 443) : Reverse Proxy SSL / Let's Encrypt

---

## 🛠️ INSTRUCTIONS PAS À PAS POUR L'IA (EXÉCUTION SUR HETZNER)

### ÉTAPE 1 : Préparation du Serveur & Mémoire Swap (OBLIGATOIRE)
> *Objectif : Éviter les erreurs OOM (Out Of Memory) dues à Meilisearch et Postgres.*

Exécute les commandes suivantes sur le serveur Hetzner (en tant que `root`) :

```bash
# 1. Mise à jour du système et installation de Docker
apt update && apt upgrade -y
curl -fsSL https://get.docker.com | sh

# 2. Création d'un fichier Swap de 4 Go
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab

# 3. Vérification du Swap
free -h
```

---

### ÉTAPE 2 : Clonage / Transfert du Projet

Se placer dans le dossier d'application (ex: `/var/www/panyem`) :

```bash
mkdir -p /var/www/panyem
cd /var/www/panyem

# Si le projet est sur Git :
git clone <VOTRE_REPO_GIT_URL> .

# Assurer l'existence du dossier des téléversements d'images
mkdir -p uploads
chmod 777 uploads
```

---

### ÉTAPE 3 : Création du Fichier d'Environnement `.env`

Crée le fichier `.env` à la racine du projet (`/var/www/panyem/.env`) :

```bash
cat << 'EOF' > /var/www/panyem/.env
# --- BASE DE DONNÉES ---
DB_USER=postgres
DB_PASSWORD=Panyem_Secure_Db_Pass_2026!
DB_NAME=htfasil

# --- MOTEUR DE RECHERCHE & CACHE ---
REDIS_HOST=redis
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=Panyem_Meili_MasterKey_2026_Secret

# --- SÉCURITÉ & BACKEND ---
JWT_SECRET=Panyem_Ultra_Long_Jwt_Secret_Key_987654321_Prod
NODE_ENV=production
FRONTEND_URL=https://panyem.com
ALLOWED_ORIGINS=https://panyem.com,https://www.panyem.com,https://manage.panyem.com

# --- VARS NGINX & BUILD ---
VITE_API_URL=https://manage.panyem.com/api
EOF
```

---

### ÉTAPE 4 : Configuration des DNS chez le Registrar (ex: Namecheap, GoDaddy, Cloudflare)

Assure-toi que les enregistrements DNS A pointent vers l'adresse IP publique de votre serveur Hetzner (`VOTRE_IP_HETZNER`) :

| Type | Nom / Hôte | Valeur / Cible | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `VOTRE_IP_HETZNER` | Automatic / 300s |
| **A** | `www` | `VOTRE_IP_HETZNER` | Automatic / 300s |
| **A** | `manage` | `VOTRE_IP_HETZNER` | Automatic / 300s |

---

### ÉTAPE 5 : Lancement des Conteneurs Docker

Exécute la commande de build et de lancement :

```bash
docker compose up -d --build
```

Vérifie que tous les conteneurs sont en statut `running` :

```bash
docker compose ps
```

---

### ÉTAPE 6 : Importation de la Base de Données (Si Dump SQL disponible)

Si vous avez un fichier `htfasil_data_dump.sql` ou `panyem_dump.sql` à importer :

```bash
cat htfasil_data_dump.sql | docker exec -i $(docker ps -qf "name=db") psql -U postgres -d htfasil
```

---

### ÉTAPE 7 : Configuration Nginx Proxy Manager & SSL (Gratuit Let's Encrypt)

1. Ouvre votre navigateur sur : `http://VOTRE_IP_HETZNER:81`
2. **Identifiants par défaut** :
   - Email : `admin@example.com`
   - Password : `changeme`
   *(Met à jour ton email et mot de passe immédiatement)*.

3. **Ajouter Proxy Host #1 pour le Site Client (`panyem.com`)** :
   - Onglet **Details** :
     - Domain Names : `panyem.com`, `www.panyem.com`
     - Scheme : `http`
     - Forward Hostname / IP : `frontend`
     - Forward Port : `80`
     - Cocher : **Block Common Exploits**, **Websockets Support**
   - Onglet **SSL** :
     - SSL Certificate : *Request a new SSL Certificate*
     - Cocher : **Force SSL**, **HTTP/2 Support**, **I Agree to the Let's Encrypt Terms**
     - Email : `contact@panyem.com`
   - Sauvegarder.

4. **Ajouter Proxy Host #2 pour l'API & Admin (`manage.panyem.com`)** :
   - Onglet **Details** :
     - Domain Names : `manage.panyem.com`
     - Scheme : `http`
     - Forward Hostname / IP : `backend`
     - Forward Port : `3001`
     - Cocher : **Block Common Exploits**, **Websockets Support**
   - Onglet **SSL** :
     - SSL Certificate : *Request a new SSL Certificate*
     - Cocher : **Force SSL**, **HTTP/2 Support**, **I Agree to the Let's Encrypt Terms**
   - Sauvegarder.

---

### ÉTAPE 8 : Mettre en place les Sauvegardes Automatiques

```bash
mkdir -p /root/scripts
cp setup_backups.sh /root/scripts/setup_backups.sh
chmod +x /root/scripts/setup_backups.sh

# Programmer le cron quotidien à 3h00 du matin
(crontab -l 2>/dev/null; echo "0 3 * * * /root/scripts/setup_backups.sh >> /root/scripts/backup.log 2>&1") | crontab -
```

---

## 🔍 COMMANDES DE VÉRIFICATION & DIAGNOSTIC POUR L'IA

Si quelque chose ne fonctionne pas, l'IA doit exécuter ces commandes :

1. **Voir les logs des conteneurs** :
   ```bash
   docker compose logs -f backend
   docker compose logs -f frontend
   ```
2. **Vérifier le statut du réseau et des ports** :
   ```bash
   curl -I http://localhost:3001/health
   curl -I http://localhost:80
   ```
3. **Redémarrer un service spécifique** :
   ```bash
   docker compose restart backend
   ```
