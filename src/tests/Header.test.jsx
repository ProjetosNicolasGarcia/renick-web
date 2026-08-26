import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from '../components/Header';
import { useUiStore } from '../stores/useUiStore';
import { useAuthStore } from '../stores/useAuthStore';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useUiStore.setState({ categories: [{ id: 1, name: 'Masculino', slug: 'masculino' }] });
    useAuthStore.setState({ isAuthenticated: false });
  });

  it('redireciona para o login quando o usuario nao esta autenticado e clica no icone', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    const userButton = screen.getByLabelText('Usuário');
    fireEvent.click(userButton);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('redireciona para a pagina de pesquisa ao submeter o formulario', () => {
    render(<MemoryRouter><Header /></MemoryRouter>);
    
    // Captura o input
    const input = screen.getByPlaceholderText('O QUE VOCÊ PROCURA?');
    const form = input.closest('form');
    
    // Preenche o valor
    fireEvent.change(input, { target: { value: 'calça' } });
    
    // Submete o formulário diretamente (melhor prática para testes)
    fireEvent.submit(form);
    
    expect(mockNavigate).toHaveBeenCalledWith('/products?q=calça');
  });
});