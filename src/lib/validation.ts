// src/lib/validation.ts

import { CalculationInput, InputErrors } from "./types";

export function validateInput(input: CalculationInput): InputErrors {
  const newErrors: InputErrors = {};

  if (!input.projectName.trim()) {
    newErrors.projectName = "O nome do projeto é obrigatório.";
  }

  if (input.numPoints < 3) {
    newErrors.numPoints = "A poligonal deve ter no mínimo 3 vértices.";
  }

  // Validação das Coordenadas Iniciais
  if (
    input.initialCoordinates.east === "" ||
    isNaN(Number(input.initialCoordinates.east))
  ) {
    if (!newErrors.initialCoordinates) newErrors.initialCoordinates = {};
    newErrors.initialCoordinates.east = "Coordenada Leste inválida.";
  }
  if (
    input.initialCoordinates.north === "" ||
    isNaN(Number(input.initialCoordinates.north))
  ) {
    if (!newErrors.initialCoordinates) newErrors.initialCoordinates = {};
    newErrors.initialCoordinates.north = "Coordenada Norte inválida.";
  }

  // Validação do Azimute Inicial
  if (
    input.initialAzimuth.deg === "" ||
    isNaN(Number(input.initialAzimuth.deg))
  ) {
    if (!newErrors.initialAzimuth) newErrors.initialAzimuth = {};
    newErrors.initialAzimuth.deg = "Grau inválido";
  }

  // Validação dos Vértices
  newErrors.vertices = [];
  input.vertices.forEach((vertex, index) => {
    const vertexError: Partial<Record<keyof typeof vertex, string>> = {};
    if (vertex.distance === "" || isNaN(Number(vertex.distance))) {
      vertexError.distance = "Distância inválida.";
    }
    if (vertex.angle_deg === "" || isNaN(Number(vertex.angle_deg))) {
      vertexError.angle_deg = "Grau inválido.";
    }
    if (Object.keys(vertexError).length > 0) {
      newErrors.vertices![index] = vertexError;
    }
  });
  if (newErrors.vertices.every((e) => !e)) {
    delete newErrors.vertices;
  }

  // --- NOVA VALIDAÇÃO PARA DETALHES ---
  newErrors.details = [];
  input.details.forEach((vertexDetails, vertexIndex) => {
    if (!newErrors.details![vertexIndex]) {
      newErrors.details![vertexIndex] = [];
    }
    vertexDetails.forEach((detail, detailIndex) => {
      const detailError: Partial<Record<keyof typeof detail, string>> = {};
      if (detail.distance === "" || isNaN(Number(detail.distance))) {
        detailError.distance = "Distância inválida.";
      }
      if (detail.angle_deg === "" || isNaN(Number(detail.angle_deg))) {
        detailError.angle_deg = "Grau inválido.";
      }
      if (Object.keys(detailError).length > 0) {
        newErrors.details![vertexIndex][detailIndex] = detailError;
      }
    });
  });
  if (
    newErrors.details.every((vertexDetails) => vertexDetails.every((e) => !e))
  ) {
    delete newErrors.details;
  }

  return newErrors;
}
