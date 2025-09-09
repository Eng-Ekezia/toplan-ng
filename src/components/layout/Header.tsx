// src/components/layout/Header.tsx

import { Target } from "lucide-react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b">
      {/* Adicionado: xl:max-w-7xl para expandir em telas grandes */}
      <div className="max-w-4xl xl:max-w-7xl mx-auto h-14 px-4 flex items-center gap-3">
        <Target className="w-6 h-6 text-blue-600" />
        <div className="flex-1">
          <h1 className="text-lg font-bold">TOPLAN NG</h1>
          <p className="text-xs text-muted-foreground">Planimetria Móvel</p>
        </div>
      </div>
    </header>
  );
}
