import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Register from './pages/Register';
import Perfil from './pages/Perfil';
import AgendarCita from './pages/AgendarCita';
import MisCitas from './pages/MisCitas';
import EditarCita from './pages/EditarCita';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />

        <main>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/catalogo" element={<Catalogo />} />

            <Route path="/login" element={<Login />} />

            <Route path="/registro" element={<Register />} />

            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />

            <Route
              path="/agendar"
              element={
                <ProtectedRoute>
                  <AgendarCita />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mis-citas"
              element={
                <ProtectedRoute>
                  <MisCitas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mis-citas/:id/editar"
              element={
                <ProtectedRoute>
                  <EditarCita />
                </ProtectedRoute>
  }
/>

            <Route
              path="*"
              element={<h2>Página no encontrada</h2>}
            />
          </Routes>
        </main>

        <Footer />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;