import { useState, useEffect } from 'react';
import api from '../services/api';

const Notificaciones = () => {
  const [alertas, setAlertas] = useState([]);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await api.get('/presupuestos');
        const superados = res.data.filter(p => p.alerta);
        setAlertas(superados);
      } catch (err) {
        console.error(err);
      }
    };
    cargar();
  }, []);

  if (!visible || alertas.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {alertas.map(p => (
        <div
          key={p._id}
          className="bg-white border border-red-200 rounded-2xl shadow-lg p-4 flex items-start gap-3"
        >
          <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700">Presupuesto superado</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {p.categoria}: {p.gastoActual} € / {p.limite} €
            </p>
          </div>
          <button
            onClick={() => setAlertas(prev => prev.filter(a => a._id !== p._id))}
            className="text-gray-300 hover:text-gray-500 text-xs transition"
          >
            x
          </button>
        </div>
      ))}
      <button
        onClick={() => setVisible(false)}
        className="text-xs text-gray-400 hover:text-gray-600 transition w-full text-right pr-1"
      >
        Cerrar todas
      </button>
    </div>
  );
};

export default Notificaciones;