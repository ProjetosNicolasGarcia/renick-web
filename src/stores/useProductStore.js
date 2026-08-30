import { create } from 'zustand';
import { api } from '../services/api';

export const useProductStore = create((set) => ({
  product: null,
  related: [],
  isLoading: false,
  error: null,
  list: [],
  meta: null,
  isLoadingList: false,

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

  clearProduct: () => set({ product: null, related: [] }),

  fetchProductsList: async (params) => {
    set({ isLoadingList: true });
    try {
      // params e um objeto gerado pelo searchParams, ex: { q: 'camisa', gender: 'masculino' }
      const res = await api.get('/products', { params });
      set({ list: res.data.data, meta: res.data.meta, isLoadingList: false });
    } catch (err) {
      set({ isLoadingList: false });
    }
  },
  
  fetchAttributes: async () => {
    try {
      const res = await api.get('/attributes');
      set({ attributes: res.data });
    } catch (error) {
      console.error('Failed to fetch attributes', error);
    }
  }

}));