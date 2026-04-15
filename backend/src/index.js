const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const transaccionRoutes = require('./routes/transaccionRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/transacciones', transaccionRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente ✅');
});

// Conexión a MongoDB y arranque del servidor
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB ✅');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT} ✅`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });