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

const LoginForm = ({ onLoginSuccess, onSwitchToAdmin }) => {
  const [dni, setDni] = useState('');
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
      const response = await axios.post(`${API_BASE_URL}/authRoutes/login`, { dni });
      localStorage.setItem('token', response.data.token);
      onLoginSuccess(response.data.user);
    } catch (err) {
      setError('DNI no registrado o error del servidor');
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
          maxWidth: 300,
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

        {/* Título y subtítulo */}
        <Typography variant="h5" fontWeight="bold" sx={{ color: 'white', mb: 1 }}>
          Bienvenidos
        </Typography>
        <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
          Ingrese su DNI para registrarse
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="DNI"
            variant="outlined"
            fullWidth
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            required
            sx={{
              mb: 2,
              '& .MuiInputBase-root': {
                color: 'white',
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#FFD700',
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              backgroundColor: '#FFD700',
              color: 'white',
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
          onClick={onSwitchToAdmin}
          sx={{
            mt: 2,
            color: '#FFD700',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          ¿Sos administrador?
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;
