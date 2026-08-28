import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Listing from '../pages/Listing';
import { useProductStore } from '../stores/useProductStore';

vi.mock('../services/api', () => ({
  api: { get: vi.fn() }
}));

describe('Listing Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useProductStore.setState({
      list: [
        { id: 1, name: 'Casaco de Inverno', price: 150.00, promotional_price: null, image_url: '/casaco.jpg' }
      ],
      isLoadingList: false,
      fetchProductsList: vi.fn()
    });
  });

  it('renderiza o titulo dinamico com base na query string e exibe os produtos', () => {
    render(
      <MemoryRouter initialEntries={['/products?q=Casaco']}>
        <Routes>
          <Route path="/products" element={<Listing />} />
        </Routes>
      </MemoryRouter>
    );

    // verifica titulo dinamico
    expect(screen.getByRole('heading', { name: /resultados para "casaco"/i })).toBeInTheDocument();
    
    // verifica icone de filtro
    expect(screen.getByRole('button', { name: /filtrar/i })).toBeInTheDocument();
    
    // verifica renderizacao do produto do mock
    expect(screen.getByText('Casaco de Inverno')).toBeInTheDocument();
  });
});