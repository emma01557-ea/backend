// routes/turnos.js
const express = require('express');
const router = express.Router();
const Turno = require('../models/Turno'); // este modelo lo creamos abajo
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

// POST: anotarse para un turno (almuerzo o cena)
router.post('/anotarseTurno', async (req, res) => {
  const { dni, turno } = req.body;

  if (!['almuerzo', 'cena'].includes(turno)) {
    return res.status(400).json({ msg: 'Turno inválido' });
  }

  try {
    const user = await User.findOne({ dni });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    user[turno] = true;
    await user.save();

    res.status(200).json({ msg: `Turno de ${turno} actualizado`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar el turno', error: err.message });
  }
});


module.exports = router;
