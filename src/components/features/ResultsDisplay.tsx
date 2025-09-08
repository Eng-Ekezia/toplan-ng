// src/components/features/ResultsDisplay.tsx

"use client";

import React from "react";
import { useCalculationStore } from "@/store/useCalculationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PolygonCanvas } from "./PolygonCanvas";
import { formatAngleToString, formatDecimal } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ResultsDisplay() {
  const { result, isLoading, input } = useCalculationStore();

  if (isLoading) {
    return <p className="text-center animate-pulse">Calculando...</p>;
  }

  if (!result) {
    return (
      <div className="text-center text-muted-foreground mt-8">
        <p>Nenhum resultado para exibir.</p>
        <p className="text-sm">
          Preencha os dados na aba Dados e clique em Calcular.
        </p>
      </div>
    );
  }

  const { finalCoordinates, detailCoordinates, errorAnalysis, intermediate } =
    result;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          Resultados para: {input.projectName}
        </h2>
        <p className="text-sm text-muted-foreground">
          Cliente: {input.clientName || "Não informado"}
        </p>
      </div>

      <PolygonCanvas
        coordinates={finalCoordinates}
        details={detailCoordinates}
        azimuths={intermediate.azimuths}
      />

      <Card>
        <CardHeader>
          <CardTitle>Coordenadas Finais</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ponto</TableHead>
                <TableHead className="text-right">Leste (X)</TableHead>
                <TableHead className="text-right">Norte (Y)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* --- CORREÇÃO DO LINTER AQUI: 'index' removido --- */}
              {finalCoordinates.map((coord) => (
                <React.Fragment key={`fragment-${coord.point}`}>
                  <TableRow>
                    <TableCell className="font-medium">{coord.point}</TableCell>
                    <TableCell className="text-right">
                      {formatDecimal(coord.east, 3)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDecimal(coord.north, 3)}
                    </TableCell>
                  </TableRow>
                  {detailCoordinates
                    .filter((detail) =>
                      detail.point.startsWith(`${coord.point}-D`)
                    )
                    .map((detail) => (
                      <TableRow key={detail.point}>
                        <TableCell className="pl-6 text-muted-foreground">
                          {detail.point}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatDecimal(detail.east, 3)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatDecimal(detail.north, 3)}
                        </TableCell>
                      </TableRow>
                    ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise de Fechamento e Dados de Cálculo</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion
            type="multiple"
            className="w-full"
            defaultValue={["item-1"]}
          >
            <AccordionItem value="item-1">
              <AccordionTrigger>Resumo da Análise de Erros</AccordionTrigger>
              <AccordionContent className="space-y-3 text-sm p-2">
                <div className="flex justify-between items-center">
                  <span>Erro Angular Total:</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        errorAnalysis.angular.isOk ? "default" : "destructive"
                      }
                    >
                      {errorAnalysis.angular.isOk ? "OK" : "Fora"}
                    </Badge>
                    <strong>
                      {formatAngleToString(errorAnalysis.angular.error)}
                    </strong>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>Tolerância Angular:</span>
                  <strong>
                    {formatAngleToString(errorAnalysis.angular.tolerance)}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Correção por Vértice:</span>
                  <strong>
                    {formatAngleToString(errorAnalysis.angular.correction)}
                  </strong>
                </div>

                <div className="border-t my-3" />

                <div className="flex justify-between">
                  <span>Perímetro:</span>
                  <strong>{formatDecimal(errorAnalysis.perimeter, 3)} m</strong>
                </div>
                <div className="flex justify-between">
                  <span>Somatório ΔE:</span>
                  <strong>
                    {formatDecimal(errorAnalysis.linear.sumEast, 5)} m
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Somatório ΔN:</span>
                  <strong>
                    {formatDecimal(errorAnalysis.linear.sumNorth, 5)} m
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Erro Linear Total:</span>
                  <strong>
                    {formatDecimal(errorAnalysis.linear.totalError, 5)} m
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Tolerância Linear:</span>
                  <strong>
                    1:{errorAnalysis.linear.tolerance.toLocaleString("pt-BR")}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span>Precisão do Levantamento:</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        errorAnalysis.linear.isOk ? "default" : "destructive"
                      }
                    >
                      {errorAnalysis.linear.isOk ? "OK" : "Fora"}
                    </Badge>
                    <strong>{errorAnalysis.linear.precision}</strong>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Tabela de Ângulos e Azimutes</AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vértice</TableHead>
                      <TableHead>Ângulo Corrigido</TableHead>
                      <TableHead>Azimute</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {intermediate.correctedAngles.map((angle, i) => (
                      <TableRow key={i}>
                        <TableCell>P{i + 1}</TableCell>
                        <TableCell>{formatAngleToString(angle)}</TableCell>
                        <TableCell>
                          {formatAngleToString(intermediate.azimuths[i])}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                Tabela de Projeções e Correções
              </AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vértice</TableHead>
                        <TableHead>ΔE</TableHead>
                        <TableHead>ΔN</TableHead>
                        <TableHead>Corr. E</TableHead>
                        <TableHead>Corr. N</TableHead>
                        <TableHead>ΔE Corr</TableHead>
                        <TableHead>ΔN Corr</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {intermediate.correctedAngles.map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>P{i + 1}</TableCell>
                          <TableCell>
                            {formatDecimal(intermediate.projectionsEast[i], 3)}
                          </TableCell>
                          <TableCell>
                            {formatDecimal(intermediate.projectionsNorth[i], 3)}
                          </TableCell>
                          <TableCell>
                            {formatDecimal(
                              intermediate.linearCorrectionsEast[i],
                              3
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDecimal(
                              intermediate.linearCorrectionsNorth[i],
                              3
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDecimal(
                              intermediate.correctedProjectionsEast[i],
                              3
                            )}
                          </TableCell>
                          <TableCell>
                            {formatDecimal(
                              intermediate.correctedProjectionsNorth[i],
                              3
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
