import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Profile from '../pages/Profile';
import { api } from '../services/api';
import { useAuthStore } from '../stores/useAuthStore';

// Mock global da API incluindo o metodo GET para o fetchProfile
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Resolve o mock do fetch inicial do perfil
    api.get.mockResolvedValue({ data: { email: 'cliente@teste.com' } });
    
    useAuthStore.setState({ 
      user: { email: 'cliente@teste.com' },
      isAuthenticated: true 
    });
  });

  it('renderiza os links do menu corretamente', async () => {
    render(<MemoryRouter><Profile /></MemoryRouter>);
    
    // Aguarda o render inicial resolver para evitar conflitos de act()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /dados da conta/i })).toBeInTheDocument();
    });
    
    expect(screen.getByRole('button', { name: /pedidos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument();
  });

  it('submete atualizacao de perfil com a senha', async () => {
    api.patch.mockResolvedValueOnce({ data: { email: 'novo@teste.com' } });
    render(<MemoryRouter><Profile /></MemoryRouter>);

    // Aguarda o botao de editar estar disponivel na tela
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /^editar$/i })).toBeInTheDocument();
    });

    // Desbloqueia o formulario clicando em "Editar"
    fireEvent.click(screen.getByRole('button', { name: /^editar$/i }));

    // Preenche os dados usando os placeholders especificos do modo de edicao
    fireEvent.change(screen.getByPlaceholderText(/^EMAIL$/i), { target: { value: 'novo@teste.com' } });
    fireEvent.change(screen.getByPlaceholderText(/SENHA ATUAL \(OBRIGATÓRIO\)/i), { target: { value: 'Senha@123' } });
    
    // Submete as alteracoes
    fireEvent.click(screen.getByRole('button', { name: /^salvar$/i }));

    await waitFor(() => {
      expect(api.patch).toHaveBeenCalledWith('/me', {
        email: 'novo@teste.com',
        current_password: 'Senha@123',
      });
    });
  });

  it('realiza o logout e redireciona para a home', async () => {
    api.post.mockResolvedValueOnce({});
    render(<MemoryRouter><Profile /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sair/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /sair/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });
});