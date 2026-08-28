import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLandingStore } from '../stores/useLandingStore';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const { banners, offers, newest, bestSellers, fetchLandingData, isLoading } = useLandingStore();
  const scrollRef = useRef(null);

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchLandingData();
  }, [fetchLandingData]);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentBannerIndex((current) => (current + 1) % banners.length);
          return 0;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [banners.length, currentBannerIndex]);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    setProgress(0);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
    setProgress(0);
  };

  const goToBanner = (index) => {
    setCurrentBannerIndex(index);
    setProgress(0);
  };

  const handleScroll = (offset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const sizes = ['1', '2', '3', '4', '6', '8', '10', '12', '14', '16'];

  if (isLoading) return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-bold text-[#1E45FB] uppercase">Carregando...</div>;

  return (
    <div className="flex flex-col w-full bg-[#FAFAFA] pb-16">
      
      {/* 1. Carrossel de Banners Principais - h-screen garante 100% de altura da tela */}
      <section className="w-full h-screen relative flex bg-[#E5E5E5] group overflow-hidden">
        {banners.length > 0 && (
          <>
            <Link to={banners[currentBannerIndex]?.link_url || '#'} className="w-full h-full block">
              {/* O elemento picture delega ao navegador a escolha da imagem ideal */}
              <picture className="w-full h-full block">
                <source 
                  media="(max-width: 768px)" 
                  srcSet={banners[currentBannerIndex]?.image_url_mobile || banners[currentBannerIndex]?.image_url} 
                />
                <img 
                  src={banners[currentBannerIndex]?.image_url} 
                  alt={`Banner ${currentBannerIndex + 1}`} 
                  className="w-full h-full object-cover object-center transition-opacity duration-500" 
                />
              </picture>
            </Link>

            {banners.length > 1 && (
              <>
                <button 
                  onClick={prevBanner} 
                  aria-label="Banner Anterior" 
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-10 p-2 text-[#FAFAFA] opacity-70 hover:opacity-100 transition-opacity cursor-pointer drop-shadow-lg"
                >
                  <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                </button>
                
                <button 
                  onClick={nextBanner} 
                  aria-label="Próximo Banner" 
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-10 p-2 text-[#FAFAFA] opacity-70 hover:opacity-100 transition-opacity cursor-pointer drop-shadow-lg"
                >
                  <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
                </button>

                <div className="absolute bottom-4 md:bottom-8 left-0 right-0 flex justify-center gap-2 md:gap-3 px-4 z-20">
                  {banners.map((_, index) => (
                    <div 
                      key={index} 
                      onClick={() => goToBanner(index)}
                      className="h-1 md:h-1.5 flex-1 max-w-16 bg-[#FAFAFA]/40 cursor-pointer overflow-hidden rounded-full shadow-sm"
                    >
                      <div 
                        className="h-full bg-[#FAFAFA]"
                        style={{
                          width: index === currentBannerIndex 
                            ? `${progress}%` 
                            : index < currentBannerIndex ? '100%' : '0%'
                        }}
                      ></div>
                    </div>
                  ))}
                </div>

                
              </>
            )}
          </>
        )}
      </section>

      {/* 2. Banners Masculino / Feminino */}
      <section className="flex flex-col md:flex-row w-full">
        <Link to="/products?gender=masculino" className="relative w-full md:w-1/2 overflow-hidden group block bg-[#1E45FB]">
          <img src="/banner-masculino.png" alt="Masculino" loading="lazy" className="w-full h-auto block opacity-90 group-hover:scale-105 transition-transform duration-500" />
          <h2 className="absolute bottom-6 md:bottom-10 left-6 md:left-10 font-suez text-[32px] md:text-[48px] text-[#FAFAFA] uppercase drop-shadow-md">Masculino</h2>
        </Link>
        <Link to="/products?gender=feminino" className="relative w-full md:w-1/2 overflow-hidden group block bg-[#D22A31]">
          <img src="/banner-feminino.png" alt="Feminino" loading="lazy" className="w-full h-auto block opacity-90 group-hover:scale-105 transition-transform duration-500" />
          <h2 className="absolute bottom-6 md:bottom-10 left-6 md:left-10 font-suez text-[32px] md:text-[48px] text-[#FAFAFA] uppercase drop-shadow-md">Feminino</h2>
        </Link>
      </section>

      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 mt-12 md:mt-20 flex flex-col gap-12 md:gap-16">
        
        <section className="flex flex-col gap-4">
          <h2 className="font-suez text-[24px] md:text-[32px] text-[#1E45FB] uppercase">Compre por Tamanho</h2>
          <div className="relative flex items-center w-full">
            
            <button aria-label="Anterior" onClick={() => handleScroll(-150)} className="md:hidden absolute -left-4 z-10 w-10 h-full flex items-center justify-start bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent text-[#1E45FB] cursor-pointer">
              <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
            </button>

            <div ref={scrollRef} className="flex gap-3 md:gap-6 overflow-x-auto py-2 scrollbar-hide w-full lg:justify-between scroll-smooth">
              {sizes.map(size => (
                <Link key={size} to={`/products?size=${size}`} className="shrink-0 flex items-center justify-center w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-[#CDF22B] text-[#FAFAFA] font-suez text-[24px] md:text-[36px] hover:opacity-90 transition-opacity cursor-pointer">
                  {size}
                </Link>
              ))}
            </div>

            <button aria-label="Próximo" onClick={() => handleScroll(150)} className="md:hidden absolute -right-4 z-10 w-10 h-full flex items-center justify-end bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent text-[#1E45FB] cursor-pointer">
              <svg className="w-8 h-8 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
            </button>
            
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-suez text-[24px] md:text-[32px] text-[#1E45FB] uppercase">Ofertas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {offers.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-suez text-[24px] md:text-[32px] text-[#1E45FB] uppercase">Novidades</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {newest.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="font-suez text-[24px] md:text-[32px] text-[#1E45FB] uppercase">Mais Buscados</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {bestSellers.map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>

      </div>
    </div>
  );
}