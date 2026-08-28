import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';
import { api } from '../../services/api';

export default function SearchDrawer() {
  const { isSearchOpen, closeAll } = useUiStore();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      const trimmed = query.trim();
      if (trimmed) {
        setIsSearching(true);
        try {
          const res = await api.get('/products', { params: { q: trimmed, per_page: 5 } });
          setResults(res.data.data || []);
        } catch (e) {
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [query, isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      closeAll();
      navigate(`/products?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAFA]/95 backdrop-blur-sm flex flex-col p-6 animate-fade-in lg:hidden h-[100dvh]">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="font-suez text-[32px] text-[#1E45FB] uppercase">Pesquisa</h2>
        <button onClick={closeAll} aria-label="Fechar" className="text-[#D22A31] font-bold text-[24px] cursor-pointer p-2">X</button>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative w-full shrink-0 shadow-sm mb-4">
        <input 
          name="search"
          type="text" 
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="DIGITE O QUE PROCURA" 
          className="h-[62px] w-full bg-[#FAFAFA] border-2 border-[#1E45FB] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase font-bold text-[16px] uppercase transition-colors"
        />
        <button aria-label="Pesquisar" type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/25 hover:text-[#1E45FB] cursor-pointer transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </button>
      </form>

      {/* min-h-0 é crucial aqui para permitir o overflow dentro de um Flex container no Safari/iOS */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pb-4">
        {isSearching ? (
          <span className="font-poppins font-bold text-[16px] text-[#0A0A0A]/50 uppercase">Buscando...</span>
        ) : results.length > 0 ? (
          <>
            {results.map(prod => (
              <Link 
                key={prod.id} 
                onClick={closeAll} 
                to={`/products/${prod.id}`} 
                className="flex gap-4 items-center bg-[#FAFAFA] p-2 hover:opacity-80 transition-opacity border-b border-[#0A0A0A]/10"
              >
                <div className="w-[80px] h-[80px] bg-[#F5F5F5] shrink-0 p-1">
                  <img src={prod.image_url || 'https://via.placeholder.com/80'} alt={prod.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-poppins font-bold text-[14px] text-[#0A0A0A] uppercase line-clamp-2">{prod.name}</span>
                  <div className="flex items-baseline gap-2">
                    {prod.promotional_price ? (
                      <>
                        <span className="font-poppins font-bold text-[12px] text-[#0A0A0A]/25 line-through">
                          R$ {Number(prod.price).toFixed(2).replace('.', ',')}
                        </span>
                        <span className="font-poppins font-bold text-[16px] text-[#CDF22B]">
                          R$ {Number(prod.promotional_price).toFixed(2).replace('.', ',')}
                        </span>
                      </>
                    ) : (
                      <span className="font-poppins font-bold text-[16px] text-[#0A0A0A]">
                        R$ {Number(prod.price).toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
            <button onClick={handleSearchSubmit} className="mt-4 shrink-0 min-h-[62px] w-full bg-[#CDF22B] text-[#FAFAFA] font-poppins font-bold text-[20px] uppercase cursor-pointer hover:opacity-90 transition-opacity">
              Ver todos os resultados
            </button>
          </>
        ) : query.trim() ? (
          <span className="font-poppins font-bold text-[16px] text-[#0A0A0A]/50 uppercase">Nenhum produto encontrado.</span>
        ) : null}
      </div>
    </div>
  );
}