import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import ProfileSidebar from '../components/ProfileSidebar';

export default function Profile() {
  const { user, fetchProfile, updateProfile, deleteAccount, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('view'); 
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  useEffect(() => {
    fetchProfile().catch(() => navigate('/login'));
    window.scrollTo(0, 0);
  }, [fetchProfile, navigate]); 

  useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const resetState = () => {
    setMode('view');
    setCurrentPassword('');
    setNewPassword('');
    setEmail(user?.email || '');
    setSuccessMsg('');
    setShowNewPassword(false);
    setShowCurrentPassword(false);
  };

  const handleUpdate = async () => {
    if (!currentPassword) return;
    try {
      await updateProfile(email, newPassword, currentPassword);
      setSuccessMsg('Conta atualizada com sucesso!');
      resetState();
    } catch (err) {
      setSuccessMsg('');
    }
  };

  const handleDelete = async () => {
    if (!currentPassword) return;
    try {
      await deleteAccount(currentPassword);
      navigate('/');
    } catch (err) {
      setSuccessMsg('');
    }
  };

  const EyeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /></svg>
  );

  const EyeSlashIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
  );

  return (
    <div className="w-full bg-[#FAFAFA] min-h-screen pb-16 pt-8 md:pt-16 px-4 md:px-16 max-w-[1440px] mx-auto flex flex-col md:flex-row gap-8 lg:gap-16">
      
      <ProfileSidebar />

      <div className="flex-1 w-full max-w-[800px] flex flex-col gap-6">
        <h2 className="font-suez text-[32px] md:text-[40px] text-[#1E45FB] uppercase border-b border-[#0A0A0A]/10 pb-4 mb-2">
          Dados da Conta
        </h2>

        {mode === 'view' && (
          <>
            <input disabled value={user?.email || (isLoading ? 'CARREGANDO...' : '')} className="font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 text-[#0A0A0A]/25 outline-none px-4 text-base md:text-lg cursor-not-allowed rounded-none" />
            <input disabled type="password" value="********" className="font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 text-[#0A0A0A]/25 outline-none px-4 text-base md:text-lg cursor-not-allowed rounded-none" />
            <div className="flex justify-end mt-[-8px]">
              <Link to="/forgot-password" className="cursor-pointer w-fit text-sm md:text-base text-[#0A0A0A]/25 font-bold uppercase hover:text-[#0A0A0A]">Esqueci minha senha</Link>
            </div>
            {successMsg && <span className="text-[#1E45FB] font-bold text-sm">{successMsg}</span>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button onClick={() => { setMode('edit'); setEmail(user?.email || ''); setSuccessMsg(''); }} className="cursor-pointer h-[62px] w-full bg-[#CDF22B] text-[#FAFAFA] font-bold text-[20px] uppercase rounded-none hover:opacity-90">Editar</button>
              <button onClick={() => { setMode('delete'); setSuccessMsg(''); }} className="cursor-pointer h-[62px] w-full bg-[#D22A31] text-[#FAFAFA] font-bold text-[18px] md:text-[20px] uppercase rounded-none hover:opacity-90">Apagar Conta</button>
            </div>
          </>
        )}

        {mode === 'edit' && (
          <>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="EMAIL" className="font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase text-base md:text-lg rounded-none" />
            <div className="relative w-full">
              <input type={showNewPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="NOVA SENHA" className="font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase text-base md:text-lg rounded-none" />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A] p-1">{showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}</button>
            </div>
            
            <div className="mt-4 flex flex-col gap-4">
              <h3 className="font-poppins font-bold text-[20px] md:text-[24px] text-[#0A0A0A] uppercase">Confirmar alterações</h3>
              <div className="relative w-full">
                <input type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="SENHA ATUAL (OBRIGATÓRIO)" className="font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase text-base md:text-lg rounded-none" />
                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A] p-1">{showCurrentPassword ? <EyeSlashIcon /> : <EyeIcon />}</button>
              </div>
              <div className="flex justify-end mt-[-8px]">
                <Link to="/forgot-password" className="cursor-pointer w-fit text-sm md:text-base text-[#0A0A0A]/25 font-bold uppercase hover:text-[#0A0A0A]">Esqueci minha senha</Link>
              </div>
            </div>

            {error && <span className="text-[#D22A31] font-bold text-sm">{error}</span>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button onClick={handleUpdate} disabled={isLoading || !currentPassword} className="cursor-pointer h-[62px] w-full bg-[#CDF22B] text-[#FAFAFA] font-bold text-[20px] uppercase disabled:opacity-50 rounded-none hover:opacity-90">Salvar</button>
              <button onClick={resetState} className="cursor-pointer h-[62px] w-full bg-[#0A0A0A]/25 text-[#FAFAFA] font-bold text-[20px] uppercase rounded-none hover:bg-[#0A0A0A]/40">Cancelar</button>
            </div>
          </>
        )}

        {mode === 'delete' && (
          <>
            <p className="font-bold text-[#D22A31] uppercase">Para apagar sua conta, confirme sua senha atual:</p>
            <div className="relative w-full">
              <input type={showCurrentPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="SENHA ATUAL" className="font-bold h-[62px] w-full bg-[#FAFAFA] border border-[#D22A31] focus:border-[#0A0A0A] outline-none px-4 pr-12 text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 placeholder:uppercase text-base md:text-lg rounded-none" />
              <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#0A0A0A] p-1">{showCurrentPassword ? <EyeSlashIcon /> : <EyeIcon />}</button>
            </div>
            {error && <span className="text-[#D22A31] font-bold text-sm">{error}</span>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button onClick={handleDelete} disabled={isLoading || !currentPassword} className="cursor-pointer h-[62px] w-full bg-[#D22A31] text-[#FAFAFA] font-bold text-[16px] md:text-[18px] uppercase disabled:opacity-50 rounded-none hover:opacity-90">Confirmar Exclusão</button>
              <button onClick={resetState} className="cursor-pointer h-[62px] w-full bg-[#0A0A0A]/25 text-[#FAFAFA] font-bold text-[16px] md:text-[18px] uppercase rounded-none hover:bg-[#0A0A0A]/40">Cancelar</button>
            </div>
          </>
        )}
      </div>

    </div>
  );
}