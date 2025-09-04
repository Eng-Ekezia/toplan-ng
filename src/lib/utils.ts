import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata um ângulo em graus decimais para a string G° M' S".
 * @param decimal O ângulo em graus decimais.
 * @returns A string formatada.
 */
export function formatAngleToString(
  decimal: number | undefined | null
): string {
  if (typeof decimal !== "number" || isNaN(decimal)) return "N/A";
  const sign = decimal < 0 ? "-" : "";
  decimal = Math.abs(decimal);
  const d = Math.floor(decimal);
  const m = Math.floor((decimal - d) * 60);
  const s = ((decimal - d) * 3600 - m * 60).toFixed(2);
  return `${sign}${d}° ${m}' ${s}"`;
}

/**
 * Formata um número para uma string com um número fixo de casas decimais.
 * @param num O número a ser formatado.
 * @param places O número de casas decimais (padrão é 3).
 * @returns A string formatada.
 */
export function formatDecimal(
  num: number | undefined | null,
  places = 3
): string {
  if (typeof num !== "number" || isNaN(num)) return "N/A";
  return num.toFixed(places);
}

/**
 * Formata um ângulo em graus decimais para a string compacta G°M'S".
 * @param decimal O ângulo em graus decimais.
 * @returns A string formatada.
 */
export function formatAngleToSimpleString(
  decimal: number | undefined | null
): string {
  if (typeof decimal !== "number" || isNaN(decimal)) return "N/A";
  const sign = decimal < 0 ? "-" : "";
  decimal = Math.abs(decimal);
  const d = Math.floor(decimal);
  const m = Math.floor((decimal - d) * 60);
  const s = Math.round((decimal - d) * 3600 - m * 60);
  return `${sign}${d}°${m}'${s}"`;
}
