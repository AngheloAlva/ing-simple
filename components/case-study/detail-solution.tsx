"use client";

import type { CaseStudy } from "@/lib/portfolio-data";
import { softEase } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface DetailSolutionProps {
  caseStudy: CaseStudy;
}

export function DetailSolution({ caseStudy }: DetailSolutionProps): ReactNode {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: softEase }}
          className="lg:pt-2"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            02 — Solución
          </p>
          <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
            Una sola plataforma para{" "}
            <span className="font-sans font-semibold tracking-tight">
              toda la operación
            </span>
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="flex flex-col gap-6"
        >
          {caseStudy.solution.map((paragraph, i) => (
            <motion.p
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: softEase },
                },
              }}
              className="text-[15px] leading-relaxed text-foreground sm:text-base"
            >
              {typeof paragraph === "string" ? (
                paragraph
              ) : (
                <>
                  <strong className="font-semibold text-foreground">
                    {paragraph.headline}
                  </strong>{" "}
                  <span className="text-muted-foreground">{paragraph.body}</span>
                </>
              )}
            </motion.p>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
