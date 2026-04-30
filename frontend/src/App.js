import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Transacciones from './pages/Transacciones';
import Presupuestos from './pages/Presupuestos';
import Resumen from './pages/Resumen';
import Perfil from './pages/Perfil';
import Admin from './pages/Admin';
import Sidebar from './components/Sidebar';

const AppContent = () => {
  const { token, rol } = useAuth();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [paginaActual, setPaginaActual] = useState('dashboard');

  if (!token) {
    if (mostrarRegistro) return <Registro onSwitch={() => setMostrarRegistro(false)} />;
    return <Login onSwitch={() => setMostrarRegistro(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-lavender-50">
      <Sidebar paginaActual={paginaActual} setPaginaActual={setPaginaActual} rol={rol} />
      <div className="flex-1 p-8 overflow-auto">
        {paginaActual === 'dashboard' && <Dashboard />}
        {paginaActual === 'transacciones' && <Transacciones />}
        {paginaActual === 'presupuestos' && <Presupuestos />}
        {paginaActual === 'resumen' && <Resumen />}
        {paginaActual === 'perfil' && <Perfil />}
        {paginaActual === 'admin' && rol === 'admin' && <Admin />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;