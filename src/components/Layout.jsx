import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import MenuDrawer from './Drawers/MenuDrawer';
import CartDrawer from './Drawers/CartDrawer';
import SearchDrawer from './Drawers/SearchDrawer';
import { useUiStore } from '../stores/useUiStore';

export default function Layout() {
  const fetchCategories = useUiStore((state) => state.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] font-poppins">
      <Header />
      <MenuDrawer />
      <CartDrawer />
      <SearchDrawer />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-16 py-8">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}