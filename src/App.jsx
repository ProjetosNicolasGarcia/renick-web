import React from 'react';
import { ShoppingBag, Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800">
      <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center text-center max-w-md w-full border border-slate-100">
        <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
          Renick Kids Web
        </h1>
        <p className="text-slate-500 text-sm mb-6">
          Frontend conectado ao ecossistema React + Tailwind CSS v4.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
          <Sparkles className="w-4 h-4" />
          Ambiente pronto para desenvolvimento
        </div>
      </div>
    </div>
  );
}