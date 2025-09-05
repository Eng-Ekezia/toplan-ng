// src/components/forms/ProjectDataForm.tsx

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalculationStore } from "@/store/useCalculationStore";

export function ProjectDataForm() {
  const { input, setInput } = useCalculationStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados do Projeto</CardTitle>
      </CardHeader>
      {/* Adicionado space-y-4 para espaçamento vertical */}
      <CardContent className="space-y-4">
        <div>
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
        <div>
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
