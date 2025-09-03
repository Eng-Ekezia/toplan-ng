import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { Toaster } from "@/components/ui/sonner";

export default function TabsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto">
      <Header />
      <main className="pt-14 pb-16 px-4 py-4">{children}</main>
      <BottomNav />
      <Toaster position="top-center" richColors />{" "}
      {/* Configuração do Toaster */}
    </div>
  );
}
