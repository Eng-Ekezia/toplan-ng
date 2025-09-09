// src/lib/constants.ts

/**
 * Constantes para os cálculos de planimetria.
 */
export const CALCULATION_CONSTANTS = {
  // Tolerância linear padrão NBR 13.133 (ex: 1 para 12.000)
  LINEAR_TOLERANCE_DENOMINATOR: 12000,
  // Fator multiplicador para tolerância angular (NBR 13.133)
  ANGULAR_TOLERANCE_FACTOR: 30,
  // Fator de soma para tolerância angular (NBR 13.133)
  ANGULAR_TOLERANCE_SUM: 10,
};

/**
 * Constantes para a renderização do canvas da poligonal.
 */
export const CANVAS_CONSTANTS = {
  // Preenchimento interno (em pixels) para evitar que o desenho toque as bordas
  PADDING: 50,
  // Comprimento da linha que representa o Norte (em pixels)
  NORTH_LINE_LENGTH: 25,
  // Raio do arco do azimute (em pixels)
  AZIMUTH_ARC_RADIUS: 20,
};
