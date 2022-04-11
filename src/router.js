const express = require('express');
const router = express.Router();
const pacientesController = require('./controllers/pacientes');
//const loginController = require('./controllers/login');

router.get('/pacientes', pacientesController.getAll)

// router.get('/skaters/:id', skatersController.getOne)
// router.delete("/skaters/:id", skatersController.deleteOne)

// router.post('/login', loginController.loginUser)

module.exports = router