import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../stores/useProductStore';

// Máscara com Debounce para evitar sobrecarga e pulos de tela
function PriceInput({ placeholder, initialValue, onChange }) {
  const [displayValue, setDisplayValue] = useState('');
  const [rawValue, setRawValue] = useState('');

  useEffect(() => {
    if (initialValue) {
      const num = parseFloat(initialValue);
      if (!isNaN(num)) {
        setDisplayValue(`R$ ${num.toFixed(2).replace('.', ',')}`);
        setRawValue(num.toFixed(2));
      }
    } else {
      setDisplayValue('');
      setRawValue('');
    }
  }, [initialValue]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (rawValue !== initialValue) {
        onChange(rawValue);
      }
    }, 800); // Aguarda 800ms antes de disparar o filtro
    return () => clearTimeout(timeoutId);
  }, [rawValue, initialValue, onChange]);

  const handleChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (!val) {
      setDisplayValue('');
      setRawValue('');
      return;
    }
    const num = (Number(val) / 100).toFixed(2);
    setDisplayValue(`R$ ${num.replace('.', ',')}`);
    setRawValue(num);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      className="w-full h-[62px] bg-[#FAFAFA] border border-[#0A0A0A]/25 focus:border-[#0A0A0A] outline-none px-4 font-poppins font-bold text-[#0A0A0A] placeholder:text-[#0A0A0A]/25 uppercase text-[16px] transition-colors"
    />
  );
}

export default function FilterSidebar() {
  const { attributes, fetchAttributes } = useProductStore();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!attributes) fetchAttributes();
  }, [attributes, fetchAttributes]);

  if (!attributes) return <div className="hidden lg:block w-[280px] shrink-0" />;

  const handleCheck = (key, value) => {
    const current = searchParams.get(key) ? searchParams.get(key).split(',') : [];
    const newValues = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    if (newValues.length > 0) searchParams.set(key, newValues.join(','));
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const handlePrice = (key, value) => {
    if (value) searchParams.set(key, value);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  return (
    <aside className="hidden lg:flex flex-col w-[280px] shrink-0 gap-6 sticky top-[120px]">
      <h2 className="font-suez text-[24px] text-[#1E45FB] uppercase mb-2">Filtros</h2>

      <FilterSection title="Sexo">
        {attributes.genders.map(g => (
          <Checkbox key={g} label={g} checked={searchParams.get('gender')?.split(',').includes(g.toLowerCase())} onChange={() => handleCheck('gender', g.toLowerCase())} />
        ))}
      </FilterSection>

      <FilterSection title="Tipo">
        {attributes.types.map(t => (
          <Checkbox key={t} label={t} checked={searchParams.get('type')?.split(',').includes(t.toLowerCase())} onChange={() => handleCheck('type', t.toLowerCase())} />
        ))}
      </FilterSection>

      <FilterSection title="Tamanho">
        {attributes.sizes.map(s => (
          <Checkbox key={s} label={s} checked={searchParams.get('size')?.split(',').includes(s)} onChange={() => handleCheck('size', s)} />
        ))}
      </FilterSection>

      <FilterSection title="Cor">
        {attributes.colors.map(c => (
          <Checkbox key={c.name} label={c.name} checked={searchParams.get('color')?.split(',').includes(c.name.toLowerCase())} onChange={() => handleCheck('color', c.name.toLowerCase())} />
        ))}
      </FilterSection>

      <FilterSection title="Preço">
        <div className="flex items-center gap-2 pt-2">
          <PriceInput placeholder="MÍN." initialValue={searchParams.get('min_price') || ''} onChange={(val) => handlePrice('min_price', val)} />
          <PriceInput placeholder="MÁX." initialValue={searchParams.get('max_price') || ''} onChange={(val) => handlePrice('max_price', val)} />
        </div>
      </FilterSection>
    </aside>
  );
}

function FilterSection({ title, children }) {
  return (
    <div className="flex flex-col border-b border-[#0A0A0A]/10 pb-6">
      <h3 className="font-poppins font-bold text-[20px] text-[#0A0A0A] uppercase">{title}</h3>
      <div className="flex flex-col gap-3 pt-4">
        {children}
      </div>
    </div>
  );
}

export function Checkbox({ label, checked, onChange }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="checkbox" className="hidden" checked={checked || false} onChange={onChange} />
      <div className={`w-5 h-5 border-2 flex items-center justify-center transition-colors ${checked ? 'bg-[#1E45FB] border-[#1E45FB]' : 'border-[#0A0A0A]/25 group-hover:border-[#0A0A0A]'}`}>
        {checked && <svg className="w-3 h-3 text-[#FAFAFA]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>}
      </div>
      <span className="font-poppins font-bold text-[14px] text-[#0A0A0A] uppercase">{label}</span>
    </label>
  );
}