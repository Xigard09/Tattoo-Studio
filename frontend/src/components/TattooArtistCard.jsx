function TattooArtistCard({ tatuador }) {
  return (
    <article className="card tarjeta-catalogo">
      <div className="icono-catalogo">
        🎨
      </div>

      <h3>{tatuador.nombre}</h3>

      <p>
        <strong>Especialidad:</strong> {tatuador.especialidad}
      </p>
    </article>
  );
}

export default TattooArtistCard;
