import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import AlertMessage from '../components/AlertMessage';
import CitaCard from '../components/CitaCard';

import {
  obtenerCitas,
  cancelarCita,
} from '../services/citaService';

function MisCitas() {
  const location = useLocation();

  const [citas, setCitas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState(
    location.state?.mensaje || ''
  );

  const [cancelando, setCancelando] = useState(null);

  useEffect(() => {
    async function cargarCitas() {
      try {
        const respuesta = await obtenerCitas();

        setCitas(respuesta);
      } catch (error) {
        setError(
          error.response?.data?.mensaje ||
          'No fue posible consultar tus citas.'
        );
      } finally {
        setCargando(false);
      }
    }

    cargarCitas();
  }, []);

  async function manejarCancelacion(id) {
    const confirmar = window.confirm(
      '¿Estás seguro de que deseas cancelar esta cita?'
    );

    if (!confirmar) {
      return;
    }

    setError('');
    setMensaje('');
    setCancelando(id);

    try {
      const respuesta = await cancelarCita(id);

      setCitas((citasActuales) =>
        citasActuales.map((cita) =>
          cita.id_cita === id
            ? respuesta.cita
            : cita
        )
      );

      setMensaje(
        respuesta.mensaje ||
        'Cita cancelada correctamente.'
      );

    } catch (error) {
      setError(
        error.response?.data?.mensaje ||
        'No fue posible cancelar la cita.'
      );
    } finally {
      setCancelando(null);
    }
  }

  return (
    <section className="contenedor-mis-citas">

      <div className="card encabezado-mis-citas">

        <h2>Mis citas</h2>

        <p>
          Consulta y gestiona tus reservas
          en Tattoo Studio.
        </p>

        <Link to="/agendar" className="btn">
          Agendar nueva cita
        </Link>

      </div>

      <AlertMessage
        mensaje={mensaje}
        tipo="success"
      />

      <AlertMessage mensaje={error} />

      {cargando && (
        <p role="status">
          Cargando tus citas...
        </p>
      )}

      {!cargando && !error && citas.length === 0 && (
        <div className="card citas-vacias">
          <h3>No tienes citas registradas</h3>

          <p>
            Agenda tu primera cita para comenzar.
          </p>

          <Link to="/agendar" className="btn">
            Agendar cita
          </Link>
        </div>
      )}

      {!cargando && citas.length > 0 && (
        <div className="grid-citas">

          {citas.map((cita) => (
            <CitaCard
              key={cita.id_cita}
              cita={cita}
              onCancelar={manejarCancelacion}
              cancelando={cancelando !== null}
            />
          ))}

        </div>
      )}

    </section>
  );
}

export default MisCitas;