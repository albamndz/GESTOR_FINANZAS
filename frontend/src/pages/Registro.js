import { useState } from 'react';
import api from '../services/api';

const Registro = ({ onSwitch }) => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/usuarios/registro', { nombre, correo, contraseña });
      setMensaje('Usuario registrado correctamente. Ahora inicia sesión.');
      setError('');
    } catch (err) {
      setError('Error al registrarse. El correo puede estar en uso.');
      setMensaje('');
    }
  };

  return (
    <div className="min-h-screen bg-lavender-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-lg border border-lavender-200">
        <h1 className="text-3xl font-bold text-violet-700 mb-1 text-center">FinanzApp</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Crea tu cuenta</p>
        {error && <p className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm">{error}</p>}
        {mensaje && <p className="bg-green-50 text-green-600 p-3 rounded-xl mb-4 text-sm">{mensaje}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 text-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 text-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="alba@ejemplo.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Contraseña</label>
            <input
              type="password"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 text-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-xl transition duration-200"
          >
            Registrarse
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          ¿Ya tienes cuenta?{' '}
          <span onClick={onSwitch} className="text-violet-600 font-medium cursor-pointer hover:underline">
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default Registro;