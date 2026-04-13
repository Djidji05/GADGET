# Guide de Déploiement HTFasil sur Hetzner Cloud

Ce guide vous explique comment mettre en ligne votre marketplace sur votre serveur Hetzner.

## 1. Préparation du Serveur (SSH)
Connectez-vous à votre serveur :
```bash
ssh root@VOTRE_IP_HETZNER
```

Installez Docker (si ce n'est pas déjà fait) :
```bash
curl -fsSL https://get.docker.com | sh
```

## 2. Transfert des Fichiers
Le plus simple est d'utiliser Git ou de copier les dossiers `gadgetzone_admin`, `gadgetzone_website` et le fichier `docker-compose.yml` sur le serveur.

## 3. Configuration des Variables (.env)
Créez un fichier `.env` à la racine (à côté du `docker-compose.yml`) sur le serveur :
```bash
nano .env
```
Copiez et remplissez ces valeurs :
```env
DB_USER=postgres
DB_PASSWORD=votre_mot_de_passe_robuste
DB_NAME=htfasil
JWT_SECRET=une_cle_secrete_tres_longue_et_aleatoire
```

## 4. Lancement de l'Application
```bash
docker compose up -d --build
```

## 5. Configuration des Domaines (Nginx Proxy Manager)
1. Accédez à l'interface de gestion : `http://VOTRE_IP_HETZNER:81`
2. Identifiants par défaut :
   - Email: `admin@example.com`
   - Password: `changeme`
3. Allez dans **Proxy Hosts** > **Add Proxy Host** :
   - **Domain Names**: `htfasil.com`
   - **Forward Hostname**: `frontend`
   - **Forward Port**: `80`
   - Dans l'onglet **SSL**, choisissez "Request a new SSL Certificate" (Let's Encrypt).
4. Répétez pour `manage.htfasil.com` :
   - **Forward Hostname**: `backend`
   - **Forward Port**: `3001` (ou redirigez vers le frontend si le build est unifié).

## 6. Importation de la Base de Données
Pour importer votre dump SQL (`htfasil_data_dump.sql`) :
```bash
cat htfasil_data_dump.sql | docker exec -i $(docker ps -qf "name=db") psql -U postgres -d htfasil
```

---
**Note sur les Images** : Vos images seront automatiquement stockées dans le dossier `./uploads` sur votre serveur. Pensez à faire des sauvegardes régulières de ce dossier !
