import { useEffect, useState } from 'react';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import CitaForm from '../components/CitaForm';
import AlertMessage from '../components/AlertMessage';

import {
  obtenerCita,
  actualizarCita,
} from '../services/citaService';

function EditarCita() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cita, setCita] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarCita() {
      setCargando(true);
      setError('');
      setCita(null);

      try {
        const respuesta = await obtenerCita(id);

        if (respuesta.estado_cita !== 'Pendiente') {
          setError(
            'Solo se pueden modificar citas pendientes.'
          );
          return;
        }

        setCita(respuesta);
      } catch (error) {
        setError(
          error.response?.status === 404
            ? 'La cita no existe o no tienes permiso para modificarla.'
            : 'No fue posible cargar la información de la cita.'
        );
      } finally {
        setCargando(false);
      }
    }

    cargarCita();
  }, [id]);

  async function manejarActualizacion(datos) {
    const respuesta = await actualizarCita(id, datos);

    navigate('/mis-citas', {
      replace: true,
      state: {
        mensaje:
          respuesta.mensaje ||
          'Cita actualizada correctamente.',
      },
    });
  }

  if (cargando) {
    return <p role="status">Cargando cita...</p>;
  }

  return (
    <section className="card contenedor-cita">

      <h2>Editar cita</h2>

      <p className="descripcion-cita">
        Modifica los datos de tu reserva en Tattoo Studio.
      </p>

      <AlertMessage mensaje={error} />

      {cita && (
        <CitaForm
          key={id}
          datosIniciales={cita}
          onSubmit={manejarActualizacion}
          textoBoton="Guardar cambios"
        />
      )}

      <div className="enlaces-cita">
        <Link to="/mis-citas">
          Volver a mis citas
        </Link>
      </div>

    </section>
  );
}

export default EditarCita;