import api from './api';

const authService = {
  async registro(datos) {
    const response = await api.post('/registro', datos);
    return response.data;
  },

  async login(credenciales) {
    const response = await api.post('/login', credenciales);
    return response.data;
  },

  async obtenerUsuario() {
    const response = await api.get('/user');
    return response.data;
  },

  async logout() {
    const response = await api.post('/logout');
    return response.data;
  },
};

export default authService;
