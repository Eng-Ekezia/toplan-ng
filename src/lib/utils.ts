// src/lib/utils.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CalculationInput, CalculationResult } from "./types";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ... (as outras funções formatDecimal, formatAngleToString, etc., permanecem as mesmas)
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
  projectName: string
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
        formatDecimal(coord.east, 3),
        formatDecimal(coord.north, 3),
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
  input: CalculationInput
) {
  if (!result) {
    toast.error("Não há resultados calculados para exportar.");
    return;
  }
  try {
    const doc = new jsPDF();
    let y = 15;

    doc.setFontSize(18);
    doc.text("Relatório de Cálculo Planimétrico", 105, y, { align: "center" });
    y += 10;
    doc.setFontSize(12);
    doc.text(`Projeto: ${input.projectName}`, 15, y);
    y += 7;
    doc.text(`Cliente: ${input.clientName || "Não informado"}`, 15, y);
    y += 10;

    doc.setFontSize(14);
    doc.text("Coordenadas Finais", 15, y);
    y += 5;
    const coordHeaders = [["Ponto", "Leste (X)", "Norte (Y)"]];
    const coordRows = [
      ...result.finalCoordinates,
      ...result.detailCoordinates,
    ].map((c) => [
      c.point,
      formatDecimal(c.east, 3),
      formatDecimal(c.north, 3),
    ]);

    // --- CORREÇÃO FINAL AQUI ---
    // Usamos a função 'autoTable' diretamente com a instância 'doc'
    autoTable(doc, {
      head: coordHeaders,
      body: coordRows,
      startY: y,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    const pageHeight = doc.internal.pageSize.height;
    const checkPageBreak = (spaceNeeded: number) => {
      if (y + spaceNeeded > pageHeight - 15) {
        doc.addPage();
        y = 15;
      }
    };
    checkPageBreak(60);
    doc.setFontSize(14);
    doc.text("Análise de Fechamento", 15, y);
    y += 5;
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
        `${formatDecimal(result.errorAnalysis.linear.totalError, 5)} m`,
      ],
      ["Perímetro", `${formatDecimal(result.errorAnalysis.perimeter, 3)} m`],
    ];
    autoTable(doc, {
      body: errorBody,
      startY: y,
      theme: "grid",
    });
    y = (doc as any).lastAutoTable.finalY + 10;

    checkPageBreak(50);
    doc.setFontSize(14);
    doc.text("Ângulos e Azimutes", 15, y);
    y += 5;
    const azHeaders = [["Vértice", "Ângulo Corrigido", "Azimute"]];
    const azRows = result.intermediate.correctedAngles.map((angle, i) => [
      `P${i + 1}`,
      formatAngleToString(angle),
      formatAngleToString(result.intermediate.azimuths[i]),
    ]);
    autoTable(doc, {
      head: azHeaders,
      body: azRows,
      startY: y,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185] },
    });
    y = (doc as any).lastAutoTable.finalY + 10;

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
