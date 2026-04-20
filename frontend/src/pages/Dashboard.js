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

  // Datos para gráfico de tarta
  const categorias = {};
  transacciones.filter(t => t.tipo === 'gasto').forEach(t => {
    categorias[t.categoria] = (categorias[t.categoria] || 0) + t.monto;
  });

  const pieData = {
    labels: Object.keys(categorias),
    datasets: [{
      data: Object.values(categorias),
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'],
      borderWidth: 0
    }]
  };

  // Datos para gráfico de línea
  const ultimas = [...transacciones].slice(-7);
  const lineData = {
    labels: ultimas.map(t => new Date(t.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })),
    datasets: [{
      label: 'Movimientos',
      data: ultimas.map(t => t.tipo === 'ingreso' ? t.monto : -t.monto),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Ingresos totales</p>
          <p className="text-3xl font-bold text-emerald-600">{ingresos.toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Gastos totales</p>
          <p className="text-3xl font-bold text-red-500">{gastos.toFixed(2)} €</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Balance</p>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
            {balance.toFixed(2)} €
          </p>
        </div>
      </div>

      {/* Graficos */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Gastos por categoría</h3>
          {Object.keys(categorias).length === 0 ? (
            <p className="text-gray-400 text-center py-10">Sin datos aún</p>
          ) : (
            <Pie data={pieData} />
          )}
        </div>
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Evolución reciente</h3>
          {transacciones.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Sin datos aún</p>
          ) : (
            <Line data={lineData} />
          )}
        </div>
      </div>

      {/* Ultimas transacciones */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Últimas transacciones</h3>
        {transacciones.length === 0 ? (
          <p className="text-gray-400 text-center py-6">No hay transacciones aún</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-left">Monto</th>
                <th className="px-4 py-3 text-left">Descripción</th>
              </tr>
            </thead>
            <tbody>
              {[...transacciones].reverse().slice(0, 5).map(t => (
                <tr key={t._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.tipo === 'ingreso' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{t.categoria}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800">{t.monto} €</td>
                  <td className="px-4 py-3 text-gray-500">{t.descripcion || '—'}</td>
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