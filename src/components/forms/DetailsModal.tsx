// src/components/forms/DetailsModal.tsx

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCalculationStore } from "@/store/useCalculationStore";
import { Plus, Trash2 } from "lucide-react";
import { DetailInput } from "@/lib/types";

interface DetailsModalProps {
  vertexIndex: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DetailsModal({
  vertexIndex,
  isOpen,
  onOpenChange,
}: DetailsModalProps) {
  const { input, addDetail, removeDetail, updateDetailInput } =
    useCalculationStore();
  const details = input.details[vertexIndex] || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Detalhes do Vértice P{vertexIndex + 1}</DialogTitle>
          <DialogDescription>
            Insira os ângulos e distâncias dos pontos irradiados a partir deste
            vértice.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
          {details.length > 0 ? (
            details.map((detail, detailIndex) => (
              <DetailRow
                key={detailIndex}
                vertexIndex={vertexIndex}
                detailIndex={detailIndex}
                detail={detail}
                onRemove={() => removeDetail(vertexIndex, detailIndex)}
                onUpdate={updateDetailInput}
              />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum detalhe adicionado a este vértice.
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => addDetail(vertexIndex)}
            className="w-full"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Detalhe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Componente auxiliar para a linha de detalhe
interface DetailRowProps {
  vertexIndex: number;
  detailIndex: number;
  detail: DetailInput;
  onRemove: () => void;
  onUpdate: (
    vertexIndex: number,
    detailIndex: number,
    field: keyof DetailInput,
    value: string
  ) => void;
}

function DetailRow({
  vertexIndex,
  detailIndex,
  detail,
  onRemove,
  onUpdate,
}: DetailRowProps) {
  const handleUpdate = (field: keyof DetailInput, value: string) => {
    onUpdate(vertexIndex, detailIndex, field, value);
  };

  return (
    <div className="p-4 border rounded-md space-y-3 bg-muted/50">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-sm">Detalhe {detailIndex + 1}</p>
        <Button
          size="icon"
          variant="ghost"
          className="h-7 w-7"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-muted-foreground">Ângulo Medido</label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <Input
              type="number"
              placeholder="G°"
              value={detail.angle_deg}
              onChange={(e) => handleUpdate("angle_deg", e.target.value)}
            />
            <Input
              type="number"
              placeholder="M'"
              value={detail.angle_min}
              onChange={(e) => handleUpdate("angle_min", e.target.value)}
            />
            <Input
              type="number"
              placeholder='S"'
              value={detail.angle_sec}
              onChange={(e) => handleUpdate("angle_sec", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground">Distância (m)</label>
          <Input
            type="number"
            placeholder="metros"
            className="mt-1"
            value={detail.distance}
            onChange={(e) => handleUpdate("distance", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
