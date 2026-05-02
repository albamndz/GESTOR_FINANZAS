import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [nombre, setNombre] = useState(sessionStorage.getItem('nombre'));
  const [rol, setRol] = useState(sessionStorage.getItem('rol'));
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
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('nombre', nombre);
    sessionStorage.setItem('rol', rol);
    setToken(token);
    setNombre(nombre);
    setRol(rol);
  };

  const logout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('nombre');
    sessionStorage.removeItem('rol');
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