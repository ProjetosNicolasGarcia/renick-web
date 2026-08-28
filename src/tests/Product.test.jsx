import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Product from '../pages/Product';
import { useProductStore } from '../stores/useProductStore';

vi.mock('../services/api', () => ({
  api: { get: vi.fn() }
}));

describe('Product Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useProductStore.setState({
      product: {
        id: 1,
        name: 'Camisa Polo Laranja',
        description: 'Descrição longa do produto.',
        price: 199.99,
        promotional_price: 99.99,
        installment_info: '5% OFF no Pix',
        images: [{ url: '/img1.jpg', color_slug: 'laranja' }],
        variants: [
          { id: 101, size: '12', color_name: 'Laranja', color_hex: '#FF7537', price: 199.99, promo_price: 99.99, stock_quantity: 10 }
        ],
        rating_summary: { total_reviews: 2 }
      },
      related: [],
      isLoading: false,
      fetchProductData: vi.fn(),
      clearProduct: vi.fn()
    });
  });

  it('renderiza todos os componentes arquiteturais da pagina', () => {
    render(
      <MemoryRouter initialEntries={['/products/1']}>
        <Routes>
          <Route path="/products/:id" element={<Product />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /camisa polo laranja/i })).toBeInTheDocument();
    
    // ATUALIZADO: Verifica o texto correto do estado inicial (antes do usuário escolher cor/tamanho)
    expect(screen.getByRole('button', { name: /selecione as opções/i })).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('CEP')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /descrição/i })).toBeInTheDocument();
  });
});