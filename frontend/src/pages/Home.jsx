
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Home() {
  return (
    <>
      <section className="card hero">
        <div className="logo">
          <img src={logo} alt="Logo de Tattoo Studio" />
        </div>

        <h2>Bienvenido a Tattoo Studio</h2>

        <p>
          Tu próximo tatuaje comienza aquí.
          Conoce nuestros artistas y servicios,
          y agenda tu cita de manera fácil y segura.
        </p>

        <div className="acciones">
          <Link to="/agendar" className="btn">
            Reservar cita
          </Link>

          <Link to="/catalogo" className="btn btn-secundario">
            Ver catálogo
          </Link>
        </div>
      </section>

      <section className="grid-catalogo">
        <article className="card">
          <h3>Artistas especializados</h3>
          <p>
            Conoce nuestros tatuadores y elige
            el estilo que mejor se adapte a ti.
          </p>
        </article>

        <article className="card">
          <h3>Reserva en línea</h3>
          <p>
            Selecciona tu servicio, fecha y hora
            desde cualquier dispositivo.
          </p>
        </article>

        <article className="card">
          <h3>Gestiona tus citas</h3>
          <p>
            Consulta, modifica o cancela tus citas
            desde tu cuenta personal.
          </p>
        </article>
      </section>
    </>
  );
}

export default Home;
