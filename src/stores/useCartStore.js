import { create } from 'zustand';
import { api } from '../services/api';

export const useCartStore = create((set) => ({
  cart: { items: [], items_count: 0, subtotal: 0, total: 0 },
  isLoading: false,

  fetchCart: async () => {
    try {
      const res = await api.get('/cart');
      set({ cart: res.data });
    } catch (error) {
      console.error('Erro ao buscar carrinho:', error);
    }
  },

  addItem: async (variantId, quantity = 1) => {
    set({ isLoading: true });
    try {
      const res = await api.post('/cart/items', { variant_id: variantId, quantity });
      set({ cart: res.data, isLoading: false });
      return true;
    } catch (error) {
      set({ isLoading: false });
      console.error('Erro ao adicionar ao carrinho:', error);
      return false;
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true });
    try {
      const res = await api.delete(`/cart/items/${itemId}`);
      set({ cart: res.data, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error('Erro ao remover do carrinho:', error);
    }
  },

  clearCart: () => {
    set({ cart: { items: [], items_count: 0, subtotal: 0, total: 0 } });
  }
}));