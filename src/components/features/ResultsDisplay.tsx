"use client";
import { useCalculationStore } from "@/store/useCalculationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ResultsDisplay() {
  const { result, isLoading, input } = useCalculationStore();

  if (isLoading) {
    return <p>Calculando...</p>;
  }

  if (!result) {
    return (
      <p className="text-muted-foreground text-center">
        Nenhum resultado para exibir. Preencha os dados e clique em Calcular.
      </p>
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

      <Card>
        <CardHeader>
          <CardTitle>Coordenadas Finais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b">
                  <th className="p-2">Ponto</th>
                  <th className="p-2">Leste (X)</th>
                  <th className="p-2">Norte (Y)</th>
                </tr>
              </thead>
              <tbody>
                {finalCoordinates.map(({ point, east, north }) => (
                  <tr key={point} className="border-b">
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
          <p>Perímetro: {errorAnalysis.perimeter.toFixed(3)} m</p>
          <p>Erro Angular Total: {errorAnalysis.angular.error.toFixed(5)}°</p>
          <p>
            Erro Linear Total: {errorAnalysis.linear.totalError.toFixed(5)} m
          </p>
          <p>Precisão do Levantamento: {errorAnalysis.linear.precision}</p>
        </CardContent>
      </Card>
    </div>
  );
}
