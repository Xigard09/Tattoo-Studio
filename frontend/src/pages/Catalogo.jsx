
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../services/api';
import TattooArtistCard from '../components/TattooArtistCard';
import ServiceCard from '../components/ServiceCard';
import AlertMessage from '../components/AlertMessage';

function Catalogo() {
  const [tatuadores, setTatuadores] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarCatalogo() {
      try {
        const [respuestaTatuadores, respuestaServicios] =
          await Promise.all([
            api.get('/tatuadores'),
            api.get('/servicios')
          ]);

        setTatuadores(respuestaTatuadores.data);
        setServicios(respuestaServicios.data);
      } catch (error) {
        console.error(error);

        setError(
          'No fue posible cargar el catálogo. Intenta nuevamente.'
        );
      } finally {
        setCargando(false);
      }
    }

    cargarCatalogo();
  }, []);

  if (cargando) {
    return <p role="status">Cargando catálogo...</p>;
  }

  if (error) {
    return <AlertMessage mensaje={error} />;
  }

  return (
    <>
      <section className="card encabezado-catalogo">
        <h2>Nuestro catálogo</h2>

        <p>
          Conoce nuestros tatuadores especializados
          y los servicios disponibles en Tattoo Studio.
        </p>
      </section>

      <section>
        <h2>Nuestros tatuadores</h2>

        <div className="grid-catalogo">
          {tatuadores.map((tatuador) => (
            <TattooArtistCard
              key={tatuador.id_tatuador}
              tatuador={tatuador}
            />
          ))}
        </div>

        {tatuadores.length === 0 && (
          <p>No hay tatuadores disponibles.</p>
        )}
      </section>

      <section>
        <h2>Nuestros servicios</h2>

        <div className="grid-catalogo">
          {servicios.map((servicio) => (
            <ServiceCard
              key={servicio.id_servicio}
              servicio={servicio}
            />
          ))}
        </div>

        {servicios.length === 0 && (
          <p>No hay servicios disponibles.</p>
        )}
      </section>

      <section className="card hero">
        <h2>¿Listo para tu próximo tatuaje?</h2>

        <p>Selecciona tu servicio y reserva una cita.</p>

        <Link to="/agendar" className="btn">
          Agendar cita
        </Link>
      </section>
    </>
  );
}

export default Catalogo;
