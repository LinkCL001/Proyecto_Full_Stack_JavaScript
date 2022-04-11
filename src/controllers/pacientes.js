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
  const insertOne = async (_, res) => {
    const pacientes = await ingresar(x);
    return res.json(pacientes);
  };
  const deleteOne = async (req, res) => {
    const { rut } = req.params;
    const pacienteDelete = await eliminar(rut);
    const pacientes = await listar();
    return res.json({ pacienteDelete, pacientes });
  };
  const updateOne = async (req, res) => {
    const pacientes = await update(id, data);
    return res.json(pacientes);
  };
  const upStatus = async (req, res) => {
    const pacientes = await updateStatus(rut, estado);
    return res.json(pacientes);
  };
  
  module.exports = {
    getAll,
    getOne,
    insertOne,
    deleteOne,
    updateOne,
    upStatus,
  };