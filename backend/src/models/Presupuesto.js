const mongoose = require('mongoose');

const presupuestoSchema = new mongoose.Schema({
  categoria: {
    type: String,
    required: true
  },
  limite: {
    type: Number,
    required: true
  },
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Presupuesto', presupuestoSchema);