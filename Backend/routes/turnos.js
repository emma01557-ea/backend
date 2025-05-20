// routes/turnos.js
const express = require('express');
const router = express.Router();
const Turno = require('../models/Turno'); // este modelo lo creamos abajo
const auth = require('../middlewares/authMiddleware');

// POST: anotarse para un turno (almuerzo o cena)
router.post('/anotarseTurno', auth, async (req, res) => {
  const { tipo } = req.body; // 'almuerzo' o 'cena'
  const dni = req.user.dni;

  try {
    const nuevoTurno = new Turno({ dni, tipo });
    await nuevoTurno.save();
    res.status(201).json({ msg: `Turno para ${tipo} guardado`, turno: nuevoTurno });
  } catch (err) {
    res.status(500).json({ msg: 'Error al guardar el turno', error: err.message });
  }
});

module.exports = router;
