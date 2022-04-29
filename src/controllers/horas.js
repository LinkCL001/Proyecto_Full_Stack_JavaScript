const {
listarExamenes,
listarHoras,
  } = require("../models/db");

  const getExamenes = async (_, res) => {
    const examenes = await listarExamenes();
    return res.json(examenes);
  };
  const getHoras = async (_, res) => {
    const horas = await listarHoras();
    return res.json(horas);
  };

module.exports = {
    getHoras,
    getExamenes,
    //insertHoraExamen,
};