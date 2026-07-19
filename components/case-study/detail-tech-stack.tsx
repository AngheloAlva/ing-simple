"use client";

import { CornerPlus } from "@/components/corner-plus";
import { TechGlyph } from "@/components/case-study/tech-icon";
import type { CaseStudy } from "@/lib/portfolio-data";
import { softEase } from "@/lib/motion";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface DetailTechStackProps {
  caseStudy: CaseStudy;
  accent: string;
}

export function DetailTechStack({
  caseStudy,
  accent,
}: DetailTechStackProps): ReactNode {
  const introText =
    caseStudy.techStackIntro ??
    "Cada pieza del stack responde a una restricción concreta del proyecto. Esto es lo que pensamos al elegir.";

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="mb-10 grid grid-cols-1 items-end gap-6 border-b border-border pb-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: softEase }}
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            04 — Decisiones técnicas
          </p>
          <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
            No es solo qué usamos, es{" "}
            <span className="font-sans font-semibold tracking-tight">
              por qué
            </span>
          </h2>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: softEase }}
          className="max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base"
        >
          {introText}
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: softEase }}
        className="relative grid grid-cols-1 border-l border-t border-border sm:grid-cols-2"
      >
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        {caseStudy.techStackDetailed.map((item, i, arr) => {
          const isLastOdd = i === arr.length - 1 && arr.length % 2 === 1;
          return (
            <div
              key={item.name}
              className={`relative overflow-hidden border-b border-r border-border p-6 sm:p-8 ${
                isLastOdd ? "sm:col-span-2" : ""
              }`}
            >
              {/* Brand logo as an oversized corner watermark. currentColor-based
                  glyphs adapt to the theme via text-foreground; multicolor logos
                  keep their internal detail as gray shades via grayscale. */}
              <span
                className="pointer-events-none absolute -right-5 -top-5 text-foreground opacity-[0.12] [filter:grayscale(1)] dark:opacity-[0.16]"
                aria-hidden="true"
              >
                <TechGlyph name={item.name} className="h-28 w-28 sm:h-36 sm:w-36" />
              </span>

              <div className="relative flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {item.name}
                  </h3>
                  {item.tag ? (
                    <span
                      className="shrink-0 self-start border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
                      style={{
                        color: accent,
                        borderColor: `${accent}33`,
                        backgroundColor: `${accent}12`,
                      }}
                    >
                      {item.tag}
                    </span>
                  ) : null}
                </div>

                {item.detail ? (
                  <>
                    <p className="text-sm italic leading-relaxed text-muted-foreground">
                      {item.detail.constraint}
                    </p>
                    <p className="text-sm leading-relaxed text-foreground/80">
                      {item.detail.decision}
                    </p>
                    <p
                      className="flex items-start gap-1.5 text-sm leading-relaxed"
                      style={{ color: accent }}
                    >
                      <ArrowRight
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>
                        <strong className="font-semibold">Resultado:</strong>{" "}
                        {item.detail.outcome}
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.reason}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>
    </section>
  );
}
