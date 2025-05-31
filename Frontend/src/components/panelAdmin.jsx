import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import axios from 'axios';
import ExcelJS from 'exceljs';
import API_BASE_URL from '../api.js';
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
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  // --- Función para descargar Excel ---
  const descargarExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet('Asistencia');

      // Cabeceras
      sheet.columns = [
       // { header: 'Nombre', key: 'nombre', width: 20 },
       // { header: 'Apellido', key: 'apellido', width: 20 },
        { header: 'DNI', key: 'dni', width: 15 },
       // { header: 'Fecha Registro', key: 'fechaRegistro', width: 20 },
        { header: 'Almuerzo Asistió', key: 'almuerzo', width: 15 },
        { header: 'Cena Asistió', key: 'cena', width: 15 },
      ];

      usuarios.forEach((u) => {
        // Formatear fecha (si tienes campo fecha, ejemplo: u.fechaRegistro)
        // Supongo que u.fechaRegistro es un ISO string o Date, si no ajustar
        //const fecha = u.fechaRegistro ? new Date(u.fechaRegistro).toLocaleString() : 'N/A';

        sheet.addRow({
        //  nombre: u.nombre,
       //   apellido: u.apellido,
          dni: u.dni,
       //   fechaRegistro: fecha,
          almuerzo: u.asistioAlmuerzo ? 'Sí' : 'No',
          cena: u.asistioCena ? 'Sí' : 'No',
        });
      });

      // Generar buffer XLSX y descargar
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `asistencia_${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Error al generar Excel', e);
      setError('Error al generar el archivo Excel');
    }
  };

  // --- Función para borrar la base después de las 21 horas ---
  const HORA_LIMPIEZA = 21;
  const limpiarBaseSiEsHora = async () => 
  {
    const ahora = new Date();
    const hoy = ahora.toISOString().split('T')[0];
    //const ultimaLimpieza = localStorage.getItem('ultimaLimpieza');
    
    if (ahora.getHours() >= HORA_LIMPIEZA) {
    try {
      console.log('Token enviado:', localStorage.getItem('token'));
      //console.log('Token enviado ultima:', localStorage.getItem('ultimaLimpieza'));
      const response = await axios.post(
        `${API_BASE_URL}/turnos/limpiar`,
        { },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
         
      //localStorage.setItem('ultimaLimpieza', hoy); // Guardamos la fecha
      //setConfirmacion('Base de datos limpiada para nuevo día');
      //setUsuarios([]);
      setConfirmacion(response.data.message || 'Turnos limpiados correctamente');
      await fetchUsuarios(); // refrescar la lista de usuarios si es necesario
    } catch (err) {
      console.error('Error al limpiar base', err);
      setError('No se pudo limpiar la base de datos');
    }
  }
};
  useEffect(() => {
    // Ejecuta limpiarBaseSiEsHora automáticamente cada minuto
    const intervalId = setInterval(() => {
      limpiarBaseSiEsHora();
    }, 60 * 1000); // 60 segundos

    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, []);

  // ... Aquí va el resto de tus funciones (toggleCamera, startScanner, confirmarAsistencia, etc.) sin cambios ...

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

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const activos = response.data.filter(
        (u) => u.almuerzo || u.cena
      );
      setUsuarios(activos);
    } catch (err) {
      console.error(err);
      setError('Error al obtener usuarios');
    }
  };

  const confirmarAsistencia = async (dni, turno) => {
    try {
      console.log('Enviando:', { dni, turno });
      const response = await axios.post(
        `${API_BASE_URL}/turnos/confirmarAsistencia`,
        { dni, turno },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      await fetchUsuarios();
      return response.data;
    } catch (e) {
        console.error(e);
        // Si hay respuesta del servidor, devolver ese mensaje
       if (e.response && e.response.data) {
        return {
          success: false,
          message: e.response.data.message || 'Error del servidor',
        };
      }
        // Si es un error de red o algo inesperado
        return { success: false, message: 'Error de conexión con el servidor' };
      }
  };

  const startScanner = async () => {
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    try {
      const devices = await codeReader.getVideoInputDevices();
      if (devices.length === 0) throw new Error('No se encontraron cámaras');

      // Buscar cámara trasera por nombre
      const backCamera = devices.find(device =>
        device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('trasera')
      );

      const selectedDeviceId = backCamera ? backCamera.deviceId : devices[0].deviceId;
      setCameraOn(true);

      codeReader.decodeFromVideoDevice(selectedDeviceId, videoRef.current, async (result, err) => {
        if (result) {
          const text = result.getText();
          codeReader.reset();
          setScanResult(text);
          setLoading(true);

          try {
            const data = JSON.parse(text);
            const { dni, almuerzo, cena } = data;
            //const { dni, turno } = data;
            // Obtener la hora actual
            const now = new Date();
            const hour = now.getHours();
            let turno = undefined;
            if (hour >= 12 && hour < 16) {
              turno = 'almuerzo';
            if (!almuerzo) {
              setError(`⚠️ El usuario no está anotado para el almuerzo`);
              return;
            }
            } else if (hour >= 18 && hour < 22) {
              turno = 'cena';
              if (!cena) {
                setError(`⚠️ El usuario no está anotado para la cena`);
                return;
              }
            } else {
              setError('⚠️ Fuera del horario válido para confirmar asistencia');
              return;
            }

            console.log('QR leído:', data);
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
    setVista('loginAdmin');
  };

  useEffect(() => {
    fetchUsuarios();
    limpiarBaseSiEsHora();
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: 'auto', textAlign: 'center' }}>
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
          <p><strong>Turno Leido:</strong> {turnoLeido}</p>
          <button onClick={() => confirmarManual('almuerzo')} style={{ marginRight: '1rem' }}>
            Confirmar Almuerzo
          </button>
          <button onClick={() => confirmarManual('cena')}>
            Confirmar Cena
          </button>
        </div>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h3>Usuarios anotados para almuerzo o cena</h3>
      {usuarios.length === 0 ? (
        <p>No hay usuarios anotados para almuerzo o cena.</p>
      ) : (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>DNI</th>
              <th>Almuerzo</th>
              <th>Cena</th>
              <th>Asistió al Almuerzo</th>
              <th>Asistió a la Cena</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id}>
                <td>{u.dni}</td>
                <td>{u.almuerzo ? '✔️' : ''}</td>
                <td>{u.cena ? '✔️' : ''}</td>
                <td>{u.asistioAlmuerzo ? (u.asistioAlmuerzo ? '✅' : '✔️') : ''}</td>
                <td>{u.asistioCena ? (u.asistioCena ? '✅' : '✔️') : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={descargarExcel}
        style={{ marginTop: '1rem', padding: '0.5rem 1rem', fontWeight: 'bold' }}
      >
        Descargar Excel
      </button>

      <button onClick={handleLogout} style={{ marginTop: '1rem', backgroundColor: 'red', color: 'white' }}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default PanelAdmin;
