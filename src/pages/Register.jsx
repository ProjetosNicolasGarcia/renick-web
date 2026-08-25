import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password, passwordConfirmation);
      navigate('/checkout');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-8 md:pt-16 px-4 font-poppins">
      <div className="w-full max-w-[480px]">
        
        <h1 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase mb-6 md:mb-8">
          Cadastro
        </h1>
        
        <div className="mb-6 flex flex-col gap-4">
          <span className="font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase">
            Utilize sua conta Google
          </span>
          <button 
            type="button"
            className="cursor-pointer h-[62px] w-full bg-[#1E45FB] flex items-center justify-center rounded-none hover:opacity-90 transition-opacity"
          >
            <div className="bg-white p-1.5 rounded-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-6 h-6">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <span className="font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase">
            Utilize seu email
          </span>
          
          <input 
            type="email" 
            placeholder="EMAIL" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="cursor-text font-poppins font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase placeholder:font-bold text-base md:text-lg rounded-none transition-colors"
            required
          />
          
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="SENHA" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="cursor-text font-poppins font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase placeholder:font-bold text-base md:text-lg rounded-none transition-colors"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A] hover:text-[#0A0A0A]/70 transition-colors p-1"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>

          <div className="relative w-full">
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              placeholder="CONFIRMAR SENHA" 
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="cursor-text font-poppins font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase placeholder:font-bold text-base md:text-lg rounded-none transition-colors"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A] hover:text-[#0A0A0A]/70 transition-colors p-1"
            >
              {showConfirmPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              )}
            </button>
          </div>

          {error && <span className="text-[#D22A31] font-bold text-sm">{error}</span>}

          <button 
            type="submit" 
            disabled={isLoading}
            className="cursor-pointer h-[62px] mt-2 w-full bg-[#CDF22B] text-[#FAFAFA] font-poppins font-bold text-[20px] uppercase rounded-none disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <div className="flex justify-end mt-2">
            <Link to="/login" className="cursor-pointer text-sm md:text-base text-[#0A0A0A]/25 font-bold hover:text-[#0A0A0A]/60 uppercase transition-colors">
              Já possuo uma conta
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}