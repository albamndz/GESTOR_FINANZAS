import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [nombre, setNombre] = useState(localStorage.getItem('nombre'));
  const [rol, setRol] = useState(localStorage.getItem('rol'));
  const [modoOscuro, setModoOscuro] = useState(localStorage.getItem('modoOscuro') === 'true');

  useEffect(() => {
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [modoOscuro]);

  const toggleModoOscuro = () => {
    const nuevo = !modoOscuro;
    setModoOscuro(nuevo);
    localStorage.setItem('modoOscuro', nuevo);
  };

  const login = (token, nombre, rol) => {
    localStorage.setItem('token', token);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('rol', rol);
    setToken(token);
    setNombre(nombre);
    setRol(rol);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
    setToken(null);
    setNombre(null);
    setRol(null);
  };

  return (
    <AuthContext.Provider value={{ token, nombre, rol, login, logout, modoOscuro, toggleModoOscuro }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);