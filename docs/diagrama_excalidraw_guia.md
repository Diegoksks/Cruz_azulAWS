# Guia para Diagrama en Excalidraw

El diagrama debe representar la arquitectura por capas y dejar claro el flujo:

GitHub -> EC2 -> Docker -> Node.js/Express -> RDS PostgreSQL -> Backup S3

## Capa Cliente

- Dibujar un navegador web.
- Conectar el navegador hacia internet y luego hacia la aplicacion publicada en EC2 por HTTP puerto 80.

## Capa Red

- Dibujar Internet.
- Dibujar una VPC.
- Dentro de la VPC, incluir una subnet publica para EC2.
- Incluir una subnet privada o segmento restringido para RDS PostgreSQL.

## Capa Seguridad

- Dibujar Security Group EC2 con reglas:
  - SSH 22 solo desde My IP.
  - HTTP 80 desde internet.
- Dibujar Security Group RDS con regla:
  - PostgreSQL 5432 solo desde Security Group EC2.
- Agregar IAM para permisos de AWS CLI hacia S3.
- Agregar MFA para administracion AWS.
- Agregar MFA TOTP y JWT para el portal web.
- Indicar SSH con llave privada y MFA administrativo.

## Capa Computo

- Dibujar EC2 Ubuntu.
- Dentro de EC2 dibujar Docker.
- Dentro de Docker dibujar contenedor `cruz-azul-frontend`.
- Dentro del contenedor indicar Node.js + Express.

## Capa Datos

- Dibujar AWS RDS PostgreSQL.
- Conectar Node.js/Express hacia RDS por puerto 5432.
- Indicar tabla `usuarios`.

## Capa Respaldo

- Dibujar AWS S3.
- Agregar flecha desde EC2 hacia S3.
- Indicar backup diario con cron.
- Indicar `pg_dump`.
- Indicar `--acl bucket-owner-full-control`.

## Capa Gestion

- Dibujar GitHub.
- Dibujar flecha de GitHub hacia EC2 con `git clone`.
- Indicar ruta obligatoria `/srv/cruz_azul-erp/`.

## Recomendacion visual

Usar colores distintos por capa, flechas con etiquetas de puerto o comando y una leyenda pequena que explique autenticacion, datos y respaldo.
