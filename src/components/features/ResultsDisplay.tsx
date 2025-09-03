"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalculationResult } from "@/lib/types";

interface ResultsDisplayProps {
  results: CalculationResult;
}

// Função auxiliar para formatar números
const format = (num: number, digits = 3) =>
  num.toFixed(digits).replace(".", ",");
const formatAngle = (num: number) => `${format(num, 6)}°`;

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  const { finalCoordinates, errorAnalysis } = results;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Coordenadas Finais</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Ponto</TableHead>
                <TableHead>Leste (X)</TableHead>
                <TableHead>Norte (Y)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {finalCoordinates.map(({ point, east, north }) => (
                <TableRow key={point}>
                  <TableCell className="font-medium">{point}</TableCell>
                  <TableCell>{format(east)}</TableCell>
                  <TableCell>{format(north)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise de Erros</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p>
            <strong>Perímetro:</strong> {format(errorAnalysis.perimeter)} m
          </p>
          <p>
            <strong>Erro de Fechamento Angular:</strong>{" "}
            {formatAngle(errorAnalysis.angular.error)}
          </p>
          <p>
            <strong>Erro de Fechamento Linear:</strong>{" "}
            {format(errorAnalysis.linear.totalError)} m
          </p>
          <p>
            <strong>Precisão Obtida:</strong> {errorAnalysis.linear.precision}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
