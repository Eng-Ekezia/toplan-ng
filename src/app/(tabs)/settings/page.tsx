// src/app/(tabs)/settings/page.tsx

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalculationStore } from "@/store/useCalculationStore";
import { Save, FilePlus, FolderUp, FileX } from "lucide-react";
// --- ALTERAÇÃO AQUI: Importar componentes do AlertDialog ---
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

// Componente de Título para reutilização e consistência
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-center mb-2">{children}</h2>
);

export default function SettingsPage() {
  const {
    saveProject,
    resetInput,
    getSavedProjects,
    loadProject,
    deleteProject,
  } = useCalculationStore();

  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  // --- ALTERAÇÃO AQUI: Estado para controlar qual projeto deletar ---
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  useEffect(() => {
    setSavedProjects(getSavedProjects());
  }, [getSavedProjects]);

  // --- ALTERAÇÃO AQUI: A função agora é chamada pelo botão de confirmação no diálogo ---
  const handleDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setSavedProjects(getSavedProjects());
      setProjectToDelete(null); // Limpa o estado após a exclusão
    }
  };

  return (
    // Envolvemos todo o conteúdo em AlertDialog para poder usar seu Trigger
    <AlertDialog>
      <div className="space-y-6">
        <h1 className="text-xl font-semibold text-center">
          Ajustes e Gerenciamento
        </h1>

        <div className="space-y-4">
          <SectionTitle>Ações Rápidas</SectionTitle>
          <Card>
            <CardContent className="space-y-4 pt-6">
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
        </div>

        <div className="space-y-4">
          <SectionTitle>Projetos Salvos</SectionTitle>
          <Card>
            <CardContent className="pt-6">
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
                        {/* --- ALTERAÇÃO AQUI: O botão de deletar agora é um gatilho para o diálogo --- */}
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            aria-label={`Excluir projeto ${projectName}`}
                            onClick={() => setProjectToDelete(projectName)}
                          >
                            <FileX className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
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
      </div>

      {/* --- ALTERAÇÃO AQUI: Conteúdo do diálogo de confirmação --- */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. O projeto{" "}
            <span className="font-semibold text-foreground">
              {projectToDelete}
            </span>{" "}
            será permanentemente excluído.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteProject}>
            Confirmar Exclusão
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
