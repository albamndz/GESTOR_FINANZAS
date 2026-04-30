import { useAuth } from '../context/AuthContext';

const Sidebar = ({ paginaActual, setPaginaActual, rol }) => {
  const { nombre, logout, modoOscuro, toggleModoOscuro } = useAuth();

  const enlaces = [
    { id: 'perfil', label: 'Perfil' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transacciones', label: 'Transacciones' },
    { id: 'presupuestos', label: 'Presupuestos' },
    { id: 'resumen', label: 'Resumen mensual' },
  ];

  if (rol === 'admin') {
    enlaces.splice(1, 0, { id: 'admin', label: 'Administración' });
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-900 min-h-screen flex flex-col border-r border-lavender-200 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-lavender-200 dark:border-gray-700">
        <h1 className="text-violet-700 dark:text-violet-400 text-2xl font-bold tracking-wide">FinanzApp</h1>
        <p className="text-gray-400 text-sm mt-1">Hola, {nombre}</p>
        {rol === 'admin' && (
          <span className="text-xs bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full font-medium mt-1 inline-block">
            Administrador
          </span>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {enlaces.map(e => (
          <button
            key={e.id}
            onClick={() => setPaginaActual(e.id)}
            className={`w-full text-left px-4 py-3 rounded-xl transition duration-200 text-sm font-medium ${
              paginaActual === e.id
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-gray-500 dark:text-gray-400 hover:bg-lavender-100 dark:hover:bg-gray-800 hover:text-violet-700 dark:hover:text-violet-400'
            }`}
          >
            {e.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-lavender-200 dark:border-gray-700 space-y-1">
        <button
          onClick={toggleModoOscuro}
          className="w-full px-4 py-3 rounded-xl text-gray-400 dark:text-gray-300 hover:bg-lavender-100 dark:hover:bg-gray-800 text-left text-sm font-medium transition duration-200"
        >
          {modoOscuro ? 'Modo claro' : 'Modo oscuro'}
        </button>
        <button
          onClick={logout}
          className="w-full px-4 py-3 rounded-xl text-gray-400 dark:text-gray-300 hover:bg-lavender-100 dark:hover:bg-gray-800 text-left text-sm font-medium transition duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;