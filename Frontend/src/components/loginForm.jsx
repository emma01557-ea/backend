import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [dni, setDni] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/authRoutes/login', {
        dni,
        password
      });

      // Guardar token en localStorage si lo necesitás
      localStorage.setItem('token', response.data.token);
      onLoginSuccess(response.data.user); // Se lo pasa a App.jsx

    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>¿No tenés cuenta? <button onClick={onSwitchToRegister}>Registrate</button></p>
    </div>
  );
};

export default LoginForm;