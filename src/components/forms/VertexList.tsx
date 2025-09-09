// src/components/forms/VertexList.tsx

"use client";
import { useState } from "react";
import { useCalculationStore } from "@/store/useCalculationStore";
import { VertexCard } from "./VertexCard";
import { DetailsModal } from "./DetailsModal";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import { cn } from "@/lib/utils"; // Importar a função cn

export function VertexList() {
  const { input, runCalculation, isLoading } = useCalculationStore(); // Obter o estado isLoading
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVertexIndex, setSelectedVertexIndex] = useState<number | null>(
    null
  );

  const handleOpenDetails = (index: number) => {
    setSelectedVertexIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-center">
          Dados dos Vértices
        </h3>
        {input.vertices.map((vertex, index) => (
          <VertexCard
            key={index}
            index={index}
            vertex={vertex}
            totalPoints={input.numPoints}
            onOpenDetails={handleOpenDetails}
          />
        ))}
        <Button
          size="lg"
          className="w-full"
          onClick={runCalculation}
          disabled={isLoading} // Desabilitar o botão durante o cálculo
        >
          <Calculator
            className={cn("mr-2 h-5 w-5", isLoading && "animate-spin")} // Adicionar animação de spin
          />
          {isLoading ? "Calculando..." : "Calcular"}{" "}
          {/* Mudar o texto durante o cálculo */}
        </Button>
      </div>

      {/* Renderizar o Modal */}
      {selectedVertexIndex !== null && (
        <DetailsModal
          vertexIndex={selectedVertexIndex}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}
    </>
  );
}
