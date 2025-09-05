// src/components/layout/Header.tsx

import { Target } from "lucide-react";

export function Header() {
  return (
    // Removido: fixed, top-0, left-0, right-0, z-40
    <header className="bg-background/80 backdrop-blur-sm border-b">
      <div className="h-14 px-4 flex items-center gap-3">
        <Target className="w-6 h-6 text-blue-600" />
        <div className="flex-1">
          <h1 className="text-lg font-bold">TOPLAN NG</h1>
          <p className="text-xs text-muted-foreground">Planimetria Móvel</p>
        </div>
      </div>
    </header>
  );
}
