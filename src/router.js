const express = require('express');
const router = express.Router();
const pacientesController = require('./controllers/pacientes');
const rutController = require("./controllers/funcionRut")
//const loginController = require('./controllers/login');

router.get('/pacientes', pacientesController.getAll)
//router.post('/paciente', pacientesController.insertOne)
//router.get('/rut', rutController.checkRut)

// router.get('/pacientes/:id', pacientesController.getOne)
// router.delete("/pacientes/:id", pacientesController.deleteOne)

// router.post('/login', loginController.loginUser)

module.exports = router