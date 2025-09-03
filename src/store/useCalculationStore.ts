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

interface StoreState {
  input: CalculationInput;
  result: CalculationResult | null;
  isLoading: boolean;
  activeTab: "data" | "results" | "settings";
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
}

export const useCalculationStore = create<StoreState & StoreActions>(
  (set, get) => ({
    input: initialInputState,
    result: null,
    isLoading: false,
    activeTab: "data",

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

    runCalculation: () => {
      set({ isLoading: true, result: null });
      try {
        const inputData = get().input;
        if (!inputData.projectName || inputData.projectName.trim() === "") {
          throw new Error("O nome do projeto é obrigatório.");
        }

        const calculationResult = calculatePlanimetry(inputData);

        set({
          result: calculationResult,
          isLoading: false,
          activeTab: "results",
        });
        toast.success("Cálculo realizado com sucesso!");
      } catch (error: unknown) {
        set({ isLoading: false });
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Ocorreu um erro desconhecido.";
        toast.error(errorMessage);
        console.error(errorMessage); // Adiciona log de erro para depuração
      }
    },
  })
);
