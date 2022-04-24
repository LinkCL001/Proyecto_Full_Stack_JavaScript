const express = require('express');
const router = express.Router();
const pacientesController = require('./controllers/pacientes');
const loginController = require('./controllers/login');

router.get('/api/pacientes', pacientesController.getAll)
router.post('/api/paciente', pacientesController.insertOne)
router.get('/api/paciente/:id', pacientesController.getOne)
router.delete('/api/paciente/:id', pacientesController.deleteOne)
router.post('/api/paciente/:id', pacientesController.updateOne)
router.post('/api/login', loginController.loginUser)

module.exports = router