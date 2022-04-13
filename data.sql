CREATE DATABASE imagenologia;

CREATE TABLE pacientes (
    rut VARCHAR(12),
    email VARCHAR (20) NOT NULL,
    nombres VARCHAR (20) NOT NULL,
    primer_apellido VARCHAR (20) NOT NULL,
    segundo_apellido VARCHAR (20),
    sexo VARCHAR (10) NOT NULL,
    fecha_nacimiento DATE (15) NOT NULL,
    password VARCHAR (20) NOT NULL,
    direccion VARCHAR (50) NOT NULL,
    comuna VARCHAR (20) NOT NULL,
    telefono VARCHAR (15) NOT NULL,
    prevision VARCHAR (10) NOT NULL,
    medico BOOLEAN NOT NULL,
    admin BOOLEAN DEFAULT false
);