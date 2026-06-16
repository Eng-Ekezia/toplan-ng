// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  CalculationInput,
  CalculationResult,
  DetailCoordinate,
  FinalCoordinate,
} from "./types";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAngleToString(
  decimal: number | undefined | null
): string {
  if (typeof decimal !== "number" || isNaN(decimal)) return "N/A";
  const sign = decimal < 0 ? "-" : "";
  decimal = Math.abs(decimal);
  const d = Math.floor(decimal);
  const m = Math.floor((decimal - d) * 60);
  const s = ((decimal - d) * 3600 - m * 60).toFixed(2);
  return `${sign}${d}° ${m}' ${s}"`;
}

export function formatDecimal(
  num: number | undefined | null,
  places = 3
): string {
  if (typeof num !== "number" || isNaN(num)) return "N/A";
  return num.toFixed(places);
}

export function formatAngleToSimpleString(
  decimal: number | undefined | null
): string {
  if (typeof decimal !== "number" || isNaN(decimal)) return "N/A";
  const sign = decimal < 0 ? "-" : "";
  decimal = Math.abs(decimal);
  const d = Math.floor(decimal);
  const m = Math.floor((decimal - d) * 60);
  const s = Math.round((decimal - d) * 3600 - m * 60);
  return `${sign}${d}°${m}'${s}"`;
}

