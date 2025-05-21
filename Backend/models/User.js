const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  dni: { type: String, required: true, unique: true },
  tipo: {
    type: String,
    enum: ['almuerzo', 'cena', 'elegir'],
    required: false
  },
})

module.exports = mongoose.model('User', userSchema)
