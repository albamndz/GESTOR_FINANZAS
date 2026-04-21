import { useState, useEffect } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

const Dashboard = () => {
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const res = await api.get('/transacciones');
      setTransacciones(res.data);
    };
    cargar();
  }, []);

  const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((acc, t) => acc + t.monto, 0);
  const gastos = transacciones.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + t.monto, 0);
  const balance = ingresos - gastos;

  const categorias = {};
  transacciones.filter(t => t.tipo === 'gasto').forEach(t => {
    categorias[t.categoria] = (categorias[t.categoria] || 0) + t.monto;
  });

  const pieData = {
    labels: Object.keys(categorias),
    datasets: [{
      data: Object.values(categorias),
      backgroundColor: ['#7c3aed', '#a78bfa', '#c4b5fd', '#8b5cf6', '#6d28d9', '#ddd6fe'],
      borderWidth: 0
    }]
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#6b7280' } }
    }
  };

  const ultimas = [...transacciones].slice(-7);
  const lineData = {
    labels: ultimas.map(t => new Date(t.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })),
    datasets: [{
      label: 'Movimientos',
      data: ultimas.map(t => t.tipo === 'ingreso' ? t.monto : -t.monto),
      borderColor: '#7c3aed',
      backgroundColor: 'rgba(124, 58, 237, 0.08)',
      fill: true,
      tension: 0.4
    }]
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#6b7280' } }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#ede9fe' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#ede9fe' } }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">Dashboard</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
          <p className="text-sm text-gray-400 mb-1">Ingresos totales</p>
          <p className="text-3xl font-bold text-violet-600">{ingresos.toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
          <p className="text-sm text-gray-400 mb-1">Gastos totales</p>
          <p className="text-3xl font-bold text-red-400">{gastos.toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
          <p className="text-sm text-gray-400 mb-1">Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-violet-600' : 'text-red-400'}`}>
            {balance.toFixed(2)} €
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Gastos por categoría</h3>
          {Object.keys(categorias).length === 0 ? (
            <p className="text-gray-300 text-center py-10">Sin datos aún</p>
          ) : (
            <div className="h-64">
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Evolución reciente</h3>
          {transacciones.length === 0 ? (
            <p className="text-gray-300 text-center py-10">Sin datos aún</p>
          ) : (
            <div className="h-64">
              <Line data={lineData} options={lineOptions} />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-lavender-200 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Últimas transacciones</h3>
        {transacciones.length === 0 ? (
          <p className="text-gray-300 text-center py-6">No hay transacciones aún</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-lavender-100">
                <th className="pb-3 text-left font-medium">Tipo</th>
                <th className="pb-3 text-left font-medium">Categoría</th>
                <th className="pb-3 text-left font-medium">Cantidad</th>
                <th className="pb-3 text-left font-medium">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {[...transacciones].reverse().slice(0, 5).map(t => (
                <tr key={t._id} className="border-b border-lavender-100 hover:bg-lavender-50 transition">
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.tipo === 'ingreso' ? 'bg-violet-100 text-violet-700' : 'bg-red-50 text-red-400'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{t.categoria}</td>
                  <td className="py-3 font-semibold text-gray-700">{t.monto} €</td>
                  <td className="py-3 text-gray-400">{t.descripcion || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;