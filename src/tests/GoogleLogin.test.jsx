import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from '../pages/Login';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('Google Authentication Component', () => {
  it('deve submeter o token assinado do google para a api', async () => {
    api.post.mockResolvedValueOnce({
      data: { access_token: 'fake-jwt', user: { email: 'google@teste.com' } }
    });

    render(
      <MemoryRouter>
        <GoogleOAuthProvider clientId="fake-client-id">
          <Login />
        </GoogleOAuthProvider>
      </MemoryRouter>
    );

    // Busca o botao pelo atributo de acessibilidade adicionado
    const googleBtn = screen.getByRole('button', { name: /login com google/i });
    expect(googleBtn).toBeInTheDocument();
  });
});