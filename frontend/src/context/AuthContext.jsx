import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const token = sessionStorage.getItem('token');

      if (token) {
        try {
          const datos = await authService.obtenerUsuario();
          setUsuario(datos);
        } catch {
          sessionStorage.removeItem('token');
          setUsuario(null);
        }
      }

      setCargando(false);
    };

    verificarSesion();
  }, []);

  const login = async (credenciales) => {
    const datos = await authService.login(credenciales);

    sessionStorage.setItem('token', datos.token);
    setUsuario(datos.cliente);

    return datos;
  };

  const registro = async (datos) => {
    return await authService.registro(datos);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      sessionStorage.removeItem('token');
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        autenticado: Boolean(usuario),
        login,
        registro,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
