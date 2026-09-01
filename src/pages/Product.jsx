import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';
import { useCartStore } from '../stores/useCartStore';
import { useUiStore } from '../stores/useUiStore';
import ProductCard from '../components/ProductCard';

export default function Product() {
  const { id } = useParams();
  const { product, related, fetchProductData, isLoading, clearProduct } = useProductStore();
  const { addItem, isLoading: isCartLoading } = useCartStore();
  const { toggleCart } = useUiStore();

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [carouselImages, setCarouselImages] = useState([]);
  const [mainImage, setMainImage] = useState('');
  
  // Controle de Quantidade
  const [quantity, setQuantity] = useState(1);
  const [isCustomQty, setIsCustomQty] = useState(false);

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
      const fotosCor = product.images?.filter(img => 
        typeof img === 'string' ? true : (img.color_slug === slugCor || !img.color_slug)
      ) || [];
      
      setCarouselImages(fotosCor);
      if (fotosCor.length > 0) {
        setMainImage(typeof fotosCor[0] === 'string' ? fotosCor[0] : fotosCor[0].url);
      }
    }
  }, [selectedColor, product]);

  const uniqueSizes = [...new Set(product?.variants?.map(v => v.size) || [])];
  const activeVariant = product?.variants?.find(v => v.size === selectedSize && v.color_hex === selectedColor?.hex);
  
  // Reseta a quantidade quando a variante for trocada
  useEffect(() => {
    setQuantity(1);
    setIsCustomQty(false);
  }, [activeVariant]);

  if (isLoading || !product) {
    return <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center font-poppins font-bold text-[20px] text-[#1E45FB] uppercase">Carregando...</div>;
  }

  const currentPrice = Number(activeVariant ? activeVariant.price : product.price);
const rawPromo = activeVariant 
  ? (activeVariant.promo_price || activeVariant.promotional_price) 
  : product.promotional_price;
  const currentPromo = rawPromo ? Number(rawPromo) : null;

  const isOutOfStock = activeVariant && activeVariant.stock_quantity === 0;
  const isSelectionComplete = selectedSize && selectedColor;
  const maxStock = activeVariant?.stock_quantity || 1;
  
  const fallbackImage = typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url;
  const displayImage = mainImage || fallbackImage || 'https://via.placeholder.com/600x800?text=Sem+Imagem';

  const handleQtyInput = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val === '') {
      setQuantity('');
      return;
    }
    val = parseInt(val, 10);
    if (val > maxStock) val = maxStock;
    setQuantity(val);
  };

  const handleQtyBlur = () => {
    if (quantity === '' || quantity < 1) setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!isSelectionComplete || !activeVariant || isOutOfStock) return;
    const finalQty = quantity === '' || quantity < 1 ? 1 : quantity;
    const success = await addItem(activeVariant.id, finalQty);
    if (success) toggleCart();
  };

  return (
    <div className="w-full bg-[#FAFAFA] pb-16 pt-8 md:pt-12 px-4 md:px-0 lg:px-0 max-w-[1440px] mx-auto flex flex-col gap-12 md:gap-16">
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-12 lg:gap-16 md:px-16">
        
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="w-full aspect-[3/4] md:aspect-square bg-[#F5F5F5] relative p-0 md:p-4">
            <img src={displayImage} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-all duration-300" />
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {carouselImages.map((img, idx) => {
              const imgUrl = typeof img === 'string' ? img : img.url;
              return (
                <button key={idx} onClick={() => setMainImage(imgUrl)} className={`shrink-0 w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-[#FAFAFA] cursor-pointer transition-all ${mainImage === imgUrl ? 'border-2 border-[#1E45FB]' : 'border border-[#0A0A0A]/25 hover:border-[#0A0A0A]'}`}>
                  <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-contain mix-blend-multiply p-1" />
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col gap-6 pt-2">
          <h1 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase leading-tight">
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
            {product.installment_info || "5% OFF no Pix ou em até 3x sem juros"}
          </p>

          <div className="flex flex-col gap-3 mt-4">
            <span className="font-poppins font-bold text-[20px] text-[#0A0A0A] uppercase">Selecionar Tamanho</span>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {uniqueSizes.map(size => (
                <button 
                  key={size} 
                  onClick={() => setSelectedSize(size)}
                  className={`w-[48px] h-[48px] flex items-center justify-center font-poppins font-bold text-[20px] md:text-[24px] cursor-pointer transition-colors ${selectedSize === size ? 'bg-[#1E45FB] text-[#FAFAFA]' : 'bg-[#FAFAFA] text-[#0A0A0A]/25 border border-[#0A0A0A]/25 hover:border-[#0A0A0A] hover:text-[#0A0A0A]'}`}
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
                  className={`w-[48px] h-[48px] cursor-pointer transition-all ${selectedColor?.hex === color.hex ? 'border-2 border-[#1E45FB] ring-2 ring-[#FAFAFA] ring-inset' : 'border border-[#0A0A0A]/25 hover:opacity-80'}`}
                />
              ))}
            </div>
          </div>

          {/* Seletor de Quantidade Híbrido com altura de 62px */}
          <div className="flex flex-col gap-3 mt-2 w-full">
            <span className="font-poppins font-bold text-[20px] text-[#0A0A0A] uppercase">Quantidade</span>
            <div className="flex items-center justify-between gap-4 w-full">
              
              <div className="flex-1 relative">
                {isCustomQty ? (
                  <>
                    <input 
                      type="text" 
                      value={quantity} 
                      onChange={handleQtyInput} 
                      onBlur={handleQtyBlur}
                      placeholder="Qtd"
                      className="w-full h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 px-4 pr-12 font-poppins font-bold text-[16px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] transition-colors uppercase"
                    />
                    <button 
                      onClick={() => { setIsCustomQty(false); setQuantity(1); }} 
                      className="absolute right-0 top-0 h-full px-4 flex items-center text-[#0A0A0A]/50 hover:text-[#D22A31] transition-colors cursor-pointer"
                      aria-label="Cancelar edição de quantidade"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <select 
                    value={quantity} 
                    onChange={(e) => {
                      if (e.target.value === 'more') setIsCustomQty(true);
                      else setQuantity(Number(e.target.value));
                    }}
                    disabled={!isSelectionComplete || isOutOfStock}
                    className="w-full h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 px-4 font-poppins font-bold text-[16px] text-[#0A0A0A] outline-none focus:border-[#0A0A0A] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%230A0A0A'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                  >
                    {activeVariant ? (
                      <>
                        {Array.from({ length: Math.min(5, maxStock) }, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num} unidade{num > 1 ? 's' : ''}</option>
                        ))}
                        {maxStock > 5 && <option value="more">Mais de 5 unidades</option>}
                      </>
                    ) : (
                      <option value="1">1 unidade</option>
                    )}
                  </select>
                )}
              </div>

              <div className="shrink-0 text-right">
                {activeVariant && !isOutOfStock ? (
                  <span className="font-poppins font-bold text-[#0A0A0A]/50 text-[12px] md:text-[14px] uppercase">
                    ({maxStock} disponíveis)
                  </span>
                ) : (
                  <span className="font-poppins font-bold text-transparent text-[12px] md:text-[14px] uppercase select-none">
                    (0 disponíveis)
                  </span>
                )}
              </div>

            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button 
              onClick={handleAddToCart}
              disabled={!isSelectionComplete || isOutOfStock || isCartLoading}
              className={`h-[62px] w-full font-poppins font-bold text-[20px] uppercase rounded-none transition-all duration-300 ${
                !isSelectionComplete || isCartLoading
                  ? 'bg-[#FAFAFA] text-[#0A0A0A]/25 border border-[#0A0A0A]/25 cursor-not-allowed' 
                  : isOutOfStock 
                    ? 'bg-[#D22A31] text-[#FAFAFA] cursor-not-allowed opacity-80' 
                    : 'bg-[#CDF22B] text-[#FAFAFA] cursor-pointer hover:opacity-90'
              }`}
            >
              {isCartLoading ? 'Adicionando...' : (!isSelectionComplete ? 'Selecione as opções' : (isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'))}
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