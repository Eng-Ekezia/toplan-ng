// src/store/useCalculationStore.ts

import { create } from "zustand";
import {
  CalculationInput,
  CalculationResult,
  VertexInput,
  DetailInput,
} from "@/lib/types";
import { calculatePlanimetry } from "@/lib/calculations";
import { toast } from "sonner";
// --- ALTERAÇÃO AQUI: Importar a nova função de exportação de PDF ---
import {
  exportInputToJSON,
  exportResultsToCSV,
  exportResultsToPDF,
} from "@/lib/utils";

const createInitialState = (numPoints: number): CalculationInput => ({
  projectName: "",
  clientName: "",
  numPoints,
  angleType: "internal",
  initialAzimuth: { deg: "", min: "", sec: "" },
  initialCoordinates: { east: "", north: "" },
  vertices: Array(numPoints).fill({
    angle_deg: "",
    angle_min: "",
    angle_sec: "",
    distance: "",
  }),
  details: Array(numPoints)
    .fill(null)
    .map(() => []),
});

const initialInputState = createInitialState(4);

const LOCAL_STORAGE_KEY = "toplan_projects";

interface StoreState {
  input: CalculationInput;
  result: CalculationResult | null;
  isLoading: boolean;
  activeTab: "data" | "results" | "settings";
  calculationSuccess: boolean;
}

interface StoreActions {
  setInput: <K extends keyof CalculationInput>(
    field: K,
    value: CalculationInput[K]
  ) => void;
  setNestedInput: (
    parentField: "initialAzimuth" | "initialCoordinates",
    childField: string,
    value: string | number
  ) => void;
  setNumPoints: (numPoints: number) => void;
  updateVertexInput: (
    index: number,
    field: keyof VertexInput,
    value: string | number
  ) => void;
  addDetail: (vertexIndex: number) => void;
  removeDetail: (vertexIndex: number, detailIndex: number) => void;
  updateDetailInput: (
    vertexIndex: number,
    detailIndex: number,
    field: keyof DetailInput,
    value: string | number
  ) => void;

  setActiveTab: (tab: "data" | "results" | "settings") => void;
  runCalculation: () => void;
  setCalculationSuccess: (status: boolean) => void;
  saveProject: () => void;
  loadProject: (projectName: string) => void;
  getSavedProjects: () => string[];
  deleteProject: (projectName: string) => void;
  resetInput: () => void;
  exportProject: () => void;
  importProject: (file: File) => void;
  exportResultsToCSV: () => void;
  // --- ALTERAÇÃO AQUI: Adicionar a nova ação ---
  exportResultsToPDF: () => void;
}

