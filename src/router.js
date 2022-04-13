const express = require('express');
const router = express.Router();
const pacientesController = require('./controllers/pacientes');
const loginController = require('./controllers/login');

router.get('/pacientes', pacientesController.getAll)
//router.post('/paciente', pacientesController.insertOne)

// router.get('/pacientes/:id', pacientesController.getOne)
// router.delete("/pacientes/:id", pacientesController.deleteOne)

router.post('/login', loginController.loginUser)

module.exports = router