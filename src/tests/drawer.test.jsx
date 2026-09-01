import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import CartDrawer from '../components/Drawers/CartDrawer';
import MenuDrawer from '../components/Drawers/MenuDrawer';
import { useUiStore } from '../stores/useUiStore';
import { useCartStore } from '../stores/useCartStore';

describe('Drawers Global Components', () => {
  beforeEach(() => {
    useUiStore.setState({ 
      isCartOpen: true, 
      isMenuOpen: true,
      categories: [{ id: 1, name: 'Feminino', slug: 'feminino' }] 
    });
    
    // Ajustado para refletir a estrutura real do estado do carrinho
    useCartStore.setState({ 
      cart: { items: [], items_count: 0, subtotal: 0, total: 0 } 
    });
  });

  it('renderiza o drawer do carrinho vazio', () => {
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    
    expect(screen.getByText('Sem itens no carrinho')).toBeInTheDocument();
    
    // queryByRole retorna null se não encontrar o elemento, evitando a quebra do teste
    const checkoutBtn = screen.queryByRole('button', { name: /FINALIZAR COMPRA/i });
    expect(checkoutBtn).not.toBeInTheDocument();
  });

  it('renderiza o drawer de menu com as categorias', () => {
    render(<MemoryRouter><MenuDrawer /></MemoryRouter>);
    expect(screen.getByText('Feminino')).toBeInTheDocument();
  });
});