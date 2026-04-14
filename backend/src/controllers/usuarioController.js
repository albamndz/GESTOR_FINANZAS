const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registro de usuario
const registrar = async (req, res) => {
  try {
    const { nombre, correo, contraseña } = req.body;

    // Comprobar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ correo });
    if (usuarioExiste) {
      return res.status(400).json({ mensaje: 'El correo ya está registrado' });
    }

    // Cifrar la contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseñaCifrada = await bcrypt.hash(contraseña, salt);

    // Crear el usuario
    const usuario = await Usuario.create({
      nombre,
      correo,
      contraseña: contraseñaCifrada
    });

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Buscar el usuario
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    // Comprobar la contraseña
    const contraseñaCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!contraseñaCorrecta) {
      return res.status(400).json({ mensaje: 'Correo o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, nombre: usuario.nombre });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
};

module.exports = { registrar, login };