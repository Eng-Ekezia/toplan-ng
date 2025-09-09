// src/components/layout/BottomNav.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pencil, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Pencil, label: "Dados" },
    { href: "/results", icon: BarChart3, label: "Resultados" },
    { href: "/settings", icon: Settings, label: "Ajustes" },
  ];

  return (
    // Adicionado: fixed, bottom-0, left-0, right-0, z-40
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t supports-[backdrop-filter]:bg-background/60">
      <nav className="max-w-4xl mx-auto h-16 flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center w-full p-1 transition-all duration-200",
                isActive
                  ? "text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-6 h-6 transition-all",
                  isActive && "scale-110"
                )}
              />
              <span className="text-xs mt-1">{item.label}</span>
              {isActive && (
                <div className="h-1 w-1 rounded-full bg-primary mt-1" />
              )}
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
