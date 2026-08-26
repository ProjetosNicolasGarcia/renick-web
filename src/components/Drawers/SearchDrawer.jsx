import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';

export default function SearchDrawer() {
  const { isSearchOpen, closeAll } = useUiStore();
  const navigate = useNavigate();

  if (!isSearchOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.target.search.value;
    if (!query) return;
    closeAll();
    navigate(`/products?q=${query}`);
  };

  // A classe lg:hidden garante que a gaveta funcione em tablets também
  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAFA] flex flex-col p-6 animate-fade-in lg:hidden">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-suez text-[32px] text-[#1E45FB] uppercase">Pesquisa</h2>
        <button onClick={closeAll} className="text-[#D22A31] font-bold text-[24px] cursor-pointer p-2">X</button>
      </div>

      <form onSubmit={handleSearch} className="relative w-full">
        <input 
          name="search"
          type="text" 
          autoFocus
          placeholder="DIGITE O QUE PROCURA" 
          className="h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase font-bold text-[16px] uppercase"
        />
        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/25 cursor-pointer">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </button>
      </form>
    </div>
  );
}