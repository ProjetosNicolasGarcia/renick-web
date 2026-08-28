import React from 'react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <div className="flex flex-col bg-[#FAFAFA] p-0 group relative w-full h-full">
      
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#FAFAFA] shrink-0">
        <Link to={`/products/${product.id}`} className="block w-full h-full flex items-center justify-center p-2">
          <img 
            src={product.image_url || 'https://via.placeholder.com/400x533?text=Sem+Imagem'} 
            alt={product.name} 
            loading="lazy" 
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        <button aria-label="Favoritar" className="absolute top-3 right-3 z-10 text-[#0A0A0A] hover:text-[#D22A31] transition-colors cursor-pointer bg-[#FAFAFA]/50 rounded-full p-1.5 backdrop-blur-sm">
          <svg className="w-6 h-6 md:w-7 md:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </button>
      </div>
      
      <div className="flex flex-col flex-1 pt-3 gap-1">
        <h3 className="font-poppins font-bold text-[12px] md:text-[14px] text-[#0A0A0A] uppercase line-clamp-2 min-h-[36px] md:min-h-[42px]">
          {product.name}
        </h3>
        
        <div className="flex flex-wrap items-baseline gap-2 mt-1">
          {product.promotional_price ? (
            <>
              <span className="font-poppins font-bold text-[12px] md:text-[16px] text-[#0A0A0A]/25 line-through">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
              <span className="font-poppins font-bold text-[18px] md:text-[24px] text-[#CDF22B]">
                R$ {product.promotional_price.toFixed(2).replace('.', ',')}
              </span>
            </>
          ) : (
            <span className="font-poppins font-bold text-[18px] md:text-[24px] text-[#0A0A0A]">
              R$ {product.price.toFixed(2).replace('.', ',')}
            </span>
          )}
        </div>
        
        <p className="font-poppins font-bold text-[10px] md:text-[12px] text-[#0A0A0A]/60 uppercase">
          5% OFF NO PIX OU NO CARTÃO EM ATÉ  3X SEM JUROS
        </p>
        
        {/* mt-auto empurra o botão sempre para o limite inferior do card */}
        <button className="mt-auto h-[40px] md:h-[48px] w-full bg-[#CDF22B] text-[#FAFAFA] font-bold text-[14px] md:text-[16px] uppercase cursor-pointer lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
          Comprar
        </button>
      </div>
    </div>
  );
}