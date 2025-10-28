// src/components/forms/AddressSelection.tsx (ou TeamAddressSelection.tsx)
import React, { useState } from 'react';
import { useGooglePlaces } from '@/hooks/useGooglePlaces';

interface AddressSelectionProps {
  label: string;
  hook: ReturnType<typeof useGooglePlaces>; // Recebe a instância do hook
  id: string;
  required?: boolean;
}

export function AddressSelection({ label, hook, id, required = false }: AddressSelectionProps) {
  const {
    address,
    suggestions,
    showSuggestions,
    handleAddressChange,
    handleSelectSuggestion,
    setShowSuggestions
  } = hook;

  return (
    <div className='relative'>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        type="text"
        value={address}
        onChange={(e) => handleAddressChange(e.target.value)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // Pequeno delay para permitir o clique na sugestão
        onFocus={() => address.length >= 3 && setShowSuggestions(true)}
        required={required}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
          {suggestions.map((s) => (
            <li
              key={s.place_id}
              onMouseDown={(e) => { // Usar onMouseDown para capturar antes do onBlur do input
                e.preventDefault();
                handleSelectSuggestion(s);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}