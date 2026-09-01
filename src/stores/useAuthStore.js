import { create } from 'zustand';
import { api } from '../services/api';
import { useCartStore } from './useCartStore';

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // autenticacao basica
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post('/auth/login', credentials);
      
      // Fluxo 2FA: Salva token temporário e interrompe antes do fetchProfile
      if (res.status === 202 || res.data?.requires_2fa || res.data?.temp_token) {
        sessionStorage.setItem('temp_token', res.data.temp_token || res.data.access_token);
        set({ isLoading: false });
        return { requires_2fa: true };
      }

      // Login direto
      localStorage.setItem('token', res.data.access_token);
      localStorage.removeItem('cart_session_id'); // Limpa carrinho anônimo
      
      await get().fetchProfile(); 
      await useCartStore.getState().fetchCart(); // Puxa o carrinho do usuário
      
      return { requires_2fa: false };
    } catch (error) {
      set({ error: error.response?.data?.message || 'Erro ao realizar login', isLoading: false });
      throw error;
    }
  },

  // cadastro de novo usuario
  register: async (email, password, passwordConfirmation) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/users', { 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      });
      
      // Fluxo 2FA ativado no cadastro: não executa fetchProfile
      if (response.status === 202 || response.data?.requires_2fa || response.data?.temp_token) {
        sessionStorage.setItem('temp_token', response.data.temp_token || response.data.access_token);
        set({ isLoading: false });
        return { requires_2fa: true };
      }
      
      // Cadastro concluído diretamente
      localStorage.setItem('token', response.data.access_token);
      localStorage.removeItem('cart_session_id');
      
      await get().fetchProfile();
      await useCartStore.getState().fetchCart();
      
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
      localStorage.removeItem('cart_session_id');
      
      set({ user, isAuthenticated: true, isLoading: false });
      await useCartStore.getState().fetchCart();
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
  verify2FA: async (email, code) => {
    set({ isLoading: true, error: null });
    try {
      const tempToken = sessionStorage.getItem('temp_token');
      const res = await api.post('/auth/2fa/verify', { email, code }, {
        headers: { Authorization: `Bearer ${tempToken}` }
      });

      // Validação passou: transforma temp_token em definitivo
      localStorage.setItem('token', res.data.access_token);
      sessionStorage.removeItem('temp_token');
      localStorage.removeItem('cart_session_id'); // Limpa carrinho anônimo da sessão 2FA
      
      await get().fetchProfile();
      await useCartStore.getState().fetchCart();
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Código inválido', isLoading: false });
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
      localStorage.removeItem('cart_session_id');
      set({ user: null, isAuthenticated: false });
      
      // Limpa a memória instantaneamente e puxa um carrinho vazio anônimo
      useCartStore.getState().clearCart();
      useCartStore.getState().fetchCart();
    }
  }
  
}));