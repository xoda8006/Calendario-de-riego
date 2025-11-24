
CREATE DATABASE IF NOT EXISTS OrquideasDB;
USE OrquideasDB;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);


CREATE TABLE sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipoConexion VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL
);


DROP TABLE IF EXISTS calendario_riego;

CREATE TABLE calendario_riego (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    ultima_fecha DATE,
    frecuencia INT,
    observaciones TEXT
);


CREATE TABLE registro_ambiental (
    id INT AUTO_INCREMENT PRIMARY KEY,
    humedad FLOAT NOT NULL,
    temperatura FLOAT NOT NULL,
    fechaHora DATETIME NOT NULL
);
CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mensaje TEXT NOT NULL,
    fecha DATETIME NOT NULL
);

INSERT INTO usuarios (nombre, email) VALUES
('Ana Torres', 'ana@correo.com'),
('Seba', 'Seba@correo.com');