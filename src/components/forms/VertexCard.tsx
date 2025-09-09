// src/components/forms/VertexCard.tsx

"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCalculationStore } from "@/store/useCalculationStore";
import { VertexInput } from "@/lib/types";

// Componente para exibir mensagens de erro
const ErrorMessage = ({ message }: { message?: string }) => {
  if (!message) return null;
  return <p className="text-sm font-medium text-destructive mt-1">{message}</p>;
};

interface VertexCardProps {
  vertex: VertexInput;
  index: number;
  totalPoints: number;
  onOpenDetails: (index: number) => void;
}

export function VertexCard({
  vertex,
  index,
  totalPoints,
  onOpenDetails,
}: VertexCardProps) {
  const { updateVertexInput, input, errors } = useCalculationStore();
  const detailCount = input.details[index]?.length || 0;
  const nextPointLabel = index + 1 === totalPoints ? 1 : index + 2;
  const vertexErrors = errors.vertices?.[index];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Vértice P{index + 1}</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenDetails(index)}
          >
            Detalhes ({detailCount})
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`vertex-angle-deg-${index}`}>Ângulo Medido</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              id={`vertex-angle-deg-${index}`}
              type="number"
              placeholder="G°"
              value={vertex.angle_deg}
              onChange={(e) =>
                updateVertexInput(index, "angle_deg", e.target.value)
              }
              aria-invalid={!!vertexErrors?.angle_deg}
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
          <ErrorMessage message={vertexErrors?.angle_deg} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`vertex-distance-${index}`}>
            Distância para P{nextPointLabel} (m)
          </Label>
          <Input
            id={`vertex-distance-${index}`}
            type="number"
            placeholder="metros"
            value={vertex.distance}
            onChange={(e) =>
              updateVertexInput(index, "distance", e.target.value)
            }
            aria-invalid={!!vertexErrors?.distance}
          />
          <ErrorMessage message={vertexErrors?.distance} />
        </div>
      </CardContent>
    </Card>
  );
}
