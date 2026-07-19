"use client";

import { getCaseStudyVisuals } from "@/components/case-study/visuals/registry";
import type {
  CaseStudy,
  CaseStudyFeature,
  ProjectData,
} from "@/lib/portfolio-data";
import { softEase } from "@/lib/motion";
import { FileText, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface DetailFeaturesProps {
  project: ProjectData;
  caseStudy: CaseStudy;
  accent: string;
}

interface FeatureWithVisual {
  key: string;
  title: string;
  description: string;
  icon: LucideIcon;
  visual: ReactNode;
  span: "full" | "wide" | "narrow";
}

function buildFeatures(
  features: CaseStudyFeature[],
  registry: Record<
    string,
    { visual: ReactNode; span: "full" | "wide" | "narrow"; icon?: LucideIcon }
  >
): FeatureWithVisual[] {
  return features.map((f) => {
    const entry = registry[f.title];
    return {
      key: f.title,
      title: f.title,
      description: f.description,
      icon: entry?.icon ?? FileText,
      visual: entry?.visual ?? null,
      span: entry?.span ?? "narrow",
    };
  });
}

const narrowGridByCount: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

export function DetailFeatures({
  project,
  caseStudy,
  accent,
}: DetailFeaturesProps): ReactNode {
  const registry = getCaseStudyVisuals(project.id)?.features ?? {};
  const features = buildFeatures(caseStudy.features, registry);
  const full = features.filter((f) => f.span === "full");
  const wide = features.filter((f) => f.span === "wide");
  const narrow = features.filter((f) => f.span === "narrow");
  const narrowCols = narrowGridByCount[narrow.length] ?? "lg:grid-cols-4";

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="mb-10 max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          05 — Funcionalidades clave
        </p>
        <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          Los módulos que{" "}
          <span className="font-sans font-semibold tracking-tight">
            sostienen la operación
          </span>
        </h2>
      </div>

      {full.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:gap-5">
          {full.map((f, i) => (
            <BentoCard key={f.key} feature={f} index={i} accent={accent} large />
          ))}
        </div>
      ) : null}

      {wide.length > 0 ? (
        <div
          className={`grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 ${
            full.length > 0 ? "mt-4 md:mt-5" : ""
          }`}
        >
          {wide.map((f, i) => (
            <BentoCard key={f.key} feature={f} index={i} accent={accent} large />
          ))}
        </div>
      ) : null}

      {narrow.length > 0 ? (
        <div
          className={`mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-5 md:gap-5 ${narrowCols}`}
        >
          {narrow.map((f, i) => (
            <BentoCard key={f.key} feature={f} index={i} accent={accent} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function BentoCard({
  feature,
  index,
  accent,
  large = false,
}: {
  feature: FeatureWithVisual;
  index: number;
  accent: string;
  large?: boolean;
}): ReactNode {
  const Icon = feature.icon;
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: softEase }}
      className={`group relative flex flex-col overflow-hidden border border-border bg-muted/30 ${
        large ? "min-h-[26rem] p-6 sm:p-8" : "min-h-[16rem] p-5"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center border border-border bg-background"
          style={{ color: accent }}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <h3
          className={`font-semibold tracking-tight text-foreground ${
            large ? "text-xl" : "text-base"
          }`}
        >
          {feature.title}
        </h3>
      </div>
      <p
        className={`mt-3 leading-relaxed text-muted-foreground ${
          large ? "max-w-md text-sm sm:text-[15px]" : "text-xs sm:text-sm"
        }`}
      >
        {feature.description}
      </p>
      {feature.visual ? (
        <div
          className={`[&>*]:!rounded-none ${large ? "pt-6 sm:pt-8" : "pt-4"}`}
        >
          {feature.visual}
        </div>
      ) : null}
    </motion.article>
  );
}
