import { useAuth } from '../context/AuthContext';

const Sidebar = ({ paginaActual, setPaginaActual }) => {
  const { nombre, logout } = useAuth();

  const enlaces = [
    { id: 'dashboard', label: 'Dashboard', icono: '📊' },
    { id: 'transacciones', label: 'Transacciones', icono: '💸' },
    { id: 'presupuestos', label: 'Presupuestos', icono: '🎯' },
  ];

  return (
    <div className="w-64 bg-emerald-800 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-emerald-700">
        <h1 className="text-white text-2xl font-bold">💰 FinanzApp</h1>
        <p className="text-emerald-300 text-sm mt-1">Hola, {nombre}</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {enlaces.map(e => (
          <button
            key={e.id}
            onClick={() => setPaginaActual(e.id)}
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition duration-200 ${
              paginaActual === e.id
                ? 'bg-emerald-600 text-white font-semibold'
                : 'text-emerald-100 hover:bg-emerald-700'
            }`}
          >
            <span>{e.icono}</span>
            <span>{e.label}</span>
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-emerald-700">
        <button
          onClick={logout}
          className="w-full px-4 py-3 rounded-lg text-emerald-100 hover:bg-emerald-700 text-left flex items-center gap-3 transition duration-200"
        >
          <span>🚪</span>
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;