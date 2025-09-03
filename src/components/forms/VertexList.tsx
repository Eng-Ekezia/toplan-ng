"use client";
import { useCalculationStore } from "@/store/useCalculationStore";
import { VertexCard } from "./VertexCard";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export function VertexList() {
  const { input, runCalculation } = useCalculationStore();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center">Dados dos Vértices</h3>
      {input.vertices.map((vertex, index) => (
        <VertexCard
          key={index}
          index={index}
          vertex={vertex}
          totalPoints={input.numPoints}
        />
      ))}
      <Button size="lg" className="w-full" onClick={runCalculation}>
        <Calculator className="mr-2 h-5 w-5" />
        Calcular
      </Button>
    </div>
  );
}
