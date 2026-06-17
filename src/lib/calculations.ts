// src/lib/calculations.ts

import { CalculationInput, CalculationResult, DetailCoordinate } from "./types";
import { CALCULATION_CONSTANTS } from "./constants"; // Importar constantes

const MIN_TO_DEG = 1.0 / 60.0;
const SEC_TO_DEG = 1.0 / 3600.0;
const toRadians = (deg: number) => (Math.PI / 180) * deg;

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

export function calculatePlanimetry(data: CalculationInput): CalculationResult {
  const {
    numPoints,
    angleType,
    initialAzimuth,
    initialCoordinates,
    vertices,
    details,
  } = data;

  // 1. Conversão e Validação Inicial
  if (vertices.some((v) => v.distance === "")) {
    throw new Error("Todas as distâncias dos vértices devem ser preenchidas.");
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
    let nextAzimuth;
    const backAzimuth = azimuths[i - 1] + 180;

    if (angleType === "internal") {
      nextAzimuth = backAzimuth + correctedAngles[i];
    } else {
      // external
      nextAzimuth = backAzimuth - correctedAngles[i];
    }

    nextAzimuth %= 360;
    if (nextAzimuth < 0) nextAzimuth += 360;

    azimuths[i] = nextAzimuth;
  }

  // 4. Projeções e Erro Linear
  const projectionsEast = distances.map(
    (dist, i) => dist * Math.sin(toRadians(azimuths[i]))
  );
  const projectionsNorth = distances.map(
    (dist, i) => dist * Math.cos(toRadians(azimuths[i]))
  );
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

  const correctedProjectionsEast = projectionsEast.map(
    (proj, i) => proj + linearCorrectionsEast[i]
  );
  const correctedProjectionsNorth = projectionsNorth.map(
    (proj, i) => proj + linearCorrectionsNorth[i]
  );

  // 5. Coordenadas Finais
  const finalCoordinates: { east: number; north: number }[] = new Array(
    numPoints
  );
  finalCoordinates[0] = { east: initialEast, north: initialNorth };

  for (let i = 1; i < numPoints; i++) {
    finalCoordinates[i] = {
      east: finalCoordinates[i - 1].east + correctedProjectionsEast[i - 1],
      north: finalCoordinates[i - 1].north + correctedProjectionsNorth[i - 1],
    };
  }

  // 6. Cálculo das Coordenadas dos Detalhes
  const detailCoordinates: DetailCoordinate[] = [];
  details.forEach((vertexDetails, vertexIndex) => {
    vertexDetails.forEach((detail, detailIndex) => {
      if (detail.distance === "" || detail.angle_deg === "") return;

      const stationCoord = finalCoordinates[vertexIndex];

      const previousVertexIndex = (vertexIndex - 1 + numPoints) % numPoints;
      const backAzimuthBase = azimuths[previousVertexIndex] + 180;

      const detailAngleDecimal = gmsToDecimal(
        detail.angle_deg,
        detail.angle_min,
        detail.angle_sec
      );
      const detailDistance = parseFloat(detail.distance as string);

      let detailAzimuth = backAzimuthBase + detailAngleDecimal;

      detailAzimuth %= 360;
      if (detailAzimuth < 0) detailAzimuth += 360;

      const detailEast =
        stationCoord.east + detailDistance * Math.sin(toRadians(detailAzimuth));
      const detailNorth =
        stationCoord.north +
        detailDistance * Math.cos(toRadians(detailAzimuth));

      detailCoordinates.push({
        point: detail.name && detail.name.trim() !== "" ? detail.name : `P${vertexIndex + 1}-D${detailIndex + 1}`,
        east: detailEast,
        north: detailNorth,
      });
    });
  });

  // 7. Montagem do Objeto de Resultado e Tolerâncias
  const totalLinearError = Math.sqrt(
    sumProjectionsEast ** 2 + sumProjectionsNorth ** 2
  );
  const precisionDenominator = perimeter / totalLinearError;
  const precision = `1:${Math.round(precisionDenominator).toLocaleString(
    "pt-BR"
  )}`;

  // Cálculo de tolerâncias usando as constantes
  const angularToleranceInSeconds =
    CALCULATION_CONSTANTS.ANGULAR_TOLERANCE_FACTOR * Math.sqrt(numPoints) +
    CALCULATION_CONSTANTS.ANGULAR_TOLERANCE_SUM;
  const angularToleranceInDecimal = angularToleranceInSeconds * SEC_TO_DEG;
  const isAngularOk = Math.abs(angularError) <= angularToleranceInDecimal;

  const linearTolerance = CALCULATION_CONSTANTS.LINEAR_TOLERANCE_DENOMINATOR;
  const isLinearOk = precisionDenominator >= linearTolerance;

  return {
    finalCoordinates: finalCoordinates.map((coord, i) => ({
      point: `P${i + 1}`,
      ...coord,
    })),
    detailCoordinates,
    errorAnalysis: {
      angular: {
        sum: sumOfMeasuredAngles,
        expected: expectedAngleSum,
        error: angularError,
        correction: angularCorrection,
        tolerance: angularToleranceInDecimal,
        isOk: isAngularOk,
      },
      linear: {
        sumEast: sumProjectionsEast,
        sumNorth: sumProjectionsNorth,
        errorEast: -sumProjectionsEast,
        errorNorth: -sumProjectionsNorth,
        totalError: totalLinearError,
        precision,
        tolerance: linearTolerance,
        isOk: isLinearOk,
      },
      perimeter,
    },
    intermediate: {
      correctedAngles,
      azimuths,
      projectionsEast,
      projectionsNorth,
      linearCorrectionsEast,
      linearCorrectionsNorth,
      correctedProjectionsEast,
      correctedProjectionsNorth,
    },
  };
}
