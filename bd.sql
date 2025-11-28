
CREATE DATABASE IF NOT EXISTS orquideasdb;
USE orquideasdb;
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
<<<<<<< HEAD
    tipoConexion VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL
);


CREATE TABLE calendario_riego (
    id INT AUTO_INCREMENT PRIMARY KEY,
    diaSemana VARCHAR(20) NOT NULL,
    horaRiego TIME NOT NULL,
    fecha DATETIME
=======
    orquidea_id INT NOT NULL, 
    fecha_riego DATE NOT NULL COMMENT 'Campo: Última fecha de riego',
    FOREIGN KEY (orquidea_id) REFERENCES Orquideas(id)
>>>>>>> ce2bcfa5b4cf5ad8c5c37279c30b5bf9d541e740
);

DROP TABLE IF EXISTS orquideas;

CREATE TABLE orquideas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especie VARCHAR(100),
    fecha_adquisicion DATE,
    ubicacion VARCHAR(100),
    observaciones TEXT
);



CREATE TABLE registro_ambiental (
    id INT AUTO_INCREMENT PRIMARY KEY,
    orquidea_id INT,
     humedad FLOAT NOT NULL,
    temperatura FLOAT NOT NULL,
    fechaHora DATETIME NOT NULL,
    FOREIGN KEY (orquidea_id) REFERENCES Orquideas(id)
);

