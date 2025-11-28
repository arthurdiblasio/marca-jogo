interface PrimaryButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

export function PrimaryButton({ children, loading = false, type = "button", disabled = false }: PrimaryButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
        ${loading || disabled
          ? "bg-blue-400 cursor-not-allowed"
          : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"}`}
    >
      {children}
    </button>
  );
}

// Exemplo de uso no seu TeamForm:
// <PrimaryButton type="submit" loading={loading}>
//   {loading ? (mode === 'create' ? 'Criando...' : 'Salvando...') : (mode === 'create' ? 'Criar Time' : 'Salvar Alterações')}
// </PrimaryButton>