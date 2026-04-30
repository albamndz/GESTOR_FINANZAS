const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { obtenerUsuarios, eliminarUsuario, obtenerTodasTransacciones } = require('../controllers/adminController');

router.get('/usuarios', auth, admin, obtenerUsuarios);
router.delete('/usuarios/:id', auth, admin, eliminarUsuario);
router.get('/transacciones', auth, admin, obtenerTodasTransacciones);

module.exports = router;