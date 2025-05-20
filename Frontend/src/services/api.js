import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Cambiar a tu URL p�blica cuando est� desplegado

export const registrarUsuario = async (datos) => {
  const res = await axios.post(`${API_URL}/api/registrar`, datos);
  return res.data;
};
