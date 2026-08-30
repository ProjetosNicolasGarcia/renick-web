import React, { useEffect } from 'react';
import { useFavoriteStore } from '../stores/useFavoriteStore';
import ProductCard from '../components/ProductCard';
import ProfileSidebar from '../components/ProfileSidebar';

export default function Favorites() {
  const { favorites, fetchFavorites, isLoading } = useFavoriteStore();

  useEffect(() => {
    fetchFavorites();
    window.scrollTo(0, 0);
  }, [fetchFavorites]);

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16 pt-8 md:pt-16 px-4 md:px-16 max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8 lg:gap-16">
      
      <ProfileSidebar />

      <div className="flex-1 w-full flex flex-col gap-6">
        <h2 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase border-b border-[#0A0A0A]/10 pb-4 mb-2">
          Favoritos
        </h2>

        {isLoading ? (
          <div className="py-20 text-center font-poppins font-bold text-[20px] text-[#0A0A0A]/25 uppercase">
            Carregando favoritos...
          </div>
        ) : favorites.length === 0 ? (
          <div className="py-20 text-center font-poppins font-bold text-[20px] text-[#0A0A0A] uppercase">
            Você ainda não possui favoritos salvos.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
            {favorites.map(fav => (
              <ProductCard key={fav.product.id} product={fav.product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}