import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';
import { useCartStore } from '../../stores/useCartStore';
import { useAuthStore } from '../../stores/useAuthStore';

export default function CartDrawer() {
  const { isCartOpen, toggleCart } = useUiStore();
  const { cart, removeItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const items = cart?.items || [];
  const discount = cart?.discount || 0;

  const handleCheckoutClick = () => {
    toggleCart(); 
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-poppins">
      <div className="fixed inset-0 bg-[#0A0A0A]/50 transition-opacity cursor-pointer" onClick={toggleCart}></div>
      <div className="relative w-full max-w-[400px] bg-[#FAFAFA] h-full shadow-lg flex flex-col p-6 animate-slide-left">
        
        <div className="flex justify-between items-center mb-8 shrink-0">
          <h2 className="font-suez text-[32px] text-[#1E45FB] uppercase">Carrinho</h2>
          <button 
            onClick={toggleCart} 
            className="text-[#D22A31] font-bold text-[32px] cursor-pointer leading-none hover:opacity-70 transition-opacity"
            aria-label="Fechar carrinho"
          >
            X
          </button>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto pr-2 gap-8 scrollbar-hide">
          {items.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="font-bold text-[20px] text-[#0A0A0A]/60 uppercase text-center">
                Sem itens no carrinho
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-[100px] h-[120px] bg-[#F1F1F1] shrink-0 p-2 flex items-center justify-center">
                  <img 
                    src={item.image_url || 'https://via.placeholder.com/120x140?text=Sem+Imagem'} 
                    alt={item.product_name} 
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                
                <div className="flex flex-col justify-between py-1 flex-1 min-w-0">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-[16px] text-[#0A0A0A] uppercase leading-tight truncate">
                      {item.product_name}
                    </span>
                    <span className="font-bold text-[12px] text-[#0A0A0A] uppercase">
                      Cor: {item.color}
                    </span>
                    <span className="font-bold text-[12px] text-[#0A0A0A] uppercase">
                      Tamanho: {item.size}
                    </span>
                    <span className="font-bold text-[12px] text-[#0A0A0A] uppercase">
                      Quantidade: {item.quantity}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-baseline gap-2 mt-2">
                    {item.original_price > item.unit_price ? (
                      <>
                        <span className="font-bold text-[14px] text-[#0A0A0A]/25 line-through">
                          R${item.original_price.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="font-bold text-[20px] text-[#CDF22B]">
                          R${item.unit_price.toFixed(2).replace('.', ',')}
                        </span>
                      </>
                    ) : (
                      <span className="font-bold text-[20px] text-[#0A0A0A]">
                        R${item.unit_price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  aria-label="Remover item"
                  className="p-1 text-[#0A0A0A]/25 hover:text-[#D22A31] transition-colors cursor-pointer self-start shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#0A0A0A]/10 shrink-0 flex flex-col gap-4">
            
            <div className="flex justify-between items-center px-1">
              <span className="font-bold text-[18px] text-[#0A0A0A] uppercase">Subtotal</span>
              <span className="font-bold text-[24px] text-[#0A0A0A]">
                R${cart.subtotal.toFixed(2).replace('.', ',')}
              </span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between items-center px-1">
                <span className="font-bold text-[16px] text-[#0A0A0A] uppercase">Você economizou</span>
                <span className="font-bold text-[20px] text-[#CDF22B]">
                  R${discount.toFixed(2).replace('.', ',')}
                </span>
              </div>
            )}

            <button 
              onClick={handleCheckoutClick}
              className="cursor-pointer h-[62px] w-full bg-[#1E45FB] text-[#FAFAFA] font-bold text-[20px] md:text-[24px] uppercase hover:opacity-90 transition-opacity"
            >
              Finalizar Compra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}