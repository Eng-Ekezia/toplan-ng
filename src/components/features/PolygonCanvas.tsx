"use client";

import { FinalCoordinate } from "@/lib/types";
import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PolygonCanvasProps {
  coordinates: FinalCoordinate[];
}

export function PolygonCanvas({ coordinates }: PolygonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || coordinates.length < 2) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Encontra os limites das coordenadas para o escalonamento
    let minX = coordinates[0].east;
    let maxX = coordinates[0].east;
    let minY = coordinates[0].north;
    let maxY = coordinates[0].north;

    for (const coord of coordinates) {
      if (coord.east < minX) minX = coord.east;
      if (coord.east > maxX) maxX = coord.east;
      if (coord.north < minY) minY = coord.north;
      if (coord.north > maxY) maxY = coord.north;
    }

    const padding = 40; // Espaçamento da borda do canvas
    const canvasWidth = canvas.width - padding * 2;
    const canvasHeight = canvas.height - padding * 2;
    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;

    // Calcula a escala para caber no canvas
    const scaleX = dataWidth === 0 ? 1 : canvasWidth / dataWidth;
    const scaleY = dataHeight === 0 ? 1 : canvasHeight / dataHeight;
    const scale = Math.min(scaleX, scaleY) * 0.9; // Fator de segurança de 90%

    // Função para transformar coordenadas reais em coordenadas do canvas
    const transform = (x: number, y: number) => {
      const canvasX = (x - minX) * scale + padding;
      // Invertemos o Y porque o canvas tem (0,0) no canto superior esquerdo
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
    ctx.closePath(); // Fecha o caminho de volta ao primeiro ponto
    ctx.strokeStyle = "#3b82f6"; // Azul
    ctx.lineWidth = 2;
    ctx.stroke();

    // Desenha os vértices e os textos
    coordinates.forEach((coord) => {
      const point = transform(coord.east, coord.north);

      // Vértice (círculo)
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#ef4444"; // Vermelho
      ctx.fill();

      // Texto (nome do ponto)
      ctx.font = "12px Arial";
      ctx.fillStyle = "#1f2937"; // Cinza escuro
      ctx.fillText(coord.point, point.x + 8, point.y + 4);
    });
  }, [coordinates]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico da Poligonal</CardTitle>
      </CardHeader>
      <CardContent>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="w-full h-auto border rounded-md bg-white"
        />
      </CardContent>
    </Card>
  );
}
