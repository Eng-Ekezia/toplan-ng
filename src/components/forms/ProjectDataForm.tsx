// src/components/forms/ProjectDataForm.tsx

"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalculationStore } from "@/store/useCalculationStore";

// Componente para exibir mensagens de erro
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
};

export function ProjectDataForm() {
  const { input, setInput, errors } = useCalculationStore();

  return (
    <Card>
      <CardContent className="space-y-4 ">
        {" "}
        {/* removido pt-6 */}
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
          {/* Nenhuma validação necessária para este campo opcional */}
        </div>
        <div className="space-y-2">
          <Label htmlFor="projectName">Nome do Projeto / Fazenda</Label>
          <Input
            id="projectName"
            placeholder="Ex: Fazenda Boa Esperança"
            value={input.projectName}
            onChange={(e) => setInput("projectName", e.target.value)}
            required
            aria-invalid={!!errors.projectName} // Adiciona o atributo aria-invalid
          />
          <ErrorMessage message={errors.projectName as string} />
        </div>
      </CardContent>
    </Card>
  );
}
