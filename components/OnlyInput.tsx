'use client';

import React from 'react';

// 💡 Tipos de propriedades:
// Para torná-lo flexível, estendemos as propriedades nativas do <input>
interface OnlyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  placeholder: string;
  // Opcional: Para exibir a primeira mensagem de erro retornada pelo Zod/hook
  errorMessage?: string;
}

export const OnlyInput: React.FC<OnlyInputProps> = ({
  id,
  placeholder,
  errorMessage,
  className = '', // Usamos um valor padrão para evitar problemas se não for passado
  ...props // Coleta todas as outras props (value, onChange, type, required, etc.)
}) => {
  // Determina a classe de borda com base na presença de um erro
  const borderClass = errorMessage
    ? 'rounded-lg border-red-500 focus:border-red-500 focus:ring-red-500' // Borda vermelha em caso de erro
    : 'rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500'; // Borda normal

  return (
    <div>

      <input
        id={id}
        className={`pl-5 pr-3 py-3 block w-full border ${borderClass} bg-white text-sm ${className}`}
        placeholder={placeholder}
        {...props}
      />


      {/* Exibição da Mensagem de Erro */}
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600">{errorMessage}</p>
      )}
    </div>
  );
};