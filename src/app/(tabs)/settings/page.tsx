"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalculationStore } from "@/store/useCalculationStore";
import { Save, FilePlus, FolderUp, FileX } from "lucide-react";

export default function SettingsPage() {
  const {
    saveProject,
    resetInput,
    getSavedProjects,
    loadProject,
    deleteProject,
  } = useCalculationStore();

  const [savedProjects, setSavedProjects] = useState<string[]>([]);

  // Efeito para carregar a lista de projetos salvos ao montar o componente
  useEffect(() => {
    setSavedProjects(getSavedProjects());
  }, [getSavedProjects]);

  const handleDeleteProject = (projectName: string) => {
    deleteProject(projectName);
    // Atualiza a lista de projetos na UI após a exclusão
    setSavedProjects(getSavedProjects());
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Ajustes e Gerenciamento</h2>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={saveProject} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Salvar Projeto Atual
          </Button>
          <Button onClick={resetInput} variant="outline" className="w-full">
            <FilePlus className="mr-2 h-4 w-4" />
            Novo Projeto (Limpar Formulário)
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projetos Salvos</CardTitle>
        </CardHeader>
        <CardContent>
          {savedProjects.length > 0 ? (
            <ul className="space-y-2">
              {savedProjects.map((projectName) => (
                <li
                  key={projectName}
                  className="flex items-center justify-between p-2 border rounded-md"
                >
                  <span className="font-medium text-sm">{projectName}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadProject(projectName)}
                    >
                      <FolderUp className="mr-2 h-4 w-4" />
                      Carregar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProject(projectName)}
                    >
                      <FileX className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              Nenhum projeto salvo.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
