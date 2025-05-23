import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api.js'; // ajustá el path si es necesario

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

  const logout = () => {
    localStorage.removeItem('token'); // Limpia el token si lo usás
    setUser(null);
    setIsLoggedIn(false); // Vuelve a mostrar el login
  };

  return (
    <div>
      <h2>Bienvenido, {user.dni}</h2>

      <button onClick={() => anotarTurno('almuerzo')} disabled={estadoTurnos.almuerzo}>
        {estadoTurnos.almuerzo ? 'Ya anotado para Almuerzo' : 'Anotarse para Almorzar'}
      </button>

      <button onClick={() => anotarTurno('cena')} disabled={estadoTurnos.cena}>
        {estadoTurnos.cena ? 'Ya anotado para Cena' : 'Anotarse para Cenar'}
      </button>

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