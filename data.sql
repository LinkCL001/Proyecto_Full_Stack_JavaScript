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
	id_examen INT REFERENCES examenes (id),
	fecha TIMESTAMP,
	activa bool DEFAULT false,
	orden_medica VARCHAR (255),
	PRIMARY KEY (id)
);

CREATE TABLE ficha_examen (
	id SERIAL,
	id_usuario INT REFERENCES usuarios (id),
	id_examen INT REFERENCES examenes (id),
	id_horas INT REFERENCES horas (id),
	estado VARCHAR (255),
	comentario VARCHAR (255),
	resultado VARCHAR (255),
	PRIMARY KEY (id)
);


--Scanner
--403001
--TAC  DE CRANEO ENCEFALICA, CEREBRO
--403002
--TAC  DE HIPOTALAMO-HIPOFISIS O SILLA TURCA
--403003
--TAC COMPUTARIZADA DE FOSA POSTERIOR O ANGULO PONTOCEREBELO
--403006
--TAC COMPUTARIZADA DE TEMPORAL-OIDOTAC COMPUTARIZADA DE TEMPORAL-OIDO
--403007
--TAC  ORBITAS MAXILOFACIAL /CAVIDADES PERINASALE
--403008
--TAC  DE COLUMNA CERVICAL
--403012
--TAC  DE CUELLO, PARTES BLANDAS
--403013
--TAC  DE TORAX. INCLUYE ADEMAS: ESTERNON
--403014
--TAC  DE ABDOMEN (HIGADO, VIAS Y VESICULA ), PIELOTAC 
--403016
--TAC  DE PELVIS (ADEMAS INCLUYE SACRO
--403017
--TAC  MUSCULOESQUELETICA POR ZONA ANATOMICA O EXTREMIDADES EST LOC
--403018
--TAC  DE COLUMNA DORSAL	
--403019
--TAC  DE COLUMNA LUMBAR	
--0403020
--TAC DE ABDOMEN Y PELVIS
--403101
--TAC  ANGIO O ANGIOTAC DE ENCEFALO O  CEREBRO
--403103
--TAC  ANGIO O ANGIOTAC DE ABDOMEN
--403104
--TAC  ANGIO O ANGIOTAC DE CUELLO
--403105

--Radiografia
--401001
--CRANEO AP LAT
--401002
--CAVUM_LARINGE
--401004
--TORAX_PLACA_EXTRA
--401006
--CAVIDADES_CARDIACAS
--401009
--TORAX SIMPLE
--401013
--ABDOMEN SIMPLE
--401014
--ABDOMEN SIMPLE PROYECCION COMPLEMENTARIA
--401028
--RENAL SIMPLE
--401029
--VESICAL SIMPLE
--401031
--NARIZ,ORBITA,MAXILAR INFERIOR,MAXILAR SUPERIOR,ATM,CP
--401032
--CRANEO
--401033
--CRANEO EXTRA
--401035
--OÍDO
--401040	
--SILLA TURCA
--401042
--COLUMNA CERVICAL
--401043
--COLUMNA CERVICAL OBLICUAS
--401044
--COLUMNA CERVICAL FUNCIONALES
--401045
--COLUMNA DORSAL,COLUMNA DORSAL OBLICUAS,COLUMNA DORSOLUMBAR
--401046
--COLUMNA LUMBOSACRA
--401047
--COLUMNA LUMBOSACRA FUNCIONALES
--401048
--COLUMNA LUMBOSACRA OBLICUAS
--401049
--COLUMNA TOTAL O DORSOLUMBAR PANORAMICA
--401051
--CADERA
--401151
--PELVIS
--401052
--CADERA EXTRA
--401053
--SACROILIACAS,SACROCOXIS
--0401054
--PIE,MUÑECA,MANO,CODO,BRAZO,TOBILLO
--0401055
--CLAVÍCULA
--0401056
--MANO EDAD OSEA
--0401057
--EDAD OSEA RODILLA
--0401058
--ESCAFOIDES
--0401059
--MUÑECA F-L OBLICUA, TOBILLO F-L OBLICUA
--0401060
--EXTREMIDADES INFERIORES,RODILLA,PIERNA,ESTERNON,FEMUR,HOMBRO,COSTILLAS
--0401062	
--PROYECCION ESPECIAL
--401070
--TORAX AP-L
--401151
--PELVIS LACTANTE O MENOR SEIS AÑOS,CADERA O COXOFEMORAL LACTANTE O MENOR SEIS AÑOS

--Ecografia
--404003
--ECOTOMOGRAFIA ABDOMINAL
--404005
--ECO TV OBSTETRICA,ECOGRAFÍA TRANSVAGINAL
--404006
--ECOGRAFÍA PELVIANA FEMENINA U OBSTÉTRICA
--404009
--ECOTOMOGRAFIA PELVIANA MASCULINA
--404010
--ECOGRAFÍA RENAL (BILATERAL), O DE BAZO
--404012
--ECOGRAFÍA MAMARIA BILATERAL (INCLUYE DOPPLER)
--404014
--ECOGRAFÍA TESTICULAR (UNO O AMBOS)
--404015
--ECOGRAFÍA TIROIDEA (INCLUYE DOPPLER)
--404016
--ECOGRAFIA PARTES BLANDAS O MUSCULOESQUELETICA

--Mes
--Enero
--Febrero
--Marzo
--Abril
--Mayo
--Junio
--Julio
--Agosto
--Septiembre
--Octubre
--Noviembre
--Diciembre

--Dia
--1
--2
--3
--4
--5
--6
--7
--8
--9
--10
--11
--12
--13
--14
--15
--16
--17
--18
--19
--20
--21
--22
--23
--24
--25
--26
--27
--28
--29
--30
--31

--hora
--8:20
--8:40
--9:00
--9:20
--9:40
--10:00
--10:20
--10:40
--11:00
--11-20
--11-40
--12:00
--12:20
--12:40
--13:00
--13:20
--13:40
--14:00
--14:20
--14:40
--15:00
--15:20
--15:40
--16:00
--16:20
--16:40