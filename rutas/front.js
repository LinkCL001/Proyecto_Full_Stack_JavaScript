const { Router } = require("express");
const db = require("../src/models/db");
const rutas = Router();

rutas.get("/", (_, res) => {
    res.render("Registro");
  });

rutas.post("/paciente-create", (req, res) => {// crear nuevo paciente
    const { fotos } = req.files;//obteniendo la data del archivo foto
    fotos.mv(`${__dirname}/public/imgs/${fotos.name}`, (e) => {//guardando la foto en directorio
      console.log(e);
    });
    req.body.foto = fotos.name;//obteniendo nombre de la foto
    req.body.medico = false;//obteniendo estado default booleano false para medico y admin
    req.body.admin = false;
    db.ingresar(req.body)
      .then(() => res.redirect("/"))//ingreso exitoso redirige al :3000/
      .catch((e) =>
        res.render("error", { title: "Error al crear skater", message: e })//mensaje error de ingreso
      );
  });

  module.exports = rutas;