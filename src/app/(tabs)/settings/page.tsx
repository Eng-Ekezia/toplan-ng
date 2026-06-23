// src/app/(tabs)/settings/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCalculationStore } from "@/store/useCalculationStore";
import {
  Save,
  FilePlus,
  FolderUp,
  FileX,
  Download,
  Upload,
} from "lucide-react";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/reui/number-field";
import { Label } from "@/components/ui/label";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

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
    exportProject,
    importProject,
    exportResultsToCSV,
    exportResultsToPDF,
    exportToAutoCAD,
    result,
    settings,
    updateSettings,
  } = useCalculationStore();

  const [savedProjects, setSavedProjects] = useState<string[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localDecimalPlaces, setLocalDecimalPlaces] = useState(settings.decimalPlaces);

  useEffect(() => {
    setLocalDecimalPlaces(settings.decimalPlaces);
  }, [settings.decimalPlaces]);

  useEffect(() => {
    setSavedProjects(getSavedProjects());
  }, [getSavedProjects]);

  const handleDeleteProject = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete);
      setSavedProjects(getSavedProjects());
      setProjectToDelete(null);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importProject(file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <AlertDialog>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-xl font-semibold text-center"
        >
          Ajustes e Gerenciamento
        </motion.h1>

        {/* Grid responsivo para os cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8 md:items-start">
          <motion.div variants={itemVariants} className="space-y-4">
            <SectionTitle>Ações Rápidas</SectionTitle>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <Button onClick={saveProject} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Projeto Atual
                </Button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".json"
                  onChange={handleFileChange}
                />
                <Button
                  onClick={handleImportClick}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Importar Projeto (JSON)
                </Button>

                <Button
                  onClick={exportProject}
                  variant="outline"
                  className="w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Projeto (JSON)
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={exportResultsToCSV}
                  disabled={!result}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Resultados (CSV)
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={exportResultsToPDF}
                  disabled={!result}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Relatório (PDF)
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={exportToAutoCAD}
                  disabled={!result}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar AutoCAD (SCR)
                </Button>

                <Button
                  onClick={resetInput}
                  variant="outline"
                  className="w-full"
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  Novo Projeto (Limpar Formulário)
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-4 mt-6 md:mt-0">
            <SectionTitle>Preferências de Exibição</SectionTitle>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="decimal-places">Casas Decimais (Resultados)</Label>
                  <NumberField
                    id="decimal-places"
                    value={localDecimalPlaces}
                    onValueChange={(value) => setLocalDecimalPlaces(Number(value))}
                    min={2}
                    max={10}
                  >
                    <NumberFieldGroup>
                      <NumberFieldDecrement />
                      <NumberFieldInput />
                      <NumberFieldIncrement />
                    </NumberFieldGroup>
                  </NumberField>
                  <p className="text-xs text-muted-foreground">
                    Ajusta o número de casas decimais na exibição de coordenadas, projeções e distâncias. Erros e tolerâncias manterão no mínimo 5 casas decimais.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setLocalDecimalPlaces(settings.decimalPlaces)}
                      disabled={localDecimalPlaces === settings.decimalPlaces}
                    >
                      Cancelar
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        updateSettings({ decimalPlaces: localDecimalPlaces });
                        toast.success("Configuração salva com sucesso!", {
                          description: `Os resultados serão exibidos com ${localDecimalPlaces} casas decimais.`
                        });
                      }}
                      disabled={localDecimalPlaces === settings.decimalPlaces}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="space-y-4 mt-6 md:mt-0"
          >
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
                        <span className="font-medium text-sm">
                          {projectName}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => loadProject(projectName)}
                          >
                            <FolderUp className="mr-2 h-4 w-4" />
                            Carregar
                          </Button>
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
          </motion.div>
        </div>
      </motion.div>

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
