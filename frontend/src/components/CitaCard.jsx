import { Link } from 'react-router-dom';

function CitaCard({ cita, onCancelar, cancelando }) {
  const estado = cita.estado_cita;

  const fecha = cita.fecha_cita.slice(0, 10);
  const hora = cita.hora.slice(0, 5);

  const fechaHora = new Date(
    `${fecha}T${hora}:00-05:00`
  );

  const esFutura = fechaHora.getTime() > Date.now();

  const puedeEditar =
    esFutura && estado === 'Pendiente';

  const puedeCancelar =
    esFutura &&
    ['Pendiente', 'Confirmada'].includes(estado);

  const fechaFormateada = new Date(
    `${fecha}T12:00:00-05:00`
  ).toLocaleDateString('es-CO', {
    timeZone: 'America/Bogota',
  });

  return (
    <article className="cita-card">

      <div className="cita-card-encabezado">
        <h3>
          {cita.servicio?.nombre_servicio || 'Servicio'}
        </h3>

        <span
          className={`estado-cita estado-${estado.toLowerCase()}`}
        >
          {estado}
        </span>
      </div>

      <div className="cita-card-informacion">

        <p>
          <strong>Tatuador:</strong>{' '}
          {cita.tatuador?.nombre || 'No disponible'}
        </p>

        <p>
          <strong>Especialidad:</strong>{' '}
          {cita.tatuador?.especialidad || 'No disponible'}
        </p>

        <p>
          <strong>Fecha:</strong> {fechaFormateada}
        </p>

        <p>
          <strong>Hora:</strong> {hora}
        </p>

        <p>
          <strong>Duración estimada:</strong>{' '}
          {cita.servicio?.duracion_estimada || 'No disponible'}
        </p>

      </div>

      {(puedeEditar || puedeCancelar) && (
        <div className="cita-card-acciones">

          {puedeEditar && !cancelando && (
            <Link
              to={`/mis-citas/${cita.id_cita}/editar`}
              className="btn"
            >
              Editar cita
            </Link>
          )}

          {puedeCancelar && (
            <button
              type="button"
              className="btn btn-cancelar"
              disabled={cancelando}
              onClick={() => onCancelar(cita.id_cita)}
            >
              {cancelando
                ? 'Cancelando...'
                : 'Cancelar cita'}
            </button>
          )}

        </div>
      )}

    </article>
  );
}

export default CitaCard;