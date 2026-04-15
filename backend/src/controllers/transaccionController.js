const Transaccion = require('../models/Transaccion');

// Crear transacción
const crearTransaccion = async (req, res) => {
  try {
    const { tipo, categoria, monto, descripcion, fecha, id_presupuesto } = req.body;
    const transaccion = await Transaccion.create({
      tipo,
      categoria,
      monto,
      descripcion,
      fecha,
      id_presupuesto,
      id_usuario: req.usuario.id
    });
    res.status(201).json(transaccion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear transacción', error });
  }
};

// Obtener todas las transacciones del usuario
const obtenerTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.find({ id_usuario: req.usuario.id });
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener transacciones', error });
  }
};

// Actualizar transacción
const actualizarTransaccion = async (req, res) => {
  try {
    const transaccion = await Transaccion.findOneAndUpdate(
      { _id: req.params.id, id_usuario: req.usuario.id },
      req.body,
      { new: true }
    );
    if (!transaccion) return res.status(404).json({ mensaje: 'Transacción no encontrada' });
    res.json(transaccion);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar transacción', error });
  }
};

// Eliminar transacción
const eliminarTransaccion = async (req, res) => {
  try {
    const transaccion = await Transaccion.findOneAndDelete(
      { _id: req.params.id, id_usuario: req.usuario.id }
    );
    if (!transaccion) return res.status(404).json({ mensaje: 'Transacción no encontrada' });
    res.json({ mensaje: 'Transacción eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar transacción', error });
  }
};

module.exports = { crearTransaccion, obtenerTransacciones, actualizarTransaccion, eliminarTransaccion };