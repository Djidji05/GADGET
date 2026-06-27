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

## 2. Configuration du Swap (Très Important !)
Pour éviter que Meilisearch ou PostgreSQL ne fassent planter le serveur par manque de RAM (OOM Kill), ajoutez 4 Go de Swap :
```bash
fallocate -l 4G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' | tee -a /etc/fstab
```

## 3. Transfert des Fichiers
Le plus simple est d'utiliser Git ou de copier les dossiers `gadgetzone_admin`, `gadgetzone_website` et le fichier `docker-compose.yml` sur le serveur.

## 4. Configuration des Variables (.env)
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

## 5. Lancement de l'Application
```bash
docker compose up -d --build
```

## 6. Configuration des Domaines (Nginx Proxy Manager)
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

## 7. Importation de la Base de Données
Pour importer votre dump SQL (`htfasil_data_dump.sql`) :
```bash
cat htfasil_data_dump.sql | docker exec -i $(docker ps -qf "name=db") psql -U postgres -d htfasil
```

## 8. Backups Automatisés (Sécurité des Données)
Pour ne jamais perdre les données de vos vendeurs, un script de sauvegarde `setup_backups.sh` a été créé.
Sur votre serveur Hetzner :
1. Créez un dossier : `mkdir -p /root/scripts`
2. Copiez le fichier `setup_backups.sh` dedans et rendez-le exécutable : `chmod +x /root/scripts/setup_backups.sh`
3. Ajoutez-le aux tâches planifiées (Cron) pour qu'il s'exécute tous les jours à 3h du matin :
```bash
crontab -e
# Ajoutez cette ligne à la fin du fichier :
0 3 * * * /root/scripts/setup_backups.sh >> /root/scripts/backup.log 2>&1
```
Les backups seront conservés pendant 7 jours dans `/root/backups/postgres`.

---
**Note sur les Images** : Vos images seront automatiquement stockées dans le dossier `./uploads` sur votre serveur. Pensez à faire des sauvegardes régulières de ce dossier !
 