import { create } from 'zustand';
import { api } from '../services/api';

export const useProductStore = create((set) => ({
  product: null,
  related: [],
  isLoading: false,
  error: null,

  fetchProductData: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const [prodRes, relRes] = await Promise.all([
        api.get(`/products/${id}`),
        api.get(`/products/${id}/related`)
      ]);
      set({ 
        product: prodRes.data, 
        related: relRes.data.data, 
        isLoading: false 
      });
    } catch (err) {
      set({ error: 'Erro ao carregar o produto', isLoading: false });
    }
  },

  clearProduct: () => set({ product: null, related: [] })
}));