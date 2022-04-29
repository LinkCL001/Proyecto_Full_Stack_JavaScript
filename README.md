# Proyecto_Full_Stack_JavaScript
# Despliegue y Contenedores

## Estructura del proyecto

```bash
└── src
    ├── routes.js
    └── controllers
        ├── login.js
        └── horas.js
        └── pacientes.js
    └── models
        └── db.js
└── rutas
    └── front.js
    └── public
        └── imgs
└── migrate.js        
└── server.js
└── views
    ├── Dashboard.handlebars
    ├── Login.handlebars
    ├── error.hadlebars
    ├── Registro.handlebars
    ├── Admin.handlebars
    ├── Paciente.handlebars
    ├── Examenes.handlebars
    ├── Horas.handlebars
    ├── Medico.handlebars
    └── layouts
        └── main.handlebars
    └── component
        └── Admin.handlebars
        └── Cards.handlebars
        └── Carousel.handlebars
        └── Footer.handlebars
        └── Medico.handlebars
        └── Nav.handlebars
        └── Paciente.handlebars
└── data.sql
```

## Tabla PostgreSQL requerida

Antes de correr este proyecto asegúrate de tener esta tabla creada
se agregó admin como boolean para poder cambiar desde la base de datos al administrador
```sql

CREATE DATABASE imagenologia;

CREATE TABLE usuarios (
	id SERIAL,
	rut varchar(12) UNIQUE NOT NULL,
	email varchar(100) NOT NULL,
	nombres varchar(20) NOT NULL,
	primer_apellido varchar(20) NOT NULL,
	segundo_apellido varchar(20) NULL,
	sexo varchar(10) NOT NULL,
	fecha_nacimiento date NOT NULL,
	edad varchar(10) NOT NULL,
	password varchar(20) NOT NULL,
	direccion varchar(50) NOT NULL,
	comuna varchar(20) NOT NULL,
	telefono varchar(15) NOT NULL,
	prevision varchar(10) NOT NULL,
	medico bool NOT NULL DEFAULT false,
	admin bool NULL DEFAULT false,
	PRIMARY KEY (id)
);

CREATE TABLE tipos_examenes (
	id SERIAL,
	nombre VARCHAR (45),
	PRIMARY KEY (id)
);

CREATE TABLE examenes (
	id SERIAL,
	id_tipo_examen INT REFERENCES tipos_examenes(id),
	codigo VARCHAR(150) UNIQUE,
	nombre_examen VARCHAR (255),
	PRIMARY KEY (id)	
);

CREATE TABLE horas (
	id SERIAL,
	fecha TIMESTAMP,
	activa bool DEFAULT false,
	PRIMARY KEY (id)
);

CREATE TABLE horas_examenes (
	id SERIAL,
	id_hora INT REFERENCES horas(id),
	id_examen INT REFERENCES examenes(id),
	id_usuario INT REFERENCES usuarios(id),
	orden_medica VARCHAR (255),
	PRIMARY KEY (id)
);

CREATE TABLE fichas_examenes (
	id SERIAL,
	id_hora_examen INT REFERENCES horas_examenes(id),
	estado VARCHAR (255),
	comentario VARCHAR (255),
	resultado VARCHAR (255),
	PRIMARY KEY (id)
);

## Correr localmente

Primero editáis el .env con tus propios datos

```bash
npm i

# correr normalmente
npm start

# o si quieres seguir desarrollando
npm run dev
```

## Correr en Heroku

Después de logearte con la cli de heroku

**recuerda montar postgres en heroku y tener creada la tabla previamente definida**

```bash
# en caso de
rm -rf .git

git init

heroku git:remote -a your-app-repo

git add .
git commit -am "make it better"
git push heroku master
```
https://link-app22.herokuapp.com/
