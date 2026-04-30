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
import Notificaciones from './components/Notificaciones';

const AppContent = () => {
  const { token, rol } = useAuth();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [paginaActual, setPaginaActual] = useState('dashboard');
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  if (!token) {
    if (mostrarRegistro) return <Registro onSwitch={() => setMostrarRegistro(false)} />;
    return <Login onSwitch={() => setMostrarRegistro(true)} />;
  }

  return (
    <div className="flex min-h-screen bg-lavender-50 dark:bg-gray-950">
      <Notificaciones />

      {/* Overlay móvil */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static z-30 transition-transform duration-300 ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar
          paginaActual={paginaActual}
          setPaginaActual={(p) => { setPaginaActual(p); setSidebarAbierto(false); }}
          rol={rol}
        />
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header móvil */}
        <div className="lg:hidden flex items-center gap-4 p-4 bg-white dark:bg-gray-900 border-b border-lavender-200 dark:border-gray-700">
          <button
            onClick={() => setSidebarAbierto(true)}
            className="text-gray-500 dark:text-gray-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-violet-700 dark:text-violet-400 font-bold text-lg">FinanzApp</h1>
        </div>

        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {paginaActual === 'dashboard' && <Dashboard />}
          {paginaActual === 'transacciones' && <Transacciones />}
          {paginaActual === 'presupuestos' && <Presupuestos />}
          {paginaActual === 'resumen' && <Resumen />}
          {paginaActual === 'perfil' && <Perfil />}
          {paginaActual === 'admin' && rol === 'admin' && <Admin />}
        </div>
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