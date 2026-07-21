"use client";

import { CornerPlus, Kicker } from "@/components/corner-plus";
import { CutButton } from "@/components/cut-button";
import { CATEGORY_LABELS, portfolioProjects } from "@/lib/portfolio-data";
import { ArrowUpRight } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { useState, type ReactNode } from "react";

// Derived from the migrated portfolio data — only projects with a full case
// study, capped for the home showcase. The full set lives on /casos.
const STUDIES = portfolioProjects
  .filter((project) => project.caseStudy)
  .slice(0, 6)
  .map((project, index) => {
    const caseStudy = project.caseStudy!;
    const metric = caseStudy.metrics[0];
    return {
      index: String(index + 1).padStart(2, "0"),
      id: project.id,
      title: project.title,
      client: caseStudy.clientName,
      sector: CATEGORY_LABELS[project.category],
      year: caseStudy.inProductionSince.match(/\d{4}/)?.[0] ?? "",
      metric: metric ? `${metric.value} · ${metric.label}` : "",
      summary: project.shortDescription,
      logo: project.clientLogo ?? "",
    };
  });

const TOTAL = String(STUDIES.length).padStart(2, "0");

const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function CaseStudy(): ReactNode {
  const [active, setActive] = useState(0);

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        {/* Left column — sticky title + mockup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="lg:sticky lg:top-24"
        >
          <Kicker>Casos de éxito</Kicker>
          <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
            Casos medidos en{" "}
            <span className="font-sans font-semibold tracking-tight">
              resultados
            </span>
            , no en pantallas
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Proyectos reales, en producción, cada uno acompañado hasta que el
            equipo del cliente lo hace suyo.
          </p>
          <div className="relative mt-10 aspect-[4/3] border border-border bg-muted/40 sm:mt-12">
            <div className="absolute inset-0 overflow-hidden">
              {STUDIES.map((study, index) => (
                <motion.div
                  key={study.id}
                  initial={false}
                  animate={{
                    opacity: active === index ? 1 : 0,
                    scale: active === index ? 1 : 1.04,
                  }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                  aria-hidden={active !== index}
                  className="absolute inset-0 flex items-center justify-center p-12"
                >
                  {study.logo ? (
                    <img
                      src={study.logo}
                      alt={study.client}
                      draggable={false}
                      className="max-h-[42%] max-w-[62%] object-contain"
                    />
                  ) : null}
                </motion.div>
              ))}

              {/* Caption bar */}
              <div className="absolute inset-x-0 bottom-0 border-t border-border bg-background/80 px-5 py-4 backdrop-blur-sm sm:px-6">
                <p className="text-sm font-semibold tracking-tight">
                  {STUDIES[active]?.client}
                </p>
                {STUDIES[active]?.metric ? (
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {STUDIES[active].metric}
                  </p>
                ) : null}
              </div>

              <span className="absolute left-4 top-4 bg-background/80 px-3 py-1 font-mono text-[11px] tracking-[0.12em] text-foreground backdrop-blur-sm">
                {STUDIES[active]?.index} / {TOTAL}
              </span>
            </div>

            <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
            <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
            <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
            <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
          </div>
        </motion.div>

        {/* Right column — case list */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="border-t border-border"
        >
          {STUDIES.map((study, index) => (
            <motion.a
              key={study.id}
              href={`/casos/${study.id}`}
              variants={rowVariants}
              whileHover="hover"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              className="group grid grid-cols-[auto_1fr_auto] items-start gap-5 border-b border-border py-7 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary sm:gap-8 sm:py-9"
            >
              <span
                className={`pt-1.5 font-mono text-xs tracking-[0.12em] transition-colors duration-200 ${
                  active === index ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {study.index}
              </span>
              <div className="min-w-0">
                <h3 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {study.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {study.client} · {study.sector} · {study.year}
                </p>
                <p className="mt-3 max-w-lg text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {study.summary}
                </p>
              </div>
              <span className="mt-1 grid h-11 w-11 shrink-0 place-items-center border border-border text-foreground transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                <motion.span
                  variants={{ hover: { x: 2, y: -2 } }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="grid place-items-center"
                >
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </motion.span>
              </span>
            </motion.a>
          ))}

          <div className="pt-8">
            <CutButton href="/casos">
              Ver todos los casos
            </CutButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
