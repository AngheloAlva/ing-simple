"use client";

import { CutButton } from "@/components/cut-button";
import { HeroWaves } from "@/components/hero-waves";
import { fadeInUp, reducedMotionVariants, softEase, useReducedMotion } from "@/lib/motion";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.35 },
  },
};

export function CasosHero(): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const item = prefersReducedMotion ? reducedMotionVariants : fadeInUp;
  const itemTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.7, ease: softEase };

  return (
    <section className="relative overflow-hidden">
      <HeroWaves videoUrl="/sample-video.mp4" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -z-[1] h-[130%] w-[78%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--background) 0%, color-mix(in srgb, var(--background) 70%, transparent) 50%, transparent 80%)",
        }}
      />

      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="relative mx-auto flex max-w-2xl flex-col items-center pb-16 pt-32 text-center sm:pt-40"
        >
          <motion.p
            variants={item}
            transition={itemTransition}
            className="text-sm font-medium text-muted-foreground"
          >
            Casos de estudio
          </motion.p>

          <motion.h1
            variants={item}
            transition={itemTransition}
            className="mt-5 text-balance font-serif text-4xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-5xl lg:text-[3.5rem]"
          >
            Software que ya está{" "}
            <span className="font-sans font-semibold tracking-tight">
              corriendo en empresas reales
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            transition={itemTransition}
            className="mt-5 max-w-xl text-balance text-[15px] leading-relaxed text-muted-foreground sm:text-base"
          >
            No son prototipos ni demos. Son plataformas en producción, usadas
            todos los días por equipos que reemplazaron planillas, correos y
            papel por un sistema que funciona.
          </motion.p>

          <motion.div
            variants={item}
            transition={itemTransition}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <CutButton variant="solid" icon="arrow" href="#casos-grid">
              Ver los casos
            </CutButton>
            <CutButton variant="outline" href="/contacto">
              Conversemos
            </CutButton>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
