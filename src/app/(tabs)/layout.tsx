// src/app/(tabs)/layout.tsx

"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Toaster } from "@/components/ui/sonner";
import { useCalculationStore } from "@/store/useCalculationStore";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { calculationSuccess, setCalculationSuccess, setActiveTab, activeTab } =
    useCalculationStore();

  useEffect(() => {
    if (calculationSuccess) {
      router.push("/results");
      setCalculationSuccess(false);
    }
  }, [calculationSuccess, router, setCalculationSuccess]);

  useEffect(() => {
    if (pathname === "/results" && activeTab !== "results") {
      setActiveTab("results");
    } else if (pathname === "/settings" && activeTab !== "settings") {
      setActiveTab("settings");
    } else if (pathname === "/" && activeTab !== "data") {
      setActiveTab("data");
    }
  }, [pathname, setActiveTab, activeTab]);

  return (
    // Container principal que organiza tudo
    <div className="max-w-4xl mx-auto flex flex-col h-screen">
      {/* Header não tem mais position: fixed */}
      <Header />

      {/* A área de conteúdo principal que cresce e permite rolagem interna */}
      <main className="flex-1 overflow-y-auto">
        {/* Wrapper interno para espaçamento */}
        <div className="px-4 md:px-6 py-4">{children}</div>
      </main>

      {/* BottomNav não tem mais position: fixed */}
      <BottomNav />
      <Toaster position="top-center" richColors />
    </div>
  );
}
