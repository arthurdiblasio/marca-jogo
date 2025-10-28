'use client';


import { SessionProvider } from 'next-auth/react';
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import { excludedRoutes } from '@/lib/sidebar';
import { usePathname } from 'next/navigation';

// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Marca Jogo",
//   description: "Sistema de marcação de jogos esportivos",
//   manifest: "/manifest.json",
//   themeColor: "#2563eb",
//   icons: {
//     icon: "/icons/icon-192x192.png",
//     apple: "/icons/icon-192x192.png"
//   }
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="pt-BR">
//       <head />
//       <body className="bg-white text-black">{children}</body>
//     </html>
//   );
// }



export default function RootLayout({ children }) {
  const pathname = usePathname()
  const showSidebar = !excludedRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        {/* <SessionProvider>
          {children}
          <Toaster position="bottom-center" reverseOrder={false} />
        </SessionProvider> */}
        <SessionProvider>
          <div className="flex">
            {showSidebar && <Sidebar />}
            <main className={`flex-1 ${showSidebar ? 'md:ml-20' : ''}`}>
              {children}
            </main>
          </div>
          <Toaster position="bottom-right" reverseOrder={false} />
        </SessionProvider>
      </body>
    </html>
  );
}