import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useFavoriteStore } from '../stores/useFavoriteStore';
import { useAuthStore } from '../stores/useAuthStore';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    post: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
}));

const mockProduct = {
  id: 1,
  name: 'Camiseta Básica',
  slug: 'camiseta-basica',
  price: 100,
};

describe('Favorites Component Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFavoriteStore.setState({ favoriteIds: [] });
  });

  it('redireciona para login ao favoritar deslogado', () => {
    useAuthStore.setState({ isAuthenticated: false });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<ProductCard product={mockProduct} />} />
          <Route path="/login" element={<div data-testid="login-page">Login</div>} />
        </Routes>
      </MemoryRouter>
    );

    const favoriteButton = screen.getByLabelText('Favoritar');
    fireEvent.click(favoriteButton);

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('efetua a adicao aos favoritos quando autenticado', async () => {
    useAuthStore.setState({ isAuthenticated: true });
    api.post.mockResolvedValue({ status: 201 });
    api.get.mockResolvedValue({ data: { data: [] } });

    render(
      <MemoryRouter>
        <ProductCard product={mockProduct} />
      </MemoryRouter>
    );

    const favoriteButton = screen.getByLabelText('Favoritar');
    fireEvent.click(favoriteButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/me/favorites', { product_id: 1 });
      expect(useFavoriteStore.getState().favoriteIds).toContain(1);
    });
  });
});