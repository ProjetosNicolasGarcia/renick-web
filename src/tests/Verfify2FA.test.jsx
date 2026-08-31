import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Verify2FA from '../pages/Verify2FA';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('Verify2FA Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.setItem('temp_token', 'temp-token-123');
  });

  it('envia o codigo de verificacao corretamente para a api', async () => {
    api.post.mockResolvedValueOnce({
      data: { access_token: 'fake-token', user: { email: 'teste@email.com' } },
    });
    api.get.mockResolvedValueOnce({
      data: { id: 1, email: 'teste@email.com' },
    });

    render(
      <MemoryRouter initialEntries={[{ state: { email: 'teste@email.com', from: '/checkout' } }]}>
        <Verify2FA />
      </MemoryRouter>
    );

    // insere o codigo de seis digitos
    const input = screen.getByPlaceholderText('- - - - - -');
    fireEvent.change(input, { target: { value: '123456' } });
    
    const button = screen.getByRole('button', { name: /verificar/i });
    fireEvent.click(button);

    // valida contrato da chamada da api com payload e headers
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/auth/2fa/verify',
        {
          email: 'teste@email.com',
          code: '123456',
        },
        {
          headers: {
            Authorization: 'Bearer temp-token-123',
          },
        }
      );
    });
  });
});