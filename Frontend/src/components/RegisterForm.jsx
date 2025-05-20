// src/components/RegisterForm.jsx
import React, { useState } from 'react'
import axios from 'axios'

const RegisterForm = () => {
  const [dni, setDni] = useState('')
//  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const validarDni = (dni) => /^\d{7,8}$/.test(dni)
//  const validarPassword = (pass) =>
//    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._\-])[A-Za-z\d@$!%*?&._\-]{9,}$/.test(pass)


  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validarDni(dni)) {
      return setError('El DNI debe ser numérico y tener entre 7 y 8 dígitos.')
    }

  /*  if (!validarPassword(password)) {
      return setError(
        'La contraseña debe tener al menos 9 caracteres, incluir letras, números y un carácter especial.'
      )
    }*/

    try {
      const res = await axios.post('http://localhost:5000/api/authRoutes/register', {
        dni,
       // password
      })
      setSuccess('Registro exitoso. Ahora puedes iniciar sesión.')
      setDni('')
      setPassword('')
    } catch (err) {
      setError(err.response?.data?.msg || 'Error al registrarse')
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Registrarse</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <input
        type="text"
        placeholder="DNI"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        required
      />
   {/**      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />*/}
      <button type="submit">Crear cuenta</button>
    </form>
  )
}

export default RegisterForm
