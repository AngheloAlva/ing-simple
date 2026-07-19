"use client";

import { motion, type Variants } from "motion/react";
import {
  Sparkles,
  Shield,
  Zap,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { softEase, useReducedMotion } from "@/lib/motion";
import { CornerPlus, Kicker } from "@/components/corner-plus";

interface Value {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const values: Value[] = [
  {
    icon: Sparkles,
    title: "Simplicidad",
    desc: "Creemos que la mejor solución es la más simple. Eliminamos la complejidad innecesaria para que la tecnología trabaje para ti, no al revés.",
  },
  {
    icon: Shield,
    title: "Transparencia",
    desc: "Sin letra pequeña, sin sorpresas. Comunicamos con claridad cada paso del proceso, los plazos y los costos desde el día uno.",
  },
  {
    icon: Zap,
    title: "Impacto Real",
    desc: "No hacemos tecnología por hacer tecnología. Cada proyecto tiene un objetivo claro y un resultado medible para tu organización.",
  },
  {
    icon: GraduationCap,
    title: "Aprendizaje Continuo",
    desc: "Capacitamos a tu equipo para que sea autónomo. No creamos dependencia: transferimos conocimiento y construimos capacidades internas.",
  },
];

export function NosotrosValues() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: softEase },
    },
  };

  return (
    <section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="max-w-2xl">
        <Kicker>Nuestros Valores</Kicker>
        <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          Lo que nos define
        </h2>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="relative mt-8 border border-border lg:mt-10"
      >
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              variants={item}
              className="relative overflow-hidden bg-background p-6 sm:p-8"
            >
              {/* Faint background watermark of the same icon */}
              <Icon
                aria-hidden="true"
                strokeWidth={1}
                className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 text-[#2f80ff]/[0.06]"
              />
              <div className="relative">
                <Icon
                  className="h-6 w-6 text-[#2f80ff]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
