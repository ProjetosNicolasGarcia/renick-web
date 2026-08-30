import { create } from 'zustand';
import { api } from '../services/api';

export const useLandingStore = create((set) => ({
  banners: [],
  offers: [],
  newest: [],
  bestSellers: [],
  isLoading: false,

  fetchLandingData: async () => {
    set({ isLoading: true });
    try {
      // Promise.all executa as requisições simultaneamente para reduzir o TTFB (Time to First Byte)
      const [bannersRes, offersRes, newestRes, bestRes] = await Promise.all([
        api.get('/banners'),
        api.get('/products?is_sale=true&per_page=4'),
        api.get('/products?sort=newest&per_page=4'),
        api.get('/products?sort=best_selling&per_page=4')
      ]);

      set({
        banners: bannersRes.data,
        offers: offersRes.data.data,
        newest: newestRes.data.data,
        bestSellers: bestRes.data.data,
        isLoading: false
      });
    } catch (error) {
      console.error('Erro ao carregar Landing Page', error);
      set({ isLoading: false });
    }
  }
  
}));