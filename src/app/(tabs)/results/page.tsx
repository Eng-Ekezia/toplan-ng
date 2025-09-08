// src/app/(tabs)/results/page.tsx

"use client";

import { motion } from "framer-motion";
import { ResultsDisplay } from "@/components/features/ResultsDisplay";

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

export default function ResultsPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <motion.div variants={itemVariants}>
        <ResultsDisplay />
      </motion.div>
    </motion.div>
  );
}
