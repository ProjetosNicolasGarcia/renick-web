import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Home from '../pages/Home';
import { useLandingStore } from '../stores/useLandingStore';

// Mock da API para evitar requisições reais durante o teste
vi.mock('../services/api', () => ({
  api: { get: vi.fn() }
}));

describe('Home Page (Landing)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Injeta o estado inicial com dados simulados incluindo os novos formatos de banner
    useLandingStore.setState({
      banners: [
        { 
          id: 1, 
          image_url: '/banner.jpg', 
          image_url_mobile: '/banner-mobile.jpg', 
          link_url: '/colecao' 
        }
      ],
      offers: [
        { 
          id: 10, 
          name: 'Camisa Polo', 
          price: 99.99, 
          promotional_price: 59.99,
          image_url: '/polo.jpg'
        }
      ],
      newest: [],
      bestSellers: [],
      isLoading: false,
      fetchLandingData: vi.fn()
    });
  });

  it('renderiza os titulos das sessoes corretamente', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Masculino')).toBeInTheDocument();
    expect(screen.getByText('Feminino')).toBeInTheDocument();
    expect(screen.getByText('Compre por Tamanho')).toBeInTheDocument();
    expect(screen.getByText('Ofertas')).toBeInTheDocument();
    expect(screen.getByText('Novidades')).toBeInTheDocument();
    expect(screen.getByText('Mais Buscados')).toBeInTheDocument();
  });

  it('renderiza os produtos formatados com indicativo de parcelamento e icone de coracao', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    // Nome do produto
    expect(screen.getByText('Camisa Polo')).toBeInTheDocument();
    
    // Frase informativa
    expect(screen.getByText(/5% OFF NO PIX OU NO CARTÃO EM ATÉ 3X SEM JUROS/i)).toBeInTheDocument();
    
    // Botão de compra
    expect(screen.getByRole('button', { name: /comprar/i })).toBeInTheDocument();
    
    // Ícone de favorito
    expect(screen.getByRole('button', { name: /favoritar/i })).toBeInTheDocument();
  });
});