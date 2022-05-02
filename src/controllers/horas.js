const {
  listarExamenes,
  listarHoras,
  ingresarHoras,
  listarExamenesHoras,
} = require("../models/db");

const getExamenes = async (_, res) => {
  const examenes = await listarExamenes();
  return res.json(examenes);
};
const getExamenesHoras = async (_, res) => {
  const horas_examenes = await listarExamenesHoras();
  return res.json(horas_examenes);
};
const getHoras = async (_, res) => {
  const horas = await listarHoras();
  return res.json(horas);
};
const insertHora = async (req, res) => {
  const data = req.body;
  try {
    const paciente = await ingresarHoras(data);
    return res.json(paciente);
  } catch (error) {
    res.status(500).json({
      message: "Error De Ingreso de Horas",
    });
  }
};

module.exports = {
  getHoras,
  getExamenes,
  insertHora,
  getExamenesHoras,
};
