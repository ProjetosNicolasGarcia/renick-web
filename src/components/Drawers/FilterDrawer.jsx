import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useUiStore } from '../../stores/useUiStore';
import { useProductStore } from '../../stores/useProductStore';

// Componente para máscara de R$
function PriceInput({ placeholder, value, onChange }) {
  const [displayValue, setDisplayValue] = useState('');

  useEffect(() => {
    if (value) {
      const num = parseFloat(value);
      if (!isNaN(num)) {
        setDisplayValue(`R$ ${num.toFixed(2).replace('.', ',')}`);
      }
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setDisplayValue('');
      onChange('');
      return;
    }
    const num = (Number(val) / 100).toFixed(2);
    setDisplayValue(`R$ ${num.replace('.', ',')}`);
    onChange(num);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      className="flex-1 h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 font-poppins font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase text-[16px] transition-colors"
    />
  );
}

export default function FilterDrawer() {
  const { isFilterOpen, toggleFilter } = useUiStore();
  const { attributes, fetchAttributes } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();

  const [localParams, setLocalParams] = useState(new URLSearchParams());
  const [openTab, setOpenTab] = useState(null);

  useEffect(() => {
    if (!attributes && isFilterOpen) fetchAttributes();
  }, [attributes, isFilterOpen, fetchAttributes]);

  useEffect(() => {
    if (isFilterOpen) {
      setLocalParams(new URLSearchParams(searchParams));
      setOpenTab(null);
    }
  }, [isFilterOpen, searchParams]);

  if (!isFilterOpen) return null;

  const handleCheck = (key, value) => {
    const current = localParams.get(key) ? localParams.get(key).split(',') : [];
    const newValues = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    if (newValues.length > 0) localParams.set(key, newValues.join(','));
    else localParams.delete(key);
    setLocalParams(new URLSearchParams(localParams));
  };

  const handleApply = () => {
    setSearchParams(localParams);
    toggleFilter();
  };

  const toggle = (tab) => setOpenTab(openTab === tab ? null : tab);

  return (
    <div className="fixed inset-0 z-50 bg-[#FAFAFA] flex flex-col animate-fade-in lg:hidden h-[100dvh]">
      <div className="flex justify-between items-center p-6 shrink-0 border-b border-[#0A0A0A]/10">
        <h2 className="font-suez text-[32px] text-[#1E45FB] uppercase">Filtros</h2>
        <button onClick={toggleFilter} aria-label="Fechar" className="text-[#D22A31] font-bold text-[24px] cursor-pointer p-2">X</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <Accordion title="Sexo" isOpen={openTab === 'sexo'} onToggle={() => toggle('sexo')}>
          {attributes?.genders.map(g => (
            <MobileCheckbox key={g} label={g} checked={localParams.get('gender')?.split(',').includes(g.toLowerCase())} onChange={() => handleCheck('gender', g.toLowerCase())} />
          ))}
        </Accordion>
        <Accordion title="Tipo" isOpen={openTab === 'tipo'} onToggle={() => toggle('tipo')}>
          {attributes?.types.map(t => (
            <MobileCheckbox key={t} label={t} checked={localParams.get('type')?.split(',').includes(t.toLowerCase())} onChange={() => handleCheck('type', t.toLowerCase())} />
          ))}
        </Accordion>
        <Accordion title="Tamanho" isOpen={openTab === 'tamanho'} onToggle={() => toggle('tamanho')}>
          {attributes?.sizes.map(s => (
            <MobileCheckbox key={s} label={s} checked={localParams.get('size')?.split(',').includes(s)} onChange={() => handleCheck('size', s)} />
          ))}
        </Accordion>
        <Accordion title="Cor" isOpen={openTab === 'cor'} onToggle={() => toggle('cor')}>
          {attributes?.colors.map(c => (
            <MobileCheckbox key={c.name} label={c.name} checked={localParams.get('color')?.split(',').includes(c.name.toLowerCase())} onChange={() => handleCheck('color', c.name.toLowerCase())} />
          ))}
        </Accordion>

        <div className="flex gap-4 mt-2">
          <PriceInput 
            placeholder="PREÇO MÍN." 
            value={localParams.get('min_price') || ''} 
            onChange={(val) => { val ? localParams.set('min_price', val) : localParams.delete('min_price'); setLocalParams(new URLSearchParams(localParams)); }} 
          />
          <PriceInput 
            placeholder="PREÇO MÁX." 
            value={localParams.get('max_price') || ''} 
            onChange={(val) => { val ? localParams.set('max_price', val) : localParams.delete('max_price'); setLocalParams(new URLSearchParams(localParams)); }} 
          />
        </div>
      </div>

      <div className="p-4 shrink-0 bg-[#FAFAFA] border-t border-[#0A0A0A]/10">
        <button onClick={handleApply} className="w-full h-[62px] bg-[#1E45FB] text-[#FAFAFA] font-poppins font-bold text-[20px] uppercase cursor-pointer hover:opacity-90 transition-opacity">
          Aplicar
        </button>
      </div>
    </div>
  );
}

function Accordion({ title, isOpen, onToggle, children }) {
  return (
    <div className="border border-[#0A0A0A]/25 flex flex-col">
      <button onClick={onToggle} className="w-full flex justify-between items-center p-4 bg-[#FAFAFA] cursor-pointer outline-none">
        <span className="font-poppins font-bold text-[20px] text-[#0A0A0A] uppercase">{title}</span>
        <svg className={`w-6 h-6 text-[#0A0A0A]/50 transition-transform ${isOpen ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>
      {isOpen && (
        <div className="flex flex-col gap-4 p-4 pt-4 border-t border-[#0A0A0A]/10 bg-[#FAFAFA]">
          {children}
        </div>
      )}
    </div>
  );
}

function MobileCheckbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-4 cursor-pointer">
      <input type="checkbox" className="hidden" checked={checked || false} onChange={onChange} />
      <div className={`w-6 h-6 border-2 flex items-center justify-center transition-colors ${checked ? 'bg-[#1E45FB] border-[#1E45FB]' : 'border-[#0A0A0A]/25'}`}>
        {checked && <svg className="w-4 h-4 text-[#FAFAFA]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
      </div>
      <span className="font-poppins font-bold text-[16px] text-[#0A0A0A] uppercase">{label}</span>
    </label>
  );
}