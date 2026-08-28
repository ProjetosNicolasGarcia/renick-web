import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import ProductCard from '../components/ProductCard';

export default function Listing() {
  const [searchParams] = useSearchParams();
  const { list, fetchProductsList, isLoadingList } = useProductStore();

  useEffect(() => {
    // converte URLSearchParams iteravel para objeto simples
    const params = Object.fromEntries([...searchParams]);
    fetchProductsList(params);
    window.scrollTo(0, 0);
  }, [searchParams, fetchProductsList]);

  // determina o titulo dinamico com base nos parametros
 let pageTitle = "Catálogo";
  if (searchParams.get('q')) pageTitle = `Resultados para "${searchParams.get('q')}"`;
  else if (searchParams.get('collection')) pageTitle = `Coleção ${searchParams.get('collection')}`;
  else if (searchParams.get('type')) pageTitle = searchParams.get('type').replace(/-/g, ' ');
  else if (searchParams.get('gender')) pageTitle = searchParams.get('gender');
  else if (searchParams.get('size')) pageTitle = `Tamanho ${searchParams.get('size')}`; // Adicionado
  else if (searchParams.get('is_sale') === 'true') pageTitle = "Promoções";

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16 pt-8 px-4 md:px-16 max-w-[1440px] mx-auto flex flex-col gap-6">
      
      <div className="flex justify-between items-end border-b border-[#0A0A0A]/10 pb-4">
        <h1 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase">
          {pageTitle}
        </h1>
        <button aria-label="Filtrar" className="text-[#0A0A0A] hover:text-[#1E45FB] transition-colors cursor-pointer mb-2">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 4C3 3.44772 3.44772 3 4 3H20C20.5523 3 21 3.44772 21 4V6.58579C21 6.851 20.8946 7.10536 20.7071 7.29289L14.2929 13.7071C14.1054 13.8946 14 14.149 14 14.4142V20C14 20.5523 13.5523 21 13 21H11C10.4477 21 10 20.5523 10 20V14.4142C10 14.149 9.89464 13.8946 9.70711 13.7071L3.29289 7.29289C3.10536 7.10536 3 6.851 3 6.58579V4Z" />
          </svg>
        </button>
      </div>

      {isLoadingList ? (
        <div className="w-full py-20 flex justify-center font-poppins font-bold text-[20px] text-[#0A0A0A]/25 uppercase">
          Buscando produtos...
        </div>
      ) : list.length === 0 ? (
        <div className="w-full py-20 flex justify-center font-poppins font-bold text-[20px] text-[#0A0A0A] uppercase">
          Nenhum produto encontrado.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {list.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}