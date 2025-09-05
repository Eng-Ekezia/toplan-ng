// src/components/features/PolygonCanvas.tsx

"use client";

import { FinalCoordinate, DetailCoordinate } from "@/lib/types";
import React, { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { formatAngleToSimpleString } from "@/lib/utils";

interface PolygonCanvasProps {
  coordinates: FinalCoordinate[];
  details: DetailCoordinate[];
  azimuths: number[];
}

const getTouchDistance = (touches: React.TouchList) => {
  return Math.sqrt(
    Math.pow(touches[0].clientX - touches[1].clientX, 2) +
      Math.pow(touches[0].clientY - touches[1].clientY, 2)
  );
};

export function PolygonCanvas({
  coordinates,
  details,
  azimuths,
}: PolygonCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const pinchDistanceRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || coordinates.length < 1) return;

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

    const padding = 50;
    const canvasWidth = canvas.width - padding * 2;
    const canvasHeight = canvas.height - padding * 2;
    const dataWidth = maxX - minX;
    const dataHeight = maxY - minY;

    const scaleX = dataWidth === 0 ? 1 : canvasWidth / dataWidth;
    const scaleY = dataHeight === 0 ? 1 : canvasHeight / dataHeight;
    const initialScale = Math.min(scaleX, scaleY) * 0.9;

    const transform = (x: number, y: number) => {
      const scaledX = (x - minX) * initialScale * zoom;
      const scaledY = (y - minY) * initialScale * zoom;

      const canvasX =
        scaledX +
        padding +
        offset.x +
        (canvasWidth - dataWidth * initialScale * zoom) / 2;
      const canvasY =
        canvasHeight -
        scaledY +
        padding +
        offset.y +
        (canvasHeight - dataHeight * initialScale * zoom) / 2;

      return { x: canvasX, y: canvasY };
    };

    if (coordinates.length > 1) {
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
    }
    coordinates.forEach((coord: FinalCoordinate, i: number) => {
      const point = transform(coord.east, coord.north);
      const northLineLength = 25;
      const arcRadius = 20;

      if (azimuths[i] !== undefined) {
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(point.x, point.y - northLineLength);
        ctx.strokeStyle = "#9ca3af";
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#6b7280";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText("N", point.x, point.y - northLineLength - 4);

        const azimuteRad = (azimuths[i] * Math.PI) / 180;
        ctx.beginPath();
        const startAngle = -Math.PI / 2;
        const endAngle = startAngle + azimuteRad;
        ctx.arc(point.x, point.y, arcRadius, startAngle, endAngle);
        ctx.strokeStyle = "#ef4444";
        ctx.stroke();

        const textAngle = startAngle + azimuteRad / 2;
        const textX = point.x + (arcRadius + 12) * Math.cos(textAngle);
        const textY = point.y + (arcRadius + 12) * Math.sin(textAngle);
        ctx.fillStyle = "#ef4444";
        ctx.fillText(formatAngleToSimpleString(azimuths[i]), textX, textY);
      }

      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
      ctx.fillStyle = "#1f2937";
      ctx.fill();

      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "#1f2937";
      ctx.textAlign = "left";
      ctx.fillText(coord.point, point.x + 8, point.y + 4);
    });
    details.forEach((coord: DetailCoordinate) => {
      const point = transform(coord.east, coord.north);
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = "#10b981";
      ctx.fill();
      ctx.font = "10px Arial";
      ctx.fillStyle = "#4b5563";
      ctx.fillText(coord.point, point.x + 6, point.y + 3);
    });
  }, [coordinates, details, azimuths, zoom, offset]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.2, 20));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.2, 0.1));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      const dx = e.clientX - lastPosition.x;
      const dy = e.clientY - lastPosition.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      pinchDistanceRef.current = getTouchDistance(e.touches);
    } else if (e.touches.length === 1) {
      e.preventDefault();
      setIsDragging(true);
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length === 2) {
      const newDistance = getTouchDistance(e.touches);
      const scale = newDistance / pinchDistanceRef.current;
      setZoom((prev) => Math.max(0.1, Math.min(prev * scale, 20)));
      pinchDistanceRef.current = newDistance;
    } else if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - lastPosition.x;
      const dy = e.touches[0].clientY - lastPosition.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDragging(false);
    pinchDistanceRef.current = 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gráfico da Poligonal</CardTitle>
      </CardHeader>
      {/* --- ALTERAÇÃO PRINCIPAL AQUI --- */}
      {/* A classe "relative" foi movida para o CardContent */}
      {/* O div extra foi removido */}
      <CardContent className="relative p-2 md:p-6">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full aspect-video border rounded-md bg-white cursor-grab active:cursor-grabbing touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        {/* As classes de posicionamento foram ajustadas para o novo contêiner */}
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          <Button
            size="icon"
            variant="outline"
            onClick={handleZoomIn}
            className="h-8 w-8 bg-background/50 backdrop-blur-sm"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={handleZoomOut}
            className="h-8 w-8 bg-background/50 backdrop-blur-sm"
          >
            <Minus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
