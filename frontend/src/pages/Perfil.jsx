
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Perfil() {
  const { usuario } = useAuth();

  return (
    <section className="auth-card">
      <h2>Mi perfil</h2>

      <p>Bienvenido, {usuario.nombre}.</p>

      <div className="profile-info">
        <p>
          <strong>Nombre:</strong> {usuario.nombre}
        </p>

        <p>
          <strong>Correo electrónico:</strong> {usuario.correo}
        </p>

        <p>
          <strong>Teléfono:</strong>{' '}
          {usuario.telefono || 'No registrado'}
        </p>

        <p>
          <strong>Fecha de registro:</strong>{' '}
          {usuario.fecha_registro?.split('T')[0] || 'No disponible'}
        </p>
      </div>

      <div className="profile-actions">
        <Link className="auth-button" to="/agendar">
          Agendar cita
        </Link>

        <Link className="auth-button secondary" to="/mis-citas">
          Mis citas
        </Link>
      </div>
    </section>
  );
}
