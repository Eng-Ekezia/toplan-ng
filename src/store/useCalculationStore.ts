import { create } from "zustand";
import { CalculationInput, CalculationResult, VertexInput } from "@/lib/types";

// Define o estado inicial para os nossos formulários
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

// Define a interface para o nosso store, incluindo o estado e as ações
interface CalculationState {
  input: CalculationInput;
  result: CalculationResult | null;
  isLoading: boolean;
  activeTab: "data" | "results" | "settings";

  // Ações para modificar o estado
  setInput: (newInput: Partial<CalculationInput>) => void;
  setNumPoints: (numPoints: number) => void;
  setActiveTab: (tab: "data" | "results" | "settings") => void;
  runCalculation: () => void;
}

// Cria o store do Zustand
export const useCalculationStore = create<CalculationState>((set, get) => ({
  input: initialInputState,
  result: null,
  isLoading: false,
  activeTab: "data",

  setInput: (newInput) =>
    set((state) => ({
      input: { ...state.input, ...newInput },
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

  setActiveTab: (tab) => set({ activeTab: tab }),

  runCalculation: () => {
    // Lógica do cálculo virá aqui no futuro
    console.log("Calculando com os dados:", get().input);
  },
}));
