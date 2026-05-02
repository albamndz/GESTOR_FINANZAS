const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ mensaje: 'No tienes autorización' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    req.usuario = decoded;
    next();

  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};

module.exports = auth;