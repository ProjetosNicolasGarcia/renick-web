import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '../pages/Login';
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

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve realizar login e chamar a api corretamente', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        requires_2fa: true,
        temp_token: 'temp_token_teste',
      },
    });

    render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId="fake-client-id">
          <Login />
        </GoogleOAuthProvider>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText('EMAIL'), {
      target: { value: 'cliente@teste.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('SENHA'), {
      target: { value: 'Senha@123' },
    });

    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'cliente@teste.com',
        password: 'Senha@123',
      });
    });
  });
});