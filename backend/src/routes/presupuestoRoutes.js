const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  crearPresupuesto,
  obtenerPresupuestos,
  actualizarPresupuesto,
  eliminarPresupuesto
} = require('../controllers/presupuestoController');

router.post('/', auth, crearPresupuesto);
router.get('/', auth, obtenerPresupuestos);
router.put('/:id', auth, actualizarPresupuesto);
router.delete('/:id', auth, eliminarPresupuesto);

module.exports = router;