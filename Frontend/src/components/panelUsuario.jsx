import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api.js'; // ajustá el path si es necesario
import { QRCode } from 'react-qr-code';
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Alert
} from '@mui/material';


const isHorarioValido = (turno) => {
  const ahora = new Date();
  const fechaActual = new Date();
  const fechaTurno = new Date();
  fechaTurno.setDate(fechaActual.getDate() + 1); // Turno es para mañana

  if (turno === 'almuerzo') {
    // Disponible desde hoy 06:00 hasta  10:00
    const inicio = new Date(fechaActual);
    inicio.setHours(6, 0, 0, 0); // hoy a las 06:00

    //const fin = new Date(fechaTurno);
    const fin = new Date(fechaActual);
    fin.setHours(10, 0, 0, 0); // hpy a las 10:00

    return ahora >= inicio && ahora <= fin;
  }

  if (turno === 'cena'  ) {
    // Disponible desde hoy 21:00 hasta mañana 13:00
    const inicio = new Date(fechaActual);
    inicio.setHours(6, 0, 0, 0); // hoy a las 15:00

    //const fin = new Date(fechaTurno);
    const fin = new Date(fechaActual);
    fin.setHours(10, 0, 0, 0); // mañana a las 19:00

    return ahora >= inicio && ahora <= fin;
  }

  return false;
};


const getFechaManana = () => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate());
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long'
  });
};

