import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marca Jogo",
  description: "Sistema de marcação de jogos esportivos",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head />
      <body className="bg-white text-black">{children}</body>
    </html>
  );
}
