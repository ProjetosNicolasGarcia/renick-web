import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ResetPassword from '../pages/ResetPassword';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(), // Necessário para simular a validação do token
  },
}));

describe('ResetPassword Component', () => {
  it('submete os dados de redefinicao conforme o contrato', async () => {
    // Simula sucesso na checagem prévia do token no useEffect
    api.get.mockResolvedValueOnce({
      data: { message: 'Token válido.' }
    });

    // Simula o sucesso da troca de senha
    api.post.mockResolvedValueOnce({
      data: { message: 'Operação realizada com sucesso.' }
    });

    render(
      <MemoryRouter initialEntries={['/reset-password?token=token-teste&email=cliente@teste.com']}>
        <ResetPassword />
      </MemoryRouter>
    );

    // Aguarda o componente sair do estado "Validando link..." e encontrar o input
    const passwordInput = await screen.findByPlaceholderText('NOVA SENHA');
    const confirmInput = screen.getByPlaceholderText('CONFIRMAR NOVA SENHA');

    fireEvent.change(passwordInput, { target: { value: 'NovaSenha@123' } });
    fireEvent.change(confirmInput, { target: { value: 'NovaSenha@123' } });

    fireEvent.click(screen.getByRole('button', { name: /confirmar/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'token-teste',
        email: 'cliente@teste.com',
        password: 'NovaSenha@123',
        password_confirmation: 'NovaSenha@123',
      });
    });
  });
});