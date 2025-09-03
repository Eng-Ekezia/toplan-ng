"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export function PolygonDataForm() {
  const { input, setNumPoints, setInput, setNestedInput } =
    useCalculationStore();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados da Poligonal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="numPoints">Nº de Vértices</Label>
            <Input
              id="numPoints"
              type="number"
              min="3"
              value={input.numPoints}
              onChange={(e) => setNumPoints(Number(e.target.value))}
            />
          </div>
          <div>
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

        <div>
          <Label>Azimute Inicial (P1 → P2)</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <Input
              type="number"
              placeholder="G°"
              value={input.initialAzimuth.deg}
              onChange={(e) =>
                setNestedInput("initialAzimuth", "deg", e.target.value)
              }
            />
            <Input
              type="number"
              placeholder="M'"
              value={input.initialAzimuth.min}
              onChange={(e) =>
                setNestedInput("initialAzimuth", "min", e.target.value)
              }
            />
            <Input
              type="number"
              placeholder='S"'
              value={input.initialAzimuth.sec}
              onChange={(e) =>
                setNestedInput("initialAzimuth", "sec", e.target.value)
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="coordEast">Coord. Leste (X) de P1</Label>
            <Input
              id="coordEast"
              type="number"
              placeholder="metros"
              value={input.initialCoordinates.east}
              onChange={(e) =>
                setNestedInput("initialCoordinates", "east", e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor="coordNorth">Coord. Norte (Y) de P1</Label>
            <Input
              id="coordNorth"
              type="number"
              placeholder="metros"
              value={input.initialCoordinates.north}
              onChange={(e) =>
                setNestedInput("initialCoordinates", "north", e.target.value)
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
