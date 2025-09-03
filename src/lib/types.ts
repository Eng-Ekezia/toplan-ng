// Define a estrutura para os dados de entrada de um único vértice
export interface VertexInput {
  angle_deg: number | string;
  angle_min: number | string;
  angle_sec: number | string;
  distance: number | string;
}

// Define a estrutura completa para todos os dados de entrada do cálculo
export interface CalculationInput {
  projectName: string;
  clientName?: string; // O '?' torna o campo opcional
  numPoints: number;
  angleType: "internal" | "external";
  initialAzimuth: {
    deg: number | string;
    min: number | string;
    sec: number | string;
  };
  initialCoordinates: {
    east: number | string;
    north: number | string;
  };
  vertices: VertexInput[];
}

// Define a estrutura para os resultados do cálculo
export interface CalculationResult {
  // Por enquanto, deixaremos vazio. Preencheremos no futuro.
}
