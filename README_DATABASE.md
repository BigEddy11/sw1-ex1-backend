# Guía de Inicialización de la Base de Datos

## Requisitos Previos
- PostgreSQL instalado y corriendo
- Usuario `postgres` con contraseña `0134`
- Puerto 5432 disponible

## Pasos para inicializar la base de datos:

### 1. Conectarse a PostgreSQL
Abre la terminal de PostgreSQL (psql) o pgAdmin y ejecuta:

```bash
# Opción 1: Usando psql desde la terminal
psql -U postgres -h localhost

# Opción 2: Si tienes configurado el PATH de PostgreSQL
psql -U postgres
```

### 2. Crear la base de datos
```sql
CREATE DATABASE sw1bd;
```

### 3. Conectarse a la nueva base de datos
```sql
\c sw1bd;
```

### 4. Ejecutar el script de inicialización
Desde psql, ejecuta:
```sql
\i 'c:/Users/rafap/Desktop/2-2025/sw1/freddy/BackEndConBd/init_database.sql'
```

O copia y pega el contenido del archivo `init_database.sql` directamente en psql.

### 5. Verificar que las tablas se crearon correctamente
```sql
\dt
```

Deberías ver las siguientes tablas:
- users
- rooms  
- room_users
- room_diagrams

## Alternativa usando pgAdmin:
1. Abre pgAdmin
2. Conecta al servidor PostgreSQL
3. Crea una nueva base de datos llamada `sw1bd`
4. Abre el Query Tool
5. Carga y ejecuta el archivo `init_database.sql`

## Instalación de dependencias del proyecto:
Después de configurar la base de datos, ejecuta:
```bash
npm install
```

## Ejecutar la aplicación:
```bash
npm run dev
```

La aplicación debería conectarse automáticamente a la base de datos usando la configuración del archivo `.env`.