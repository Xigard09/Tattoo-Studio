function ServiceCard({ servicio }) {
  return (
    <article className="card tarjeta-catalogo">
      <div className="icono-catalogo">
        ✒️
      </div>

      <h3>{servicio.nombre_servicio}</h3>

      <p>{servicio.descripcion}</p>

      <p>
        <strong>Duración estimada:</strong>{' '}
        {servicio.duracion_estimada}
      </p>

      <span className="estado-activo">
        {servicio.estado}
      </span>
    </article>
  );
}

export default ServiceCard;
