import { useEffect, useState } from 'react';
import api from './services/api';
import './App.css';

function App() {
  const [estadoApi, setEstadoApi] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const consultarApi = async () => {
      try {
        const respuesta = await api.get('/estado');
        setEstadoApi(respuesta.data);
      } catch {
        setError('No fue posible conectar con la API.');
      } finally {
        setCargando(false);
      }
    };

    consultarApi();
  }, []);

  return (
    <main>
      <h1>Tattoo Studio</h1>
      <h2>Integración del frontend con la API REST</h2>

      {cargando && <p>Conectando con el servidor...</p>}

      {error && <p>{error}</p>}

      {estadoApi && (
        <section>
          <p>Proyecto: {estadoApi.proyecto}</p>
          <p>Servicio: {estadoApi.servicio}</p>
          <p>Versión: {estadoApi.version}</p>
          <p>Estado: {estadoApi.estado}</p>
          <p>{estadoApi.mensaje}</p>
        </section>
      )}
    </main>
  );
}

export default App;