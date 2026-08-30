import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';

export default function ProfileSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const menuItems = [
    { name: 'Dados da Conta', path: '/profile' },
    { name: 'Pedidos', path: '/orders' },
    { name: 'Endereços', path: '/addresses' },
    { name: 'Favoritos', path: '/favorites' },
  ];

  return (
    <aside className="w-full md:w-[280px] flex flex-col gap-4 shrink-0">
      <h1 className="font-suez font-normal text-[32px] md:text-[40px] text-[#1E45FB] uppercase mb-4">
        Perfil
      </h1>
      
      <div className="flex flex-col gap-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-fit font-poppins font-bold text-[18px] md:text-[20px] uppercase transition-colors ${
                isActive 
                  ? 'text-[#1E45FB] cursor-default pointer-events-none' 
                  : 'text-[#0A0A0A] hover:text-[#1E45FB] cursor-pointer'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
        
        <button 
          onClick={handleLogout} 
          className="w-fit text-left font-poppins font-bold text-[18px] md:text-[20px] text-[#D22A31] uppercase mt-4 hover:opacity-80 transition-opacity cursor-pointer"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}