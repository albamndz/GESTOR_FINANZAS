import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [nombre, setNombre] = useState(localStorage.getItem('nombre'));
  const [rol, setRol] = useState(localStorage.getItem('rol'));

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
    <AuthContext.Provider value={{ token, nombre, rol, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);