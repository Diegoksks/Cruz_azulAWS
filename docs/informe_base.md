# Informe Tecnico-Comercial - Farmacias Cruz Azul

## 1. Portada

**Proyecto:** Cruz Azul ERP  
**Asignatura:** Arquitectura Multicloud - AWS Academy  
**Integrantes:** Diego Munoz y Luis Henriquez  
**Repositorio GitHub:** completar con enlace  
**Video YouTube no listado:** completar con enlace  

## 2. Indice

1. Introduccion
2. Problematica
3. Riesgos
4. Arquitectura propuesta
5. Servicios utilizados
6. Desarrollo de aplicacion
7. Seguridad y autenticacion
8. Base de datos y respaldos
9. Evidencias
10. Costos
11. Conclusiones

## 3. Introduccion

Farmacias Cruz Azul requiere modernizar una parte de su infraestructura tecnologica mediante una solucion desplegable en nube publica. El objetivo es demostrar una arquitectura segura, documentada y funcional, usando servicios de AWS Academy y buenas practicas basicas de desarrollo, despliegue y respaldo.

## 4. Descripcion tecnica de la problematica

La organizacion necesita una aplicacion web protegida para acceso administrativo. Esta aplicacion debe conectarse a una base de datos PostgreSQL, separar credenciales mediante variables de entorno, utilizar contenedores para facilitar el despliegue y contar con respaldos periodicos hacia almacenamiento de objetos.

## 5. Analisis de riesgos de la infraestructura anterior

Una infraestructura sin controles adecuados puede exponer la base de datos a internet, permitir accesos SSH desde ubicaciones no confiables, almacenar contrasenas sin hash o depender de respaldos manuales. Estos riesgos afectan disponibilidad, confidencialidad e integridad de la informacion.

## 6. Propuesta de arquitectura segura

Se propone alojar la aplicacion en una instancia EC2 Ubuntu con Docker, conectar el frontend/backend Node.js a RDS PostgreSQL y almacenar respaldos en S3. El acceso HTTP se publica hacia internet, mientras que el acceso a RDS se restringe al Security Group de EC2.

## 7. Modelo por capas

La arquitectura se organiza en capa cliente, red, seguridad, computo, datos, respaldo y gestion. Este modelo permite explicar responsabilidades y controles de forma clara en el informe y en el diagrama.

## 8. Servicios utilizados

- EC2 para ejecutar Docker y Node.js.
- RDS PostgreSQL para base de datos administrada.
- S3 para almacenar backups.
- IAM para permisos de AWS CLI.
- Security Groups para control de trafico.
- GitHub para control de versiones.

## 9. Desarrollo del frontend Node.js/Express

La aplicacion usa Node.js con Express y entrega rutas web simples: `/login`, `/dashboard` y `/logout`. El dashboard queda protegido por middleware JWT y consulta la base de datos para evidenciar conectividad.

## 10. Autenticacion con contrasena, MFA y JWT

El login solicita correo, contrasena y codigo MFA TOTP. La contrasena se compara con bcryptjs, el codigo MFA se valida con Speakeasy y el token JWT se guarda en una cookie httpOnly con expiracion de 15 minutos.

## 11. Base de datos RDS PostgreSQL

Al iniciar, la aplicacion crea la tabla `usuarios` si no existe y registra un administrador inicial usando variables de entorno. La conexion usa la libreria `pg` y los datos se configuran en `.env`.

## 12. Respaldos de base de datos hacia S3

El script `backup_rds_s3.sh` ejecuta `pg_dump`, genera un archivo `.sql` con fecha y hora y lo sube a S3 con AWS CLI usando `--acl bucket-owner-full-control`.

## 13. Security Groups y minima exposicion a internet

El Security Group de EC2 debe permitir SSH solo desde My IP y HTTP desde internet. El Security Group de RDS debe permitir el puerto 5432 solamente desde el Security Group de EC2.

## 14. Evidencias de ejecucion del stack

Se deben capturar evidencias de GitHub, EC2, RDS, S3, despliegue Docker, login web, dashboard con PostgreSQL OK y backup visible en S3.

## 15. Ventajas de nube publica y microservicios

La nube publica permite provisionar recursos bajo demanda, reducir inversion inicial y usar servicios administrados. Docker facilita portabilidad y separacion entre aplicacion, configuracion e infraestructura.

## 16. Comparacion de costos AWS, Azure y Oracle OCI

La comparacion debe completarse con calculadoras oficiales de cada proveedor, considerando computo, base de datos administrada, almacenamiento de objetos, transferencia y seguridad.

## 17. CAPEX, OPEX y TCO

CAPEX representa inversion inicial en infraestructura. OPEX corresponde a costos operacionales mensuales. TCO integra costos directos e indirectos durante el ciclo de vida del proyecto.

## 18. Cronograma del proyecto

El cronograma considera analisis, diseno, desarrollo, despliegue, pruebas, evidencias, informe y video. Las responsabilidades se dividen entre infraestructura AWS y desarrollo/documentacion.

## 19. Resultados esperados

Se espera obtener una aplicacion funcional desplegada en EC2, conectada a RDS, con autenticacion segura, backups hacia S3 y evidencia suficiente para informe tecnico-comercial.

## 20. Conclusiones

El proyecto demuestra una arquitectura basica pero segura para una aplicacion empresarial, incorporando autenticacion, base de datos administrada, contenedores, respaldos y documentacion operativa.

## 21. Link a GitHub

Completar: `https://github.com/TU_USUARIO/cruz-azul-erp`

## 22. Link a video no listado de YouTube

Completar: `https://youtube.com/...`
