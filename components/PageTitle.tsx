interface PageTitleProps {
  children: React.ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  return (
    <p className="text-center text-2xl font-bold text-gray-800 mb-2">
      {children}
    </p>
  );
}