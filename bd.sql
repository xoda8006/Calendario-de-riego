CREATE DATABASE IF NOT EXISTS OrquideasDB;
USE OrquideasDB;

CREATE TABLE Orquideas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL COMMENT 'Ej: Phalaenopsis, Cattleya...',
    frecuencia_riego_dias INT COMMENT 'Campo: Frecuencia de riego (dias)',
    observaciones TEXT COMMENT 'Campo: Notas sobre etapa, fertilizante, etc.'
);
CREATE TABLE registro_riego (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orquidea_id INT NOT NULL, 
    fecha_riego DATE NOT NULL COMMENT 'Campo: Última fecha de riego',
    FOREIGN KEY (orquidea_id) REFERENCES Orquideas(id)
);

CREATE TABLE registro_ambiental (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orquidea_id INT,
     humedad FLOAT NOT NULL,
    temperatura FLOAT NOT NULL,
    fechaHora DATETIME NOT NULL,
    FOREIGN KEY (orquidea_id) REFERENCES Orquideas(id)
);

CREATE TABLE sensores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orquidea_id INT,
       tipoConexion VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    FOREIGN KEY (orquidea_id) REFERENCES Orquideas(id)
);

CREATE TABLE notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orquidea_id INT,
       mensaje TEXT NOT NULL,
    fecha DATETIME NOT NULL,
    FOREIGN KEY (orquidea_id) REFERENCES Orquideas(id)
);

INSERT INTO Orquideas (nombre, frecuencia_riego_dias, observaciones) VALUES
('Phalaenopsis Rosa', 7, 'Floración actual. Abonar ligeramente.'),
('Cattleya Purpurea', 10, 'Etapa de crecimiento vegetativo. Mucha luz indirecta.');