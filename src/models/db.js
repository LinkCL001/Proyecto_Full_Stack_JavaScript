require("dotenv").config();
const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? { connectionString, ssl: { rejectUnauthorized: false }, log: console.log }
    : undefined
);

const ingresar = (x) =>
  pool.query(
    "INSERT INTO pacientes(rut,email,nombres,primer_apellido,segundo_apellido,sexo,fecha_nacimiento,password,direccion,comuna,telefono,prevision,foto,medico,admin) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)",
    [
      x.rut,
      x.email,
      x.nombres,
      x.primer_apellido,
      x.segundo_apellido,
      x.sexo,
      x.fecha_nacimiento,
      x.password,
      x.direccion,
      x.comuna,
      x.telefono,
      x.prevision,
      x.foto,
      x.medico,
      x.admin,
    ]
  );

  module.exports = {
    ingresar,
  };