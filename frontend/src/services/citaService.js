import api from './api';

export const obtenerCitas = async () => {
  const response = await api.get('/citas');
  return response.data;
};

export const obtenerCita = async (id) => {
  const response = await api.get(`/citas/${id}`);
  return response.data;
};

export const registrarCita = async (datos) => {
  const response = await api.post('/citas', datos);
  return response.data;
};

export const actualizarCita = async (id, datos) => {
  const response = await api.put(`/citas/${id}`, datos);
  return response.data;
};

export const cancelarCita = async (id) => {
  const response = await api.delete(`/citas/${id}`);
  return response.data;
};