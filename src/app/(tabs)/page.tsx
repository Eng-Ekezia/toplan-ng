// src/app/(tabs)/page.tsx

"use client";
import { motion } from "framer-motion";
import { ProjectDataForm } from "@/components/forms/ProjectDataForm";
import { PolygonDataForm } from "@/components/forms/PolygonDataForm";
import { VertexList } from "@/components/forms/VertexList";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

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

// Componente de Título para reutilização
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-center mt-4 mb-2">{children}</h2>
);

export default function DataEntryPage() {
  return (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <SectionTitle>Dados do Projeto</SectionTitle>
        <ProjectDataForm />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SectionTitle>Dados da Poligonal</SectionTitle>
        <PolygonDataForm />
      </motion.div>

      <motion.div variants={itemVariants}>
        {/* O VertexList já tem o título internamente, então só precisamos dele aqui */}
        <VertexList />
      </motion.div>
    </motion.div>
  );
}
