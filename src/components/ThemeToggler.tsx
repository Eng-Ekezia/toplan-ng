// src/components/ThemeToggler.tsx

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggler() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10" />;
  }

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-full flex items-center justify-center bg-transparent border-none cursor-pointer hover:bg-accent transition-colors"
      aria-label="Toggle theme"
      style={{ perspective: 500 }} // Adiciona perspectiva para o efeito 3D
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ rotateY: -90, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          exit={{ rotateY: 90, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {theme === "light" ? <Sun /> : <Moon />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
