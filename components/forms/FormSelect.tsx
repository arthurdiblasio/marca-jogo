'use client';

import React from 'react';


export interface SelectOption {
  id: string;
  name: string;
}


interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: SelectOption[];
  defaultOptionLabel?: string;
  errorMessage?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  options,
  defaultOptionLabel = 'Selecione uma opção',
  errorMessage,
  className = '',
  ...props
}) => {
  const borderClass = errorMessage
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';

  return (
    <div className='mt-2'>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        id={id}
        className={`mt-1 block w-full px-4 py-2 border ${borderClass} rounded-md shadow-sm focus:outline-none ${className}`}
        {...props}
      >
        <option value="">{defaultOptionLabel}</option>

        {/* Opções Dinâmicas */}
        {options.map((option) => (

          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>

      {/* Exibição da Mensagem de Erro */}
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};