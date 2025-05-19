import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

export const register = async (req, res) => {
  const { nombre, apellido, email, password } = req.body
  try {
    const userExists = await User.findOne({ email })
    if (userExists) return res.status(400).json({ msg: 'El usuario ya existe' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new User({ nombre, apellido, email, password: hashedPassword })
    await newUser.save()

    res.status(201).json({ msg: 'Usuario registrado' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' })

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({ msg: 'Contraseña incorrecta' })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' })
    res.json({ token, user: { id: user._id, nombre: user.nombre, apellido: user.apellido, email: user.email } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
