const Presupuesto = require('../models/Presupuesto');
const Transaccion = require('../models/Transaccion');

// Crear presupuesto
const crearPresupuesto = async (req, res) => {
  try {
    const { categoria, limite } = req.body;
    const presupuesto = await Presupuesto.create({
      categoria,
      limite,
      id_usuario: req.usuario.id
    });
    res.status(201).json(presupuesto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear presupuesto', error });
  }
};

// Obtener presupuestos con gasto actual y alerta
const obtenerPresupuestos = async (req, res) => {
  try {
    const presupuestos = await Presupuesto.find({ id_usuario: req.usuario.id });

    const resultado = await Promise.all(presupuestos.map(async (p) => {
      const transacciones = await Transaccion.find({
        id_usuario: req.usuario.id,
        categoria: p.categoria,
        tipo: 'gasto'
      });
      const gastoActual = transacciones.reduce((acc, t) => acc + t.monto, 0);
      return {
        ...p.toObject(),
        gastoActual,
        alerta: gastoActual >= p.limite
      };
    }));

    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener presupuestos', error });
  }
};

// Actualizar presupuesto
const actualizarPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findOneAndUpdate(
      { _id: req.params.id, id_usuario: req.usuario.id },
      req.body,
      { new: true }
    );
    if (!presupuesto) return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
    res.json(presupuesto);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar presupuesto', error });
  }
};

// Eliminar presupuesto
const eliminarPresupuesto = async (req, res) => {
  try {
    const presupuesto = await Presupuesto.findOneAndDelete(
      { _id: req.params.id, id_usuario: req.usuario.id }
    );
    if (!presupuesto) return res.status(404).json({ mensaje: 'Presupuesto no encontrado' });
    res.json({ mensaje: 'Presupuesto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar presupuesto', error });
  }
};

module.exports = { crearPresupuesto, obtenerPresupuestos, actualizarPresupuesto, eliminarPresupuesto };