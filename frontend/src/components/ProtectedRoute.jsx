import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { autenticado, cargando } = useAuth();

  if (cargando) {
    return <p>Verificando sesión...</p>;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
