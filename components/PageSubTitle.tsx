interface PageSubTitleProps {
  children: React.ReactNode;
}

export function PageSubTitle({ children }: PageSubTitleProps) {
  return (
    <h2 className="text-center text-gray-600 mb-8">
      {children}
    </h2>
  );
}