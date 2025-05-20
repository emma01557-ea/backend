// models/Turno.js
const mongoose = require('mongoose');

const TurnoSchema = new mongoose.Schema({
  dni: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['almuerzo', 'cena'],
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Turno', TurnoSchema);
