# Cruz Azul ERP

Proyecto preparado para una evaluacion de Arquitectura Multicloud en AWS Academy. El caso de estudio corresponde a Farmacias Cruz Azul, que requiere una infraestructura segura en AWS con computo, red, base de datos RDS PostgreSQL, almacenamiento S3 para backups, control de acceso, MFA y token JWT para autenticacion web.

Este repositorio no contiene credenciales reales, archivo `.env`, llaves `.pem` ni contrasenas productivas. Queda listo para subirse primero a GitHub y, posteriormente, clonarse en una instancia EC2 Ubuntu dentro de AWS Academy.

## Flujo de evidencia

GitHub -> EC2 -> /srv/cruz_azul-erp -> Docker -> Frontend -> RDS -> S3

## Tecnologias utilizadas

- AWS Academy
- EC2
- RDS PostgreSQL
- S3
- Docker
- Docker Compose
- Node.js
- Express
- JWT
- MFA TOTP
- GitHub

## Estructura

```text
cruz-azul-erp/
├── app/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── .env.example
├── scripts/
│   └── backup_rds_s3.sh
├── docs/
│   ├── informe_base.md
│   ├── analisis_riesgos.md
│   ├── evidencias.md
│   ├── cronograma.md
│   ├── costos_multicloud.md
│   └── diagrama_excalidraw_guia.md
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Subir el proyecto a GitHub desde el PC

```bash
cd cruz-azul-erp
git init
git add .
git commit -m "Proyecto base Cruz Azul ERP"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/cruz-azul-erp.git
git push -u origin main
```

## Clonar en EC2

Estos pasos se ejecutan despues de crear la cuenta/laboratorio en AWS Academy, crear EC2 y tener acceso por SSH.

```bash
sudo mkdir -p /srv
sudo chown -R ubuntu:ubuntu /srv
git clone https://github.com/TU_USUARIO/cruz-azul-erp.git /srv/cruz_azul-erp
cd /srv/cruz_azul-erp
pwd
git remote -v
git log --oneline -5
ls -la
```

## Preparar variables de entorno

```bash
cd /srv/cruz_azul-erp/app
cp .env.example .env
nano .env
```

Completar en `.env` los datos reales de RDS, el bucket S3, el correo administrador, una contrasena temporal segura, `JWT_SECRET` y un `MFA_SECRET` base32. No subir este archivo a GitHub.

## Construir y levantar Docker

```bash
cd /srv/cruz_azul-erp
docker compose build
docker compose up -d
docker ps
docker logs cruz-azul-frontend
```

La aplicacion queda expuesta en el puerto 80 del host EC2 y en el puerto 3000 dentro del contenedor.

## Detener y reiniciar

```bash
docker compose stop
docker ps
docker compose start
docker ps
```

## Probar conexion a RDS

```bash
cd /srv/cruz_azul-erp
source app/.env
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -c "SELECT NOW();"
```

## Backup manual hacia S3

```bash
chmod +x /srv/cruz_azul-erp/scripts/backup_rds_s3.sh
/srv/cruz_azul-erp/scripts/backup_rds_s3.sh
aws s3 ls s3://NOMBRE_BUCKET/backups/
```

## Cron diario cada 24 horas

```cron
0 2 * * * /srv/cruz_azul-erp/scripts/backup_rds_s3.sh >> /srv/cruz_azul-erp/backups/backup.log 2>&1
```

## Funcionamiento de la aplicacion

Al iniciar, Express se conecta a PostgreSQL usando `pg`, crea la tabla `usuarios` si no existe y registra un administrador inicial con variables de entorno. La contrasena se guarda con hash bcryptjs y el secreto MFA se valida como TOTP base32 con Speakeasy.

El login solicita correo, contrasena y codigo MFA de 6 digitos. Si las credenciales son validas, se genera un JWT con expiracion de 15 minutos y se guarda en una cookie httpOnly. El dashboard protegido muestra el usuario autenticado, el token activo, conexion PostgreSQL OK y el resultado de `SELECT NOW()`.

## Checklist de capturas para el informe

- Repositorio GitHub con archivos.
- Commit y push.
- AWS Academy iniciado.
- EC2 creada.
- Security Group EC2.
- RDS PostgreSQL creado.
- Security Group RDS.
- S3 bucket creado.
- SSH a EC2.
- `git clone` desde GitHub.
- `pwd` mostrando `/srv/cruz_azul-erp`.
- `git remote -v`.
- `git log`.
- `docker compose build`.
- `docker compose up -d`.
- `docker ps`.
- `docker logs`.
- Login web.
- Dashboard con RDS OK.
- Backup manual.
- Backup visible en S3.
- `crontab -l`.
- `docker compose stop/start`.

## Proximos pasos en AWS Academy

1. Crear una instancia EC2 Ubuntu.
2. Configurar Security Group de EC2 con SSH desde My IP y HTTP desde internet.
3. Crear RDS PostgreSQL en subred privada o con acceso restringido.
4. Configurar Security Group de RDS permitiendo 5432 solo desde el Security Group de EC2.
5. Crear bucket S3 con acceso publico bloqueado.
6. Conectarse por SSH a EC2.
7. Instalar Git, Docker, Docker Compose, PostgreSQL client y AWS CLI.
8. Clonar este repositorio en `/srv/cruz_azul-erp`.
9. Crear `.env` desde `.env.example` con los datos reales.
10. Levantar Docker, probar login, probar RDS y ejecutar backup hacia S3.
