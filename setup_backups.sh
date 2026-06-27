#!/bin/bash
# Script de sauvegarde automatisé pour PostgreSQL sur Docker (HTFasil)
# À placer dans /root/scripts/backup_db.sh et à exécuter via cron

# Configuration
BACKUP_DIR="/root/backups/postgres"
CONTAINER_NAME="db"  # Nom du conteneur postgres dans docker-compose
DB_USER="postgres"
DB_NAME="htfasil"
DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/db_backup_${DATE}.sql.gz"
RETENTION_DAYS=7

# Créer le dossier s'il n'existe pas
mkdir -p "$BACKUP_DIR"

echo "Démarrage de la sauvegarde de la base de données $DB_NAME..."

# Exécuter pg_dump dans le conteneur et compresser la sortie
docker exec $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME | gzip > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
  echo "✅ Sauvegarde réussie : $BACKUP_FILE"
  
  # Nettoyage des anciennes sauvegardes (plus de $RETENTION_DAYS jours)
  find "$BACKUP_DIR" -type f -name "*.sql.gz" -mtime +$RETENTION_DAYS -exec rm {} \;
  echo "Nettoyage des fichiers de plus de $RETENTION_DAYS jours effectué."
else
  echo "❌ Erreur lors de la sauvegarde."
  # Optionnel : envoyer un email ou une alerte Slack/Discord ici
  exit 1
fi
