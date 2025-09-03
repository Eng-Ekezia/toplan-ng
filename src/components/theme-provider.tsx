"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
// O tipo é importado diretamente do pacote principal
import { type ThemeProviderProps } from "next-themes";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
