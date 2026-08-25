import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Register from '../pages/Register';
import { api } from '../services/api';

// mock do modulo de api axios
vi.mock('../services/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

// mock da navegacao do react router
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
    // simula resposta 202 com necessidade de 2fa
    api.post.mockResolvedValueOnce({
      data: {
        requires_2fa: true,
        temp_token: 'temp_token_teste',
        message: 'Código de verificação enviado para o seu e-mail.',
      },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    // preenche os campos do formulario
    fireEvent.change(screen.getByPlaceholderText('EMAIL'), {
      target: { value: 'cliente@teste.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('SENHA'), {
      target: { value: 'Senha@123' },
    });
    fireEvent.change(screen.getByPlaceholderText('CONFIRMAR SENHA'), {
      target: { value: 'Senha@123' },
    });

    // submete o cadastro
    const submitButton = screen.getByRole('button', { name: /cadastrar/i });
    fireEvent.click(submitButton);

    // valida a chamada de rede com chaves em snake_case conforme o contrato
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/users', {
        email: 'cliente@teste.com',
        password: 'Senha@123',
        password_confirmation: 'Senha@123',
      });
    });

    // valida redirecionamento com estado contendo o email
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/verify-2fa', {
        state: { email: 'cliente@teste.com' },
      });
    });
  });

  it('exibe mensagem de erro quando a requisicao de cadastro falha', async () => {
    // simula erro de validacao retornado pelo backend
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Este email já está cadastrado em nossa base.',
        },
      },
    });

    render(
      <MemoryRouter>
        <Register />
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

    // valida se a mensagem de erro foi renderizada na arvore dom
    await waitFor(() => {
      expect(
        screen.getByText('Este email já está cadastrado em nossa base.')
      ).toBeInTheDocument();
    });
  });
});