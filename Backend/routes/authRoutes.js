import express from 'express'
import { register, login } from '../controllers/authController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.get('/perfil', authMiddleware, (req, res) => {
  res.json({ msg: 'Ruta protegida', userId: req.user.id })
})

export default router
