// src/app/(tabs)/graph/page.tsx

"use client";

import { motion } from "framer-motion";
import { useCalculationStore } from "@/store/useCalculationStore";
import { PolygonCanvas } from "@/components/features/PolygonCanvas";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export default function GraphPage() {
  const { result, isLoading, input } = useCalculationStore();

  if (isLoading) {
    return (
      <p className="text-center animate-pulse pt-8">Carregando gráfico...</p>
    );
  }

  if (!result) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        <p>Nenhum resultado para exibir o gráfico.</p>
        <p className="text-sm">
          Calcule uma poligonal na aba Dados para visualizar o gráfico aqui.
        </p>
      </div>
    );
  }

  const { finalCoordinates, detailCoordinates, intermediate } = result;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          Gráfico para: {input.projectName}
        </h2>
        <p className="text-sm text-muted-foreground">
          Cliente: {input.clientName || "Não informado"}
        </p>
      </div>

      <PolygonCanvas
        coordinates={finalCoordinates}
        details={detailCoordinates}
        azimuths={intermediate.azimuths}
      />
    </motion.div>
  );
}
