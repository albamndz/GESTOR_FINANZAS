import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Transacciones from './pages/Transacciones';
import Presupuestos from './pages/Presupuestos';
import Sidebar from './components/Sidebar';

const AppContent = () => {
  const { token } = useAuth();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [paginaActual, setPaginaActual] = useState('dashboard');

  if (!token) {
    if (mostrarRegistro) return <Registro onSwitch={() => setMostrarRegistro(false)} />;
    return <Login onSwitch={() => setMostrarRegistro(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar paginaActual={paginaActual} setPaginaActual={setPaginaActual} />
      <div className="flex-1 p-8 overflow-auto bg-gray-950">
        {paginaActual === 'dashboard' && <Dashboard />}
        {paginaActual === 'transacciones' && <Transacciones />}
        {paginaActual === 'presupuestos' && <Presupuestos />}
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