import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUiStore } from '../stores/useUiStore';
import { useAuthStore } from '../stores/useAuthStore';
import { useCartStore } from '../stores/useCartStore';

export default function Header() {
  const { toggleMenu, toggleCart, toggleSearch, categories } = useUiStore();
  const { isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  
  // Verifica se o usuário está na Landing Page
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      // Ativa o background sólido após 20px de rolagem
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleUserClick = () => {
    navigate(isAuthenticated ? '/profile' : '/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = e.currentTarget.elements.search.value;
    if (!query) return;
    navigate(`/products?q=${query}`);
  };

  // Classes dinâmicas baseadas na rota e no scroll
  const headerClasses = `
    min-h-[90px] w-full flex items-center justify-between px-4 md:px-8 lg:px-16 z-40 transition-all duration-300 
    ${isHome ? 'fixed top-0 left-0' : 'sticky top-0'} 
    ${isHome && !isScrolled ? 'bg-transparent' : 'bg-[#CDF22B] shadow-sm'}
  `;

  return (
    <header className={headerClasses}>
      
      <div className="flex items-center gap-4 lg:gap-12 h-full">
        <button aria-label="Menu" onClick={toggleMenu} className="md:hidden text-[#FAFAFA] p-2 cursor-pointer z-10 -ml-2 shrink-0 hover:scale-105 transition-transform">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="shrink-0 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
          <img src="/Frame 1.png" alt="Renick" className="h-12 md:h-14 lg:h-16 object-contain drop-shadow-md" />
        </Link>

        <nav className="hidden md:flex gap-4 lg:gap-8 items-center h-full">
          <Link to="/products?is_sale=true" className="font-bold text-[#FAFAFA] text-[16px] lg:text-[18px] uppercase hover:opacity-80 transition-opacity whitespace-nowrap h-full flex items-center drop-shadow-md">
            Promoções
          </Link>
          
          {categories.map((cat) => (
            <div key={cat.id} className="relative group h-full flex items-center">
              <Link 
                to={`/products?gender=${cat.slug}`} 
                className="font-bold text-[#FAFAFA] text-[16px] lg:text-[18px] uppercase hover:opacity-80 transition-opacity flex items-center gap-1 whitespace-nowrap h-full drop-shadow-md"
              >
                {cat.name}
                <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"/>
                </svg>
              </Link>

              {cat.subcategories && cat.subcategories.length > 0 && (
                <div className="absolute top-full left-0 hidden group-hover:flex flex-col bg-[#FAFAFA] shadow-lg border-t-4 border-[#1E45FB] min-w-[220px] py-2 z-50 animate-fade-in">
                  {cat.subcategories.map((sub) => (
                    <Link 
                      key={sub.id} 
                      to={`/products?type=${sub.slug}`} 
                      className="px-6 py-3 font-bold text-[#0A0A0A] text-[16px] uppercase hover:bg-[#E5E5E5] transition-colors"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2 md:gap-4 lg:gap-6 shrink-0">
        <form onSubmit={handleSearch} className="hidden lg:flex relative w-[220px] xl:w-[300px]">
          <input 
            name="search"
            type="text" 
            placeholder="O QUE VOCÊ PROCURA?" 
            className="w-full h-[48px] bg-[#FAFAFA] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 font-bold uppercase rounded-none text-[14px] lg:text-[16px] shadow-sm focus:ring-2 focus:ring-[#1E45FB]"
          />
          <button aria-label="Pesquisar" type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0A0A0A]/25 hover:text-[#0A0A0A] cursor-pointer transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          </button>
        </form>

        <button aria-label="Buscar" onClick={toggleSearch} className="lg:hidden text-[#FAFAFA] p-2 cursor-pointer hover:scale-105 transition-transform">
          <svg className="w-6 h-6 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </button>

        <button aria-label="Usuário" onClick={handleUserClick} className="text-[#FAFAFA] p-2 cursor-pointer hover:scale-105 transition-transform">
          <svg className="w-7 h-7 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        </button>

        <button aria-label="Carrinho" onClick={toggleCart} className="text-[#FAFAFA] p-2 cursor-pointer hover:scale-105 transition-transform relative">
          <svg className="w-7 h-7 drop-shadow-md" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          {items.length > 0 && (
            <span className="absolute top-0 right-0 bg-[#D22A31] text-[#FAFAFA] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md animate-bounce">
              {items.length}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}