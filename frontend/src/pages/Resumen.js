import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

const Resumen = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth());
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());

  useEffect(() => {
    const cargar = async () => {
      const res = await api.get('/transacciones');
      setTransacciones(res.data);
    };
    cargar();
  }, []);

  const transaccionesMes = transacciones.filter(t => {
    const fecha = new Date(t.fecha);
    return fecha.getMonth() === mesSeleccionado && fecha.getFullYear() === anioSeleccionado;
  });

  const ingresosMes = transaccionesMes.filter(t => t.tipo === 'ingreso').reduce((acc, t) => acc + t.monto, 0);
  const gastosMes = transaccionesMes.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + t.monto, 0);
  const balanceMes = ingresosMes - gastosMes;

  // Datos por mes para el grafico anual
  const datosPorMes = MESES.map((_, i) => {
    const t = transacciones.filter(t => {
      const fecha = new Date(t.fecha);
      return fecha.getMonth() === i && fecha.getFullYear() === anioSeleccionado;
    });
    return {
      ingresos: t.filter(t => t.tipo === 'ingreso').reduce((acc, t) => acc + t.monto, 0),
      gastos: t.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + t.monto, 0),
    };
  });

  const barData = {
    labels: MESES.map(m => m.slice(0, 3)),
    datasets: [
      {
        label: 'Ingresos',
        data: datosPorMes.map(d => d.ingresos),
        backgroundColor: '#a78bfa',
        borderRadius: 6,
      },
      {
        label: 'Gastos',
        data: datosPorMes.map(d => d.gastos),
        backgroundColor: '#fca5a5',
        borderRadius: 6,
      }
    ]
  };

  const barOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#6b7280' } }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#ede9fe' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#ede9fe' } }
    }
  };

  // Gastos por categoria del mes
  const categoriasMes = {};
  transaccionesMes.filter(t => t.tipo === 'gasto').forEach(t => {
    categoriasMes[t.categoria] = (categoriasMes[t.categoria] || 0) + t.monto;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">Resumen mensual</h2>

      {/* Selector de mes */}
      <div className="flex gap-4 items-center">
        <select
          value={mesSeleccionado}
          onChange={e => setMesSeleccionado(parseInt(e.target.value))}
          className="bg-white border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
        >
          {MESES.map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>
        <select
          value={anioSeleccionado}
          onChange={e => setAnioSeleccionado(parseInt(e.target.value))}
          className="bg-white border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
        >
          {[2024, 2025, 2026].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* Tarjetas del mes */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
          <p className="text-sm text-gray-400 mb-1">Ingresos en {MESES[mesSeleccionado]}</p>
          <p className="text-3xl font-bold text-violet-600">{ingresosMes.toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
          <p className="text-sm text-gray-400 mb-1">Gastos en {MESES[mesSeleccionado]}</p>
          <p className="text-3xl font-bold text-red-400">{gastosMes.toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
          <p className="text-sm text-gray-400 mb-1">Balance en {MESES[mesSeleccionado]}</p>
          <p className={`text-3xl font-bold ${balanceMes >= 0 ? 'text-violet-600' : 'text-red-400'}`}>
            {balanceMes.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Grafico anual */}
      <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Comparativa anual {anioSeleccionado}</h3>
        <div className="h-64">
          <Bar data={barData} options={barOptions} />
        </div>
      </div>

      {/* Gastos por categoria del mes */}
      <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Gastos por categoría en {MESES[mesSeleccionado]}</h3>
        {Object.keys(categoriasMes).length === 0 ? (
          <p className="text-gray-300 text-center py-6">Sin gastos este mes</p>
        ) : (
          <div className="space-y-3">
            {Object.entries(categoriasMes).sort((a, b) => b[1] - a[1]).map(([cat, total]) => {
              const porcentaje = (total / gastosMes) * 100;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{cat}</span>
                    <span className="text-gray-400">{total.toFixed(2)} € ({porcentaje.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-lavender-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-violet-500 transition-all duration-500"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Resumen;