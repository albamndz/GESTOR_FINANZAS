import { useState, useEffect } from 'react';
import api from '../services/api';

const Presupuestos = () => {
  const [presupuestos, setPresupuestos] = useState([]);
  const [categoria, setCategoria] = useState('');
  const [limite, setLimite] = useState('');

  const cargarPresupuestos = async () => {
    const res = await api.get('/presupuestos');
    setPresupuestos(res.data);
  };

  useEffect(() => {
    cargarPresupuestos();
  }, []);

  const handleCrear = async (e) => {
    e.preventDefault();
    await api.post('/presupuestos', { categoria, limite: parseFloat(limite) });
    setCategoria('');
    setLimite('');
    cargarPresupuestos();
  };

  const handleEliminar = async (id) => {
    await api.delete(`/presupuestos/${id}`);
    cargarPresupuestos();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Presupuestos</h2>

      {/* Formulario */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Crear presupuesto</h3>
        <form onSubmit={handleCrear} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
            <input
              type="text"
              value={categoria}
              onChange={e => setCategoria(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Ej: Alimentación"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Límite (€)</label>
            <input
              type="number"
              value={limite}
              onChange={e => setLimite(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="0.00"
              required
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Crear presupuesto
            </button>
          </div>
        </form>
      </div>

      {/* Lista de presupuestos */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Mis presupuestos</h3>
        {presupuestos.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No hay presupuestos creados</p>
        ) : (
          <div className="space-y-4">
            {presupuestos.map(p => {
              const porcentaje = Math.min((p.gastoActual / p.limite) * 100, 100);
              return (
                <div key={p._id} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-semibold text-gray-800">{p.categoria}</span>
                      {p.alerta && (
                        <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          ⚠ Límite superado
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleEliminar(p._id)}
                      className="text-red-400 hover:text-red-600 text-xs font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-1">
                    <span>Gastado: {p.gastoActual} €</span>
                    <span>Límite: {p.limite} €</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${porcentaje >= 100 ? 'bg-red-500' : porcentaje >= 75 ? 'bg-yellow-400' : 'bg-emerald-500'}`}
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