import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';

export default function MenuDrawer() {
  const { isMenuOpen, closeAll } = useUiStore();
  const navigate = useNavigate();
  
  // Controle do acordeão para expandir/recolher subcategorias
  const [openDept, setOpenDept] = useState(null);

  if (!isMenuOpen) return null;

  // Mesma estrutura isolada adotada no Header
  const navigationMenu = [
    { id: 'masc', name: 'Masculino', slug: 'masculino' },
    { id: 'fem', name: 'Feminino', slug: 'feminino' },
    { id: 'beb', name: 'Bebês', slug: 'bebes' },
  ];

  const subcategoriesBase = [
    { name: 'Camisetas', slug: 'camisetas' },
    { name: 'Camisas', slug: 'camisas' },
    { name: 'Casacos', slug: 'casacos' },
    { name: 'Calças', slug: 'calcas' },
    { name: 'Bermudas', slug: 'bermudas' },
    { name: 'Conjuntos', slug: 'conjuntos' },
  ];

  const handleNavigate = (path) => {
    closeAll();
    navigate(path);
  };

  const toggleDept = (id) => {
    setOpenDept(openDept === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0A]/50 flex lg:hidden animate-fade-in">
      
      {/* Container principal da gaveta */}
      <div className="w-[80%] max-w-sm h-[100dvh] bg-[#FAFAFA] flex flex-col shadow-xl">
        <div className="flex justify-between items-center p-6 border-b border-[#0A0A0A]/10 shrink-0">
          <h2 className="font-suez text-[28px] text-[#1E45FB] uppercase">Menu</h2>
          <button onClick={closeAll} aria-label="Fechar" className="text-[#D22A31] font-bold text-[24px] cursor-pointer p-2">
            X
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col py-4">
          <button 
            onClick={() => handleNavigate('/products?is_sale=true')}
            className="w-full text-left px-6 py-4 font-poppins font-bold text-[18px] text-[#0A0A0A] uppercase hover:bg-[#E5E5E5] transition-colors"
          >
            Promoções
          </button>

          {navigationMenu.map((dept) => (
            <div key={dept.id} className="flex flex-col border-b border-[#0A0A0A]/10">
              {/* Botão principal do Departamento (Acordeão) */}
              <button 
                className="w-full flex justify-between items-center px-6 py-4 hover:bg-[#E5E5E5] transition-colors cursor-pointer" 
                onClick={() => toggleDept(dept.id)}
              >
                <span className="font-poppins font-bold text-[18px] text-[#0A0A0A] uppercase">{dept.name}</span>
                <svg className={`w-6 h-6 text-[#0A0A0A] transition-transform duration-300 ${openDept === dept.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Subcategorias visíveis quando expandido */}
              {openDept === dept.id && (
                <div className="flex flex-col bg-[#F5F5F5] py-2 animate-fade-in">
                  <button 
                    onClick={() => handleNavigate(`/products?gender=${dept.slug}`)}
                    className="w-full text-left px-8 py-3 font-poppins font-bold text-[16px] text-[#1E45FB] uppercase hover:bg-[#E5E5E5] transition-colors"
                  >
                    Tudo de {dept.name}
                  </button>
                  
                  {subcategoriesBase.map(sub => (
                    <button 
                      key={sub.slug}
                      onClick={() => handleNavigate(`/products?gender=${dept.slug}&type=${sub.slug}`)}
                      className="w-full text-left px-8 py-3 font-poppins font-bold text-[16px] text-[#0A0A0A]/80 uppercase hover:text-[#0A0A0A] hover:bg-[#E5E5E5] transition-colors"
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Overlay transparente clicável para fechar o menu ao clicar fora */}
      <div className="flex-1" onClick={closeAll}></div>
    </div>
  );
}