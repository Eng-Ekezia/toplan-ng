"use client";
import { useCalculationStore } from "@/store/useCalculationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PolygonCanvas } from "./PolygonCanvas";

export function ResultsDisplay() {
  const { result, isLoading, input } = useCalculationStore();

  if (isLoading) {
    return <p className="text-center">Calculando...</p>;
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

  const { finalCoordinates, errorAnalysis } = result;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resultados para: {input.projectName}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Cliente: {input.clientName || "Não informado"}
          </p>
        </CardContent>
      </Card>

      {/* Gráfico da Poligonal */}
      <PolygonCanvas coordinates={finalCoordinates} />

      <Card>
        <CardHeader>
          <CardTitle>Coordenadas Finais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2 font-semibold">Ponto</th>
                  <th className="p-2 font-semibold">Leste (X)</th>
                  <th className="p-2 font-semibold">Norte (Y)</th>
                </tr>
              </thead>
              <tbody>
                {finalCoordinates.map(({ point, east, north }) => (
                  <tr key={point} className="border-b last:border-b-0">
                    <td className="p-2 font-medium">{point}</td>
                    <td className="p-2">{east.toFixed(3)}</td>
                    <td className="p-2">{north.toFixed(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Análise de Erros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            Perímetro: <strong>{errorAnalysis.perimeter.toFixed(3)} m</strong>
          </p>
          <p>
            Erro Angular Total:{" "}
            <strong>{errorAnalysis.angular.error.toFixed(5)}°</strong>
          </p>
          <p>
            Erro Linear Total:{" "}
            <strong>{errorAnalysis.linear.totalError.toFixed(5)} m</strong>
          </p>
          <p>
            Precisão do Levantamento:{" "}
            <strong>{errorAnalysis.linear.precision}</strong>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
