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
    useCartStore.setState({ items: [] });
  });

  it('renderiza o drawer do carrinho vazio', () => {
    render(<MemoryRouter><CartDrawer /></MemoryRouter>);
    expect(screen.getByText('Sem itens no carrinho')).toBeInTheDocument();
    
    const checkoutBtn = screen.getByRole('button', { name: /FINALIZAR COMPRA/i });
    expect(checkoutBtn).toBeDisabled();
  });

  it('renderiza o drawer de menu com as categorias', () => {
    render(<MemoryRouter><MenuDrawer /></MemoryRouter>);
    expect(screen.getByText('Feminino')).toBeInTheDocument();
  });
});