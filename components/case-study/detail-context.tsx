"use client";

import Logo from "@/components/case-study/logo";
import MagicTransform from "@/components/case-study/magic-transformation";
import { getCaseStudyVisuals } from "@/components/case-study/visuals/registry";
import { CornerPlus } from "@/components/corner-plus";
import type { CaseStudy, ProjectData } from "@/lib/portfolio-data";
import { softEase } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface DetailContextProps {
  project: ProjectData;
  caseStudy: CaseStudy;
}

function getShortName(title: string): string {
  const dash = title.indexOf(" — ");
  return dash > 0 ? title.slice(0, dash) : title;
}

export function DetailContext({
  project,
  caseStudy,
}: DetailContextProps): ReactNode {
  const config = getCaseStudyVisuals(project.id)?.context;
  const shortName = getShortName(project.title);
  const centerContent = config?.centerContent ?? (
    <Logo
      className="h-10 w-auto"
      classNameIcon="text-primary"
      classNameText="text-foreground"
    />
  );

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
            01 — Punto de partida
          </p>
          <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
            El problema antes de{" "}
            <span className="font-sans font-semibold tracking-tight">
              {shortName}
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
          {caseStudy.problem.map((paragraph, i) => (
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
              className="text-[15px] leading-relaxed text-muted-foreground sm:text-base"
            >
              {typeof paragraph === "string" ? (
                paragraph
              ) : (
                <>
                  <strong className="font-semibold text-foreground">
                    {paragraph.headline}
                  </strong>{" "}
                  {paragraph.body}
                </>
              )}
            </motion.p>
          ))}
        </motion.div>
      </div>

      {config ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: softEase }}
          className="relative mt-14 border border-border bg-muted/40"
        >
          <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
          <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
          <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
          <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

          <div className="flex items-center justify-between border-b border-border bg-background/60 px-5 py-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {config.bannerLeft}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {config.bannerRight}
            </span>
          </div>

          <div className="px-2 py-4 sm:px-4 sm:py-6">
            <MagicTransform
              height={520}
              axisColor={config.axisColor}
              centerSize={92}
              documentDuration={5}
              documentWidth={200}
              documentHeight={280}
              particleCount={22}
              results={config.modules}
              centerContent={centerContent}
            />
          </div>

          <div className="border-t border-border px-5 py-3">
            <p className="text-center text-xs text-muted-foreground sm:text-sm">
              {config.footerText}
            </p>
          </div>
        </motion.div>
      ) : null}
    </section>
  );
}
