// routes/turnos.js
const express = require('express');
const router = express.Router();
//const Turno = require('../models/Turno'); // este modelo lo creamos abajo
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

const esHorarioPermitido = require('../utils/timeHelpers');

// POST: anotarse para un turno (almuerzo o cena)
router.post('/anotarseTurno', async (req, res) => {
  const { dni, turno } = req.body;
  //comprobacion si turno tiene el valor de almuerzo o cena
  if (!['almuerzo', 'cena'].includes(turno)) {
    return res.status(400).json({ msg: 'Turno inválido' });
  }
  //comprueba el horario sea el permitido para anotarse
 // if (!esHorarioPermitido(turno)) {
 //   return res.status(403).json({ msg: `No se puede anotar para ${turno} en este horario` });
 // }
 //

  //Busca al usuario segun el DNI
  try {
    const user = await User.findOne({ dni });
    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }
    //cambia el estado de los turnos almuerzo y cena a true
    user[turno] = true;
    //guarda los cambios
    await user.save();
    res.status(200).json({ msg: `Turno de ${turno} actualizado`, user });
  } catch (err) {
    //en caso de que no se pueda actualizar el turno marca un error
    console.error(err);
    res.status(500).json({ msg: 'Error al actualizar el turno', error: err.message });
  }
});

//CANCELAR TURNO
router.post('/cancelarTurno', async (req, res) => {
  const { dni, turno } = req.body;

  if (!dni || !turno) {
    return res.status(400).json({ msg: 'Faltan datos obligatorios' });
  }

  if (!['almuerzo', 'cena'].includes(turno)) {
    return res.status(400).json({ msg: 'Turno inválido' });
  }

  try {
    const user = await User.findOne({ dni });

    if (!user) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    // Cancelar el turno (poner false)
    user[turno] = false;

    await user.save();

    return res.json({ msg: `Cancelado el turno de ${turno}`, user });
  } catch (error) {
    console.error('Error en cancelarTurno:', error);
    return res.status(500).json({ msg: 'Error en el servidor' });
  }
});

router.post('/confirmarAsistencia', verifyToken, async (req, res) => {
  const { dni, turno } = req.body;

  try {
    const user = await User.findOne({ dni });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    if (turno === 'almuerzo') {
      if (!user.almuerzo) {
        return res.status(400).json({ success: false, message: 'El usuario no está anotado para el almuerzo' });
      }
      if (user.asistioAlmuerzo) {
        return res.status(400).json({ success: false, message: 'Ya se confirmó asistencia al almuerzo' });
      }
      user.asistioAlmuerzo = true;
    } else if (turno === 'cena') {
      if (!user.cena) {
        return res.status(400).json({ success: false, message: 'El usuario no está anotado para la cena' });
      }
      if (user.asistioCena) {
        return res.status(400).json({ success: false, message: 'Ya se confirmó asistencia a la cena' });
      }
      user.asistioCena = true;
    } else {
      return res.status(400).json({ success: false, message: 'Turno inválido' });
    }

    await user.save();
    return res.json({ success: true, message: 'Asistencia confirmada' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error al confirmar asistencia' });
  }
});



module.exports = router;
