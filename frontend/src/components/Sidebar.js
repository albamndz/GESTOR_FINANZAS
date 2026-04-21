import { useAuth } from '../context/AuthContext';

const Sidebar = ({ paginaActual, setPaginaActual }) => {
  const { nombre, logout } = useAuth();

  const enlaces = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transacciones', label: 'Transacciones' },
    { id: 'presupuestos', label: 'Presupuestos' },
  ];

  return (
    <div className="w-64 bg-gray-950 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-gold-400 text-2xl font-bold tracking-wide">FinanzApp</h1>
        <p className="text-gray-400 text-sm mt-1">Hola, {nombre}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {enlaces.map(e => (
          <button
            key={e.id}
            onClick={() => setPaginaActual(e.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition duration-200 text-sm ${
              paginaActual === e.id
                ? 'bg-gold-500 text-gray-950 font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {e.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 text-left text-sm transition duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;