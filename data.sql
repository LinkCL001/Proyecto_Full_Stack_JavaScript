CREATE DATABASE imagenologia;

CREATE TABLE public.pacientes (
	rut varchar(12) NOT NULL,
	email varchar(100) NOT NULL,
	nombres varchar(20) NOT NULL,
	primer_apellido varchar(20) NOT NULL,
	segundo_apellido varchar(20) NULL,
	sexo varchar(10) NOT NULL,
	fecha_nacimiento date NOT NULL,
	password varchar(20) NOT NULL,
	direccion varchar(50) NOT NULL,
	comuna varchar(20) NOT NULL,
	telefono varchar(15) NOT NULL,
	prevision varchar(10) NOT NULL,
	medico bool NOT NULL,
	admin bool NULL DEFAULT false,
	CONSTRAINT pacientes_pkey PRIMARY KEY (rut)
);