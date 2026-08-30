import React, { useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import { useUiStore } from '../stores/useUiStore';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import FilterDrawer from '../components/Drawers/FilterDrawer';

export default function Listing() {
  const [searchParams] = useSearchParams();
  const { list, fetchProductsList, isLoadingList } = useProductStore();
  const { toggleFilter } = useUiStore();
  const location = useLocation();

  // Impede pulos ao digitar: o Scroll ao topo só ocorre quando o usuário navega entre rotas diferentes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Carrega limite de 100 itens para evitar cortes na listagem
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    params.per_page = 100;
    fetchProductsList(params);
  }, [searchParams, fetchProductsList]);

  // Inteligência de Títulos Limpa
  let pageTitle = "Catálogo";
  const paramsCount = Array.from(searchParams.keys()).filter(k => k !== 'page' && k !== 'per_page').length;

  if (paramsCount > 1) {
    pageTitle = "Resultados";
  } else if (paramsCount === 1) {
    if (searchParams.get('q')) pageTitle = `Resultados para "${searchParams.get('q')}"`;
    else if (searchParams.get('collection')) pageTitle = `Coleção ${searchParams.get('collection')}`;
    else if (searchParams.get('type')) pageTitle = searchParams.get('type').replace(/-/g, ' ');
    else if (searchParams.get('gender')) pageTitle = searchParams.get('gender');
    else if (searchParams.get('size')) pageTitle = `Tamanho ${searchParams.get('size')}`;
    else if (searchParams.get('is_sale') === 'true') pageTitle = "Promoções";
    else pageTitle = "Resultados";
  }

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16 pt-8 px-4 md:px-16 max-w-[1440px] mx-auto flex flex-col gap-6">
      
      <div className="flex justify-between items-end border-b border-[#0A0A0A]/10 pb-4">
        <h1 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase truncate">
          {pageTitle}
        </h1>
        
        {/* Ícone de Funil para Dispositivos Móveis */}
        <button onClick={toggleFilter} aria-label="Filtrar" className="lg:hidden flex items-center justify-center w-12 h-12 bg-[#FAFAFA] border-2 border-[#1E45FB] text-[#1E45FB] transition-colors cursor-pointer mb-2 shrink-0 ml-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      <div className="flex gap-8 items-start w-full relative">
        <FilterSidebar />
        
        <div className="flex-1 w-full">
          {isLoadingList ? (
            <div className="w-full py-20 flex justify-center font-poppins font-bold text-[20px] text-[#0A0A0A]/25 uppercase">
              Buscando produtos...
            </div>
          ) : list.length === 0 ? (
            <div className="w-full py-20 flex justify-center font-poppins font-bold text-[20px] text-[#0A0A0A] uppercase">
              Nenhum produto encontrado.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
              {list.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
      
      <FilterDrawer />
    </div>
  );
}