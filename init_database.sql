-- Inicialización de la base de datos para DiagramColabSW1
-- Este archivo debe ejecutarse en PostgreSQL para crear las tablas necesarias

-- Crear la base de datos (ejecutar este comando desde la terminal psql)
-- CREATE DATABASE sw1bd;

-- Conectarse a la base de datos sw1bd antes de ejecutar los siguientes comandos
-- \c sw1bd;

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
    role VARCHAR(50) NOT NULL DEFAULT 'collaborator', -- 'admin' o 'collaborator'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, room_id)
);

-- Crear tabla para almacenar los diagramas
CREATE TABLE IF NOT EXISTS room_diagrams (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(10) NOT NULL, -- Almacena el código de la sala
    diagram_data TEXT NOT NULL, -- JSON con los datos del diagrama
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(room_code);
CREATE INDEX IF NOT EXISTS idx_room_users_user_id ON room_users(user_id);
CREATE INDEX IF NOT EXISTS idx_room_users_room_id ON room_users(room_id);
CREATE INDEX IF NOT EXISTS idx_room_diagrams_room_id ON room_diagrams(room_id);

-- Insertar datos de prueba (opcional)
-- INSERT INTO users (name, email, password) VALUES 
-- ('Usuario Test', 'test@example.com', '$2a$10$example_hash');

-- Mostrar mensaje de confirmación
SELECT 'Base de datos inicializada correctamente' as status;