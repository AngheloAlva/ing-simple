"use client";

import type { CaseStudy } from "@/lib/portfolio-data";
import { softEase } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface DetailBeforeAfterProps {
  caseStudy: CaseStudy;
  accent: string;
}

export function DetailBeforeAfter({
  caseStudy,
  accent,
}: DetailBeforeAfterProps): ReactNode {
  if (!caseStudy.beforeAfter || caseStudy.beforeAfter.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          08 — El antes y el después
        </p>
        <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          El antes y el{" "}
          <span className="font-sans font-semibold tracking-tight">
            después
          </span>
        </h2>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Lo que cambia cuando la operación deja de vivir en planillas, correos
          y chats.
        </p>
      </div>

      {/* Column headers */}
      <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="border border-destructive/20 bg-destructive/5 px-4 py-2 text-sm font-semibold text-destructive/80">
          Antes
        </div>
        <div
          className="border px-4 py-2 text-sm font-semibold"
          style={{
            color: accent,
            background: `${accent}0d`,
            borderColor: `${accent}26`,
          }}
        >
          Después
        </div>
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3">
        {caseStudy.beforeAfter.map((row, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: softEase }}
            className="grid grid-cols-1 gap-3 md:grid-cols-2"
          >
            <div className="flex items-start gap-3 border border-border bg-muted/30 p-4">
              <span
                className="mt-0.5 shrink-0 text-sm font-bold text-destructive/60"
                aria-hidden="true"
              >
                ✕
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">
                {row.before}
              </span>
            </div>
            <div className="flex items-start gap-3 border border-border bg-muted/30 p-4">
              <span
                className="mt-0.5 shrink-0 text-sm font-bold"
                style={{ color: accent }}
                aria-hidden="true"
              >
                ✓
              </span>
              <span className="text-sm font-medium leading-relaxed text-foreground">
                {row.after}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
