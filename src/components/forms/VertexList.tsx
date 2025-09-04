// src/components/forms/VertexList.tsx

"use client";
import { useState } from "react";
import { useCalculationStore } from "@/store/useCalculationStore";
import { VertexCard } from "./VertexCard";
import { DetailsModal } from "./DetailsModal"; // Importar o novo modal
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export function VertexList() {
  const { input, runCalculation } = useCalculationStore();
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
            onOpenDetails={handleOpenDetails} // Passar a função para o card
          />
        ))}
        <Button size="lg" className="w-full" onClick={runCalculation}>
          <Calculator className="mr-2 h-5 w-5" />
          Calcular
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
