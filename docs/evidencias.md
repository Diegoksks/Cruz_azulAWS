# Guia de Evidencias

| Nro. | Pantalla o accion a capturar | Comando usado | Que demuestra | Seccion del informe |
|---:|---|---|---|---|
| 1 | Repositorio GitHub con archivos | `git status` | Proyecto versionado | Evidencias de ejecucion |
| 2 | Commit y push realizados | `git log --oneline -5` | Historial de cambios | Control de versiones |
| 3 | AWS Academy iniciado | No aplica | Ambiente academico disponible | Servicios utilizados |
| 4 | EC2 creada | Consola EC2 | Computo provisionado | Arquitectura propuesta |
| 5 | Security Group EC2 | Consola EC2 | SSH restringido y HTTP habilitado | Seguridad |
| 6 | RDS PostgreSQL creado | Consola RDS | Base de datos administrada | Base de datos |
| 7 | Security Group RDS | Consola VPC | Puerto 5432 restringido a EC2 | Seguridad |
| 8 | Bucket S3 creado | Consola S3 | Almacenamiento de backups | Respaldos |
| 9 | SSH conectado a EC2 | `ssh -i llave.pem ubuntu@IP` | Acceso operativo al servidor | Evidencias |
| 10 | Clonacion GitHub en EC2 | `git clone ... /srv/cruz_azul-erp` | Despliegue desde repositorio | Ejecucion |
| 11 | Ruta obligatoria | `pwd` | Proyecto en `/srv/cruz_azul-erp` | Ejecucion |
| 12 | Repositorio remoto | `git remote -v` | Origen GitHub configurado | Ejecucion |
| 13 | Ultimos commits | `git log --oneline -5` | Trazabilidad | Control de versiones |
| 14 | Build Docker | `docker compose build` | Imagen construida | Despliegue |
| 15 | Contenedor iniciado | `docker compose up -d` | Servicio levantado | Despliegue |
| 16 | Contenedores activos | `docker ps` | App en ejecucion | Despliegue |
| 17 | Logs frontend | `docker logs cruz-azul-frontend` | Inicio correcto de app | Pruebas |
| 18 | Login web | Navegador | Portal de autenticacion | Autenticacion |
| 19 | Dashboard | Navegador | JWT, usuario y RDS OK | Resultados |
| 20 | Prueba RDS | `psql ... -c "SELECT NOW();"` | Conexion directa a RDS | Base de datos |
| 21 | Backup manual | `backup_rds_s3.sh` | Respaldo generado | Respaldos |
| 22 | Backup visible en S3 | `aws s3 ls s3://NOMBRE_BUCKET/backups/` | Archivo subido a S3 | Respaldos |
| 23 | Cron configurado | `crontab -l` | Automatizacion diaria | Operacion |
| 24 | Stop/start Docker | `docker compose stop` y `docker compose start` | Control operativo | Operacion |
