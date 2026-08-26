import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAddressStore } from '../stores/useAddressesStore';
import { useAuthStore } from '../stores/useAuthStore';

export default function Addresses() {
  const { addresses, fetchAddresses, saveAddress, removeAddress } = useAddressStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  
  const [formData, setFormData] = useState({
    zip_code: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: ''
  });

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  // Aplica mascara rigorosa e aciona o ViaCEP
  const handleCepChange = async (e) => {
    let value = e.target.value.replace(/\D/g, ''); 
    
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 8);
    }
    
    setFormData((prev) => ({ ...prev, zip_code: value }));

    const rawCep = value.replace(/\D/g, '');
    
    if (rawCep.length === 8) {
      try {
        // Utiliza integracao direta com ViaCEP para auto-preenchimento
        const response = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setFormData({ zip_code: '', street: '', number: '', complement: '', neighborhood: '', city: '', state: '' });
    setEditingId(null);
    setIsFormOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, zip_code: formData.zip_code.replace('-', '') };
    await saveAddress(payload, editingId);
    handleCancel();
  };

  const confirmDelete = async () => {
    if (!deleteModalId) return;
    await removeAddress(deleteModalId);
    setDeleteModalId(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col md:flex-row pt-8 md:pt-16 px-4 md:px-16 font-poppins max-w-6xl mx-auto gap-4 md:gap-8">
      
      <nav className="w-full md:w-64 flex flex-col gap-4 mb-8 md:mb-0">
        <h1 className="font-suez font-normal text-[32px] md:text-[40px] text-[#1E45FB] uppercase mb-4">
          Perfil
        </h1>
        <Link to="/profile" className="cursor-pointer w-fit text-left font-bold text-[20px] uppercase transition-colors text-[#0A0A0A] hover:text-[#1E45FB]">DADOS DA CONTA</Link>
        <Link to="/profile" className="cursor-pointer w-fit text-left font-bold text-[20px] uppercase transition-colors text-[#0A0A0A] hover:text-[#1E45FB]">PEDIDOS</Link>
        <span className="cursor-default w-fit text-left font-bold text-[20px] uppercase text-[#1E45FB]">ENDEREÇOS</span>
        <Link to="/profile" className="cursor-pointer w-fit text-left font-bold text-[20px] uppercase transition-colors text-[#0A0A0A] hover:text-[#1E45FB]">FAVORITOS</Link>
        <button onClick={handleLogout} className="cursor-pointer w-fit text-left font-bold text-[20px] text-[#D22A31] uppercase mt-4 hover:opacity-80">
          Sair
        </button>
      </nav>

      <div className="flex-1 w-full max-w-[600px] flex flex-col gap-6">
        {/* Título de seção atualizado com as diretrizes de H1 */}
        <h2 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase mb-2">
          Endereços
        </h2>

        {!isFormOpen && addresses.map((addr) => (
          <div key={addr.id} className="border border-[#0A0A0A] p-4 flex justify-between items-center bg-[#FAFAFA]">
            <div className="flex flex-col font-bold text-[#0A0A0A] text-[16px] md:text-[20px] uppercase">
              <span>{addr.street} {addr.number}</span>
              <span>{addr.neighborhood}</span>
              <span>{addr.state} {addr.zip_code}</span>
            </div>
            
            <div className="flex gap-4">
              <button aria-label="Editar" onClick={() => handleEdit(addr)} className="bg-[#1E45FB] w-12 h-12 flex items-center justify-center cursor-pointer hover:opacity-90">
                <svg className="w-6 h-6 text-[#FAFAFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
              </button>
              <button aria-label="Apagar" onClick={() => setDeleteModalId(addr.id)} className="bg-[#D22A31] w-12 h-12 flex items-center justify-center cursor-pointer hover:opacity-90">
                <svg className="w-6 h-6 text-[#FAFAFA]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          </div>
        ))}

        {!isFormOpen && (
          <button onClick={() => setIsFormOpen(true)} className="bg-[#CDF22B] h-[62px] w-full font-bold text-[20px] text-[#FAFAFA] uppercase cursor-pointer hover:opacity-90 rounded-none">
            Adicionar Endereço
          </button>
        )}

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="zip_code" value={formData.zip_code} onChange={handleCepChange} maxLength={9} placeholder="CEP*" required className="h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] px-4 font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase w-full outline-none text-base md:text-lg rounded-none" />
              <input name="street" value={formData.street} onChange={handleInputChange} placeholder="LOGRADOURO*" required className="h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] px-4 font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase w-full outline-none text-base md:text-lg rounded-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input name="number" value={formData.number} onChange={handleInputChange} placeholder="NÚMERO*" required className="h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] px-4 font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase w-full outline-none text-base md:text-lg rounded-none" />
              <input name="complement" value={formData.complement} onChange={handleInputChange} placeholder="COMPLEMENTO" className="h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] px-4 font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase w-full outline-none text-base md:text-lg rounded-none" />
            </div>

            <input name="neighborhood" value={formData.neighborhood} onChange={handleInputChange} placeholder="BAIRRO*" required className="h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] px-4 font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase w-full outline-none text-base md:text-lg rounded-none" />
            
            <div className="grid grid-cols-3 gap-4">
              <input name="city" value={formData.city} onChange={handleInputChange} placeholder="CIDADE*" required className="col-span-2 h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] px-4 font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase w-full outline-none text-base md:text-lg rounded-none" />
              <input name="state" value={formData.state} onChange={handleInputChange} placeholder="UF*" maxLength={2} required className="col-span-1 h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] px-4 font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase w-full outline-none text-base md:text-lg rounded-none" />
            </div>

            <div className="flex gap-4 mt-4">
              <button type="submit" className="flex-1 h-[62px] bg-[#CDF22B] font-bold text-[20px] text-[#FAFAFA] uppercase cursor-pointer hover:opacity-90 rounded-none">Salvar</button>
              <button type="button" onClick={handleCancel} className="flex-1 h-[62px] bg-[#0A0A0A]/25 font-bold text-[20px] text-[#FAFAFA] uppercase cursor-pointer hover:bg-[#0A0A0A]/40 rounded-none">Cancelar</button>
            </div>
          </form>
        )}
      </div>

      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0A0A]/50">
          <div className="bg-[#FAFAFA] p-8 max-w-[400px] w-full flex flex-col gap-6 items-center text-center animate-fade-in shadow-xl">
            <h3 className="font-poppins font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase">
              Deseja apagar o endereço?
            </h3>
            <div className="flex gap-4 w-full">
              <button onClick={() => setDeleteModalId(null)} className="flex-1 h-[62px] bg-[#1E45FB] font-bold text-[18px] md:text-[20px] text-[#FAFAFA] uppercase cursor-pointer hover:opacity-90 rounded-none">
                Não
              </button>
              <button onClick={confirmDelete} className="flex-1 h-[62px] bg-[#D22A31] font-bold text-[18px] md:text-[20px] text-[#FAFAFA] uppercase cursor-pointer hover:opacity-90 rounded-none">
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}