import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Addresses from '../pages/Addresses';
import { useAddressStore } from '../stores/useAddressesStore';

// Moca o uso do Axios caso seja acionado via useAddressStore.fetchAddresses
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}));

// Moca o fetch nativo do JS global para testes no ViaCEP
global.fetch = vi.fn();

describe('Addresses Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAddressStore.setState({
      addresses: [
        { id: 1, zip_code: '01311-999', street: 'Avenida Paulista', number: '118', neighborhood: 'Centro', city: 'São Paulo', state: 'SP' }
      ],
      fetchAddresses: vi.fn(),
      saveAddress: vi.fn(),
      removeAddress: vi.fn()
    });
  });

  it('renderiza os enderecos iniciais listados pela loja de estado', () => {
    render(<MemoryRouter><Addresses /></MemoryRouter>);
    expect(screen.getByText(/AVENIDA PAULISTA 118/i)).toBeInTheDocument();
  });

  it('formata o CEP digitado e busca dados de endereco automaticamente via ViaCEP', async () => {
    // Simula resposta do ViaCEP
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        logradouro: 'Rua Teste',
        bairro: 'Bairro Teste',
        localidade: 'Cidade Teste',
        uf: 'SP'
      })
    });

    render(<MemoryRouter><Addresses /></MemoryRouter>);
    
    const btnAdd = screen.getByText(/adicionar endereço/i);
    fireEvent.click(btnAdd);
    
    const cepInput = screen.getByPlaceholderText('CEP*');
    
    // Dispara mudanca do valor para o raw string
    fireEvent.change(cepInput, { target: { value: '01311999' } });
    
    // Verifica se a mascara embutiu o hifen
    expect(cepInput.value).toBe('01311-999');
    
    // Aguarda processamento do state atrelado ao ViaCEP
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('https://viacep.com.br/ws/01311999/json/');
      expect(screen.getByPlaceholderText('LOGRADOURO*').value).toBe('Rua Teste');
      expect(screen.getByPlaceholderText('BAIRRO*').value).toBe('Bairro Teste');
      expect(screen.getByPlaceholderText('CIDADE*').value).toBe('Cidade Teste');
    });
  });

  it('exibe modal de confirmacao ao clicar no icone de apagar o endereco', () => {
    render(<MemoryRouter><Addresses /></MemoryRouter>);
    
    const btnApagar = screen.getByLabelText('Apagar');
    fireEvent.click(btnApagar);
    
    expect(screen.getByText(/deseja apagar o endereço\?/i)).toBeInTheDocument();
  });
});