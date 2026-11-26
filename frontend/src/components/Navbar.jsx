import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { autenticado, cargando, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('No se pudo revocar el token en el servidor.', error);
    } finally {
      navigate('/', { replace: true });
    }
  };

  return (
    <header>
      <h1>Tattoo Studio</h1>

      <nav aria-label="Navegación principal">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/catalogo">Catálogo</NavLink>

        {!cargando && (
          autenticado ? (
            <>
              <NavLink to="/agendar">Agendar cita</NavLink>
              <NavLink to="/mis-citas">Mis citas</NavLink>
              <NavLink to="/perfil">Mi perfil</NavLink>

              <button
                className="logout-button"
                onClick={handleLogout}
                type="button"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Iniciar sesión</NavLink>
              <NavLink to="/registro">Registro</NavLink>
            </>
          )
        )}
      </nav>
    </header>
  );
}

export default Navbar;
