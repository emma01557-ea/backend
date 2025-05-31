import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api.js'; // ajustá el path si es necesario
//import QRCode from 'qrcode.react';
//import { QRCode } from 'qrcode.react';
//import QRCode from 'react-qr-code';
import { QRCode } from 'react-qr-code';


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
    fin.setHours(13, 0, 0, 0); // hpy a las 10:00

    return ahora >= inicio && ahora <= fin;
  }

  if (turno === 'cena'  ) {
    // Disponible desde hoy 21:00 hasta mañana 13:00
    const inicio = new Date(fechaActual);
    inicio.setHours(6, 0, 0, 0); // hoy a las 15:00

    //const fin = new Date(fechaTurno);
    const fin = new Date(fechaActual);
    fin.setHours(13, 0, 0, 0); // mañana a las 19:00

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

  
  return (
    <div>
      <h2>Bienvenido, {user.dni}</h2>

      {/*
      <button onClick={() => anotarTurno('almuerzo')} disabled={estadoTurnos.almuerzo}>
        {estadoTurnos.almuerzo ? 'Ya anotado para Almuerzo' : 'Anotarse para Almorzar'}
      </button>

      <button onClick={() => anotarTurno('cena')} disabled={estadoTurnos.cena}>
        {estadoTurnos.cena ? 'Ya anotado para Cena' : 'Anotarse para Cenar'}
      </button>
      
      <button
      onClick={() => anotarTurno('cena')}
      disabled={estadoTurnos.cena || !puedeAnotarseParaCena()}
      >
      {estadoTurnos.cena
        ? 'Ya anotado para Cena'
          : puedeAnotarseParaCena()
        ? 'Anotarse para Cenar'
          : 'Fuera de horario de anotación'}
      </button>*/}

    <button
      onClick={() => anotarTurno('almuerzo')}
      disabled={estadoTurnos.almuerzo || !isHorarioValido('almuerzo')}
    >
      {estadoTurnos.almuerzo
      ? 'Ya anotado para Almuerzo'
      :  'Anotarse para Almorzar'}
    </button>
    <button
      onClick={() => anotarTurno('cena')}
      disabled={estadoTurnos.cena || !isHorarioValido('cena')}
    >
      {estadoTurnos.cena
        ? 'Ya anotado para Cena'
        : 'Anotarse para Cenar'}
    </button>

        <p style={{ fontStyle: 'italic', fontSize: '14px' }}>
          Turnos disponibles para Almuerzo y cena del dia  <strong>{getFechaManana()}</strong>.<br />
          <strong>Almuerzo/Cena:</strong> desde hoy a las <strong>06:00</strong> hasta a las <strong>10:00</strong>.<br />
        </p>
      


      {estadoTurnos.almuerzo && <button onClick={() => cancelarTurno('almuerzo')}>Cancelar Almuerzo</button>}
      {estadoTurnos.cena && <button onClick={() => cancelarTurno('cena')}>Cancelar Cena</button>}

      <br /><br />
      <button onClick={() => setMostrarQR(!mostrarQR)}>
        {mostrarQR ? 'Ocultar QR' : 'Mostrar QR'}
      </button>
      <br /><br />
      {mostrarQR && (
        <div style={{ marginTop: '1rem', padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
          <p><strong>Tu código QR:</strong></p>
          <QRCode
            value={JSON.stringify({
              dni: user.dni,
              almuerzo: estadoTurnos.almuerzo,
              cena: estadoTurnos.cena
            })}size={128}
          />
           </div>
      )}
      <br /><br />
      <button onClick={logout} style={{ backgroundColor: 'red', color: 'white' }}>
        Cerrar sesión
      </button>

      {confirmacion && <p style={{ color: 'green' }}>{confirmacion}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default PanelUsuario;