// src/components/forms/ProjectDataForm.tsx

"use client";
import { Card, CardContent } from "@/components/ui/card"; // Removido CardHeader e CardTitle
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalculationStore } from "@/store/useCalculationStore";

export function ProjectDataForm() {
  const { input, setInput } = useCalculationStore();

  return (
    // O Card agora não tem mais o Header
    <Card>
      <CardContent className="space-y-4 pt-6">
        {" "}
        {/* Adicionado pt-6 para compensar a remoção do header */}
        <div className="space-y-2">
          <Label htmlFor="clientName">
            Nome do Cliente{" "}
            <span className="text-muted-foreground text-xs">(opcional)</span>
          </Label>
          <Input
            id="clientName"
            placeholder="Ex: João Silva"
            value={input.clientName}
            onChange={(e) => setInput("clientName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectName">Nome do Projeto / Fazenda</Label>
          <Input
            id="projectName"
            placeholder="Ex: Fazenda Boa Esperança"
            value={input.projectName}
            onChange={(e) => setInput("projectName", e.target.value)}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
}
