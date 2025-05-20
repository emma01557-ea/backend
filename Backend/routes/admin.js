const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');

const ADMIN_USER = "admin";
const ADMIN_PASS_HASH = bcrypt.hashSync("1234", 8);
const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_super_secreta";

// Login de admin
router.post('/login', (req, res) => {
  const { usuario, password } = req.body;
  
  if (!usuario || !password) {
    return res.status(400).json({ message: "Faltan usuario o contrase�a" });
  }

  if (usuario !== ADMIN_USER) {
    return res.status(401).json({ message: "Usuario o contrase�a incorrectos" });
  }

  const passwordIsValid = bcrypt.compareSync(password, ADMIN_PASS_HASH);
  if (!passwordIsValid) {
    return res.status(401).json({ message: "Usuario o contrase�a incorrectos" });
  }

  const token = jwt.sign({ usuario }, JWT_SECRET, { expiresIn: '1h' });

  res.json({ success: true, message: "Login exitoso", token });
});

// Ruta protegida
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "Bienvenido al panel de administraci�n",
    usuario: req.user.usuario,
  });
}); // ?? ESTA L�NEA FALTABA

const User = require('../models/User'); // Asegurate de importar el modelo

// GET: Obtener todos los usuarios con su fecha de registro y asistencia
router.get('/usuariosFecha', verifyToken, async (req, res) => {
  try {
    const usuarios = await User.find({}, '-__v').sort({ fechaRegistro: -1 }); // ordena por fecha
    res.json({ success: true, usuarios });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});

router.put('/confirmar-asistencia/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(userId, { asistencia: true }, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ success: true, message: 'Asistencia confirmada', user });
  } catch (error) {
    console.error('Error al confirmar asistencia:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Obtener todos los usuarios registrados (protegido con JWT)
router.get('/usuarios', verifyToken, async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json({ success: true, usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /api/admin/usuarios/hoy
router.delete('/usuarios/hoy', verifyToken, async (req, res) => {
  try {
    //const usuarios = await User.find();
    const inicioDelDia = new Date();
    inicioDelDia.setHours(0, 0, 0, 0);

    const finDelDia = new Date();
    finDelDia.setDate(inicioDelDia.getDate() + 1);

   //const result = await User.deleteMany({
     // fechaRegistro: { $gte: inicioDelDia, $lte: finDelDia },
const result = await User.deleteMany({
      $or: [
        { fechaRegistro: { $lt:  inicioDelDia } },
        { fechaRegistro: { $gte:  finDelDia } },
        { fechaRegistro: { $exists: false } },
      ],   
});

    res.json({ mensaje: "Registros de hoy eliminados", eliminados: result.deletedCount });
  } catch (err) {
    console.error("Error al eliminar registros de hoy:", err);
    res.status(500).json({ error: "Error al eliminar registros ahora" });
  }
});

module.exports = router;
