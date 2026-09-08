import { create } from 'zustand';
import { postSupportMessage } from '../services/supportService';

export const useSupportStore = create((set) => ({
  isLoading: false,
  isSuccess: false,
  errorMessage: null,

  submitSupportForm: async (payload) => {
    set({ isLoading: true, isSuccess: false, errorMessage: null });
    
    try {
      await postSupportMessage(payload);
      set({ isSuccess: true, isLoading: false });
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao enviar mensagem.';
      set({ errorMessage: errorMsg, isLoading: false });
    }
  },

  resetState: () => set({ isSuccess: false, errorMessage: null }),
}));