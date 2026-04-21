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
      <h2 className="text-2xl font-bold text-gray-800">Transacciones</h2>

      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Añadir transacción</h3>
        <form onSubmit={handleCrear} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Tipo</label>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            >
              <option value="gasto">Gasto</option>
              <option value="ingreso">Ingreso</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
            <div className="flex gap-2">
              <select
                value={categoria}
                onChange={e => setCategoria(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                {categorias.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setMostrarNuevaCategoria(!mostrarNuevaCategoria)}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 text-sm font-medium transition"
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
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                />
                <button
                  type="button"
                  onClick={handleAnadirCategoria}
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition"
                >
                  Añadir
                </button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Monto (€)</label>
            <input
              type="number"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Opcional"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Guardar transacción
            </button>
          </div>
        </form>
      </div>

      {/* Filtros e historial */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Historial</h3>
        <div className="flex gap-4 mb-4">
          <select
            value={filtroTipo}
            onChange={e => setFiltroTipo(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Categoría</th>
              <th className="px-4 py-3 text-left">Monto</th>
              <th className="px-4 py-3 text-left">Descripción</th>
              <th className="px-4 py-3 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {transaccionesFiltradas.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">No hay transacciones</td>
              </tr>
            ) : (
              transaccionesFiltradas.map(t => (
                <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.tipo === 'ingreso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{t.categoria}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{t.monto} €</td>
                  <td className="px-4 py-3 text-gray-500">{t.descripcion || '—'}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleEliminar(t._id)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium"
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