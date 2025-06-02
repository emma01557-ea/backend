import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress
} from '@mui/material';

const LoginAdmin = ({ onLoginSuccess, onBackToUserLogin }) => {
  const [username, setUsername] = useState(''); 
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
      onLoginSuccess(response.data.admin);

    } catch (err) {
      console.error('Error en login admin:', err.response?.data || err.message);
      setError('Usuario o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          width: '100%',
          maxWidth: 350,
          p: 4,
          borderRadius: 4,
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Logo */}
        <Box sx={{ mb: 2 }}>
          <img src="/logo.png" alt="Logo" style={{ height: 120 }} />
        </Box>

        {/* Título */}
        <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 3 }}>
          Login Administrador
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Usuario"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{
              mb: 2,
              '& .MuiInputBase-root': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
            }}
          />

          <TextField
            label="Contraseña"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{
              mb: 3,
              '& .MuiInputBase-root': { color: 'white' },
              '& .MuiInputLabel-root': { color: 'white' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#FFD700' },
            }}
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: '#FFD700',
              color: 'black',
              fontWeight: 'bold',
              py: 1.5,
              '&:hover': {
                backgroundColor: '#e6c200',
              },
              mb: 2,
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
          </Button>
        </Box>

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Typography
          variant="body2"
          onClick={onBackToUserLogin}
          sx={{
            mt: 2,
            color: '#FFD700',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Volver a login usuario
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginAdmin;
