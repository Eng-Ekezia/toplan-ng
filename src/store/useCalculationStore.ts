// src/store/useCalculationStore.ts

import { create } from "zustand";
import {
  CalculationInput,
  CalculationResult,
  VertexInput,
  DetailInput,
  InputErrors,
} from "@/lib/types";
import { calculatePlanimetry } from "@/lib/calculations";
import { validateInput } from "@/lib/validation";
import { toast } from "sonner";
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
const SETTINGS_STORAGE_KEY = "toplan_settings";

// --- ALTERAÇÃO AQUI ---
type ActiveTab = "data" | "results" | "settings" | "graph";

export interface AppSettings {
  decimalPlaces: number;
}

const defaultSettings: AppSettings = {
  decimalPlaces: 5,
};

interface StoreState {
  input: CalculationInput;
  result: CalculationResult | null;
  isLoading: boolean;
  activeTab: ActiveTab; // Usar o novo tipo
  calculationSuccess: boolean;
  errors: InputErrors;
  settings: AppSettings;
}

interface StoreActions {
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setInput: <K extends keyof CalculationInput>(
    field: K,
    value: CalculationInput[K]
  ) => void;
  setNestedInput: <TParent extends "initialAzimuth" | "initialCoordinates">(
    parentField: TParent,
    childField: keyof CalculationInput[TParent],
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

  setActiveTab: (tab: ActiveTab) => void; // Usar o novo tipo
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
  exportResultsToPDF: () => void;
  validate: () => boolean;
}

const getInitialSettings = (): AppSettings => {
  if (typeof window === "undefined") return defaultSettings;
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (stored) {
    try {
      return { ...defaultSettings, ...JSON.parse(stored) };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
};

export const useCalculationStore = create<StoreState & StoreActions>(
  (set, get) => ({
    input: initialInputState,
    result: null,
    isLoading: false,
    activeTab: "data",
    calculationSuccess: false,
    errors: {},
    settings: getInitialSettings(),

    updateSettings: (newSettings) => {
      set((state) => {
        const updatedSettings = { ...state.settings, ...newSettings };
        if (typeof window !== "undefined") {
          localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
        }
        return { settings: updatedSettings };
      });
    },

    validate: () => {
      const { input } = get();
      const newErrors = validateInput(input);
      set({ errors: newErrors });
      return Object.keys(newErrors).length === 0;
    },

    setInput: (field, value) => {
      const state = get();
      const input = { ...state.input, [field]: value };
      set({ input, errors: validateInput(input) });
    },

    setNestedInput: (parentField, childField, value) => {
      const state = get();
      const input = {
        ...state.input,
        [parentField]: {
          ...(state.input[parentField] as object),
          [childField]: value,
        },
      };
      set({ input, errors: validateInput(input) });
    },

    updateVertexInput: (index, field, value) => {
      const state = get();
      const newVertices = state.input.vertices.map((vertex, i) => {
        if (i === index) {
          return { ...vertex, [field]: value };
        }
        return vertex;
      });
      const input = { ...state.input, vertices: newVertices };
      set({ input, errors: validateInput(input) });
    },

    setNumPoints: (numPoints) => {
      if (numPoints < 3) return;
      const state = get();
      const currentInput = state.input;
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

      const input = {
        ...currentInput,
        numPoints,
        vertices: newVertices,
        details: newDetails,
      };
      set({ input, errors: validateInput(input) });
    },

    updateDetailInput: (vertexIndex, detailIndex, field, value) => {
      const state = get();
      const newDetails = [...state.input.details];
      newDetails[vertexIndex] = newDetails[vertexIndex].map((detail, i) => {
        if (i === detailIndex) {
          return { ...detail, [field]: value };
        }
        return detail;
      });
      const input = { ...state.input, details: newDetails };
      set({ input, errors: validateInput(input) });
    },

    runCalculation: () => {
      const { validate } = get();
      if (!validate()) {
        toast.error(
          "Existem erros no formulário. Por favor, verifique os campos destacados."
        );
        return;
      }

      set({ isLoading: true, result: null, calculationSuccess: false });
      try {
        const { input } = get();
        const calculationResult = calculatePlanimetry(input);
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

    resetInput: () => {
      set({ input: createInitialState(4), result: null, errors: {} });
      toast.info("Campos de entrada foram limpos.");
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

        set({
          input: projectData,
          result: null,
          activeTab: "data",
          errors: {},
        });
        toast.success(`Projeto "${projectName}" carregado!`);
      } else {
        toast.error("Projeto não encontrado.");
      }
    },

    addDetail: (vertexIndex) =>
      set((state) => {
        const newDetails = [...state.input.details];
        newDetails[vertexIndex] = [
          ...newDetails[vertexIndex],
          { name: "", angle_deg: "", angle_min: "", angle_sec: "", distance: "" },
        ];
        return { input: { ...state.input, details: newDetails } };
      }),
    removeDetail: (vertexIndex, detailIndex) =>
      set((state) => {
        const newDetails = [...state.input.details];
        newDetails[vertexIndex] = newDetails[vertexIndex].filter(
          (_, i) => i !== detailIndex
        );
        const input = { ...state.input, details: newDetails };
        return { input, errors: validateInput(input) };
      }),
    setActiveTab: (tab) => set({ activeTab: tab }),
    setCalculationSuccess: (status) => set({ calculationSuccess: status }),
    getSavedProjects: () => {
      if (typeof window === "undefined") return [];
      const projects = localStorage.getItem(LOCAL_STORAGE_KEY);
      return projects ? Object.keys(JSON.parse(projects)) : [];
    },
    saveProject: () => {
      const { input, validate } = get();
      if (!validate()) {
        toast.error(
          "Não é possível salvar um projeto com erros no formulário."
        );
        return;
      }
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
    deleteProject: (projectName) => {
      const projects = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_KEY) || "{}"
      );
      delete projects[projectName];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(projects));
      toast.info(`Projeto "${projectName}" deletado.`);
    },
    exportProject: () => exportInputToJSON(get().input),
    exportResultsToCSV: () => {
      const { result, input, settings } = get();
      exportResultsToCSV(result, input.projectName, settings.decimalPlaces);
    },
    exportResultsToPDF: () => {
      const { result, input, settings } = get();
      exportResultsToPDF(result, input, settings.decimalPlaces);
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
          set({
            input: projectData,
            result: null,
            activeTab: "data",
            errors: {},
          });
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
  })
);
