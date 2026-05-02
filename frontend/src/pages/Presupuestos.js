import { useState, useEffect } from 'react';
import api from '../services/api';

const CATEGORIAS_DEFAULT = [
  'Alimentación',
  'Transporte',
  'Ocio',
  'Salud',
  'Ropa',
  'Vivienda',
  'Nómina',
  'Otros'
];

const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [categorias, setCategorias] = useState(CATEGORIAS_DEFAULT);
  const [categoria, setCategoria] = useState('Alimentación');
  const [limite, setLimite] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);

  const cargarPresupuestos = async () => {
    const res = await api.get('/presupuestos');
    setPresupuestos(res.data);
  };

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  const handleAnadirCategoria = () => {
    if (nuevaCategoria.trim() && !categorias.includes(nuevaCategoria.trim())) {
      const actualizada = [...categorias, nuevaCategoria.trim()];
      setCategorias(actualizada);
      setCategoria(nuevaCategoria.trim());
      setNuevaCategoria('');
      setMostrarNuevaCategoria(false);
    }
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    await api.post('/presupuestos', { categoria, limite: parseFloat(limite) });
    setCategoria('Alimentación');
    setLimite('');
    cargarPresupuestos();
  };

  const handleEliminar = async (id) => {
    await api.delete(`/presupuestos/${id}`);
    cargarPresupuestos();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Presupuestos</h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-lavender-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Crear presupuesto</h3>
        <form onSubmit={handleCrear} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Categoría</label>
            <div className="flex gap-2">
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="w-full bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
              >
                {categorias.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setMostrarNuevaCategoria(!mostrarNuevaCategoria)}
                className="px-3 py-2 bg-lavender-100 dark:bg-gray-700 hover:bg-lavender-200 dark:hover:bg-gray-600 rounded-xl text-violet-700 dark:text-violet-400 text-sm font-medium transition"
              >
                + Nueva
              </button>
            </div>
            {mostrarNuevaCategoria && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={nuevaCategoria}
                  onChange={e => setNuevaCategoria(e.target.value)}
                  placeholder="Nombre de la categoría"
                  className="w-full bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAnadirCategoria}
                  className="px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-medium transition"
                >
                  Añadir
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Límite (€)</label>
            <input
              type="number"
              value={limite}
              onChange={e => setLimite(e.target.value)}
              className="w-full bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="0.00"
              required
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-xl transition duration-200"
            >
              Crear presupuesto
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-lavender-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Mis presupuestos</h3>
        {presupuestos.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No hay presupuestos creados</p>
        ) : (
          <div className="space-y-4">
            {presupuestos.map(p => {
              const porcentaje = Math.min((p.gastoActual / p.limite) * 100, 100);
              return (
                <div key={p._id} className="border border-lavender-100 dark:border-gray-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-200">{p.categoria}</span>
                      {p.alerta && (
                        <span className="ml-2 text-xs bg-red-50 text-red-400 px-2 py-1 rounded-full font-medium">
                          Límite superado
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleEliminar(p._id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium transition"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Gastado: {p.gastoActual} €</span>
                    <span>Límite: {p.limite} €</span>
                  </div>
                  <div className="w-full bg-lavender-100 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${porcentaje >= 100 ? 'bg-red-400' : porcentaje >= 75 ? 'bg-yellow-400' : 'bg-violet-600'}`}
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{porcentaje.toFixed(0)}% utilizado</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Presupuestos;