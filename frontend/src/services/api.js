import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gestor-finanzas-bhvr.onrender.com/api'
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('nombre');
      sessionStorage.removeItem('rol');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;