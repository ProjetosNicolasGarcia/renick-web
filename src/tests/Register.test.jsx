import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Register from '../pages/Register';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
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

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submete o formulario de cadastro com os campos no formato esperado pelo contrato openapi', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        requires_2fa: true,
        temp_token: 'temp_token_teste',
      },
    });

    render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId="fake-client-id">
          <Register />
        </GoogleOAuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('EMAIL'), {
      target: { value: 'cliente@teste.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('SENHA'), {
      target: { value: 'Senha@123' },
    });
    fireEvent.change(screen.getByPlaceholderText('CONFIRMAR SENHA'), {
      target: { value: 'Senha@123' },
    });

    const submitButton = screen.getByRole('button', { name: /cadastrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/users', {
        email: 'cliente@teste.com',
        password: 'Senha@123',
        password_confirmation: 'Senha@123',
      });
    });
  });

  it('exibe mensagem de erro quando a requisicao de cadastro falha', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Este email já está cadastrado em nossa base.',
        },
      },
    });

    render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId="fake-client-id">
          <Register />
        </GoogleOAuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('EMAIL'), {
      target: { value: 'existente@teste.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('SENHA'), {
      target: { value: 'Senha@123' },
    });
    fireEvent.change(screen.getByPlaceholderText('CONFIRMAR SENHA'), {
      target: { value: 'Senha@123' },
    });

    const submitButton = screen.getByRole('button', { name: /cadastrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText('Este email já está cadastrado em nossa base.')
      ).toBeInTheDocument();
    });
  });
});