export const useCalculationStore = create<StoreState & StoreActions>(
  (set, get) => ({
    input: initialInputState,
    result: null,
    isLoading: false,
    activeTab: "data",
    calculationSuccess: false,

    // ... (outras funções do store permanecem iguais)
    setInput: (field, value) =>
      set((state) => ({ input: { ...state.input, [field]: value } })),

    setNestedInput: (parentField, childField, value) =>
      set((state) => ({
        input: {
          ...state.input,
          [parentField]: {
            ...(state.input[parentField] as object),
            [childField]: value,
          },
        },
      })),
    setNumPoints: (numPoints) => {
      if (numPoints < 3) return;
      const currentInput = get().input;
      const newVertices: VertexInput[] = Array(numPoints)
        .fill(null)
        .map(
          (_, i) =>
            currentInput.vertices[i] || {
              angle_deg: "",
              angle_min: "",
              angle_sec: "",
              distance: "",
            }
        );
      const newDetails: DetailInput[][] = Array(numPoints)
        .fill(null)
        .map((_, i) => currentInput.details[i] || []);

      set((state) => ({
        input: {
          ...state.input,
          numPoints,
          vertices: newVertices,
          details: newDetails,
        },
      }));
    },
    updateVertexInput: (index, field, value) =>
      set((state) => {
        const newVertices = state.input.vertices.map((vertex, i) => {
          if (i === index) {
            return { ...vertex, [field]: value };
          }
          return vertex;
        });
        return {
          input: {
            ...state.input,
            vertices: newVertices,
          },
        };
      }),

    addDetail: (vertexIndex) =>
      set((state) => {
        const newDetails = [...state.input.details];
        newDetails[vertexIndex] = [
          ...newDetails[vertexIndex],
          { angle_deg: "", angle_min: "", angle_sec: "", distance: "" },
        ];
        return { input: { ...state.input, details: newDetails } };
      }),

    removeDetail: (vertexIndex, detailIndex) =>
      set((state) => {
        const newDetails = [...state.input.details];
        newDetails[vertexIndex] = newDetails[vertexIndex].filter(
          (_, i) => i !== detailIndex
        );
        return { input: { ...state.input, details: newDetails } };
      }),

    updateDetailInput: (vertexIndex, detailIndex, field, value) =>
      set((state) => {
        const newDetails = [...state.input.details];
        newDetails[vertexIndex] = newDetails[vertexIndex].map((detail, i) => {
          if (i === detailIndex) {
            return { ...detail, [field]: value };
          }
          return detail;
        });
        return { input: { ...state.input, details: newDetails } };
      }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    setCalculationSuccess: (status) => set({ calculationSuccess: status }),

    runCalculation: () => {
      set({ isLoading: true, result: null, calculationSuccess: false });
      try {
        const inputData = get().input;
        if (!inputData.projectName || inputData.projectName.trim() === "") {
          throw new Error("O nome do projeto é obrigatório.");
        }
        const calculationResult = calculatePlanimetry(inputData);

        set({
          result: calculationResult,
          isLoading: false,
          calculationSuccess: true,
        });
        toast.success("Cálculo realizado com sucesso!");
      } catch (error: unknown) {
        set({ isLoading: false });
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocorreu um erro desconhecido.";
        toast.error(errorMessage);
        console.error(errorMessage);
      }
    },

    getSavedProjects: () => {
      if (typeof window === "undefined") return [];
      const projects = localStorage.getItem(LOCAL_STORAGE_KEY);
      return projects ? Object.keys(JSON.parse(projects)) : [];
    },
    saveProject: () => {
      const { input } = get();
      if (!input.projectName.trim()) {
        toast.error("O nome do projeto é obrigatório para salvar.");
        return;
      }
      const projects = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
      );
      projects[input.projectName] = input;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      toast.success(`Projeto "${input.projectName}" salvo com sucesso!`);
    },
    loadProject: (projectName) => {
      const projects = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
      );
      const projectData = projects[projectName] as CalculationInput;

      if (projectData) {
        if (!projectData.details || !Array.isArray(projectData.details)) {
          projectData.details = Array(projectData.numPoints)
            .fill(null)
            .map(() => []);
        } else {
          projectData.details = projectData.details.map(
            (d: DetailInput[] | null) => d || []
          );
        }

        set({ input: projectData, result: null, activeTab: "data" });
        toast.success(`Projeto "${projectName}" carregado!`);
      } else {
        toast.error("Projeto não encontrado.");
      }
    },
    deleteProject: (projectName) => {
      const projects = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
      );
      delete projects[projectName];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      toast.info(`Projeto "${projectName}" deletado.`);
    },

    exportProject: () => {
      exportInputToJSON(get().input);
    },

    exportResultsToCSV: () => {
      const { result, input } = get();
      exportResultsToCSV(result, input.projectName);
    },

    // --- ALTERAÇÃO AQUI: Implementar a nova ação ---
    exportResultsToPDF: () => {
      const { result, input } = get();
      exportResultsToPDF(result, input);
    },

    importProject: (file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const text = event.target?.result;
          if (typeof text !== "string") {
            throw new Error("Falha ao ler o arquivo.");
          }
          const projectData = JSON.parse(text) as CalculationInput;
          if (
            !projectData.projectName ||
            !projectData.vertices ||
            !projectData.numPoints
          ) {
            throw new Error(
              "Arquivo JSON inválido ou não corresponde ao formato esperado."
            );
          }
          if (!projectData.details || !Array.isArray(projectData.details)) {
            projectData.details = Array(projectData.numPoints)
              .fill(null)
              .map(() => []);
          } else {
            projectData.details = projectData.details.map(
              (d: DetailInput[] | null) => d || []
            );
          }
          set({ input: projectData, result: null, activeTab: "data" });
          toast.success(
            `Projeto "${projectData.projectName}" importado com sucesso!`
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Ocorreu um erro desconhecido ao importar o projeto.";
          toast.error(errorMessage);
          console.error("Erro ao importar projeto:", error);
        }
      };
      reader.onerror = () => {
        toast.error("Não foi possível ler o arquivo selecionado.");
      };
      reader.readAsText(file);
    },

    resetInput: () => {
      set({ input: createInitialState(4), result: null });
      toast.info("Campos de entrada foram limpos.");
    },
  })
);
