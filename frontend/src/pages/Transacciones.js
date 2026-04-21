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

const Transacciones = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [categorias, setCategorias] = useState(CATEGORIAS_DEFAULT);
  const [tipo, setTipo] = useState('gasto');
  const [categoria, setCategoria] = useState('Alimentación');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);

  const cargarTransacciones = async () => {
    const res = await api.get('/transacciones');
    setTransacciones(res.data);
  };

  useEffect(() => {
    cargarTransacciones();
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
    await api.post('/transacciones', { tipo, categoria, monto: parseFloat(monto), descripcion });
    setMonto('');
    setDescripcion('');
    cargarTransacciones();
  };

  const handleEliminar = async (id) => {
    await api.delete(`/transacciones/${id}`);
    cargarTransacciones();
  };

  const transaccionesFiltradas = transacciones.filter(t => {
    const coincideTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    const coincideCategoria = filtroCategoria === '' || t.categoria.toLowerCase().includes(filtroCategoria.toLowerCase());
    return coincideTipo && coincideCategoria;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">Transacciones</h2>

      <div className="bg-white rounded-2xl shadow-sm border border-lavender-200 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Añadir transacción</h3>
        <form onSubmit={handleCrear} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Categoría</label>
            <div className="flex gap-2">
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="w-full bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
              >
                {categorias.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setMostrarNuevaCategoria(!mostrarNuevaCategoria)}
                className="px-3 py-2 bg-lavender-100 hover:bg-lavender-200 rounded-xl text-violet-700 text-sm font-medium transition"
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
                  className="w-full bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600 text-sm"
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
            <label className="block text-sm font-medium text-gray-500 mb-1">Cantidad (€)</label>
            <input
              type="number"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Opcional"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-xl transition duration-200"
            >
              Guardar transacción
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-lavender-200 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Historial</h3>
        <div className="flex gap-4 mb-4">
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
          >
            <option value="todos">Todos</option>
            <option value="ingreso">Ingresos</option>
            <option value="gasto">Gastos</option>
          </select>
          <input
            type="text"
            value={filtroCategoria}
            onChange={e => setFiltroCategoria(e.target.value)}
            placeholder="Filtrar por categoría"
            className="bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
          />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-lavender-100">
              <th className="pb-3 text-left font-medium">Tipo</th>
              <th className="pb-3 text-left font-medium">Categoría</th>
              <th className="pb-3 text-left font-medium">Cantidad</th>
              <th className="pb-3 text-left font-medium">Descripción</th>
              <th className="pb-3 text-left font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {transaccionesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-300">No hay transacciones</td>
              </tr>
            ) : (
              transaccionesFiltradas.map(t => (
                <tr key={t._id} className="border-b border-lavender-100 hover:bg-lavender-50 transition">
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.tipo === 'ingreso' ? 'bg-violet-100 text-violet-700' : 'bg-red-50 text-red-400'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{t.categoria}</td>
                  <td className="py-3 font-semibold text-gray-700">{t.monto} €</td>
                  <td className="py-3 text-gray-400">{t.descripcion || '—'}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleEliminar(t._id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium transition"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transacciones;