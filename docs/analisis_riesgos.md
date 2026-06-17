# Analisis de Riesgos

| Riesgo | Descripcion | Impacto | Probabilidad | Nivel | Medida de mitigacion |
|---|---|---:|---:|---|---|
| Exposicion publica de base de datos | RDS queda accesible desde internet. | Alto | Media | Alto | Permitir puerto 5432 solo desde el Security Group de EC2. |
| Acceso SSH desde cualquier IP | La instancia EC2 acepta SSH desde `0.0.0.0/0`. | Alto | Media | Alto | Restringir SSH a My IP y usar llave privada protegida. |
| Falta de MFA en administracion | Accesos administrativos dependen solo de contrasena. | Alto | Media | Alto | Activar MFA en cuentas AWS/IAM. |
| Falta de MFA en portal web | Login web sin segundo factor. | Medio | Media | Medio | Validar TOTP de 6 digitos con Speakeasy. |
| Almacenamiento de contrasenas sin hash | Contrasenas quedan legibles si se filtra la base. | Alto | Baja | Alto | Guardar solo hashes bcryptjs. |
| Falta de backups diarios | Perdida de datos ante errores o fallas. | Alto | Media | Alto | Programar `pg_dump` diario con cron y subida a S3. |
| Bucket S3 publico por error | Backups quedan expuestos. | Alto | Baja | Alto | Bloquear acceso publico y controlar permisos IAM. |
| Falta de control de versiones | Cambios no trazables y dificultad para recuperar codigo. | Medio | Media | Medio | Usar GitHub con commits claros. |
| Falta de logs de contenedores | Dificultad para diagnosticar fallas. | Medio | Media | Medio | Revisar `docker logs` y mantener evidencias. |
| Uso de credenciales dentro del codigo | Filtracion de secretos en repositorio. | Alto | Media | Alto | Usar `.env`, `.env.example` y `.gitignore`. |
