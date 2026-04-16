import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';

const AppContent = () => {
  const { token } = useAuth();
  const [mostrarRegistro, setMostrarRegistro] = useState(false);

  if (token) return <Dashboard />;

  if (mostrarRegistro) return <Registro onSwitch={() => setMostrarRegistro(false)} />;

  return <Login onSwitch={() => setMostrarRegistro(true)} />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;