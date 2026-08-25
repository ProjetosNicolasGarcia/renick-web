import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function Verify2FA() {
  const [code, setCode] = useState('');
  const { verify2fa, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // extrai email vindo do state do react router no fluxo de login
  const email = location.state?.email || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await verify2fa(email, code);
      navigate('/checkout');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-8 md:pt-16 px-4 font-poppins">
      <div className="w-full max-w-[480px]">
        <h1 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase mb-6 md:mb-8">
          Verificação
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <span className="font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase">
            Insira o código que enviamos para o seu email
          </span>
          
          <input 
            type="text" 
            placeholder="- - - - - -" 
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
            className="cursor-text font-poppins font-bold tracking-[1em] text-center h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 text-[24px] rounded-none transition-colors"
            required
          />

          {error && <span className="text-[#D22A31] font-bold text-sm text-center">{error}</span>}

          <button 
            type="submit" 
            disabled={isLoading || code.length < 6}
            className="cursor-pointer h-[62px] mt-2 w-full bg-[#CDF22B] text-[#FAFAFA] font-poppins font-bold text-[20px] uppercase rounded-none disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Verificando...' : 'Verificar'}
          </button>
        </form>
      </div>
    </div>
  );
}