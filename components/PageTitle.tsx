"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PageTitleProps {
  children: React.ReactNode;      // título da página
}

export function PageTitle({ children }: PageTitleProps) {
  const hideOn = ["/", "/login", "/register", "/dashboard"];
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Detecta se é mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (isMobile && !hideOn.includes(pathname)) {
    const handleBack = () => {
      if (document.referrer === "" || history.length <= 1) {
        router.push("/dashboard");
      } else {
        router.back();
      }
    };

    return (
      <div className="sticky top-0 z-40 bg-white px-4 py-3 mb-3 flex items-center justify-between">

        {/* Botão voltar */}
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-gray-700 active:scale-95 transition"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        {/* Título centralizado */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <p className="text-center text-2xl font-bold text-gray-800 mb-2">
            {children}
          </p>
        </div>

        {/* Elemento fantasma para balancear o layout */}
        <div className="w-6 opacity-0" />
      </div>
    )
  } else if (!isMobile) {
    return (
      <p className="text-center text-2xl font-bold text-gray-800 mb-2">
        {children}
      </p>
    )
  }
}
