
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [credenciales, setCredenciales] = useState({
    correo: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setCredenciales((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setEnviando(true);

    try {
      await login(credenciales);
      navigate('/perfil', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.mensaje ||
        err.response?.data?.message ||
        'No fue posible iniciar sesión.'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="auth-card">
      <h2>Iniciar sesión</h2>
      <p>Accede a tu cuenta de Tattoo Studio.</p>

      {location.state?.mensaje && (
        <div className="auth-success" role="status">
          {location.state.mensaje}
        </div>
      )}

      {error && (
        <div className="auth-error" role="alert">{error}</div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={credenciales.correo}
          onChange={handleChange}
          maxLength={100}
          autoComplete="email"
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          value={credenciales.password}
          onChange={handleChange}
          maxLength={72}
          autoComplete="current-password"
          required
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Iniciar sesión'}
        </button>
      </form>

      <p className="auth-link">
        ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
      </p>
    </section>
  );
}
