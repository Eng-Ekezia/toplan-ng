// src/components/forms/PolygonDataForm.tsx

"use client";
import { Card, CardContent } from "@/components/ui/card"; // Removido CardHeader e CardTitle
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalculationStore } from "@/store/useCalculationStore";
import React from "react";

export function PolygonDataForm() {
  const { input, setNumPoints, setInput, setNestedInput } =
    useCalculationStore();

  return (
    // O Card agora não tem mais o Header
    <Card>
      <CardContent className="space-y-6 pt-6">
        {" "}
        {/* Adicionado pt-6 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numPoints">Nº de Vértices</Label>
            <Input
              id="numPoints"
              type="number"
              min="3"
              value={input.numPoints}
              onChange={(e) => setNumPoints(Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="angleType">Tipo de Ângulo</Label>
            <Select
              value={input.angleType}
              onValueChange={(value: "internal" | "external") =>
                setInput("angleType", value)
              }
            >
              <SelectTrigger id="angleType">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internos</SelectItem>
                <SelectItem value="external">Externos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Azimute Inicial (P1 → P2)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              type="number"
              placeholder="G°"
              value={input.initialAzimuth.deg}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNestedInput("initialAzimuth", "deg", e.target.value)
              }
            />
            <Input
              type="number"
              placeholder="M'"
              value={input.initialAzimuth.min}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNestedInput("initialAzimuth", "min", e.target.value)
              }
            />
            <Input
              type="number"
              placeholder='S"'
              value={input.initialAzimuth.sec}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNestedInput("initialAzimuth", "sec", e.target.value)
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coordEast">Coord. Leste (X) de P1</Label>
            <Input
              id="coordEast"
              type="number"
              placeholder="metros"
              value={input.initialCoordinates.east}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNestedInput("initialCoordinates", "east", e.target.value)
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coordNorth">Coord. Norte (Y) de P1</Label>
            <Input
              id="coordNorth"
              type="number"
              placeholder="metros"
              value={input.initialCoordinates.north}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNestedInput("initialCoordinates", "north", e.target.value)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
