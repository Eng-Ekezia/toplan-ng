import { create } from "zustand";
import { CalculationInput, CalculationResult, VertexInput } from "@/lib/types";
import { calculatePlanimetry } from "@/lib/calculations";
import { toast } from "sonner";

const initialInputState: CalculationInput = {
  projectName: "",
  clientName: "",
  numPoints: 4,
  angleType: "internal",
  initialAzimuth: { deg: "", min: "", sec: "" },
  initialCoordinates: { east: "", north: "" },
  vertices: Array(4).fill({
    angle_deg: "",
    angle_min: "",
    angle_sec: "",
    distance: "",
  }),
};

const LOCAL_STORAGE_KEY = "toplan_projects";

interface StoreState {
  input: CalculationInput;
  result: CalculationResult | null;
  isLoading: boolean;
  activeTab: "data" | "results" | "settings";
  calculationSuccess: boolean; // Flag para comunicar o sucesso à UI
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
  setActiveTab: (tab: "data" | "results" | "settings") => void;
  runCalculation: () => void;
  setCalculationSuccess: (status: boolean) => void; // Ação para resetar a flag
  saveProject: () => void;
  loadProject: (projectName: string) => void;
  getSavedProjects: () => string[];
  deleteProject: (projectName: string) => void;
  resetInput: () => void;
}

export const useCalculationStore = create<StoreState & StoreActions>(
  (set, get) => ({
    input: initialInputState,
    result: null,
    isLoading: false,
    activeTab: "data",
    calculationSuccess: false, // Estado inicial da flag

    setInput: (field, value) =>
      set((state) => ({ input: { ...state.input, [field]: value } })),

    // ... (outras ações como setNestedInput, setNumPoints, updateVertexInput)
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
      const currentVertices = get().input.vertices;
      const newVertices: VertexInput[] = Array(numPoints)
        .fill(null)
        .map(
          (_, i) =>
            currentVertices[i] || {
              angle_deg: "",
              angle_min: "",
              angle_sec: "",
              distance: "",
            }
        );
      set((state) => ({
        input: { ...state.input, numPoints, vertices: newVertices },
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

        // **NÃO** muda a aba aqui, apenas sinaliza o sucesso
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

    // ... (ações de persistência como getSavedProjects, saveProject, etc.)
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
      const projectData = projects[projectName];
      if (projectData) {
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
    resetInput: () => {
      set({ input: initialInputState, result: null });
      toast.info("Campos de entrada foram limpos.");
    },
  })
);
