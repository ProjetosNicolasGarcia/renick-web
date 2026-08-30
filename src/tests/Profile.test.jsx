import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Profile from '../pages/Profile';
import { useAuthStore } from '../stores/useAuthStore';

describe('Profile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({
      user: { id: 1, email: 'cliente@teste.com' },
      fetchProfile: vi.fn().mockResolvedValue(),
      updateProfile: vi.fn(),
      deleteAccount: vi.fn(),
      logout: vi.fn(),
      isLoading: false,
      error: null,
    });
  });

  it('renderiza os links do menu corretamente', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      // CORREÇÃO: Usa getAllByText pois "Dados da Conta" existe no Menu e no Título
      expect(screen.getAllByText(/dados da conta/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/pedidos/i)).toBeInTheDocument();
      expect(screen.getByText(/endereços/i)).toBeInTheDocument();
      expect(screen.getByText(/favoritos/i)).toBeInTheDocument();
    });
  });

  it('permite alternar para o modo de edição', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Editar')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Editar'));
    expect(screen.getByPlaceholderText('NOVA SENHA')).toBeInTheDocument();
  });

  it('permite alternar para o modo de exclusão', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Apagar Conta')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Apagar Conta'));
    expect(screen.getByText(/Para apagar sua conta, confirme sua senha atual/i)).toBeInTheDocument();
  });
});