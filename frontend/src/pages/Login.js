import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = ({ onSwitch }) => {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setCorreo('');
    setContraseña('');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/usuarios/login', { correo, contraseña });
      login(res.data.token, res.data.nombre, res.data.rol);
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="min-h-screen bg-lavender-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-lg border border-lavender-200">
        <h1 className="text-3xl font-bold text-violet-700 mb-1 text-center">FinanzApp</h1>
        <p className="text-gray-400 text-sm text-center mb-6">Gestiona tus finanzas personales</p>
        {error && <p className="bg-red-50 text-red-500 p-3 rounded-xl mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              className="w-full bg-lavender-50 border border-lavender-200 text-gray-800 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-600"
              placeholder="alba@ejemplo.com"
              autoComplete="off"
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
              autoComplete="new-password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2 rounded-xl transition duration-200"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-4">
          ¿No tienes cuenta?{' '}
          <span onClick={onSwitch} className="text-violet-600 font-medium cursor-pointer hover:underline">
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;