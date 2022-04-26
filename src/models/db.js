require("dotenv").config();
const { Pool } = require("pg");
//const { parseISO, format } = require("date-fns");
var format = require("date-fns/format");
const { id } = require("date-fns/locale");

const connectionString = process.env.DATABASE_URL;

const pool = new Pool(
  connectionString
    ? { connectionString, ssl: { rejectUnauthorized: false }, log: console.log }
    : undefined
);

const listar = () =>
  pool.query("SELECT * FROM usuarios").then((res) => res.rows);

const buscar = async (id) =>
  pool
    .query("SELECT * FROM usuarios WHERE id = $1 LIMIT 1", [id])
    .then((res) => {
     
      res.rows[0].fecha_nacimiento = format(new Date(res.rows[0].fecha_nacimiento), "yyyy-MM-dd")
 
      return res.rows;
    })
    .catch((e) => {
      console.log({ e });
    });

const ingresar = (x) =>
  pool.query(
    "INSERT INTO usuarios(rut,email,nombres,primer_apellido,segundo_apellido,sexo,fecha_nacimiento,edad,password,direccion,comuna,telefono,prevision,medico,admin) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)",
    [
      x.rut,
      x.email,
      x.nombres,
      x.primer_apellido,
      x.segundo_apellido,
      x.sexo,
      format(new Date(x.fecha_nacimiento), "yyyy-MM-dd"),
      x.edad,
      x.password,
      x.direccion,
      x.comuna,
      x.telefono,
      x.prevision,
      x.medico,
      x.admin,
    ]
  );

const login = async (email, password) =>
  pool
    .query(
      "SELECT * FROM usuarios WHERE email = $1 AND password = $2 LIMIT 1",
      [email, password]
    )
    .then((res) => {
      return res.rows[0];
    })
    .catch((e) => {
      console.log({ e });
    });

const eliminar = (id) => pool.query("DELETE FROM usuarios WHERE id = $1", [id]);

const update = async (id, data) => {
  try {
    const updatePaciente = await pool.query(
      `UPDATE usuarios SET rut='${data.rut}',email = '${data.email}', nombres = '${data.nombres}', primer_apellido = '${data.primer_apellido}',segundo_apellido = '${data.segundo_apellido}',sexo = '${data.sexo}',fecha_nacimiento = '${format(new Date(data.fecha_nacimiento), "yyyy-MM-dd")}',edad = '${data.edad}',password = '${data.password}',direccion = '${data.direccion}',comuna = '${data.comuna}',telefono = '${data.telefono}',prevision = '${data.prevision}', medico = false, "admin" = false WHERE id = '${id}' RETURNING*`
    );
    return updatePaciente.rows;
  } catch (e) {
    console.log(e);
    return e;
  }
};

const updateStatus = async (rut, medico) => {
  try {
    const result = await pool.query(
      `UPDATE pacientes SET medico = ${medico} WHERE rut = ${rut} RETURNING*`
    );
    return result.rowCount;
  } catch (e) {
    console.log(e);
    return false;
  }
};

const ingresarTiposExamenes = (x) => 
pool.query(`INSERT INTO tipos_examenes(nombre) VALUES($1);`,[
  x.nombre,
])

const ingresarExamenes = (x) => 
pool.query(`INSERT INTO examenes (id_tipo_examen, codigo, nombre_examen) VALUES ($1, '$2', '$3');`,[
  x.codigo,
  x.nombre_examen,
])

const ingresarHoras = (x) => 
pool.query(`INSERT INTO horas(id_examen, fecha, activa, orden_medica) VALUES ($1, '$2', true, '$4');`,[
  x.fecha,
  x.activa,
  x.orden_medica,
])

const listarTiposExamenes = () =>
  pool.query("SELECT id, nombre FROM tipos_examenes;").then((res) => res.rows);

const listarExamenes = () => 
  pool.query("SELECT id, id_tipo_examen, codigo, nombre_examen FROM examenes;").then((res) => res.rows);

const listarHoras = () =>
  pool.query("SELECT id, id_examen, fecha, activa, orden_medica FROM horas;").then((res) => res.rows);

module.exports = {
  listar,
  buscar,
  ingresar,
  login,
  eliminar,
  update,
  updateStatus,
  ingresarTiposExamenes,
  ingresarExamenes,
  ingresarHoras,
  listarTiposExamenes,
  listarExamenes,
  listarHoras,
};



// //WITH data(nombre, codigo, nombre_examen, fecha, activa, orden_medica) AS (
//   VALUES                                 -- provide data here
//      (text '$1',text '$2',text '$3',datetime '$4',bool=true ,text '$5')  -- see below
//       --  more?                          -- works for multiple input rows
//   )
// , ins1 AS (
//   INSERT INTO tipos_examenes (nombre)
//   SELECT nombre FROM data  
//   ON     CONFLICT DO NOTHING             
//   RETURNING nombre, id AS id_tipo_examen
//   )
// , ins2 AS (
//   INSERT INTO examenes (id_tipo_examen, codigo, nombre_examen)
//   SELECT id_tipo_examen, codigo, nombre_examen
//   FROM   data
//   JOIN   ins1 USING (nombre)
//   RETURNING id_tipo_examen, id_examen
//   )
// INSERT INTO horas (id_examen, fecha, activa, orden_medica )
// SELECT id_examen, fecha, activa, orden_medica
// FROM   data
// JOIN   ins1 USING (nombre)
// JOIN   ins2 USING (id_tipo_examen);