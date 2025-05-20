import { useState } from 'react'
import { registerUser } from '../api/auth'

export default function Register() {
  const [dni, setDni] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validateDni = (dni) => /^\d{7,8}$/.test(dni)

  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/.test(password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateDni(dni)) {
      setError('DNI inválido. Debe tener 7 u 8 dígitos numéricos.')
      return
    }

    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 9 caracteres, incluir letras, números y un carácter especial.')
      return
    }

    const response = await registerUser({ dni, password })
    if (response.msg === 'Usuario registrado correctamente') {
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.')
    } else {
      setError(response.msg || 'Error al registrar.')
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input
        type="text"
        placeholder="DNI"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Registrarse</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  )
}
