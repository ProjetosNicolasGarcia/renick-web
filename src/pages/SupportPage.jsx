import { useEffect } from 'react';
import { useSupportStore } from '../stores/useSupportStore';

export default function SupportPage() {
  const { submitSupportForm, isLoading, isSuccess, errorMessage, resetState } = useSupportStore();

  // limpa o estado ao desmontar
  useEffect(() => {
    return () => resetState();
  }, [resetState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // evita multiplos envios
    if (isLoading) return;

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    await submitSupportForm(payload);
    
    // limpa form se sucesso
    if (!errorMessage) {
        e.target.reset();
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] w-full px-[16px] md:px-0 py-8 md:py-12 font-poppins">
      <div className="w-full max-w-xl mx-auto">
        <h1 className="text-[#1E45FB] font-suez font-normal text-[32px] md:text-[48px] uppercase mb-8">
          Suporte
        </h1>

        {isSuccess && (
          <div className="text-[#CDF22B] font-bold p-4 mb-6 text-[16px]">
            Mensagem enviada com sucesso! Responderemos em breve.
          </div>
        )}

        {errorMessage && (
          <div className="text-[#D22A31] font-bold mb-6 text-[16px]">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
          <div className="flex flex-col">
            <label htmlFor="email" className="font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="seu@email.com"
              className="h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] text-[#0A0A0A] placeholder-[#0A0A0A]/25 rounded-none px-4 outline-none w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="subject" className="font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase mb-2">
              Assunto
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              placeholder="Qual o motivo do contato?"
              className="h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] text-[#0A0A0A] placeholder-[#0A0A0A]/25 rounded-none px-4 outline-none w-full"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="message" className="font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase mb-2">
              Mensagem
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows="5"
              placeholder="Descreva sua dúvida ou problema"
              className="bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] text-[#0A0A0A] placeholder-[#0A0A0A]/25 rounded-none p-4 outline-none w-full resize-y"
            ></textarea>
          </div>

     <button
  type="submit"
  disabled={isLoading}
  className="h-[62px] bg-[#CDF22B] text-[#FAFAFA] font-bold text-[20px] md:text-[24px] uppercase flex items-center justify-center w-full mt-4 cursor-pointer disabled:cursor-not-allowed"
>
  {isLoading ? 'Enviando...' : 'Enviar'}
</button>
        </form>
      </div>
    </main>
  );
}