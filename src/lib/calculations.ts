import { CalculationInput, CalculationResult } from "./types";

const MIN_TO_DEG = 1.0 / 60.0;
const SEC_TO_DEG = 1.0 / 3600.0;
const toRadians = (deg: number) => (Math.PI / 180) * deg;

/**
 * Converte um ângulo em GMS (Graus, Minutos, Segundos) para graus decimais.
 */
// Tipos 'any' corrigidos para 'string | number'
function gmsToDecimal(
  deg: string | number,
  min: string | number,
  sec: string | number
): number {
  return (
    (parseFloat(deg as string) || 0) +
    (parseFloat(min as string) || 0) * MIN_TO_DEG +
    (parseFloat(sec as string) || 0) * SEC_TO_DEG
  );
}

/**
 * Função principal que realiza todos os cálculos planimétricos.
 * @param data Os dados de entrada do formulário.
 * @returns Um objeto com os resultados do cálculo ou lança um erro se os dados forem inválidos.
 */
export function calculatePlanimetry(data: CalculationInput): CalculationResult {
  const { numPoints, angleType, initialAzimuth, initialCoordinates, vertices } =
    data;

  // 1. Conversão e Validação Inicial
  if (vertices.some((v) => v.distance === "")) {
    throw new Error("Todas as distâncias devem ser preenchidas.");
  }
  const initialAzimuthDecimal = gmsToDecimal(
    initialAzimuth.deg,
    initialAzimuth.min,
    initialAzimuth.sec
  );
  const initialEast = parseFloat(initialCoordinates.east as string);
  const initialNorth = parseFloat(initialCoordinates.north as string);
  const measuredAnglesDecimal = vertices.map((v) =>
    gmsToDecimal(v.angle_deg, v.angle_min, v.angle_sec)
  );
  const distances = vertices.map((v) => parseFloat(v.distance as string));

  // 2. Cálculo do Erro Angular
  const sumOfMeasuredAngles = measuredAnglesDecimal.reduce(
    (sum, val) => sum + val,
    0
  );
  const expectedAngleSum =
    angleType === "internal" ? (numPoints - 2) * 180 : (numPoints + 2) * 180;
  const angularError = sumOfMeasuredAngles - expectedAngleSum;
  const angularCorrection = -angularError / numPoints;
  const correctedAngles = measuredAnglesDecimal.map(
    (angle) => angle + angularCorrection
  );

  // 3. Cálculo dos Azimutes
  const azimuths: number[] = new Array(numPoints);
  azimuths[0] = initialAzimuthDecimal;

  for (let i = 1; i < numPoints; i++) {
    let nextAzimuth = azimuths[i - 1] + correctedAngles[i - 1];
    if (angleType === "internal") {
      nextAzimuth += 180;
    } else {
      nextAzimuth -= 180;
    }

    if (nextAzimuth >= 360) nextAzimuth -= 360;
    if (nextAzimuth < 0) nextAzimuth += 360;

    azimuths[i] = nextAzimuth;
  }

  // 4. Cálculo das Projeções (Variações Leste e Norte)
  const projectionsEast = distances.map(
    (dist, i) => dist * Math.sin(toRadians(azimuths[i]))
  );
  const projectionsNorth = distances.map(
    (dist, i) => dist * Math.cos(toRadians(azimuths[i]))
  );

  // 5. Cálculo do Erro Linear
  const sumProjectionsEast = projectionsEast.reduce((sum, val) => sum + val, 0);
  const sumProjectionsNorth = projectionsNorth.reduce(
    (sum, val) => sum + val,
    0
  );
  const perimeter = distances.reduce((sum, val) => sum + val, 0);

  const linearCorrectionsEast = distances.map(
    (dist) => (-sumProjectionsEast / perimeter) * dist
  );
  const linearCorrectionsNorth = distances.map(
    (dist) => (-sumProjectionsNorth / perimeter) * dist
  );

  // 6. Cálculo das Coordenadas Finais
  const finalCoordinates: { east: number; north: number }[] = new Array(
    numPoints
  );
  finalCoordinates[0] = { east: initialEast, north: initialNorth };

  for (let i = 1; i < numPoints; i++) {
    finalCoordinates[i] = {
      east:
        finalCoordinates[i - 1].east +
        projectionsEast[i - 1] +
        linearCorrectionsEast[i - 1],
      north:
        finalCoordinates[i - 1].north +
        projectionsNorth[i - 1] +
        linearCorrectionsNorth[i - 1],
    };
  }

  // 7. Montagem do Objeto de Resultado
  const totalLinearError = Math.sqrt(
    sumProjectionsEast ** 2 + sumProjectionsNorth ** 2
  );
  const precision = `1:${Math.round(
    perimeter / totalLinearError
  ).toLocaleString("pt-BR")}`;

  return {
    finalCoordinates: finalCoordinates.map((coord, i) => ({
      point: `P${i + 1}`,
      ...coord,
    })),
    errorAnalysis: {
      angular: {
        sum: sumOfMeasuredAngles,
        expected: expectedAngleSum,
        error: angularError,
        correction: angularCorrection,
      },
      linear: {
        sumEast: sumProjectionsEast,
        sumNorth: sumProjectionsNorth,
        errorEast: -sumProjectionsEast,
        errorNorth: -sumProjectionsNorth,
        totalError: totalLinearError,
        precision,
      },
      perimeter,
    },
  };
}
