import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // novos estados para a checagem previa
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  
  const { resetPassword, validateResetToken, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  // efeito rodado na montagem para checar o token
  useEffect(() => {
    const checkToken = async () => {
      if (!email || !token) {
        setIsTokenValid(false);
        setIsValidating(false);
        return;
      }
      
      const valid = await validateResetToken(email, token);
      setIsTokenValid(valid);
      setIsValidating(false);
    };

    checkToken();
  }, [email, token, validateResetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(token, email, password, passwordConfirmation);
      setSuccessMessage('Senha alterada com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      console.error(err);
    }
  };

  // tela de carregamento da checagem
  if (isValidating) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center font-poppins text-[#0A0A0A] font-bold">
        Validando link de segurança...
      </div>
    );
  }

  // tela de bloqueio se o token for invalido/utilizado
  if (!isTokenValid) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-16 px-4 font-poppins text-center">
        <h1 className="font-suez text-[32px] md:text-[40px] text-[#D22A31] uppercase mb-6">
          Link Inválido
        </h1>
        <p className="font-bold text-lg text-[#0A0A0A] max-w-[480px] mb-8">
          Este link de redefinição de senha é inválido, expirou ou já foi utilizado.
        </p>
        <Link 
          to="/forgot-password" 
          className="h-[62px] w-full max-w-[480px] bg-[#1E45FB] text-[#FAFAFA] font-bold text-[20px] uppercase flex items-center justify-center hover:opacity-90 transition-opacity"
        >
          Solicitar novo link
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center pt-8 md:pt-16 px-4 font-poppins">
      <div className="w-full max-w-[480px]">
        <h1 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase mb-6 md:mb-8">
          Alteração de senha
        </h1>
        
        <div className="mb-6">
          <span className="font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase block mb-4">
            Insira uma nova senha
          </span>
          <p className="font-bold text-sm text-[#0A0A0A] uppercase mb-2">A nova senha deve atender a:</p>
          <ul className="list-disc pl-5 font-bold text-sm text-[#0A0A0A]">
            <li>Mínimo de 8 caracteres</li>
            <li>Uma letra maiúscula</li>
            <li>Um número</li>
            <li>Um símbolo especial</li>
            <li>Ser diferente da anterior</li>
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          
          <div className="relative w-full">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="NOVA SENHA" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={Boolean(successMessage)}
              className="cursor-text font-poppins font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase placeholder:font-bold text-base md:text-lg rounded-none transition-colors disabled:opacity-50"
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
              placeholder="CONFIRMAR NOVA SENHA" 
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              disabled={Boolean(successMessage)}
              className="cursor-text font-poppins font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase placeholder:font-bold text-base md:text-lg rounded-none transition-colors disabled:opacity-50"
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
          {successMessage && <span className="text-[#CDF22B] font-bold text-sm">{successMessage}</span>}

          <button 
            type="submit" 
            disabled={isLoading || Boolean(successMessage)}
            className="cursor-pointer h-[62px] mt-2 w-full bg-[#CDF22B] text-[#FAFAFA] font-poppins font-bold text-[20px] uppercase rounded-none disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {isLoading ? 'Confirmando...' : 'Confirmar'}
          </button>
        </form>
      </div>
    </div>
  );
}