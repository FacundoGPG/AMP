# AMP

**AMP — Sistema automatizado**

Aplicación web monolítica construida con Node.js + Express + EJS y base de datos PostgreSQL (Supabase). Gestiona clientes, operaciones, alertas, casos, reportes y buzón de cumplimiento.

**Requisitos**:

Node.js v18 o superior (desarrollado con v22)
PostgreSQL (se usa Supabase como proveedor)
No requiere docker

**Instalación**:
npm i --legacy-peer-deps

**Para ejecutar código**:
node app.js

**Tests**:
npm test

**Puerto**:
3001

**Scripts disponibles**:

npm start  #node app.js
npm test   #jest

**Base de datos**:

PostgreSQL via Supabase

Las tablas se crean manualmente con el archivo scheme.sql incluido en este repo.
Para el store de sesiones, la tabla sesiones se crea automaticamente en entornos de desarrollo. En produccion debe crearse manualmente (incluida en scheme.sql)

**Lista de variables de entorno**:
DATABASE_URL:

Cadena de conexión a PostgreSQL en Supabase. La usa el pool de pg en config/database.js para conectarse a la base de datos. Sin esta variable el servidor no puede arrancar.

SUPABASE_URL:

URL base del proyecto en Supabase (sin /rest/v1/ al final). La usa config/storage.js para inicializar el cliente de Supabase Storage y subir archivos al bucket documentos.

SUPABASE_SERVICE_KEY:

Clave service_role de Supabase. Tiene permisos completos sobre Storage y la BD, por eso se usa solo en el backend, nunca en el frontend. La usa config/storage.js junto con SUPABASE_URL.
