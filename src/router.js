const express = require('express');
const router = express.Router();
const pacientesController = require('./controllers/pacientes');
const loginController = require('./controllers/login');

router.get('/pacientes', pacientesController.getAll)
router.post('/paciente', pacientesController.insertOne)
router.get('/paciente', pacientesController.getOne)
router.delete('/paciente/:rut', pacientesController.deleteOne)
router.post('/paciente/:rut', pacientesController.upStatus)
router.post('/login', loginController.loginUser)

module.exports = router