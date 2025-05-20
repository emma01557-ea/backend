import { useState } from 'react'
import { loginUser } from '../api/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await loginUser({ email, password })

    if (data.token) {
      localStorage.setItem('token', data.token)
      alert('Login correcto')
      // redirigir o mostrar contenido
    } else {
      setError(data.msg || 'Error en login')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required />
      <button type="submit">Iniciar sesión</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  )
}
