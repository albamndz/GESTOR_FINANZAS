import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = ({ onSwitch }) => {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/usuarios/login', { correo, contraseña });
      login(res.data.token, res.data.nombre);
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Correo:</label>
          <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Contraseña:</label>
          <input type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Entrar
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        ¿No tienes cuenta? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onSwitch}>Regístrate</span>
      </p>
    </div>
  );
};

export default Login;