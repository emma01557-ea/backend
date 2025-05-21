import React, { useState } from 'react';
import axios from 'axios';
//import QRCode from 'qrcode.react';

const panelUsuario = ({ user }) => {
  const [turno, setTurno] = useState('');
  const [error, setError] = useState('');
  const [confirmacion, setConfirmacion] = useState('');

  const anotarTurno = async (tipoTurno) => {
    try {
      //const token = localStorage.getItem('token');
       
      const response = await axios.post('http://localhost:5000/api/turnos/anotarseTurno',
        { tipo: tipoTurno }, );
      localStorage.setItem('token', response.data.token);
      
      setTurno(tipoTurno);
      setConfirmacion('Turno guardado con éxito');
      setError('');
    } catch (err) {
      setError('Error al guardar el turno front');
      setConfirmacion('');
    }
  };

  return (
    <div>
      <h2>Bienvenido, {user.dni}</h2>
      
      <button onClick={() => anotarTurno('almuerzo')}>Anotarse para Almorzar</button>
      <button onClick={() => anotarTurno('cena')}>Anotarse para Cenar</button>

      {confirmacion && <p style={{ color: 'green' }}>{confirmacion}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {turno && (
        <div style={{ marginTop: '20px' }}>
          <h3>Tu código QR:</h3>
          <QRCode value={JSON.stringify({ dni: user.dni, turno })} />
        </div>
      )}
    </div>
  );
};

export default panelUsuario;
