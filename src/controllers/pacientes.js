const {
  listar,
  buscar,
  ingresar,
  eliminar,
  update,
  updateStatus,
} = require("../models/db");

const getAll = async (_, res) => {
  const pacientes = await listar();
  return res.json(pacientes);
};
const getOne = async (req, res) => {
  const { rut } = req.params;
  const pacientes = await buscar(rut);
  return res.json(pacientes);
};
const insertOne = async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const paciente = await ingresar(data);
    return res.json(paciente);
  } catch (error) {
    res.status(500).json({
      message: "Error De Ingreso a Base de datos",
    });
  }
};
const deleteOne = async (req, res) => {
  const { rut } = req.params;
  const pacienteDelete = await eliminar(rut);
  const paciente = await listar();
  return res.json({ pacienteDelete, paciente });
};
const updateOne = async (req, res) => {
  const paciente = await update(rut, data);
  return res.json(paciente);
};
const upStatus = async (req, res) => {
  const { rut } = req.params;
  const { medico } = req.body;
  const paciente = await updateStatus(rut, medico);
  return res.json(paciente);
};

module.exports = {
  getAll,
  getOne,
  insertOne,
  deleteOne,
  updateOne,
  upStatus,
};
