"use client";

import { getCaseStudyVisuals } from "@/components/case-study/visuals/registry";
import { CornerPlus } from "@/components/corner-plus";
import { CutButton } from "@/components/cut-button";
import {
  CATEGORY_LABELS,
  type CaseStudy,
  type ProjectData,
} from "@/lib/portfolio-data";
import { fadeInUp, reducedMotionVariants, softEase, useReducedMotion } from "@/lib/motion";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

interface DetailHeroProps {
  project: ProjectData;
  caseStudy: CaseStudy;
  accent: string;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

export function DetailHero({
  project,
  caseStudy,
  accent,
}: DetailHeroProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const item = prefersReducedMotion ? reducedMotionVariants : fadeInUp;
  const itemTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.6, ease: softEase };

  const HeroMockup = getCaseStudyVisuals(project.id)?.HeroMockup ?? null;

  const meta: { label: string; value: string }[] = [
    { label: "Cliente", value: caseStudy.clientName },
    { label: "Industria", value: caseStudy.clientIndustry },
    ...(caseStudy.team ? [{ label: "Equipo", value: caseStudy.team }] : []),
    { label: "Duración", value: caseStudy.duration },
    { label: "Estado", value: caseStudy.inProductionSince },
    ...(caseStudy.userBreakdown
      ? [{ label: "Usuarios", value: caseStudy.userBreakdown }]
      : []),
  ];

  const metaGridCols =
    meta.length === 6
      ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      : "grid-cols-2 sm:grid-cols-4";

  return (
    <section className="relative overflow-hidden">
      {/* Restrained top accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-[1] h-[45vh] opacity-[0.18]"
        style={{
          background: `radial-gradient(55% 55% at 50% 0%, ${accent} 0%, transparent 70%)`,
        }}
      />

      <div className="mx-auto max-w-[1440px] px-5 pb-16 pt-28 sm:px-8 sm:pb-24 sm:pt-36 lg:px-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
        >
          <motion.a
            variants={item}
            transition={itemTransition}
            href="/casos"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <span aria-hidden="true">←</span> Volver a casos
          </motion.a>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-10">
            {/* Left — copy + CTAs */}
            <div>
              <motion.p
                variants={item}
                transition={itemTransition}
                className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
              >
                Caso de estudio · {CATEGORY_LABELS[project.category]}
              </motion.p>

              <motion.h1
                variants={item}
                transition={itemTransition}
                className="mt-5 text-balance font-serif text-4xl font-normal leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-[3.25rem]"
              >
                {project.title}
              </motion.h1>

              <motion.p
                variants={item}
                transition={itemTransition}
                className="mt-5 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base"
              >
                {caseStudy.pitch}
              </motion.p>

              <motion.div
                variants={item}
                transition={itemTransition}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                {project.liveUrl ? (
                  <CutButton
                    variant="solid"
                    icon="arrow"
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver sitio en vivo
                  </CutButton>
                ) : null}
                <CutButton variant="outline" href="/contacto">
                  Cotizar algo similar
                </CutButton>
              </motion.div>
            </div>

            {/* Right — hero mockup (guarded) */}
            <motion.div variants={item} transition={itemTransition}>
              {HeroMockup ? (
                <div className="relative border border-border bg-muted/40 [&>*]:!rounded-none">
                  <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
                  <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
                  <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
                  <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
                  <HeroMockup label={`Vista de ${project.title}`} />
                </div>
              ) : (
                <div className="relative aspect-video w-full border border-border bg-muted/40">
                  <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
                  <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
                  <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
                  <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
                </div>
              )}
            </motion.div>
          </div>

          {/* Meta strip */}
          <motion.dl
            variants={item}
            transition={itemTransition}
            className={`mt-14 grid gap-x-6 gap-y-6 border-t border-border pt-8 ${metaGridCols}`}
          >
            {meta.map((entry) => (
              <div key={entry.label}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  {entry.label}
                </dt>
                <dd className="mt-1.5 text-sm font-medium text-foreground">
                  {entry.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>
    </section>
  );
}
