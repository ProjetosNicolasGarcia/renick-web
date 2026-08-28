import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import ProductCard from '../components/ProductCard';

export default function Product() {
  const { id } = useParams();
  const { product, related, fetchProductData, isLoading, clearProduct } = useProductStore();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [mainImage, setMainImage] = useState('');

  useEffect(() => {
    fetchProductData(id);
    window.scrollTo(0, 0);
    return () => clearProduct();
  }, [id, fetchProductData, clearProduct]);

  const uniqueColors = [];
  if (product) {
    const map = new Map();
    for (const item of product.variants) {
      if (!map.has(item.color_hex)) {
        map.set(item.color_hex, true);
        uniqueColors.push({ hex: item.color_hex, name: item.color_name });
      }
    }
  }

  useEffect(() => {
    if (product && uniqueColors.length > 0 && !selectedColor) {
      setSelectedColor(uniqueColors[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product && selectedColor) {
      const slugCor = selectedColor.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const fotosCor = product.images.filter(img => img.color_slug === slugCor || !img.color_slug);
      
      setCarouselImages(fotosCor);
      if (fotosCor.length > 0) setMainImage(fotosCor[0].url);
    }
  }, [selectedColor, product]);

  if (isLoading || !product) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-poppins font-bold text-[20px] text-[#1E45FB] uppercase">Carregando...</div>;
  }

  const uniqueSizes = [...new Set(product.variants.map(v => v.size))];
  const activeVariant = product.variants.find(v => v.size === selectedSize && v.color_hex === selectedColor?.hex);
  
  const currentPrice = Number(activeVariant ? activeVariant.price : product.price);
  const rawPromo = activeVariant ? activeVariant.promo_price : product.promotional_price;
  const currentPromo = rawPromo ? Number(rawPromo) : null;

  // Lógica de validação de estoque
  const isOutOfStock = activeVariant && activeVariant.stock_quantity === 0;
  const isSelectionComplete = selectedSize && selectedColor;

  return (
    <div className="w-full bg-[#FAFAFA] pb-16 pt-8 md:pt-12 px-4 md:px-0 lg:px-0 max-w-[1440px] mx-auto flex flex-col gap-12 md:gap-16">
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 lg:gap-16 md:px-16">
        
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-[3/4] md:aspect-square bg-[#F5F5F5] relative p-0 md:p-4">
            <img src={mainImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-all duration-300" />
            <button aria-label="Favoritar" className="absolute top-4 right-4 z-10 text-[#0A0A0A] hover:text-[#D22A31] transition-colors cursor-pointer bg-[#FAFAFA]/50 rounded-full p-2 backdrop-blur-sm">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </button>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {carouselImages.map((img, idx) => (
              <button key={idx} onClick={() => setMainImage(img.url)} className={`shrink-0 w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-[#F5F5F5] cursor-pointer transition-all ${mainImage === img.url ? 'border-2 border-[#1E45FB]' : 'border border-transparent hover:border-[#0A0A0A]/25'}`}>
                <img src={img.url} alt={`Thumb ${idx}`} className="w-full h-full object-contain mix-blend-multiply p-1" />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-6 pt-2">
          <h1 className="font-suez text-[32px] md:text-[40px] text-[#0A0A0A] uppercase leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-baseline gap-4 -mt-2">
            {currentPromo ? (
              <>
                <span className="font-poppins font-bold text-[32px] md:text-[40px] text-[#CDF22B]">
                  R$ {currentPromo.toFixed(2).replace('.', ',')}
                </span>
                <span className="font-poppins font-bold text-[18px] md:text-[24px] text-[#0A0A0A]/25 line-through">
                  R$ {currentPrice.toFixed(2).replace('.', ',')}
                </span>
              </>
            ) : (
              <span className="font-poppins font-bold text-[32px] md:text-[40px] text-[#0A0A0A]">
                R$ {currentPrice.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          
          <p className="font-poppins font-bold text-[12px] md:text-[14px] text-[#0A0A0A]/60 uppercase mt-[-16px]">
            {product.installment_info}
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <span className="font-poppins font-bold text-[20px] text-[#0A0A0A] uppercase">Selecionar Tamanho</span>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {uniqueSizes.map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`w-[48px] h-[48px] flex items-center justify-center font-suez text-[20px] md:text-[24px] cursor-pointer transition-colors ${selectedSize === size ? 'bg-[#1E45FB] text-[#FAFAFA]' : 'bg-[#E5E5E5] text-[#0A0A0A]/25 hover:bg-[#0A0A0A]/20'}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <span className="font-poppins font-bold text-[20px] text-[#0A0A0A] uppercase">Selecionar Cor</span>
            <div className="flex flex-wrap gap-3">
              {uniqueColors.map(color => (
                <button 
                  key={color.hex} 
                  onClick={() => setSelectedColor(color)}
                  aria-label={color.name}
                  style={{ backgroundColor: color.hex }}
                  className={`w-[48px] h-[48px] cursor-pointer transition-all ${selectedColor?.hex === color.hex ? 'border-2 border-[#1E45FB] ring-2 ring-white ring-inset' : 'border border-[#0A0A0A]/25 hover:opacity-80'}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button 
              disabled={!isSelectionComplete || isOutOfStock}
              className={`h-[62px] w-full font-poppins font-bold text-[20px] uppercase rounded-none transition-all duration-300 ${
                !isSelectionComplete 
                  ? 'bg-[#E5E5E5] text-[#0A0A0A]/50 cursor-not-allowed' 
                  : isOutOfStock 
                    ? 'bg-[#D22A31] text-[#FAFAFA] cursor-not-allowed opacity-80' 
                    : 'bg-[#CDF22B] text-[#FAFAFA] cursor-pointer hover:opacity-90'
              }`}
            >
              {!isSelectionComplete ? 'Selecione as opções' : (isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho')}
            </button>
            
            <div className="flex gap-4 w-full">
              <input 
                type="text" 
                placeholder="CEP" 
                className="flex-1 min-w-0 h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] px-4 font-poppins font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase outline-none text-[16px] rounded-none transition-colors" 
              />
              <button className="shrink-0 h-[62px] px-6 md:px-8 bg-[#1E45FB] text-[#FAFAFA] font-poppins font-bold text-[20px] uppercase cursor-pointer hover:opacity-90 rounded-none transition-opacity">
                Calcular
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 w-full md:px-16">
        <h2 className="font-suez text-[32px] text-[#1E45FB] uppercase">Descrição</h2>
        <p className="font-poppins font-bold text-[16px] text-[#0A0A0A] leading-relaxed max-w-4xl">
          {product.description}
        </p>
      </div>

      <div className="flex flex-col gap-6 w-full md:px-16">
        <h2 className="font-suez text-[24px] md:text-[32px] text-[#1E45FB] uppercase">Você Também Pode Gostar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {related.map(prod => <ProductCard key={prod.id} product={prod} />)}
        </div>
      </div>

    </div>
  );
}