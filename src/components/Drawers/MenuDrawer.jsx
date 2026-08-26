import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';

export default function MenuDrawer() {
  const { isMenuOpen, closeAll, categories } = useUiStore();
  const [expandedCat, setExpandedCat] = useState(null);

  if (!isMenuOpen) return null;

  const handleToggle = (id) => {
    setExpandedCat(expandedCat === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-[#0A0A0A]/50" onClick={closeAll}></div>
      <div className="relative w-full max-w-[320px] bg-[#FAFAFA] h-full shadow-lg flex flex-col p-6 animate-slide-right">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-suez text-[32px] text-[#1E45FB] uppercase">Menu</h2>
          <button onClick={closeAll} className="text-[#D22A31] font-bold text-[24px] cursor-pointer p-2">X</button>
        </div>

        <div className="flex flex-col gap-6 overflow-y-auto">
          <Link to="/products?is_sale=true" onClick={closeAll} className="font-bold text-[20px] text-[#0A0A0A] uppercase cursor-pointer">
            Descontos
          </Link>
          
          {categories.map((cat) => (
            <div key={cat.id} className="flex flex-col gap-4">
              <button 
                onClick={() => handleToggle(cat.id)}
                className="flex justify-between items-center w-full font-bold text-[20px] text-[#0A0A0A] uppercase cursor-pointer"
              >
                {cat.name}
                <svg className={`w-5 h-5 transition-transform ${expandedCat === cat.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/></svg>
              </button>
              
              {expandedCat === cat.id && (
                <div className="flex flex-col gap-4 pl-4 border-l-2 border-[#0A0A0A]/10">
                  {cat.subcategories?.map((sub) => (
                    <Link 
                      key={sub.id} 
                      to={`/products?type=${sub.slug}`} 
                      onClick={closeAll}
                      className="font-bold text-[16px] text-[#0A0A0A] uppercase cursor-pointer"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}