export function exportInputToJSON(input: CalculationInput) {
  if (!input.projectName.trim()) {
    toast.error("Adicione um nome ao projeto para poder exportá-lo.");
    return;
  }
  try {
    const jsonString = JSON.stringify(input, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `${input.projectName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}.json`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Projeto "${input.projectName}" exportado com sucesso!`);
  } catch (error) {
    toast.error("Ocorreu um erro ao exportar o projeto.");
    console.error("Erro ao exportar projeto:", error);
  }
}

export function exportResultsToCSV(
  result: CalculationResult | null,
  projectName: string,
  decimalPlaces: number = 3
) {
  if (!result) {
    toast.error("Não há resultados calculados para exportar.");
    return;
  }
  try {
    const headers = ["Ponto", "Leste (X)", "Norte (Y)"];
    const rows = [...result.finalCoordinates, ...result.detailCoordinates].map(
      (coord) => [
        coord.point,
        formatDecimal(coord.east, decimalPlaces),
        formatDecimal(coord.north, decimalPlaces),
      ]
    );

    const csvContent =
      headers.join(";") + "\n" + rows.map((e) => e.join(";")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `${projectName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_resultados.csv`;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Resultados exportados para CSV com sucesso!");
  } catch (error) {
    toast.error("Ocorreu um erro ao gerar o arquivo CSV.");
    console.error("Erro ao exportar CSV:", error);
  }
}

export function exportResultsToPDF(
  result: CalculationResult | null,
  input: CalculationInput,
  decimalPlaces: number = 3
) {
  if (!result) {
    toast.error("Não há resultados calculados para exportar.");
    return;
  }
  try {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const pageWidth = doc.internal.pageSize.width;
    const primaryColor = "#2563eb";
    let y = 15;

    doc.setFont("Times", "normal");

    doc.setFontSize(18);
    doc.setTextColor(primaryColor);
    doc.text("Relatório de Cálculo Planimétrico", pageWidth / 2, y, {
      align: "center",
    });
    y += 8;

    doc.setFontSize(10);
    doc.setTextColor(40);
    doc.text(`Projeto: ${input.projectName}`, 14, y);
    doc.text(
      `Cliente: ${input.clientName || "Não informado"}`,
      pageWidth - 14,
      y,
      { align: "right" }
    );
    y += 10;

    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text("Coordenadas Finais", 14, y);
    y += 6;

    const allCoordinates = [
      ...result.finalCoordinates,
      ...result.detailCoordinates,
    ];
    const coordBody = allCoordinates.map((c) => [
      c.point,
      formatDecimal(c.east, decimalPlaces),
      formatDecimal(c.north, decimalPlaces),
    ]);

    autoTable(doc, {
      head: [["Ponto", "Leste (X)", "Norte (Y)"]],
      body: coordBody,
      startY: y,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
      styles: { fontSize: 7, cellPadding: 1.5, font: "Times" },
    });
    y = doc.lastAutoTable.finalY + 7;

    doc.setFontSize(12);
    doc.setTextColor(primaryColor);
    doc.text("Análise de Fechamento", 14, y);
    y += 6;
    const errorBody = [
      [
        "Erro Angular Total",
        formatAngleToString(result.errorAnalysis.angular.error),
      ],
      [
        "Tolerância Angular",
        formatAngleToString(result.errorAnalysis.angular.tolerance),
      ],
      ["Precisão do Levantamento", result.errorAnalysis.linear.precision],
      [
        "Tolerância Linear",
        `1:${result.errorAnalysis.linear.tolerance.toLocaleString("pt-BR")}`,
      ],
      [
        "Erro Linear Total",
        `${formatDecimal(result.errorAnalysis.linear.totalError, Math.max(5, decimalPlaces))} m`,
      ],
      ["Perímetro", `${formatDecimal(result.errorAnalysis.perimeter, decimalPlaces)} m`],
    ];
    autoTable(doc, {
      body: errorBody,
      startY: y,
      theme: "grid",
      styles: { fontSize: 7, cellPadding: 1.5, font: "Times" },
      columnStyles: { 0: { fontStyle: "bold", cellWidth: 50 } },
    });
    y = doc.lastAutoTable.finalY + 7;

    const leftTableY = y;
    const azBody = result.intermediate.correctedAngles.map((angle, i) => [
      `P${i + 1}`,
      formatAngleToString(angle),
      formatAngleToString(result.intermediate.azimuths[i]),
    ]);
    autoTable(doc, {
      head: [["Vértice", "Ângulo Corrigido", "Azimute"]],
      body: azBody,
      startY: leftTableY,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
      styles: { fontSize: 7, cellPadding: 1.5, font: "Times" },
      tableWidth: (pageWidth - 32) / 2,
      margin: { left: 14 },
    });

    const projBody = result.intermediate.correctedAngles.map((_, i) => [
      `P${i + 1}`,
      formatDecimal(result.intermediate.correctedProjectionsEast[i], decimalPlaces),
      formatDecimal(result.intermediate.correctedProjectionsNorth[i], decimalPlaces),
    ]);
    autoTable(doc, {
      head: [["Vértice", "ΔE Corrigida", "ΔN Corrigida"]],
      body: projBody,
      startY: leftTableY,
      theme: "striped",
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontSize: 8,
        fontStyle: "bold",
      },
      styles: { fontSize: 7, cellPadding: 1.5, font: "Times" },
      tableWidth: (pageWidth - 32) / 2,
      margin: { left: 14 + (pageWidth - 28) / 2 },
    });

    doc.addPage();
    drawPolygonOnPDF(
      doc,
      result.finalCoordinates,
      result.detailCoordinates,
      result.intermediate.azimuths
    );

    const fileName = `${input.projectName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase()}_relatorio.pdf`;
    doc.save(fileName);
    toast.success("Relatório PDF gerado com sucesso!");
  } catch (error) {
    toast.error("Ocorreu um erro ao gerar o relatório PDF.");
    console.error("Erro ao exportar PDF:", error);
  }
}

function drawPolygonOnPDF(
  doc: jsPDF,
  coordinates: FinalCoordinate[],
  details: DetailCoordinate[],
  azimuths: number[]
) {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const padding = 20;
  const primaryColor = "#2563eb";

  if (coordinates.length === 0) return;

  const allCoords = [...coordinates, ...details];
  let minX = allCoords[0].east,
    maxX = allCoords[0].east,
    minY = allCoords[0].north,
    maxY = allCoords[0].north;

  allCoords.forEach((c) => {
    if (c.east < minX) minX = c.east;
    if (c.east > maxX) maxX = c.east;
    if (c.north < minY) minY = c.north;
    if (c.north > maxY) maxY = c.north;
  });

  const dataWidth = maxX - minX;
  const dataHeight = maxY - minY;

  const scaleX = dataWidth === 0 ? 1 : (pageWidth - padding * 2) / dataWidth;
  const scaleY = dataHeight === 0 ? 1 : (pageHeight - padding * 2) / dataHeight;
  const scale = Math.min(scaleX, scaleY) * 0.9;

  const transform = (east: number, north: number) => {
    const x = (east - minX) * scale;
    const y = (north - minY) * scale;
    const finalX = x + (pageWidth - dataWidth * scale) / 2;
    const finalY =
      pageHeight - padding - y - (pageHeight - dataHeight * scale) / 2;
    return { x: finalX, y: finalY };
  };

  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  if (coordinates.length > 1) {
    const points = coordinates.map((c) => transform(c.east, c.north));
    // Adiciona o primeiro ponto ao final para fechar o polígono
    points.push(points[0]);

    for (let i = 0; i < points.length - 1; i++) {
      doc.line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
    }
  }

  coordinates.forEach((coord, i) => {
    const p = transform(coord.east, coord.north);

    doc.setFillColor("#1f2937");
    doc.circle(p.x, p.y, 1.5, "F");
    doc.setFontSize(8);
    doc.setTextColor("#1f2937");
    doc.text(coord.point, p.x + 3, p.y + 1.5);

    if (azimuths[i] !== undefined) {
      const nextPointIndex = (i + 1) % coordinates.length;
      const p2 = transform(
        coordinates[nextPointIndex].east,
        coordinates[nextPointIndex].north
      );
      doc.setDrawColor("#ef4444");
      doc.setLineWidth(0.2);
      doc.line(p.x, p.y, p2.x, p2.y);
    }
  });

  details.forEach((detail) => {
    const p = transform(detail.east, detail.north);
    doc.setFillColor("#10b981");
    doc.circle(p.x, p.y, 1, "F");
    doc.setFontSize(6);
    doc.setTextColor("#4b5563");
    doc.text(detail.point, p.x + 3, p.y + 1);
  });
}
