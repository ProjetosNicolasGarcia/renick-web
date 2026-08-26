import { create } from 'zustand';
import { api } from '../services/api';

export const useAddressStore = create((set, get) => ({
  addresses: [],
  isLoading: false,
  error: null,

  fetchAddresses: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/me/addresses');
      set({ addresses: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: 'erro ao carregar endereços', isLoading: false });
    }
  },

  saveAddress: async (addressData, id = null) => {
    set({ isLoading: true, error: null });
    try {
      if (id) {
        await api.patch(`/me/addresses/${id}`, addressData);
      } else {
        await api.post('/me/addresses', addressData);
      }
      await get().fetchAddresses();
    } catch (error) {
      set({ error: 'erro ao salvar endereço', isLoading: false });
      throw error;
    }
  },

  removeAddress: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/me/addresses/${id}`);
      set((state) => ({
        addresses: state.addresses.filter((addr) => addr.id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'erro ao remover endereço', isLoading: false });
      throw error;
    }
  }
}));