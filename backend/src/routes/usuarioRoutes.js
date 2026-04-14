const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/usuarioController');

// POST /api/usuarios/registro
router.post('/registro', registrar);

// POST /api/usuarios/login
router.post('/login', login);

module.exports = router;