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
  // Inicializa com 4 vértices vazios
  vertices: Array(4).fill({
    angle_deg: "",
    angle_min: "",
    angle_sec: "",
    distance: "",
  }),
};

// Define a "forma" do nosso estado
interface StoreState {
  input: CalculationInput;
  result: CalculationResult | null;
  isLoading: boolean;
  activeTab: "data" | "results" | "settings";
}

// Define as "ações" que podem modificar o estado
interface StoreActions {
  setInput: (field: keyof CalculationInput, value: any) => void;
  setNestedInput: (
    parentField: keyof CalculationInput,
    childField: string,
    value: any
  ) => void;
  setNumPoints: (numPoints: number) => void;
  updateVertexInput: (
    index: number,
    field: keyof VertexInput,
    value: string | number
  ) => void;
  setActiveTab: (tab: "data" | "results" | "settings") => void;
  runCalculation: () => void;
}

// Cria o store do Zustand
export const useCalculationStore = create<StoreState & StoreActions>(
  (set, get) => ({
    // Estado Inicial
    input: initialInputState,
    result: null,
    isLoading: false,
    activeTab: "data",

    // Implementação das Ações
    setInput: (field, value) =>
      set((state) => ({
        input: { ...state.input, [field]: value },
      })),

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
        const newVertices = [...state.input.vertices];
        newVertices[index] = { ...newVertices[index], [field]: value };
        return { input: { ...state.input, vertices: newVertices } };
      }),

    setActiveTab: (tab) => set({ activeTab: tab }),

    runCalculation: () => {
      // Lógica do cálculo virá aqui no futuro
      console.log("Calculando com os dados:", get().input);
    },
  })
);
// Agora você pode usar este store em seus componentes React para gerenciar o estado globalmente.
