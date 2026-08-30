import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useLocation } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import FilterDrawer from '../components/Drawers/FilterDrawer';
import { useUiStore } from '../stores/useUiStore';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

const mockAttributes = {
  genders: ['Masculino', 'Feminino'],
  types: ['Camisetas', 'Calças'],
  sizes: ['10', '12'],
  colors: [{ name: 'Azul', hex: '#0000FF' }],
  price_range: { min: 10, max: 200 }
};

// Componente ajudante para extrair a URL de dentro da memória do Router no teste
const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.pathname}{location.search}</div>;
};

describe('Product Filters Integration', () => {
  beforeEach(() => {
    api.get.mockResolvedValue({ data: mockAttributes });
    useUiStore.setState({ isFilterOpen: true });
  });

  it('FilterSidebar aplica filtros reativamente (Desktop)', async () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <FilterSidebar />
        <LocationDisplay />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Masculino')).toBeInTheDocument();
    });

    const checkbox = screen.getByText('Masculino');
    fireEvent.click(checkbox);
    
    // Verifica se a URL interna do Router mudou imediatamente após o clique
    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent('/products?gender=masculino');
    });
  });

  it('FilterDrawer exige clique no botao Aplicar (Mobile)', async () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <FilterDrawer />
        <LocationDisplay />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sexo')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Sexo'));
    const checkbox = screen.getByText('Feminino');
    fireEvent.click(checkbox);
    
    // A URL NÃO DEVE mudar apenas ao clicar no checkbox (comportamento retido do mobile)
    expect(screen.getByTestId('location-display')).toHaveTextContent('/products');
    
    const applyButton = screen.getByRole('button', { name: /aplicar/i });
    fireEvent.click(applyButton);
    
    // Após clicar no botão de aplicar, a URL deve ser atualizada e a gaveta deve fechar
    await waitFor(() => {
      expect(screen.getByTestId('location-display')).toHaveTextContent('/products?gender=feminino');
    });
    expect(useUiStore.getState().isFilterOpen).toBe(false);
  });
});