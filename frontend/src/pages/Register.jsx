
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { registro } = useAuth();
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    password: '',
    password_confirmation: '',
  });

  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (formulario.password !== formulario.password_confirmation) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setEnviando(true);

    try {
      await registro(formulario);

      navigate('/login', {
        state: {
          mensaje: 'Registro exitoso. Ya puedes iniciar sesión.',
        },
      });
    } catch (err) {
      const datos = err.response?.data;

      setError(
        datos?.errors
          ? Object.values(datos.errors).flat().join(' ')
          : datos?.mensaje || datos?.message ||
            'No fue posible realizar el registro.'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <section className="auth-card">
      <h2>Registro de clientes</h2>
      <p>Crea tu cuenta para agendar citas en Tattoo Studio.</p>

      {error && (
        <div className="auth-error" role="alert">{error}</div>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          name="nombre"
          value={formulario.nombre}
          onChange={handleChange}
          maxLength={100}
          autoComplete="name"
          required
        />

        <label htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          value={formulario.telefono}
          onChange={handleChange}
          maxLength={30}
          autoComplete="tel"
        />

        <label htmlFor="correo">Correo electrónico</label>
        <input
          id="correo"
          name="correo"
          type="email"
          value={formulario.correo}
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
          value={formulario.password}
          onChange={handleChange}
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          required
        />

        <label htmlFor="password_confirmation">
          Confirmar contraseña
        </label>
        <input
          id="password_confirmation"
          name="password_confirmation"
          type="password"
          value={formulario.password_confirmation}
          onChange={handleChange}
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          required
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Registrando...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="auth-link">
        ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </section>
  );
}

