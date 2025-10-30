'use client';

import React from 'react';

// Define a estrutura de uma opção de seleção
export interface SelectOption {
  value: string;
  label: string;
}

// Tipagem: Estende as propriedades nativas do <select>
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: SelectOption[];
  // Opcional: Define o texto da primeira opção (e.g., "Selecione...")
  defaultOptionLabel?: string;
  // Opcional: Suporte a mensagem de erro (para o Zod)
  errorMessage?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  id,
  label,
  options,
  defaultOptionLabel = 'Selecione uma opção', // Valor padrão
  errorMessage,
  className = '',
  ...props // Coleta todas as outras props (value, onChange, required, etc.)
}) => {
  // Determina a classe de borda com base na presença de um erro
  const borderClass = errorMessage
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Borda vermelha
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'; // Borda normal

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      <select
        id={id}
        // Aplica classes de estilo e a classe condicional de erro
        className={`mt-1 block w-full px-4 py-2 border ${borderClass} rounded-md shadow-sm focus:outline-none ${className}`}
        {...props} // Aplica as props como value, onChange, etc.
      >
        {/* Opção Padrão (Vazia) */}
        <option value="">{defaultOptionLabel}</option>

        {/* Opções Dinâmicas */}
        {options.map((option) => (
          // Garante que o valor da option seja uma string para o select
          <option key={option.value} value={option.value}>
            {option.label}
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