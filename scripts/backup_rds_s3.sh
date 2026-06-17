#!/usr/bin/env bash
set -e

trap 'echo "Error: el backup no pudo completarse. Revisa credenciales, conectividad RDS, pg_dump y permisos AWS CLI."' ERR

ENV_FILE="/srv/cruz_azul-erp/app/.env"
BACKUP_DIR="/srv/cruz_azul-erp/backups"

echo "Iniciando backup de RDS PostgreSQL..."

if [ ! -f "$ENV_FILE" ]; then
  echo "No existe el archivo de variables: $ENV_FILE"
  exit 1
fi

set -a
. "$ENV_FILE"
set +a

if [ -z "$S3_BUCKET" ]; then
  echo "La variable S3_BUCKET no esta configurada."
  exit 1
fi

for required_var in DB_HOST DB_PORT DB_NAME DB_USER DB_PASSWORD; do
  if [ -z "${!required_var}" ]; then
    echo "La variable $required_var no esta configurada."
    exit 1
  fi
done

mkdir -p "$BACKUP_DIR"

TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/cruzazul_rds_$TIMESTAMP.sql"

if [ "$DB_SSL" = "true" ]; then
  export PGSSLMODE="require"
else
  export PGSSLMODE="disable"
fi

export PGPASSWORD="$DB_PASSWORD"

pg_dump \
  -h "$DB_HOST" \
  -p "$DB_PORT" \
  -U "$DB_USER" \
  -d "$DB_NAME" \
  -F p \
  -f "$BACKUP_FILE"

aws s3 cp "$BACKUP_FILE" "s3://$S3_BUCKET/backups/$(basename "$BACKUP_FILE")" --acl bucket-owner-full-control

echo "Backup finalizado correctamente: $BACKUP_FILE"
echo "Archivo subido a S3: s3://$S3_BUCKET/backups/$(basename "$BACKUP_FILE")"
