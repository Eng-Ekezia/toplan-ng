// src/components/forms/DetailsModal.tsx

"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";
import { useState } from "react";
import { DetailInput } from "@/lib/types";
import { ErrorMessage } from "@/components/ui/error-message"; // Importar o novo componente

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
  const { errors } = useCalculationStore();
  const detailErrors = errors.details?.[vertexIndex]?.[detailIndex];
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(detail.name || "");

  const handleUpdate = (field: keyof DetailInput, value: string) => {
    onUpdate(vertexIndex, detailIndex, field, value);
  };

  const saveName = () => {
    handleUpdate("name", tempName);
    setIsEditingName(false);
  };

  const cancelName = () => {
    setTempName(detail.name || "");
    setIsEditingName(false);
  };

  return (
    <div className="p-4 border rounded-md space-y-3 bg-muted/50">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {isEditingName ? (
            <div className="flex items-center gap-1">
              <Input
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="h-7 w-32 text-sm"
                placeholder={`Detalhe ${detailIndex + 1}`}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveName();
                  if (e.key === "Escape") cancelName();
                }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={saveName}
                aria-label="Salvar nome"
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={cancelName}
                aria-label="Cancelar edição"
              >
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ) : (
            <>
              <p className="font-semibold text-sm">
                {detail.name && detail.name.trim() !== "" ? detail.name : `Detalhe ${detailIndex + 1}`}
              </p>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => {
                  setTempName(detail.name || "");
                  setIsEditingName(true);
                }}
                aria-label="Editar nome"
              >
                <Pencil className="h-3 w-3 text-muted-foreground" />
              </Button>
            </>
          )}
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              aria-label="Remover Detalhe"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação não pode ser desfeita. Isso excluirá permanentemente o
                detalhe deste vértice.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={onRemove}>
                Continuar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor={`detail-angle-deg-${vertexIndex}-${detailIndex}`}
            className="text-xs text-muted-foreground"
          >
            Ângulo Medido
          </label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <Input
              id={`detail-angle-deg-${vertexIndex}-${detailIndex}`}
              type="number"
              placeholder="G°"
              value={detail.angle_deg}
              onChange={(e) => handleUpdate("angle_deg", e.target.value)}
              aria-invalid={!!detailErrors?.angle_deg}
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
          <ErrorMessage message={detailErrors?.angle_deg} />
        </div>
        <div>
          <label
            htmlFor={`detail-distance-${vertexIndex}-${detailIndex}`}
            className="text-xs text-muted-foreground"
          >
            Distância (m)
          </label>
          <Input
            id={`detail-distance-${vertexIndex}-${detailIndex}`}
            type="number"
            placeholder="metros"
            className="mt-1"
            value={detail.distance}
            onChange={(e) => handleUpdate("distance", e.target.value)}
            aria-invalid={!!detailErrors?.distance}
          />
          <ErrorMessage message={detailErrors?.distance} />
        </div>
      </div>
    </div>
  );
}
