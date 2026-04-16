import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const { nombre, logout } = useAuth();
  const [transacciones, setTransacciones] = useState([]);
  const [presupuestos, setPresupuestos] = useState([]);
  const [tipo, setTipo] = useState('gasto');
  const [categoria, setCategoria] = useState('');
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const cargarDatos = async () => {
    const t = await api.get('/transacciones');
    const p = await api.get('/presupuestos');
    setTransacciones(t.data);
    setPresupuestos(p.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrearTransaccion = async (e) => {
    e.preventDefault();
    await api.post('/transacciones', { tipo, categoria, monto: parseFloat(monto), descripcion });
    setCategoria('');
    setMonto('');
    setDescripcion('');
    cargarDatos();
  };

  const ingresos = transacciones.filter(t => t.tipo === 'ingreso').reduce((acc, t) => acc + t.monto, 0);
  const gastos = transacciones.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + t.monto, 0);
  const balance = ingresos - gastos;

  return (
    <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Hola, {nombre}</h1>
        <button onClick={logout} style={{ padding: '8px 16px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar sesión
        </button>
      </div>

      {/* Resumen */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
          <h3>Ingresos</h3>
          <p style={{ fontSize: '24px', color: 'green' }}>{ingresos.toFixed(2)} €</p>
        </div>
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
          <h3>Gastos</h3>
          <p style={{ fontSize: '24px', color: 'red' }}>{gastos.toFixed(2)} €</p>
        </div>
        <div style={{ flex: 1, padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
          <h3>Balance</h3>
          <p style={{ fontSize: '24px', color: balance >= 0 ? 'green' : 'red' }}>{balance.toFixed(2)} €</p>
        </div>
      </div>

      {/* Formulario */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Añadir transacción</h3>
        <form onSubmit={handleCrearTransaccion} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ padding: '8px' }}>
            <option value="gasto">Gasto</option>
            <option value="ingreso">Ingreso</option>
          </select>
          <input placeholder="Categoría" value={categoria} onChange={e => setCategoria(e.target.value)} style={{ padding: '8px' }} required />
          <input placeholder="Monto" type="number" value={monto} onChange={e => setMonto(e.target.value)} style={{ padding: '8px' }} required />
          <input placeholder="Descripción" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ padding: '8px' }} />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Guardar
          </button>
        </form>
      </div>

      {/* Presupuestos */}
      {presupuestos.length > 0 && (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>Presupuestos</h3>
          {presupuestos.map(p => (
            <div key={p._id} style={{ marginBottom: '10px', padding: '10px', backgroundColor: p.alerta ? '#ffebee' : '#e8f5e9', borderRadius: '4px' }}>
              <strong>{p.categoria}</strong> — Gastado: {p.gastoActual}€ / Límite: {p.limite}€
              {p.alerta && <span style={{ color: 'red', marginLeft: '10px' }}>⚠ Límite superado</span>}
            </div>
          ))}
        </div>
      )}

      {/* Historial */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Historial de transacciones</h3>
        {transacciones.length === 0 ? <p>No hay transacciones aún.</p> : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Tipo</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Categoría</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Monto</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map(t => (
                <tr key={t._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '8px', color: t.tipo === 'ingreso' ? 'green' : 'red' }}>{t.tipo}</td>
                  <td style={{ padding: '8px' }}>{t.categoria}</td>
                  <td style={{ padding: '8px' }}>{t.monto} €</td>
                  <td style={{ padding: '8px' }}>{t.descripcion}</td>
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