
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/catalogo" element={<Catalogo />} />

          <Route
            path="/login"
            element={<h2>Inicio de sesión - En desarrollo</h2>}
          />

          <Route
            path="/registro"
            element={<h2>Registro - En desarrollo</h2>}
          />

          <Route
            path="/agendar"
            element={<h2>Agendamiento - En desarrollo</h2>}
          />

          <Route
            path="*"
            element={<h2>Página no encontrada</h2>}
          />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
