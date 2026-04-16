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
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Crear cuenta</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Nombre:</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Correo:</label>
          <input type="email" value={correo} onChange={e => setCorreo(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Contraseña:</label>
          <input type="password" value={contraseña} onChange={e => setContraseña(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Registrarse
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '10px' }}>
        ¿Ya tienes cuenta? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={onSwitch}>Inicia sesión</span>
      </p>
    </div>
  );
};

export default Registro;