const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const Usuario = require('../models/User');

// Registrar usuario y generar QR
router.post('/registrar', async (req, res) => {
  const {nombre, apellido, grado, destino, opcionComida} = req.body;

  const qrText = `${nombre} ${apellido} | ${grado} | ${destino} | ${opcionComida.join(', ')}`;

  try {
    const qrData = await QRCode.toDataURL(qrText);

    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      grado,
      destino,
      opcionComida,
      qrData
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Obtener todos los usuarios registrados
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
});

// Confirmar asistencia
router.post('/confirmar', async (req, res) => {
  const { nombre, apellido, opcionComida } = req.body;

  const usuario = await Usuario.findOne({ nombre, apellido });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  if (opcionComida.includes('almuerzo')) usuario.asistio.almuerzo = true;
  if (opcionComuda.includes('cena')) usuario.asistio.cena = true;

  await usuario.save();
  res.json({ mensaje: 'Asistencia confirmada', usuario });
});

module.exports = router;
