const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  grado: String,
  destino: String,
  turno: [String], // puede ser ['almuerzo', 'cena']
  qrData: String,
  asistio: {
    almuerzo: { type: Boolean, default: false },
    cena: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('userModel', usuarioSchema);
