import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// envia o payload de suporte para a api
export const postSupportMessage = async (payload) => {
  const response = await apiClient.post('/support', payload);
  return response.data;
};