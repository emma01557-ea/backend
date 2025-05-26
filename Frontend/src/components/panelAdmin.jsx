import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from 'axios';
import API_BASE_URL from '../api';
import { useNavigate } from 'react-router-dom';

const PanelAdmin = ({ setVista }) => {
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [dniLeido, setDniLeido] = useState('');
  const [turnoLeido, setTurnoLeido] = useState('');
  const [error, setError] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleCamera = () => {
    if (cameraOn) {
      stopScanner();
    } else {
      resetStates();
      startScanner();
    }
  };

  const stopScanner = () => {
    codeReaderRef.current?.reset();
    setCameraOn(false);
  };

  const resetStates = () => {
    setError('');
    setConfirmacion('');
    setScanResult(null);
    setDniLeido('');
    setTurnoLeido('');
    setLoading(false);
  };

  const confirmarAsistencia = async (dni, turno) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/turnos/confirmarAsistencia`,
        { dni, turno },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data;
    } catch (e) {
      console.error(e);
      return { success: false, message: 'Error de conexión con el servidor' };
    }
  };

  const startScanner = async () => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    try {
      const devices = await codeReader.getVideoInputDevices();
      if (devices.length === 0) throw new Error('No se encontraron cámaras');

      const selectedDeviceId = devices[1].deviceId;
      setCameraOn(true);

      codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, async (result, err) => {
        if (result) {
          const text = result.getText();
          codeReader.reset();
          setScanResult(text);
          setLoading(true);

          try {
            const data = JSON.parse(text);
            const { dni, turno } = data;
            setDniLeido(dni);
            setTurnoLeido(turno);

            const res = await confirmarAsistencia(dni, turno);
            if (res.success) {
              setConfirmacion(`✅ Asistencia confirmada para DNI ${dni} en turno ${turno}`);
              setError('');
            } else {
              setError(`⚠️ ${res.message || 'No se pudo confirmar asistencia'}`);
            }
          } catch (e) {
            console.error(e);
            setError('❌ QR inválido o error al confirmar asistencia');
          } finally {
            setLoading(false);
            setCameraOn(false);
          }
        } else if (err && err.name !== 'NotFoundException') {
          console.error(err);
          setError('⚠️ Error accediendo a la cámara o leyendo QR');
        }
      });
    } catch (err) {
      console.error(err);
      setError('❌ No se pudo acceder a la cámara');
    }
  };

  const confirmarManual = async (turno) => {
    if (!dniLeido) {
      setError('No hay DNI leído para confirmar');
      return;
    }

    setLoading(true);
    const res = await confirmarAsistencia(dniLeido, turno);

    if (res.success) {
      setConfirmacion(`✅ Asistencia confirmada para DNI ${dniLeido} en turno ${turno}`);
      setError('');
    } else {
      setError(`⚠️ ${res.message || 'No se pudo confirmar asistencia'}`);
    }
    setLoading(false);
  };

  const handleLogout = () => {
  localStorage.removeItem('token');
  setVista('loginAdmin'); // o 'loginUsuario' si quieres mostrar el login usuario
};

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>Panel Administrador - Escanear QR</h2>

      <button onClick={toggleCamera} style={{ marginBottom: '1rem' }}>
        {cameraOn ? '📴 Apagar cámara' : '📷 Encender cámara'}
      </button>

      {cameraOn && <p style={{ color: 'blue' }}>🎥 Cámara encendida</p>}

      <div style={{ width: '100%' }}>
        <video ref={videoRef} style={{ width: '100%' }} />
      </div>

      {loading && <p>⏳ Cargando...</p>}
      {confirmacion && <p style={{ color: 'green' }}>{confirmacion}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {dniLeido && !loading && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>DNI escaneado:</strong> {dniLeido}</p>
          {turnoLeido && <p><strong>Turno escaneado:</strong> {turnoLeido}</p>}
          <button onClick={() => confirmarManual('almuerzo')} style={{ marginRight: '0.5rem' }} disabled={loading}>
            ✅ Confirmar Almuerzo
          </button>
          <button onClick={() => confirmarManual('cena')} disabled={loading}>
            🌙 Confirmar Cena
          </button>
        </div>
      )}

      {scanResult && !loading && (
        <button onClick={startScanner} style={{ marginTop: '1rem' }}>
          🔄 Escanear otro QR
        </button>
      )}

      <hr style={{ margin: '2rem 0' }} />
      <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white', padding: '0.5rem 1rem' }}>
        🔒 Cerrar sesión
      </button>
    </div>
  );
};

export default PanelAdmin;

