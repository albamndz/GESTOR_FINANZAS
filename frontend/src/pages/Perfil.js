import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Perfil = () => {
  const { nombre, login } = useAuth();
  const [nuevoNombre, setNuevoNombre] = useState(nombre);
  const [contraseñaActual, setContraseñaActual] = useState('');
  const [nuevaContraseña, setNuevaContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [mensajeNombre, setMensajeNombre] = useState('');
  const [mensajeContraseña, setMensajeContraseña] = useState('');
  const [errorNombre, setErrorNombre] = useState('');
  const [errorContraseña, setErrorContraseña] = useState('');

  const handleActualizarNombre = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/usuarios/perfil', { nombre: nuevoNombre });
      login(localStorage.getItem('token'), res.data.nombre);
      setMensajeNombre('Nombre actualizado correctamente');
      setErrorNombre('');
    } catch (err) {
      setErrorNombre('Error al actualizar el nombre');
      setMensajeNombre('');
    }
  };

  const handleCambiarContraseña = async (e) => {
    e.preventDefault();
    if (nuevaContraseña !== confirmarContraseña) {
      setErrorContraseña('Las contraseñas no coinciden');
      return;
    }
    try {
      await api.put('/usuarios/contraseña', { contraseñaActual, nuevaContraseña });
      setMensajeContraseña('Contraseña actualizada correctamente');
      setErrorContraseña('');
      setContraseñaActual('');
      setNuevaContraseña('');
      setConfirmarContraseña('');
    } catch (err) {
      setErrorContraseña('Contraseña actual incorrecta');
      setMensajeContraseña('');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-700">Perfil</h2>

      {/* Actualizar nombre */}
      <div className="bg-white rounded-2xl shadow-sm border border-lavender-200 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Datos personales</h3>
        {errorNombre && <p className="bg-red-50 text-red-400 p-3 rounded-xl mb-4 text-sm">{errorNombre}</p>}
        {mensajeNombre && <p className="bg-violet-50 text-violet-600 p-3 rounded-xl mb-4 text-sm">{mensajeNombre}</p>}
        <form onSubmit={handleActualizarNombre} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
            <input
              type="text"
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-xl transition duration-200"
          >
            Guardar cambios
          </button>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white rounded-2xl shadow-sm border border-lavender-200 p-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Cambiar contraseña</h3>
        {errorContraseña && <p className="bg-red-50 text-red-400 p-3 rounded-xl mb-4 text-sm">{errorContraseña}</p>}
        {mensajeContraseña && <p className="bg-violet-50 text-violet-600 p-3 rounded-xl mb-4 text-sm">{mensajeContraseña}</p>}
        <form onSubmit={handleCambiarContraseña} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Contraseña actual</label>
            <input
              type="password"
              value={contraseñaActual}
              onChange={e => setContraseñaActual(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Nueva contraseña</label>
            <input
              type="password"
              value={nuevaContraseña}
              onChange={e => setNuevaContraseña(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Confirmar nueva contraseña</label>
            <input
              type="password"
              value={confirmarContraseña}
              onChange={e => setConfirmarContraseña(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 rounded-xl px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-xl transition duration-200"
          >
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default Perfil;