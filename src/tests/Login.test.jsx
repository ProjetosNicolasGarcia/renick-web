import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import Login from '../pages/Login';
import { api } from '../services/api';

// mock da instancia do axios
vi.mock('../services/api', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('Login Component', () => {
  it('deve realizar login e chamar a api corretamente', async () => {
    api.post.mockResolvedValueOnce({
      data: { access_token: 'fake-token', user: { email: 'teste@email.com' } }
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // interage com os campos
    fireEvent.change(screen.getByPlaceholderText('EMAIL'), { target: { value: 'teste@email.com' } });
    fireEvent.change(screen.getByPlaceholderText('SENHA'), { target: { value: 'Senha@123' } });
    
    // aciona submit
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // valida contrato da chamada
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'teste@email.com',
        password: 'Senha@123',
      });
    });
  });
});