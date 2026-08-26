import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Footer from '../components/Footer';

describe('Footer Component', () => {
  it('renderiza os links institucionais e a logo do mercado pago', () => {
    render(<MemoryRouter><Footer /></MemoryRouter>);
    
    expect(screen.getByText('Sobre Nós')).toBeInTheDocument();
    expect(screen.getByText('Termos de Uso')).toBeInTheDocument();
    
    const mercadoPagoImg = screen.getByAltText('Mercado Pago');
    expect(mercadoPagoImg).toBeInTheDocument();
    expect(mercadoPagoImg).toHaveAttribute('src', '/MP_RGB_HANDSHAKE_pluma_horizontal.png');
  });
});