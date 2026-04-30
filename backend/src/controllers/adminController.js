const Usuario = require('../models/Usuario');
const Transaccion = require('../models/Transaccion');

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, '-contraseña');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    await Transaccion.deleteMany({ id_usuario: req.params.id });
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error });
  }
};

// Obtener todas las transacciones
const obtenerTodasTransacciones = async (req, res) => {
  try {
    const transacciones = await Transaccion.find().populate('id_usuario', 'nombre correo');
    res.json(transacciones);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener transacciones', error });
  }
};

module.exports = { obtenerUsuarios, eliminarUsuario, obtenerTodasTransacciones };