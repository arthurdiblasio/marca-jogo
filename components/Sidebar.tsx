'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import {
  Home,
  Users,
  Menu,
  ShieldHalf,
  X,
  Swords
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Times', href: '/team', icon: ShieldHalf },
  { name: 'Jogos', href: '/games', icon: Swords },
  { name: 'Perfil', href: '/profile', icon: Users }
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (!session) {
    return;
  }

  const excludedRoutes = ['/', '/login', '/register'];
  if (excludedRoutes.includes(pathname)) {
    return;
  }

  return (
    <>
      {/* 🚀 Versão para Desktop */}
      <aside className={`md:block hidden fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-700">
          {isOpen ?
            <div className="flex justify-between w-full items-center">
              <span className={`text-xl font-bold transition-opacity duration-300 ${!isOpen && 'opacity-1'}`}>Menu</span>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                {/* 💡 Ícone X (Fechar) do Lucide */}
                <X className="w-6 h-6" />
              </button>
            </div> :
            <div className="flex justify-center w-full">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                {/* 💡 Ícone Menu (Abrir) do Lucide */}
                <Menu className="w-6 h-6" />
              </button>
            </div>
          }
        </div>

        {/* Links de Navegação */}
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="my-2">
                <Link href={item.href} className="pl-4 flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
                  <div className={`flex-shrink-0 w-6 h-6 mr-3 ${!isOpen && 'mx-auto'}`}>
                    {/* 💡 Renderiza o componente do Ícone Lucide */}
                    <item.icon className="w-6 h-6" />
                  </div>
                  <span className={`transition-opacity duration-300 ${!isOpen && 'opacity-0'}`}>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* 🚀 Versão para Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-800 text-white z-50 mt-8">
        <ul className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <li key={item.name} className="flex-1">
              <Link href={item.href} className="flex flex-col items-center justify-center text-xs text-gray-300 hover:text-white transition-colors duration-200">
                <div className="w-6 h-6 mb-1">
                  {/* 💡 Renderiza o componente do Ícone Lucide no Mobile */}
                  <item.icon className="w-6 h-6" />
                </div>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}