import { Link, useNavigate } from 'react-router-dom';

import CitaForm from '../components/CitaForm';
import { registrarCita } from '../services/citaService';

function AgendarCita() {
  const navigate = useNavigate();

  async function manejarRegistro(datos) {
    const respuesta = await registrarCita(datos);

    navigate('/mis-citas', {
      replace: true,
      state: {
        mensaje:
          respuesta.mensaje ||
          'Cita registrada correctamente.',
      },
    });
  }

  return (
    <section className="card contenedor-cita">

      <h2>Agendar cita</h2>

      <p className="descripcion-cita">
        Selecciona el tatuador, servicio, fecha y hora
        para reservar tu próxima cita.
      </p>

      <CitaForm
        onSubmit={manejarRegistro}
        textoBoton="Agendar cita"
      />

      <div className="enlaces-cita">
        <Link to="/catalogo">
          Volver al catálogo
        </Link>
      </div>

    </section>
  );
}

export default AgendarCita;