const PanelUsuario = ({ user, setIsLoggedIn, setUser }) => {
//const PanelUsuario = ({ user }) => {
  
  if (!user) return <p>Cargando datos del usuario...</p>;

  const [estadoTurnos, setEstadoTurnos] = useState({
  almuerzo: user?.almuerzo || false,
  cena: user?.cena || false
  });
  /*console.log("user",user);
  const [estadoTurnos, setEstadoTurnos] = useState({
    almuerzo: user.almuerzo,
    cena: user.cena
  });*/
  const [error, setError] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [mostrarQR, setMostrarQR] = useState(false);
  
  const anotarTurno = async (turno) => {
    try {
      //const response = await axios.post('http://localhost:5000/api/turnos/anotarseTurno', {
      const response = await axios.post(`${API_BASE_URL}/turnos/anotarseTurno`, {  
        dni: user.dni,
        turno: turno
      });

      // Actualizar estado local
      //setEstadoTurnos(prev => ({ ...prev, [turno]: true }));
      setEstadoTurnos({
         almuerzo: response.data.user.almuerzo,
         cena: response.data.user.cena 
      });

      setConfirmacion(`Te anotaste para ${turno}`);
      setError('');
    } catch (err) {
      console.error('Error al anotar turno:', err);
      setError('No se pudo guardar el turno');
      setConfirmacion('');
    }
  };
  //CANCELAR TURNO
  const cancelarTurno = async (turno) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/turnos/cancelarTurno`, {  
      dni: user.dni,
      turno: turno
    });
    setEstadoTurnos({
      almuerzo: response.data.user.almuerzo,
      cena: response.data.user.cena
    });
    setConfirmacion(`Cancelaste el turno de ${turno}`);
    setError('');
  } catch (err) {
    console.error('Error al cancelar turno:', err);
    setError('No se pudo cancelar el turno');
    setConfirmacion('');
  }
};

  

  const logout = () => {
    localStorage.removeItem('token'); // Limpia el token si lo usás
    setUser(null);
    setIsLoggedIn(false); // Vuelve a mostrar el login
  };
  
/*return (
    <Box
      sx={{
        maxWidth: 500,
        mx: 'auto',
        mt: 6,
        p: 4,
        borderRadius: 4,
        boxShadow: 3,
        bgcolor: '#f9f9f9'
      }}
    >
      <Typography variant="h5" gutterBottom>
        Bienvenido, {user.dni}
      </Typography>

      <Typography sx={{ mb: 2 }} fontSize="14px" fontStyle="italic">
        Turnos disponibles para el día <strong>{getFechaManana()}</strong>.<br />
        <strong>Almuerzo/Cena:</strong> desde hoy a las <strong>06:00</strong> hasta <strong>10:00</strong>.
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="contained"
          color="primary"
          disabled={estadoTurnos.almuerzo || !isHorarioValido('almuerzo')}
          onClick={() => anotarTurno('almuerzo')}
        >
          {estadoTurnos.almuerzo ? 'Ya anotado para Almuerzo' : 'Anotarse para Almorzar'}
        </Button>

        <Button
          variant="contained"
          color="primary"
          disabled={estadoTurnos.cena || !isHorarioValido('cena')}
          onClick={() => anotarTurno('cena')}
        >
          {estadoTurnos.cena ? 'Ya anotado para Cena' : 'Anotarse para Cenar'}
        </Button>

        {estadoTurnos.almuerzo && (
          <Button variant="outlined" color="warning" onClick={() => cancelarTurno('almuerzo')}>
            Cancelar Almuerzo
          </Button>
        )}

        {estadoTurnos.cena && (
          <Button variant="outlined" color="warning" onClick={() => cancelarTurno('cena')}>
            Cancelar Cena
          </Button>
        )}

        <Button variant="outlined" onClick={() => setMostrarQR(!mostrarQR)}>
          {mostrarQR ? 'Ocultar QR' : 'Mostrar QR'}
        </Button>

        {mostrarQR && (
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Tu código QR:</Typography>
            <QRCode
              value={JSON.stringify({
                dni: user.dni,
                almuerzo: estadoTurnos.almuerzo,
                cena: estadoTurnos.cena
              })}
              size={128}
            />
          </Paper>
        )}

        <Button variant="contained" color="error" onClick={logout}>
          Cerrar sesión
        </Button>

        {confirmacion && <Alert severity="success">{confirmacion}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Box>
  );*/
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
        maxWidth: 500,
        p: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        color: 'white',
      }}
    >
      <Typography variant="h5" gutterBottom fontWeight="bold">
        Bienvenido, usted ingresó con el DNI: {user.dni}
      </Typography>

      <Typography sx={{ mb: 2 }} fontSize="14px" fontStyle="italic">
        Turnos disponibles para el día <strong>{getFechaManana()}</strong>.<br />
        <strong>Almuerzo/Cena:</strong> desde hoy a las <strong>06:00</strong> hasta <strong>10:00</strong>.
      </Typography>

      <Stack spacing={2}>
        <Button
          fullWidth
          disabled={estadoTurnos.almuerzo || !isHorarioValido('almuerzo')}
          onClick={() => anotarTurno('almuerzo')}
          sx={{
            backgroundColor: '#FFD700',
            color: 'white',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#e6c200',
            },
          }}
        >
          {estadoTurnos.almuerzo ? 'Ya anotado para Almuerzo' : 'Anotarse para Almorzar'}
        </Button>

        <Button
          fullWidth
          disabled={estadoTurnos.cena || !isHorarioValido('cena')}
          onClick={() => anotarTurno('cena')}
          sx={{
            backgroundColor: '#FFD700',
            color: 'white',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#e6c200',
            },
          }}
        >
          {estadoTurnos.cena ? 'Ya anotado para Cena' : 'Anotarse para Cenar'}
        </Button>

        {estadoTurnos.almuerzo && (
          <Button
            fullWidth
            variant="outlined"
            color="warning"
            disabled={!isHorarioValido('almuerzo')}
            onClick={() => cancelarTurno('almuerzo')}
            sx={{
              borderColor: '#FFA500',
              color: '#FFA500',
              '&:hover': {
                backgroundColor: 'rgba(255,165,0,0.1)',
              },
            }}
          >
            Cancelar Almuerzo
          </Button>
        )}

        {estadoTurnos.cena && (
          <Button
            fullWidth
            variant="outlined"
            color="warning"
            disabled={!isHorarioValido('cena')}
            onClick={() => cancelarTurno('cena')}
            sx={{
              borderColor: '#FFA500',
              color: '#FFA500',
              '&:hover': {
                backgroundColor: 'rgba(255,165,0,0.1)',
              },
            }}
          >
            Cancelar Cena
          </Button>
        )}

        <Button
          fullWidth
          variant="outlined"
          onClick={() => setMostrarQR(!mostrarQR)}
          sx={{
            borderColor: '#FFD700',
            color: '#FFD700',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: 'rgba(255,215,0,0.1)',
            },
          }}
        >
          {mostrarQR ? 'Ocultar QR' : 'Mostrar QR'}
        </Button>

        {mostrarQR && (
          <Paper
            elevation={2}
            sx={{
              p: 2,
              textAlign: 'center',
              mt: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Tu código QR:
            </Typography>
            <QRCode
              value={JSON.stringify({
                dni: user.dni,
                almuerzo: estadoTurnos.almuerzo,
                cena: estadoTurnos.cena,
              })}
              size={128}
            />
          </Paper>
        )}

        <Button
          fullWidth
          onClick={logout}
          sx={{
            backgroundColor: '#FF4C4C',
            color: 'white',
            fontWeight: 'bold',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#e64545',
            },
          }}
        >
          Cerrar sesión
        </Button>

        {confirmacion && <Alert severity="success">{confirmacion}</Alert>}
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Paper>
  </Box>
);

};
export default PanelUsuario;