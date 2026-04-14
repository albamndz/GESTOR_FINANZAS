const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ['ingreso', 'gasto'],
    required: true
  },
  categoria: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  id_presupuesto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Presupuesto'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaccion', transaccionSchema);