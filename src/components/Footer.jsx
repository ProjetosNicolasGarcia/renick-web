import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faYoutube, faTiktok } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-[#1E45FB] w-full px-4 md:px-16 py-12 mt-auto flex flex-col font-poppins">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 w-full max-w-6xl mx-auto">
        
        <div className="flex flex-col gap-4">
          <h3 className="font-suez text-[20px] md:text-[24px] text-[#CDF22B] uppercase">Institucional</h3>
          <div className="flex flex-col gap-3 font-bold text-[16px] text-[#FAFAFA] uppercase">
            <Link to="/sobre-nos" className="cursor-pointer">Sobre Nós</Link>
            <Link to="/privacidade" className="cursor-pointer">Política de Privacidade</Link>
            <Link to="/termos" className="cursor-pointer">Termos de Uso</Link>
            <Link to="/acessibilidade" className="cursor-pointer">Acessibilidade</Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-suez text-[20px] md:text-[24px] text-[#CDF22B] uppercase">Ajuda</h3>
          <div className="flex flex-col gap-3 font-bold text-[16px] text-[#FAFAFA] uppercase">
            <Link to="/suporte" className="cursor-pointer">Suporte</Link>
            <Link to="/faq" className="cursor-pointer">FAQ</Link>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-suez text-[20px] md:text-[24px] text-[#CDF22B] uppercase">Redes Sociais</h3>
          <div className="flex gap-6 font-bold text-[28px] text-[#FAFAFA]">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="cursor-pointer">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="cursor-pointer">
              <FontAwesomeIcon icon={faYoutube} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="cursor-pointer">
              <FontAwesomeIcon icon={faTiktok} />
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-suez text-[20px] md:text-[24px] text-[#CDF22B] uppercase">Pagamento</h3>
          <div className="flex items-center">
            {/* Logo do Mercado Pago ampliada consideravelmente */}
            <img 
              src="/MP_RGB_HANDSHAKE_pluma_horizontal.png" 
              alt="Mercado Pago" 
              className="h-16 md:h-20 lg:h-24 max-w-[200px] object-contain -ml-2" 
            />
          </div>
        </div>
        
      </div>

      <div className="w-full max-w-6xl mx-auto border-t border-[#FAFAFA]/20 pt-6 mt-12 text-center md:text-left">
        <span className="font-bold text-[14px] text-[#FAFAFA] uppercase tracking-wider">
          RENICK KIDS © 2026
        </span>
      </div>
    </footer>
  );
}