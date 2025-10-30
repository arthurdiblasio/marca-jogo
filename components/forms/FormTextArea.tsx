'use client';

import React, { TextareaHTMLAttributes } from 'react';

// 💡 Tipos de propriedades:
// Para torná-lo flexível, estendemos as propriedades nativas do <textarea>
interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  // Opcional: Para exibir a primeira mensagem de erro retornada pelo Zod/hook
  errorMessage?: string;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  id,
  label,
  errorMessage,
  rows = 4, // Valor padrão para o número de linhas
  cols = 50, // Valor padrão para o número de colunas
  className = '', // Usamos um valor padrão para evitar problemas se não for passado
  ...props // Coleta todas as outras props (value, onChange, type, required, etc.)
}) => {
  // Determina a classe de borda com base na presença de um erro
  const borderClass = errorMessage
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' // Borda vermelha em caso de erro
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'; // Borda normal

  return (
    <div className='col-span-full'>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        id={id}
        className={`mt-1 block w-full px-4 py-2 border ${borderClass} rounded-md shadow-sm focus:outline-none ${className}`}
        rows={rows}
        cols={cols}
        {...props}
      />

      {/* Exibição da Mensagem de Erro */}
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};