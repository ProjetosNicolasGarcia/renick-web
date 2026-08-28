import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Verify2FA from './pages/Verify2FA';
import Profile from './pages/Profile';
import Addresses from './pages/Addresses';
import Product from './pages/Product';
import Listing from './pages/Listing';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* rotas com header e footer */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-2fa" element={<Verify2FA />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/products" element={<Listing />} />
          <Route path="/products/:id" element={<Product />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}