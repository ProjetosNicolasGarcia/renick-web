import { create } from 'zustand';
import { api } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // payload exato exigido pelo contrato openapi
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erro ao realizar login', isLoading: false });
      throw error;
    }
  },

  register: async (email, password, password_confirmation) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/users', { email, password, password_confirmation });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erro ao realizar cadastro', isLoading: false });
      throw error;
    }
  },
}));