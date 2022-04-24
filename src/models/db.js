require("dotenv").config();
const { Pool } = require("pg");
//const { parseISO, format } = require("date-fns");
var format = require("date-fns/format");

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

module.exports = {
  listar,
  buscar,
  ingresar,
  login,
  eliminar,
  update,
  updateStatus,
};
