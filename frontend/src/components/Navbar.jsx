
import { NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <header>
      <h1>Tattoo Studio</h1>

      <nav aria-label="Navegación principal">
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/catalogo">Catálogo</NavLink>
        <NavLink to="/login">Iniciar sesión</NavLink>
        <NavLink to="/registro">Registro</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
