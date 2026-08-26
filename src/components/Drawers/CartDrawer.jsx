import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';
import { useCartStore } from '../../stores/useCartStore';

export default function CartDrawer() {
  const { isCartOpen, closeAll } = useUiStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    closeAll();
    navigate('/checkout'); // O roteamento ira gerenciar se manda pro login ou nao
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-[#0A0A0A]/50" onClick={closeAll}></div>
      <div className="relative w-full max-w-[400px] bg-[#FAFAFA] h-full shadow-lg flex flex-col p-6 animate-slide-left">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-suez text-[32px] text-[#1E45FB] uppercase">Carrinho</h2>
          <button onClick={closeAll} className="text-[#D22A31] font-bold text-[24px] cursor-pointer p-2">X</button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto">
          {items.length === 0 ? (
            <p className="font-bold text-[20px] text-[#0A0A0A]/60 uppercase text-center">Sem itens no carrinho</p>
          ) : (
            <p>Lista de Itens aqui...</p>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-[#0A0A0A]/10">
          <button 
            onClick={handleCheckout}
            disabled={items.length === 0}
            className="cursor-pointer h-[62px] w-full bg-[#1E45FB] text-[#FAFAFA] font-bold text-[20px] uppercase disabled:opacity-50"
          >
            Finalizar Compra
          </button>
        </div>

      </div>
    </div>
  );
}