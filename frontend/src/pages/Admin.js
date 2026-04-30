import { useState, useEffect } from 'react';
import api from '../services/api';

const Admin = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [transacciones, setTransacciones] = useState([]);
  const [vista, setVista] = useState('usuarios');

  const cargarDatos = async () => {
    const u = await api.get('/admin/usuarios');
    const t = await api.get('/admin/transacciones');
    setUsuarios(u.data);
    setTransacciones(t.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleEliminarUsuario = async (id) => {
    if (window.confirm('¿Seguro que quieres eliminar este usuario?')) {
      await api.delete(`/admin/usuarios/${id}`);
      cargarDatos();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-700">Panel de administración</h2>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setVista('usuarios')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${vista === 'usuarios' ? 'bg-violet-600 text-white' : 'bg-white text-gray-500 border border-lavender-200 hover:bg-lavender-50'}`}
        >
          Usuarios ({usuarios.length})
        </button>
        <button
          onClick={() => setVista('transacciones')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${vista === 'transacciones' ? 'bg-violet-600 text-white' : 'bg-white text-gray-500 border border-lavender-200 hover:bg-lavender-50'}`}
        >
          Todas las transacciones ({transacciones.length})
        </button>
      </div>

      {/* Lista de usuarios */}
      {vista === 'usuarios' && (
        <div className="bg-white rounded-2xl shadow-sm border border-lavender-200 p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Usuarios registrados</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-lavender-100">
                <th className="pb-3 text-left font-medium">Nombre</th>
                <th className="pb-3 text-left font-medium">Correo</th>
                <th className="pb-3 text-left font-medium">Rol</th>
                <th className="pb-3 text-left font-medium">Registro</th>
                <th className="pb-3 text-left font-medium">Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u._id} className="border-b border-lavender-100 hover:bg-lavender-50 transition">
                  <td className="py-3 font-medium text-gray-700">{u.nombre}</td>
                  <td className="py-3 text-gray-500">{u.correo}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.rol === 'admin' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500'}`}>
                      {u.rol}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString('es-ES')}</td>
                  <td className="py-3">
                    {u.rol !== 'admin' && (
                      <button
                        onClick={() => handleEliminarUsuario(u._id)}
                        className="text-red-400 hover:text-red-600 text-xs font-medium transition"
                      >
                        Eliminar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Todas las transacciones */}
      {vista === 'transacciones' && (
        <div className="bg-white rounded-2xl shadow-sm border border-lavender-200 p-6">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Todas las transacciones</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-lavender-100">
                <th className="pb-3 text-left font-medium">Usuario</th>
                <th className="pb-3 text-left font-medium">Fecha</th>
                <th className="pb-3 text-left font-medium">Tipo</th>
                <th className="pb-3 text-left font-medium">Categoría</th>
                <th className="pb-3 text-left font-medium">Cantidad</th>
              </tr>
            </thead>
            <tbody>
              {transacciones.map(t => (
                <tr key={t._id} className="border-b border-lavender-100 hover:bg-lavender-50 transition">
                  <td className="py-3 text-gray-600">{t.id_usuario?.nombre || '—'}</td>
                  <td className="py-3 text-gray-400">{new Date(t.fecha).toLocaleDateString('es-ES')}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${t.tipo === 'ingreso' ? 'bg-violet-100 text-violet-700' : 'bg-red-50 text-red-400'}`}>
                      {t.tipo}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{t.categoria}</td>
                  <td className="py-3 font-semibold text-gray-700">{t.monto} €</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;