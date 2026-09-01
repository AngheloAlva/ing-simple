"use client";

import { CornerPlus } from "@/components/corner-plus";
import { getCaseStudyVisuals } from "@/components/case-study/visuals/registry";
import {
  CATEGORY_LABELS,
  portfolioProjects,
  type ProjectCategory,
} from "@/lib/portfolio-data";
import { ArrowUpRight, Lock } from "lucide-react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import Image from "next/image";
import { useMemo, useState, type ReactNode } from "react";

type Filter = "todos" | ProjectCategory;

// Only flagship, in-production projects with a full case study reach /casos.
// Matches the /casos/[id] detail-route gating so every card links somewhere real.
const CASES = portfolioProjects.filter(
  (project) => project.isFlagship && project.caseStudy
);

// Chip order + labels come straight from the configurable taxonomy.
const FILTERS = Object.entries(CATEGORY_LABELS) as [Filter, string][];

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function CaseCard({
  project,
}: {
  project: (typeof CASES)[number];
}): ReactNode {
  const caseStudy = project.caseStudy!;
  const HeroMockup = getCaseStudyVisuals(project.id)?.HeroMockup ?? null;
  const isConfidential = caseStudy.visualPrivacy === "confidential-ui";

  return (
    <motion.a
      variants={cardVariants}
      href={`/casos/${project.id}`}
      className="group relative flex flex-col overflow-hidden rounded-sm border border-border bg-background transition-colors duration-200 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary"
    >
      {/* Thumbnail — the polished per-project mockup, non-interactive here */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-muted/40">
        {HeroMockup ? (
          <div className="pointer-events-none absolute inset-0 [&>*]:!rounded-none [&>*]:h-full [&>*]:w-full">
            <HeroMockup />
          </div>
        ) : project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            draggable={false}
            className="object-cover"
          />
        ) : null}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          {project.clientLogo ? (
            <img
              src={project.clientLogo}
              alt={caseStudy.clientName}
              draggable={false}
              className="h-6 max-w-[45%] object-contain object-left"
            />
          ) : (
            <span className="text-sm font-semibold tracking-tight">
              {caseStudy.clientName}
            </span>
          )}
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
            {CATEGORY_LABELS[project.category]}
          </span>
        </div>

        <h3 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-pretty text-sm leading-relaxed text-muted-foreground">
          {project.shortDescription}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-6 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2">
            Ver caso
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
          {isConfidential ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
              <Lock className="h-3 w-3" aria-hidden="true" />
              Vista confidencial
            </span>
          ) : null}
        </div>
      </div>
    </motion.a>
  );
}

export function CasosGrid(): ReactNode {
  const [filter, setFilter] = useState<Filter>("todos");

  const counts = useMemo(() => {
    const map = new Map<Filter, number>();
    map.set("todos", CASES.length);
    for (const project of CASES) {
      map.set(project.category, (map.get(project.category) ?? 0) + 1);
    }
    return map;
  }, []);

  const visible = useMemo(
    () =>
      filter === "todos"
        ? CASES
        : CASES.filter((project) => project.category === filter),
    [filter]
  );

  return (
    <section
      id="casos-grid"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10"
    >
      <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl">
          Casos en{" "}
          <span className="font-sans font-semibold tracking-tight">
            producción
          </span>
        </h2>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoría">
          {FILTERS.map(([key, label]) => {
            const count = counts.get(key) ?? 0;
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setFilter(key)}
                className={`inline-flex items-center gap-1.5 rounded-sm px-3.5 py-1.5 text-sm font-medium tracking-wide transition-colors duration-200 focus-ring ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                }`}
              >
                {label}
                <span
                  className={`font-mono text-[11px] ${
                    isActive
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground/70"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {visible.length > 0 ? (
          <motion.div
            key={filter}
            variants={gridVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6"
          >
            {visible.map((project) => (
              <CaseCard key={project.id} project={project} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key={`${filter}-empty`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative mt-10 flex min-h-[280px] flex-col items-center justify-center rounded-sm border border-dashed border-border px-6 py-16 text-center"
          >
            <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
            <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
            <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
            <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
            <p className="font-serif text-2xl font-normal tracking-[-0.01em]">
              Todavía no hay casos publicados en{" "}
              {CATEGORY_LABELS[filter as ProjectCategory]}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Estamos trabajando en proyectos de esta línea. Muy pronto vas a
              verlos aquí.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
