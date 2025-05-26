// src/components/LoginAdmin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';

const LoginAdmin = ({ onLoginSuccess, onBackToUserLogin }) => {
  const [username, setUsername] = useState(''); // o email si querés
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/authRoutes/loginAdmin`, {
        username,
        password
      });

      localStorage.setItem('adminToken', response.data.token);
      onLoginSuccess(response.data.admin); // podés enviar el adminData como user

    } catch (err) {
      console.error('Error en login admin:', err.response?.data || err.message);
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login Administrador</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {error && <p style={styles.error}>{error}</p>}

      <button onClick={onBackToUserLogin} style={styles.link}>
        Volver a login usuario
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '350px',
    margin: 'auto',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '8px',
    fontSize: '1rem'
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  error: {
    color: 'red',
    marginTop: '10px'
  },
  link: {
    background: 'none',
    color: '#007bff',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    fontSize: '1rem',
    marginTop: '10px'
  }
};

export default LoginAdmin;
