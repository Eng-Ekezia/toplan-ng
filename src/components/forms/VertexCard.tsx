"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCalculationStore } from "@/store/useCalculationStore";
import { VertexInput } from "@/lib/types";

interface VertexCardProps {
  vertex: VertexInput;
  index: number;
  totalPoints: number;
}

export function VertexCard({ vertex, index, totalPoints }: VertexCardProps) {
  const { updateVertexInput } = useCalculationStore();

  const nextPointIndex = (index + 1) % totalPoints;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vértice P{index + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Ângulo Medido</Label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <Input
              type="number"
              placeholder="G°"
              value={vertex.angle_deg}
              onChange={(e) =>
                updateVertexInput(index, "angle_deg", e.target.value)
              }
            />
            <Input
              type="number"
              placeholder="M'"
              value={vertex.angle_min}
              onChange={(e) =>
                updateVertexInput(index, "angle_min", e.target.value)
              }
            />
            <Input
              type="number"
              placeholder='S"'
              value={vertex.angle_sec}
              onChange={(e) =>
                updateVertexInput(index, "angle_sec", e.target.value)
              }
            />
          </div>
        </div>
        <div>
          <Label>Distância para P{nextPointIndex + 1} (m)</Label>
          <Input
            type="number"
            placeholder="metros"
            value={vertex.distance}
            onChange={(e) =>
              updateVertexInput(index, "distance", e.target.value)
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
