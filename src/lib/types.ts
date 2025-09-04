// src/lib/types.ts

// Define a estrutura para os dados de entrada de um único vértice da poligonal
export interface VertexInput {
  angle_deg: number | string;
  angle_min: number | string;
  angle_sec: number | string;
  distance: number | string;
}

// Define a estrutura para os dados de entrada de um único ponto de detalhe (irradiação)
export interface DetailInput {
  angle_deg: number | string;
  angle_min: number | string;
  angle_sec: number | string;
  distance: number | string;
}

// Define a estrutura completa para todos os dados de entrada do cálculo
export interface CalculationInput {
  projectName: string;
  clientName?: string;
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
  // Array de arrays: o primeiro índice corresponde ao vértice, o segundo aos detalhes daquele vértice
  details: DetailInput[][];
}

// Define a estrutura para as coordenadas finais de um ponto da poligonal
export interface FinalCoordinate {
  point: string;
  east: number;
  north: number;
}

// Define a estrutura para as coordenadas finais de um ponto de detalhe
export interface DetailCoordinate {
  point: string; // Ex: "P1-D1"
  east: number;
  north: number;
}

// Define a estrutura para a análise de erros
export interface ErrorAnalysis {
  angular: {
    sum: number;
    expected: number;
    error: number;
    correction: number;
  };
  linear: {
    sumEast: number;
    sumNorth: number;
    errorEast: number;
    errorNorth: number;
    totalError: number;
    precision: string;
  };
  perimeter: number;
}

// Define a estrutura completa para os resultados do cálculo
export interface CalculationResult {
  finalCoordinates: FinalCoordinate[];
  detailCoordinates: DetailCoordinate[]; // Adicionado para os resultados dos detalhes
  errorAnalysis: ErrorAnalysis;
  // Adicionamos os resultados intermediários para exibição na UI
  intermediate: {
    correctedAngles: number[];
    azimuths: number[];
  };
}
