// src/components/features/PolygonCanvas.tsx

"use client";

import { FinalCoordinate, DetailCoordinate } from "@/lib/types";
import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAngleToSimpleString } from "@/lib/utils"; // Importar a nova função

interface PolygonCanvasProps {
  coordinates: FinalCoordinate[];
  details: DetailCoordinate[];
  azimuths: number[]; // Adicionar prop para azimutes
}

export function PolygonCanvas({
  coordinates,
  details,
  azimuths,
}: PolygonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || coordinates.length < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const allCoords = [...coordinates, ...details];
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let minX = allCoords.length > 0 ? allCoords[0].east : 0;
    let maxX = allCoords.length > 0 ? allCoords[0].east : 0;
    let minY = allCoords.length > 0 ? allCoords[0].north : 0;
    let maxY = allCoords.length > 0 ? allCoords[0].north : 0;

    for (const coord of allCoords) {
      if (coord.east < minX) minX = coord.east;
      if (coord.east > maxX) maxX = coord.east;
      if (coord.north < minY) minY = coord.north;
      if (coord.north > maxY) maxY = coord.north;
    }

    const padding = 50; // Aumentar padding para dar espaço aos labels de azimute
    const canvasWidth = canvas.width - padding * 2;
    const canvasHeight = canvas.height - padding * 2;
    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;

    const scaleX = dataWidth === 0 ? 1 : canvasWidth / dataWidth;
    const scaleY = dataHeight === 0 ? 1 : canvasHeight / dataHeight;
    const scale = Math.min(scaleX, scaleY) * 0.9;

    const transform = (x: number, y: number) => {
      const canvasX = (x - minX) * scale + padding;
      const canvasY = canvasHeight - (y - minY) * scale + padding;
      return { x: canvasX, y: canvasY };
    };

    // Desenha as linhas da poligonal
    ctx.beginPath();
    const startPoint = transform(coordinates[0].east, coordinates[0].north);
    ctx.moveTo(startPoint.x, startPoint.y);

    for (let i = 1; i < coordinates.length; i++) {
      const point = transform(coordinates[i].east, coordinates[i].north);
      ctx.lineTo(point.x, point.y);
    }
    ctx.closePath();
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Desenha os vértices, azimutes e textos da poligonal
    coordinates.forEach((coord, i) => {
      const point = transform(coord.east, coord.north);

      // --- Lógica de Desenho do Azimute (NOVO) ---
      const northLineLength = 25;
      const arcRadius = 20;

      // 1. Linha do Norte
      ctx.beginPath();
      ctx.setLineDash([3, 3]);
      ctx.moveTo(point.x, point.y);
      ctx.lineTo(point.x, point.y - northLineLength);
      ctx.strokeStyle = "#9ca3af"; // cinza
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#6b7280";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText("N", point.x, point.y - northLineLength - 4);

      // 2. Arco do Azimute
      const azimuteRad = (azimuths[i] * Math.PI) / 180;
      ctx.beginPath();
      const startAngle = -Math.PI / 2; // Aponta para cima (Norte)
      const endAngle = startAngle + azimuteRad;
      ctx.arc(point.x, point.y, arcRadius, startAngle, endAngle);
      ctx.strokeStyle = "#ef4444"; // Vermelho
      ctx.stroke();

      // 3. Texto do Azimute
      const textAngle = startAngle + azimuteRad / 2;
      const textX = point.x + (arcRadius + 12) * Math.cos(textAngle);
      const textY = point.y + (arcRadius + 12) * Math.sin(textAngle);
      ctx.fillStyle = "#ef4444";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(formatAngleToSimpleString(azimuths[i]), textX, textY);
      // --- Fim da Lógica do Azimute ---

      // Vértice (círculo)
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#1f2937";
      ctx.fill();

      // Texto (nome do ponto)
      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "#1f2937";
      ctx.textAlign = "left";
      ctx.fillText(coord.point, point.x + 8, point.y + 4);
    });

    // Desenha os pontos de detalhe
    details.forEach((coord) => {
      const point = transform(coord.east, coord.north);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981"; // Verde
      ctx.fill();
      ctx.font = "10px Arial";
      ctx.fillStyle = "#4b5563";
      ctx.fillText(coord.point, point.x + 6, point.y + 3);
    });
  }, [coordinates, details, azimuths]); // Adicionar azimuths às dependências

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico da Poligonal</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full aspect-video border rounded-md bg-white cursor-grab active:cursor-grabbing"
        />
      </CardContent>
    </Card>
  );
}
