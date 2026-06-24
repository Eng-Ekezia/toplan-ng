// src/components/forms/PolygonDataForm.tsx

"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/reui/number-field";
import { Switch } from "@/components/ui/switch";
import { useCalculationStore } from "@/store/useCalculationStore";
import React from "react";
import { ErrorMessage } from "@/components/ui/error-message"; // Importar o novo componente

export function PolygonDataForm() {
  const { input, setNumPoints, setInput, setNestedInput, errors } =
    useCalculationStore();

  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="numPoints">Nº de Vértices</Label>
            <NumberField
              id="numPoints"
              value={input.numPoints}
              onValueChange={(value) => setNumPoints(Number(value))}
              min={3}
            >
              <NumberFieldGroup>
                <NumberFieldDecrement />
                <NumberFieldInput aria-invalid={!!errors.numPoints} />
                <NumberFieldIncrement />
              </NumberFieldGroup>
            </NumberField>
            <ErrorMessage message={errors.numPoints as string} />
          </div>
          <div className="space-y-2 flex flex-col justify-center">
            <Label htmlFor="angleType">Tipo de Ângulo</Label>
            <div className="flex items-center gap-2 pt-2 pb-1">
              <span
                id="angle-internal"
                className={`cursor-pointer text-sm font-medium transition-colors ${input.angleType === "internal" ? "text-foreground" : "text-muted-foreground/70"}`}
                onClick={() => setInput("angleType", "internal")}
              >
                Internos
              </span>
              <Switch
                id="angleType"
                checked={input.angleType === "external"}
                onCheckedChange={(checked) =>
                  setInput("angleType", checked ? "external" : "internal")
                }
                aria-labelledby="angle-internal angle-external"
              />
              <span
                id="angle-external"
                className={`cursor-pointer text-sm font-medium transition-colors ${input.angleType === "external" ? "text-foreground" : "text-muted-foreground/70"}`}
                onClick={() => setInput("angleType", "external")}
              >
                Externos
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="initialAzimuth_deg">Azimute Inicial (P1 → P2)</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              id="initialAzimuth_deg"
              type="number"
              placeholder="G°"
              value={input.initialAzimuth.deg}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNestedInput("initialAzimuth", "deg", e.target.value)
              }
              aria-invalid={!!errors.initialAzimuth?.deg}
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
          <ErrorMessage message={errors.initialAzimuth?.deg} />
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
              aria-invalid={!!errors.initialCoordinates?.east}
            />
            <ErrorMessage message={errors.initialCoordinates?.east} />
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
              aria-invalid={!!errors.initialCoordinates?.north}
            />
            <ErrorMessage message={errors.initialCoordinates?.north} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
