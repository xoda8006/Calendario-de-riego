CREATE DATABASE IF NOT EXISTS control_riego_db;
USE control_riego_db;

CREATE TABLE orquideas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL, -- ¿Existe?
    ultima_fecha DATE,            -- ¿Existe?
    frecuencia INT NOT NULL,      -- ¿Existe?
    observaciones TEXT,           -- ¿Existe?
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);