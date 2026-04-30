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
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroFechaDesde, setFiltroFechaDesde] = useState('');
  const [filtroFechaHasta, setFiltroFechaHasta] = useState('');
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [mostrarNuevaCategoria, setMostrarNuevaCategoria] = useState(false);
  const [editando, setEditando] = useState(null);

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
    if (editando) {
      await api.put(`/transacciones/${editando}`, { tipo, categoria, monto: parseFloat(monto), descripcion, fecha });
      setEditando(null);
    } else {
      await api.post('/transacciones', { tipo, categoria, monto: parseFloat(monto), descripcion, fecha });
    }
    setTipo('gasto');
    setCategoria('Alimentación');
    setMonto('');
    setDescripcion('');
    setFecha(new Date().toISOString().split('T')[0]);
    cargarTransacciones();
  };

  const handleEditar = (t) => {
    setEditando(t._id);
    setTipo(t.tipo);
    setCategoria(t.categoria);
    setMonto(t.monto);
    setDescripcion(t.descripcion || '');
    setFecha(new Date(t.fecha).toISOString().split('T')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelarEdicion = () => {
    setEditando(null);
    setTipo('gasto');
    setCategoria('Alimentación');
    setMonto('');
    setDescripcion('');
    setFecha(new Date().toISOString().split('T')[0]);
  };

  const handleEliminar = async (id) => {
    await api.delete(`/transacciones/${id}`);
    cargarTransacciones();
  };

  const exportarCSV = () => {
    const cabecera = ['Fecha', 'Tipo', 'Categoria', 'Cantidad', 'Descripcion'];
    const filas = transacciones.map(t => [
      new Date(t.fecha).toLocaleDateString('es-ES'),
      t.tipo,
      t.categoria,
      t.monto,
      t.descripcion || ''
    ]);
    const csv = [cabecera, ...filas].map(f => f.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'transacciones.csv';
    link.click();
  };

  const transaccionesFiltradas = transacciones.filter(t => {
    const coincideTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    const coincideCategoria = filtroCategoria === '' || t.categoria.toLowerCase().includes(filtroCategoria.toLowerCase());
    const fechaT = new Date(t.fecha);
    const coincideDesde = filtroFechaDesde === '' || fechaT >= new Date(filtroFechaDesde);
    const coincideHasta = filtroFechaHasta === '' || fechaT <= new Date(filtroFechaHasta);
    return coincideTipo && coincideCategoria && coincideDesde && coincideHasta;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Transacciones</h2>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-lavender-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
          {editando ? 'Editar transacción' : 'Añadir transacción'}
        </h3>
        {editando && (
          <div className="bg-violet-50 dark:bg-violet-900 border border-violet-200 dark:border-violet-700 rounded-xl p-3 mb-4 text-sm text-violet-700 dark:text-violet-300 flex justify-between items-center">
            <span>Editando transacción</span>
            <button onClick={handleCancelarEdicion} className="text-violet-500 hover:text-violet-700 font-medium">
              Cancelar
            </button>
          </div>
        )}
        <form onSubmit={handleCrear} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              className="w-full bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
            >
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
          </div>
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
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Cantidad (€)</label>
            <input
              type="number"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              className="w-full bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Opcional"
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="w-full bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />
          </div>
          <div className="col-span-1 sm:col-span-2">
            <button
              type="submit"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-xl transition duration-200"
            >
              {editando ? 'Guardar cambios' : 'Guardar transacción'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-lavender-200 dark:border-gray-700 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Historial</h3>
        <div className="flex flex-wrap gap-4 mb-4 justify-between items-center">
          <div className="flex flex-wrap gap-4">
            <select
              value={filtroTipo}
              onChange={e => setFiltroTipo(e.target.value)}
              className="bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
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
              className="bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
            />
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={e => setFiltroFechaDesde(e.target.value)}
              className="bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
              title="Desde"
            />
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={e => setFiltroFechaHasta(e.target.value)}
              className="bg-lavender-50 dark:bg-gray-700 border border-lavender-200 dark:border-gray-600 rounded-xl px-4 py-2 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-600"
              title="Hasta"
            />
          </div>
          <button
            onClick={exportarCSV}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-xl transition"
          >
            Exportar CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-lavender-100 dark:border-gray-700">
                <th className="pb-3 text-left font-medium">Fecha</th>
                <th className="pb-3 text-left font-medium">Tipo</th>
                <th className="pb-3 text-left font-medium">Categoría</th>
                <th className="pb-3 text-left font-medium">Cantidad</th>
                <th className="pb-3 text-left font-medium">Descripción</th>
                <th className="pb-3 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {transaccionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-300">No hay transacciones</td>
                </tr>
              ) : (
                transaccionesFiltradas.map(t => (
                  <tr key={t._id} className={`border-b border-lavender-100 dark:border-gray-700 hover:bg-lavender-50 dark:hover:bg-gray-700 transition ${editando === t._id ? 'bg-violet-50 dark:bg-violet-900' : ''}`}>
                    <td className="py-3 text-gray-400">{new Date(t.fecha).toLocaleDateString('es-ES')}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.tipo === 'ingreso' ? 'bg-violet-100 text-violet-700' : 'bg-red-50 text-red-400'}`}>
                        {t.tipo}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600 dark:text-gray-300">{t.categoria}</td>
                    <td className="py-3 font-semibold text-gray-700 dark:text-gray-200">{t.monto} €</td>
                    <td className="py-3 text-gray-400">{t.descripcion || '—'}</td>
                    <td className="py-3 flex gap-3">
                      <button
                        onClick={() => handleEditar(t)}
                        className="text-violet-500 hover:text-violet-700 text-xs font-medium transition"
                      >
                        Editar
                      </button>
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
    </div>
  );
};

export default Transacciones;