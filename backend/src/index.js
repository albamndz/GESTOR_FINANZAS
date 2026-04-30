const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const transaccionRoutes = require('./routes/transaccionRoutes');
const presupuestoRoutes = require('./routes/presupuestoRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/transacciones', transaccionRoutes);
app.use('/api/presupuestos', presupuestoRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando correctamente');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a MongoDB:', err);
  });