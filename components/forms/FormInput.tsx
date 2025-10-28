'use client';

import React from 'react';

// 💡 Tipos de propriedades:
// Para torná-lo flexível, estendemos as propriedades nativas do <input>
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  // Opcional: Para exibir a primeira mensagem de erro retornada pelo Zod/hook
  errorMessage?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  errorMessage,
  className = '', // Usamos um valor padrão para evitar problemas se não for passado
  ...props // Coleta todas as outras props (value, onChange, type, required, etc.)
}) => {
  // Determina a classe de borda com base na presença de um erro
  const borderClass = errorMessage
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Borda vermelha em caso de erro
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'; // Borda normal

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        className={`mt-1 block w-full px-4 py-2 border ${borderClass} rounded-md shadow-sm focus:outline-none ${className}`}
        {...props}
      />

      {/* Exibição da Mensagem de Erro */}
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};