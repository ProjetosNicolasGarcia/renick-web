import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const sessionId = localStorage.getItem('cart_session_id');

  // Defesa contra poluição do localStorage com strings inválidas
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (sessionId && sessionId !== 'undefined' && sessionId !== 'null') {
    config.headers['X-Cart-Session-Id'] = sessionId;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    // Lê do payload ou do header
    const sessionId = response.data?.session_id || response.headers['x-cart-session-id'];
    
    // CORREÇÃO: Salva o session_id independentemente do estado do token
    if (sessionId) {
      localStorage.setItem('cart_session_id', sessionId);
    }
    
    return response;
  },
  (error) => {
    // Se o token estiver expirado/inválido (401), limpa ele para não causar conflitos
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);