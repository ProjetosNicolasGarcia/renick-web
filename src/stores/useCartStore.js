import { create } from 'zustand';

export const useCartStore = create((set) => ({
  items: [],
  total: 0,
  
  // mocks para o funcionamento inicial da UI
  clearCart: () => set({ items: [], total: 0 }),
}));