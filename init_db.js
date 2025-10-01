const { Pool } = require('pg');
require('dotenv').config();

// Configuración de la base de datos
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: false  // Deshabilitar SSL para desarrollo local
});

// SQL para crear las tablas
const createTablesSQL = `
-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de salas
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_name VARCHAR(255) NOT NULL,
    room_code VARCHAR(10) UNIQUE NOT NULL,
    admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de relación usuarios-salas
CREATE TABLE IF NOT EXISTS room_users (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'collaborator',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, room_id)
);

-- Crear tabla para almacenar los diagramas
CREATE TABLE IF NOT EXISTS room_diagrams (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(10) NOT NULL,
    diagram_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_room_users_user_id ON room_users(user_id);
CREATE INDEX IF NOT EXISTS idx_room_users_room_id ON room_users(room_id);
CREATE INDEX IF NOT EXISTS idx_room_diagrams_room_id ON room_diagrams(room_id);
`;

async function initializeDatabase() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    
    // Probar conexión
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL establecida');
    
    console.log('🔄 Creando tablas...');
    
    // Ejecutar el script SQL
    await client.query(createTablesSQL);
    
    console.log('✅ Tablas creadas exitosamente');
    
    // Verificar las tablas creadas
    console.log('🔄 Verificando tablas creadas...');
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
    
    console.log('📋 Tablas en la base de datos:');
    result.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    client.release();
    console.log('🎉 Inicialización de base de datos completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error.message);
    console.error('Detalles del error:', error);
  } finally {
    await pool.end();
  }
}

// Ejecutar la inicialización
initializeDatabase();