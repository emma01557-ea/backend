// routes/turnos.js
const express = require('express');
const router = express.Router();
const Turno = require('../models/Turno'); // este modelo lo creamos abajo
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

// POST: anotarse para un turno (almuerzo o cena)
router.post('/anotarseTurno', async (req, res) => {
  console.log('BODY anotarse:', req.body); 
  const { tipo } = req.body; // 'almuerzo' o 'cena'
  const dni = req.user.dni;

  console.log('Usuario autenticado:', req.user);
  console.log('Tipo de turno:', req.body.tipo);
  
  try {
    const nuevoUsuario = new User({ dni, tipo });
    await nuevoUsuario.save();

    const nuevoTurno = new Turno({ dni, tipo });
    await nuevoTurno.save();
    
    
    res.status(201).json({ msg: `Turno para ${tipo} guardado`, turno: nuevoUser });
  } catch (err) {
    res.status(500).json({ msg: 'Error al guardar el turno back', error: err.message });
    console.log('Usuario autenticado:', req.user);
    console.log('Tipo de turno:', req.body.tipo);
  }
});

module.exports = router;
