import axios from 'axios';

// instancia cliente http pre-configurado para a api
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// interceptor para injetar bearer token e tratar sessao anonima
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const sessionId = localStorage.getItem('cart_session_id');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (sessionId) {
    config.headers['X-Cart-Session-Id'] = sessionId;
  }

  return config;
});

// interceptor para tratamento centralizado de respostas e erros comuns
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // limpeza de sessao expirada quando necessario
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);