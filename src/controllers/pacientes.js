const {
  listar,
  buscar,
  ingresar,
  eliminar,
  update,
  updateStatus,
  listarHoras,
  listarExamenes,
  listarTiposExamenes,
  ingresarHoras,
} = require("../models/db");

const getAll = async (_, res) => {
  const pacientes = await listar();
  return res.json(pacientes);
};
const getOne = async (req, res) => {
  const { id } = req.params;
  const usuario = await buscar(id);
  return res.json(usuario);
};
const insertOne = async (req, res) => {
  const data = req.body;
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
  const { id } = req.params;
  const pacienteDelete = await eliminar(id);
  const usuarios = await listar();
  return res.json({ pacienteDelete, usuarios });
};
const updateOne = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const pacienteUpdate = await update(id, data)
  const usuario = await buscar(id);
  return res.json({ pacienteUpdate, usuario });
};


module.exports = {
  getAll,
  getOne,
  insertOne,
  deleteOne,
  updateOne,
};
