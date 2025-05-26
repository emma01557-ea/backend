const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const Admin = require('../models/Admin'); // Modelo de admin


const User = require('../models/User')
const verifyToken = require('../middlewares/authMiddleware');

//usuario por defecto
const ADMIN_USER = "admin";
const ADMIN_PASS_HASH = bcrypt.hashSync("1234", 8);
const JWT_SECRET = process.env.JWT_SECRET || "mi_clave_super_secreta";

// Registro (ya implementado)
//*router.post('/register', async (req, res) => {
 // const { dni, password } = req.body
 /*const dni = req.body */

  /*if (!/^\d{7,8}$/.test(dni)) {
    return res.status(400).json({ msg: 'DNI inválido.' })
  }*/

 /* if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&]).{9,}$/.test(password)) {
    return res.status(400).json({ msg: 'Contraseña insegura.' })
  }*/

/*  try {
    const existingUser = await User.findOne({ dni })
    if (existingUser) {
      return res.status(400).json({ msg: 'DNI ya registrado.' })
    }*/

   // const hashedPassword = await bcrypt.hash(password, 10)
    //const newUser = new User({ dni, password: hashedPassword })
    /*const newUser = new User({dni})
    await newUser.save()

    res.status(201).json({ msg: 'Registro exitoso' })
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor' })
  }
})*/

// Login con JWT
router.post('/login', async (req, res) => {
  const { dni,almuerzo,cena} = req.body;
  console.log('BODY:', req.body); 
  console.log('dni: ',dni);
  console.log('almuerzo: ',almuerzo);
  console.log('almuerzo: ',cena);
  
  if (!req.body.dni) {
    return res.status(400).json({ message: "Falta DNI" });
  }
  //BUSCAR SI EXISTE QUE INGRESE SI NO EXISTE QUE LO CREE
  try {
    const existingUser = await User.findOne({ dni })
    console.log('Existe el usuario: ',existingUser);
    
    if (!existingUser) {
    //  return res.status(400).json({ msg: 'DNI ya registrado.' })
      console.log('algo:',req.body);
      const user = new User({dni,almuerzo,cena});
      await user.save()
      console.log('BODY NUEVO USUARIO:', user);
      //const { dniNuevo,turnoNuevo } = req.body;
      const token = jwt.sign({ dni: user.dni , almuerzo: user.almuerzo, cena:user.cena }, JWT_SECRET, { expiresIn: '2h' });  
      res.json({ token, user });
    }else{
      console.log('BODY existe USUARIO else:', existingUser.dni);
      //let user = await User.findOne({ dni });
     // user = existingUser;
      const token = jwt.sign({ dni: existingUser.dni, almuerzo: existingUser.almuerzo, cena:existingUser.cena }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ token, user:existingUser });
    }
   // res.status(201).json({ msg: 'Registro exitoso' })
  } catch (err) {
    res.status(500).json({ msg: 'Error en el servidor' })
  }
      console.log('algo fuera:',req.body);
 //**  try {
  //  res.json({ token, user });
  //} catch (err) {
  //  console.error(err);
  //  res.status(500).json({ msg: 'Error del servidor' });
 // }
});

// POST /authRoutes/loginAdmin
router.post('/loginAdmin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { username: admin.username, role: 'admin' },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '1h' }
    );

    res.json({ token, user: { username: admin.username, role: 'admin' } });
  } catch (err) {
    console.error('Error al hacer login de admin:', err);
    res.status(500).json({ message: 'Error del servidor' });
  }
});



module.exports = router
