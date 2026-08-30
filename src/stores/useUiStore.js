import { create } from 'zustand';
import { api } from '../services/api';

export const useUiStore = create((set) => ({
  isMenuOpen: false,
  isCartOpen: false,
  isSearchOpen: false,
  isFilterOpen: false,
  categories: [],
  
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen, isCartOpen: false, isSearchOpen: false })),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen, isMenuOpen: false, isSearchOpen: false })),
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen, isMenuOpen: false, isCartOpen: false })),
  toggleFilter: () => set((state) => ({ isFilterOpen: !state.isFilterOpen })),
  closeAll: () => set({ isMenuOpen: false, isCartOpen: false, isSearchOpen: false }),
  setCategories: (cats) => set({ categories: cats }),

  fetchCategories: async () => {
    try {
      const response = await api.get('/categories');
      set({ categories: response.data });
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  }
}));