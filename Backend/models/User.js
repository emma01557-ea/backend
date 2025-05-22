const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  dni: { type: String, required: true, unique: true },
  almuerzo: { type: Boolean, default: false },
  cena: { type: Boolean, default: false }
  

  //cambiar el modelo de usario
  //almuerzo: true o false
  //cena: true o false
})

module.exports = mongoose.model('User', userSchema)
