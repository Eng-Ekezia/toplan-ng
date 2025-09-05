// src/app/(tabs)/page.tsx

"use client"; // Manter o client component para as animações
import { motion } from "framer-motion";
import { ProjectDataForm } from "@/components/forms/ProjectDataForm";
import { PolygonDataForm } from "@/components/forms/PolygonDataForm";
import { VertexList } from "@/components/forms/VertexList";

// Variantes para a animação do contêiner principal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Atraso entre a animação de cada item filho
    },
  },
};

// Variantes para a animação de cada item (card)
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

export default function DataEntryPage() {
  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <ProjectDataForm />
      </motion.div>
      <motion.div variants={itemVariants}>
        <PolygonDataForm />
      </motion.div>
      <motion.div variants={itemVariants}>
        <VertexList />
      </motion.div>
    </motion.div>
  );
}
