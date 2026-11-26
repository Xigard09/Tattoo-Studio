import { useEffect, useState } from 'react';

import api from '../services/api';
import AlertMessage from './AlertMessage';

function CitaForm({
  datosIniciales = null,
  onSubmit,
  textoBoton = 'Agendar cita',
}) {
  const [datos, setDatos] = useState({
    fecha_cita: datosIniciales?.fecha_cita?.slice(0, 10) || '',
    hora: datosIniciales?.hora?.slice(0, 5) || '',
    id_tatuador: datosIniciales?.id_tatuador || '',
    id_servicio: datosIniciales?.id_servicio || '',
  });

  const [tatuadores, setTatuadores] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const fechaMinima = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  useEffect(() => {
    async function cargarCatalogo() {
      try {
        const [respuestaTatuadores, respuestaServicios] =
          await Promise.all([
            api.get('/tatuadores'),
            api.get('/servicios'),
          ]);

        setTatuadores(respuestaTatuadores.data);

        setServicios(
          respuestaServicios.data.filter(
            (servicio) => servicio.estado === 'Activo'
          )
        );
      } catch (error) {
        console.error(error);

        setError(
          'No fue posible cargar los tatuadores y servicios.'
        );
      } finally {
        setCargando(false);
      }
    }

    cargarCatalogo();
  }, []);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setDatos((anteriores) => ({
      ...anteriores,
      [name]: value,
    }));

    setError('');
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();

    setError('');
    setEnviando(true);

    try {
      await onSubmit({
        ...datos,
        id_tatuador: Number(datos.id_tatuador),
        id_servicio: Number(datos.id_servicio),
      });
    } catch (error) {
      const respuesta = error.response?.data;

      const erroresValidacion = respuesta?.errors
        ? Object.values(respuesta.errors).flat().join(' ')
        : '';

      setError(
        respuesta?.mensaje ||
        erroresValidacion ||
        respuesta?.message ||
        'No fue posible guardar la cita. Intenta nuevamente.'
      );
    } finally {
      setEnviando(false);
    }
  }

  const servicioSeleccionado = servicios.find(
    (servicio) =>
      Number(servicio.id_servicio) === Number(datos.id_servicio)
  );

  if (cargando) {
    return <p role="status">Cargando formulario...</p>;
  }

  return (
    <form onSubmit={manejarEnvio} className="formulario-cita">

      <AlertMessage mensaje={error} />

      <div className="campo-cita">
        <label htmlFor="id_tatuador">Tatuador</label>

        <select
          id="id_tatuador"
          name="id_tatuador"
          value={datos.id_tatuador}
          onChange={manejarCambio}
          required
        >
          <option value="">Selecciona un tatuador</option>

          {tatuadores.map((tatuador) => (
            <option
              key={tatuador.id_tatuador}
              value={tatuador.id_tatuador}
            >
              {tatuador.nombre} - {tatuador.especialidad}
            </option>
          ))}
        </select>
      </div>

      <div className="campo-cita">
        <label htmlFor="id_servicio">Servicio</label>

        <select
          id="id_servicio"
          name="id_servicio"
          value={datos.id_servicio}
          onChange={manejarCambio}
          required
        >
          <option value="">Selecciona un servicio</option>

          {servicios.map((servicio) => (
            <option
              key={servicio.id_servicio}
              value={servicio.id_servicio}
            >
              {servicio.nombre_servicio}
            </option>
          ))}
        </select>
      </div>

      {servicioSeleccionado && (
        <div className="informacion-servicio">
          <p>
            <strong>Descripción: </strong>
            {servicioSeleccionado.descripcion}
          </p>

          <p>
            <strong>Duración estimada: </strong>
            {servicioSeleccionado.duracion_estimada}
          </p>
        </div>
      )}

      <div className="campo-cita">
        <label htmlFor="fecha_cita">Fecha de la cita</label>

        <input
          type="date"
          id="fecha_cita"
          name="fecha_cita"
          min={fechaMinima}
          value={datos.fecha_cita}
          onChange={manejarCambio}
          required
        />
      </div>

      <div className="campo-cita">
        <label htmlFor="hora">Hora de la cita</label>

        <input
          type="time"
          id="hora"
          name="hora"
          value={datos.hora}
          onChange={manejarCambio}
          required
        />
      </div>

      <p className="nota-cita">
        La disponibilidad del tatuador será verificada
        al guardar la cita.
      </p>

      <button
        type="submit"
        className="btn"
        disabled={
          enviando ||
          tatuadores.length === 0 ||
          servicios.length === 0
        }
      >
        {enviando ? 'Guardando cita...' : textoBoton}
      </button>

    </form>
  );
}

export default CitaForm;