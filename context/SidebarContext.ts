// context/SidebarContext.tsx

"use client";

import { createContext, useContext, useState } from "react";

type SidebarContextType = {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebarContext must be used within a SidebarProvider");
  }
  return context;
}
