import { create } from 'zustand';
import { api } from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // autenticacao basica
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/login', { email, password });
      set({ isLoading: false });
      return response.data; // retorna para o componente avaliar o requires_2fa
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erro ao realizar login.', isLoading: false });
      throw error;
    }
  },

  // cadastro de novo usuario
  register: async (email, password, passwordConfirmation) => {
    set({ isLoading: true, error: null });
    try {
      // mapeamento explicito para a chave snake_case esperada pelo backend/openapi
      const response = await api.post('/users', { 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.errors?.password?.[0] 
        || error.response?.data?.message 
        || 'Erro ao realizar cadastro.';
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  // login via google
  googleLogin: async (idToken) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/google', { id_token: idToken });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erro ao autenticar com o Google.', isLoading: false });
      throw error;
    }
  },

  // solicitacao de recuperacao de senha
  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/forgot-password', { email });
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erro ao processar solicitação.', isLoading: false });
      throw error;
    }
  },

  // validacao previa do token de redefinicao
  validateResetToken: async (email, token) => {
    try {
      await api.get('/auth/reset-password/validate', { params: { email, token } });
      return true;
    } catch (error) {
      return false;
    }
  },

  // redefinicao de senha com token
  resetPassword: async (token, email, password, password_confirmation) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/auth/reset-password', { token, email, password, password_confirmation });
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erro ao alterar senha.', isLoading: false });
      throw error;
    }
  },

  // validacao de codigo 2fa
  verify2fa: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/auth/2fa/verify', { email, code });
      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Código inválido.', isLoading: false });
      throw error;
    }
  },

  // atualiza dados do perfil
updateProfile: async (email, newPassword, currentPassword) => {
    set({ isLoading: true, error: null });
    try {
      const payload = { 
        email, 
        current_password: currentPassword 
      };
      
      // se o usuario preencheu uma nova senha, adiciona ao payload
      if (newPassword) {
        payload.password = newPassword;
      }
      
      const response = await api.patch('/me', payload);
      set({ user: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erro ao atualizar perfil.', isLoading: false });
      throw error;
    }
  },

  // exclui a conta do usuario
  deleteAccount: async (currentPassword) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete('/me', { data: { current_password: currentPassword } });
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erro ao apagar conta.', isLoading: false });
      throw error;
    }
  },

  // busca o perfil atualizado
  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/me');
      set({ user: response.data, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      // se o token for invalido ou expirado, limpa a sessao
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false, isLoading: false });
      throw error;
    }
  },

  // desloga o usuario
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    }
  }

  
}));