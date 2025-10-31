// src/components/forms/RadioButtons.tsx
'use client'; // Marque como Client Component se o page.tsx importar outros client components

import React from 'react';

// Tipagem para clareza
interface RadioButtonsProps {
  label: string;
  name: string;
  value: string;
  setter: (v: string) => void;
  options: { label: string; value: string }[];
}

export const RadioButtons: React.FC<RadioButtonsProps> = ({ label, name, value, setter, options }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="flex gap-3 pt-2">
      {options.map((option) => (
        <label
          key={option.value}
          className={`cursor-pointer flex items-center justify-center w-24 py-2 rounded-lg border-2 text-sm font-medium transition-all ${value === option.value ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"}`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => { setter(e.target.value); }}
            className="hidden"
          />
          {option.label}
        </label>
      ))}
    </div>
  </div>
);