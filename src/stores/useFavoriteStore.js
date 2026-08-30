import { create } from 'zustand';
import { api } from '../services/api';

export const useFavoriteStore = create((set, get) => ({
  favorites: [],
  favoriteIds: [],
  isLoading: false,

  fetchFavorites: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/me/favorites');
      const favs = res.data.data;
      set({ 
        favorites: favs, 
        favoriteIds: favs.map(f => f.product.id) 
      });
    } catch (error) {
      console.error('Erro ao buscar favoritos', error);
    } finally {
      set({ isLoading: false });
    }
  },

  toggleFavorite: async (productId) => {
    const { favoriteIds, favorites } = get();
    const isFavorited = favoriteIds.includes(productId);

    if (isFavorited) {
      // CORREÇÃO: Remove instantaneamente dos IDs E da lista de objetos renderizados
      set({ 
        favoriteIds: favoriteIds.filter(id => id !== productId),
        favorites: favorites.filter(fav => fav.product.id !== productId)
      });
      try {
        await api.delete(`/me/favorites/${productId}`);
      } catch (e) {
        get().fetchFavorites(); // rollback em caso de erro
      }
    } else {
      set({ favoriteIds: [...favoriteIds, productId] });
      try {
        await api.post('/me/favorites', { product_id: productId });
        get().fetchFavorites();
      } catch (e) {
        get().fetchFavorites(); // rollback em caso de erro
      }
    }
  }
}));