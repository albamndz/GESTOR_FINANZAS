import { useAuth } from '../context/AuthContext';

const Sidebar = ({ paginaActual, setPaginaActual }) => {
  const { nombre, logout } = useAuth();

  const enlaces = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transacciones', label: 'Transacciones' },
    { id: 'presupuestos', label: 'Presupuestos' },
  ];

  return (
    <div className="w-64 bg-white min-h-screen flex flex-col border-r border-lavender-200 shadow-sm">
      <div className="p-6 border-b border-lavender-200">
        <h1 className="text-violet-700 text-2xl font-bold tracking-wide">FinanzApp</h1>
        <p className="text-gray-400 text-sm mt-1">Hola, {nombre}</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {enlaces.map(e => (
          <button
            key={e.id}
            onClick={() => setPaginaActual(e.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition duration-200 text-sm font-medium ${
              paginaActual === e.id
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-gray-500 hover:bg-lavender-100 hover:text-violet-700'
            }`}
          >
            {e.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-lavender-200">
        <button
          onClick={logout}
          className="w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-lavender-100 hover:text-violet-700 text-left text-sm font-medium transition duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;