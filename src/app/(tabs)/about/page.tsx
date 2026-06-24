"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, GraduationCap, Map, Users } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export default function AboutPage() {
  return (
    <motion.div
      className="space-y-6 max-w-2xl mx-auto pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">TOPLAN NG</h1>
        <p className="text-muted-foreground">Sistema de Cálculos Topográficos</p>
        <div className="flex justify-center gap-2 mt-2">
          <Badge variant="secondary">Next.js 15</Badge>
          <Badge variant="secondary">React 19</Badge>
          <Badge variant="secondary">TypeScript</Badge>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5 text-primary" />
              Sobre o Projeto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              O <strong className="text-foreground">TOPLAN NG</strong> (Next Generation) é uma aplicação web progressiva (PWA) moderna, desenvolvida para auxiliar no ensino e na prática de topografia. A ferramenta permite o cálculo, ajuste e visualização de poligonais planimétricas e irradiações, com foco em usabilidade móvel e precisão técnica.
            </p>
            <p>
              Este projeto é uma iniciativa interdisciplinar do <strong className="text-foreground">CEFET-MG</strong> (Campus Curvelo), unindo os departamentos de Eletroeletrônica e Engenharia Civil e Meio Ambiente.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-primary" />
              Histórico e Contexto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div>
              <strong className="text-foreground">Origem (TOPO-JAVA):</strong> O projeto é a evolução direta do software &quot;TOPO-JAVA&quot; (2018), originalmente uma aplicação desktop que resultou em publicações acadêmicas, mas que carecia de portabilidade.
            </div>
            <div>
              <strong className="text-foreground">A Evolução (NG):</strong> A versão atual foi reescrita do zero utilizando tecnologias web modernas para garantir acesso via navegador e dispositivos móveis, eliminando a necessidade de instalações complexas.
            </div>
            <div>
              <strong className="text-foreground">Propósito:</strong> Democratizar o acesso a ferramentas de cálculo topográfico para estudantes e profissionais, automatizando cálculos manuais suscetíveis a erros.
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Equipe e Créditos
            </CardTitle>
            <CardDescription>
              Projeto desenvolvido no âmbito do CEFET-MG Campus Curvelo.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <div>
              <strong className="text-foreground block mb-1">Coordenação:</strong>
              Prof. Ezequiel Junio de Lima & Profa. Carolina Vieira de Andrade
            </div>
            <div>
              <strong className="text-foreground block mb-1">Desenvolvimento:</strong>
              [Ciclo 2025-2027] Discentes dos cursos de Eletrotécnica e Edificações (PIBIC-FEM-Jr).
            </div>
            <div className="pt-4 flex items-center justify-center">
              <a 
                href="https://github.com/eng-ekezia/toplan-ng" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <Github className="w-4 h-4" />
                Repositório do Projeto no GitHub
              </a>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
