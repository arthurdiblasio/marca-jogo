'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

const HomeIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7-7-7m7 7v10a1 0 001 1h3a1 1 0 001-1v-4a1 1 0 00-1-1H9a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 001-1v-4z"></path></svg>);
const TeamsIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h-1a1 1 0 01-1-1v-1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1zM7 20h-1a1 1 0 01-1-1v-1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1zM12 20h-1a1 1 0 01-1-1v-1a1 1 0 011-1h1a1 1 0 011 1v1a1 1 0 01-1 1zM20 7H4a1 1 0 01-1-1V5a1 1 0 011-1h16a1 1 0 011 1v1a1 1 0 01-1 1z"></path></svg>);
const ProfileIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>);
const GamesIcon = () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>);

const navItems = [
  { name: 'Home', href: '/dashboard', icon: <HomeIcon /> },
  { name: 'Times', href: '/teams', icon: <TeamsIcon /> },
  { name: 'Jogos', href: '/games', icon: <GamesIcon /> },
  { name: 'Perfil', href: '/profile', icon: <ProfileIcon /> },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Se o usuário não estiver logado, não exiba nada
  if (!session) {
    return null;
  }

  // Lista de rotas onde o menu não deve ser exibido
  const excludedRoutes = ['/', '/login', '/register'];
  if (excludedRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      {/* 🚀 Versão para Desktop */}
      <aside className={`md:block hidden fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out z-40 ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex items-center justify-between p-4">
          <span className={`text-xl font-bold transition-opacity duration-300 ${!isOpen && 'opacity-0'}`}>Menu</span>
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}></path></svg>
          </button>
        </div>
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.name} className="my-2">
                <Link href={item.href} className="flex items-center p-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
                  <div className={`flex-shrink-0 w-6 h-6 mr-3 ${!isOpen && 'mx-auto'}`}>
                    {item.icon}
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
                  {item.icon}
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