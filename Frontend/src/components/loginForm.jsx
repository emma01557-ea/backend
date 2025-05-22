import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [dni, setDni] = useState('');
  const almuerzo = false;
  const cena = false;
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!/^\d{7,9}$/.test(dni)) {
      setError('El DNI debe tener solo números (7 a 9 cifras)');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/authRoutes/login', {dni,almuerzo,cena});
      console.log("Respuesta del servidor:", response.data); 
      localStorage.setItem('token', response.data.token);
    try {
      onLoginSuccess(response.data.user);
    } catch (e) {
    console.error("Error en onLoginSuccess:", e);
    }
      onLoginSuccess(response.data.user);
    
    } catch (err) {
      console.error("Error en login:", err.response?.data || err.message);
      setError('DNI no registrado o error del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="text"
          placeholder="DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      {error && <p style={styles.error}>{error}</p>}
      
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
    fontSize: '1rem'
  }
};

export default LoginForm;
