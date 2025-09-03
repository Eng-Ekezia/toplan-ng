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

  // Efeitos para navegação e sincronização (permanecem os mesmos)
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
    // Container principal simples, sem classes de altura ou flex.
    <div className="max-w-md mx-auto">
      <Header />

      {/* O padding é a chave:
        - pt-14: Deixa espaço para o Header (que tem h-14).
        - pb-20: Deixa espaço para a BottomNav (que tem h-16) mais uma margem de segurança.
      */}
      <main className="pt-14 pb-20 px-4 py-4">{children}</main>

      <BottomNav />
      <Toaster position="top-center" richColors />
    </div>
  );
}
