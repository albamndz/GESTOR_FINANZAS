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
      backgroundColor: ['#f59e0b', '#d97706', '#92400e', '#fbbf24', '#fcd34d', '#b45309'],
      borderWidth: 0
    }]
  };

  const pieOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af' }
      }
    }
  };

  const ultimas = [...transacciones].slice(-7);
  const lineData = {
    labels: ultimas.map(t => new Date(t.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })),
    datasets: [{
      label: 'Movimientos',
      data: ultimas.map(t => t.tipo === 'ingreso' ? t.monto : -t.monto),
      borderColor: '#f59e0b',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#9ca3af' }
      }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#1f2937' } }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Dashboard</h2>

      {/* Tarjetas */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <p className="text-sm text-gray-400 mb-1">Ingresos totales</p>
          <p className="text-3xl font-bold text-gold-400">{ingresos.toFixed(2)} €</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <p className="text-sm text-gray-400 mb-1">Gastos totales</p>
          <p className="text-3xl font-bold text-red-400">{gastos.toFixed(2)} €</p>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <p className="text-sm text-gray-400 mb-1">Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-gold-400' : 'text-red-400'}`}>
            {balance.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Graficos */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Gastos por categoría</h3>
          {Object.keys(categorias).length === 0 ? (
            <p className="text-gray-600 text-center py-10">Sin datos aún</p>
          ) : (
            <div className="h-64">
              <Pie data={pieData} options={pieOptions} />
            </div>
          )}
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Evolución reciente</h3>
          {transacciones.length === 0 ? (
            <p className="text-gray-600 text-center py-10">Sin datos aún</p>
          ) : (
            <div className="h-64">
              <Line data={lineData} options={lineOptions} />
            </div>
          )}
        </div>
      </div>

      {/* Ultimas transacciones */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">Últimas transacciones</h3>
        {transacciones.length === 0 ? (
          <p className="text-gray-600 text-center py-6">No hay transacciones aún</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-gray-800">
                <th className="pb-3 text-left font-medium">Tipo</th>
                <th className="pb-3 text-left font-medium">Categoría</th>
                <th className="pb-3 text-left font-medium">Monto</th>
                <th className="pb-3 text-left font-medium">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {[...transacciones].reverse().slice(0, 5).map(t => (
                <tr key={t._id} className="border-b border-gray-800 hover:bg-gray-800 transition">
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.tipo === 'ingreso' ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className="py-3 text-gray-300">{t.categoria}</td>
                  <td className="py-3 font-semibold text-white">{t.monto} €</td>
                  <td className="py-3 text-gray-500">{t.descripcion || '—'}</td>
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