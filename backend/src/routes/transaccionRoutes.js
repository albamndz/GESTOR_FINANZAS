const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  crearTransaccion,
  obtenerTransacciones,
  actualizarTransaccion,
  eliminarTransaccion
} = require('../controllers/transaccionController');

// Todas las rutas requieren autenticación
router.post('/', auth, crearTransaccion);
router.get('/', auth, obtenerTransacciones);
router.put('/:id', auth, actualizarTransaccion);
router.delete('/:id', auth, eliminarTransaccion);

module.exports = router;