const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/User')
const verifyToken = require('../middlewares/authMiddleware');

//usuario por defecto
const ADMIN_USER = "admin";
const ADMIN_PASS_HASH = bcrypt.hashSync("1234", 8);
const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_super_secreta";

// Registro (ya implementado)
router.post('/register', async (req, res) => {
 // const { dni, password } = req.body
 const dni = req.body

  if (!/^\d{7,8}$/.test(dni)) {
    return res.status(400).json({ msg: 'DNI inválido.' })
  }

 /* if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{9,}$/.test(password)) {
    return res.status(400).json({ msg: 'Contraseña insegura.' })
  }*/

  try {
    const existingUser = await User.findOne({ dni })
    if (existingUser) {
      return res.status(400).json({ msg: 'DNI ya registrado.' })
    }

   // const hashedPassword = await bcrypt.hash(password, 10)
    //const newUser = new User({ dni, password: hashedPassword })
    const newUser = new User({ dni})
    await newUser.save()

    res.status(201).json({ msg: 'Registro exitoso' })
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor' })
  }
})

// Login con JWT
router.post('/login', async (req, res) => {
  console.log('BODY:', req.body); 
  const { dni } = req.body;
  

  if (!dni) {
    return res.status(400).json({ message: "Falta DNI" });
  }

  try {
    let user = await User.findOne({ dni });

    if (!user) {
      const newUser = new User({ dni});
      await newUser.save();
      user = newUser;
    }

    const token = jwt.sign({ userId: user._id, dni: user.dni, elegir: user.tipo("elegir") }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error del servidor' });
  }
});

module.exports = router
