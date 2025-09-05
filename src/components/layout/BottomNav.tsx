// src/components/layout/BottomNav.tsx

import Link from "next/link";
import { Pencil, BarChart3, Settings } from "lucide-react";

export function BottomNav() {
  return (
    // Removido: fixed, bottom-0, left-0, right-0, z-40
    <footer className="bg-background/80 backdrop-blur-sm border-t">
      <nav className="h-16 flex justify-around items-center">
        <Link
          href="/"
          className="flex flex-col items-center text-muted-foreground w-full p-1"
        >
          <Pencil className="w-6 h-6" />
          <span className="text-xs mt-1">Dados</span>
        </Link>
        <Link
          href="/results"
          className="flex flex-col items-center text-muted-foreground w-full p-1"
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs mt-1">Resultados</span>
        </Link>
        <Link
          href="/settings"
          className="flex flex-col items-center text-muted-foreground w-full p-1"
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs mt-1">Ajustes</span>
        </Link>
      </nav>
    </footer>
  );
}
