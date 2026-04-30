const express = require('express');
const router = express.Router();
const { registrar, login, actualizarPerfil, cambiarContraseña } = require('../controllers/usuarioController');
const auth = require('../middleware/auth');

router.post('/registro', registrar);
router.post('/login', login);
router.put('/perfil', auth, actualizarPerfil);
router.put('/contraseña', auth, cambiarContraseña);

module.exports = router;