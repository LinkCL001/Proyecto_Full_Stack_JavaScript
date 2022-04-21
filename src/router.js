const express = require('express');
const router = express.Router();
const pacientesController = require('./controllers/pacientes');
const loginController = require('./controllers/login');

router.get('/api/pacientes', pacientesController.getAll)
router.post('/api/paciente', pacientesController.insertOne)
router.get('/api/paciente/:rut', pacientesController.getOne)
router.delete('/api/paciente/:rut', pacientesController.deleteOne)
router.post('/api/paciente/:rut', pacientesController.upStatus)
router.post('/api/login', loginController.loginUser)

module.exports = router