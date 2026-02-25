import { useEffect, useRef, useState } from 'react';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

export default function SearchBar({ value, onChange, placeholder = 'Rechercher un produit...' }) {
  const [localVal, setLocalVal] = useState(value || '');
  const timerRef = useRef(null);

  useEffect(() => {
    setLocalVal(value || '');
  }, [value]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalVal(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(val), 400); // debounce 400ms
  };

  const clear = () => { setLocalVal(''); onChange(''); };

  return (
    <div className="relative">
      <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
      <input
        type="search"
        value={localVal}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-field pl-11 pr-10"
      />
      {localVal && (
        <button onClick={clear} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
          <HiXMark className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
