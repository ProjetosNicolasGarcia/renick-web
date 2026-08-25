import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { forgotPassword, isLoading, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setSuccessMessage('Um link de recuperação foi enviado para o seu email.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-8 md:pt-16 px-4 font-poppins">
      <div className="w-full max-w-[480px]">
        <h1 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase mb-6 md:mb-8">
          Esqueci minha senha
        </h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <span className="font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase">
            Insira o seu email cadastrado na loja
          </span>
          
          <input 
            type="email" 
            placeholder="EMAIL" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="cursor-text font-poppins font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase placeholder:font-bold text-base md:text-lg rounded-none transition-colors"
            required
          />

          {error && <span className="text-[#D22A31] font-bold text-sm">{error}</span>}
          {successMessage && <span className="text-green-600 font-bold text-sm">{successMessage}</span>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="cursor-pointer h-[62px] mt-2 w-full bg-[#CDF22B] text-[#FAFAFA] font-poppins font-bold text-[20px] uppercase rounded-none disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Enviando...' : 'Confirmar'}
          </button>
        </form>
      </div>
    </div>
  );
}