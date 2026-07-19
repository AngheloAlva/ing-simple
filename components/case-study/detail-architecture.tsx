"use client";

import {
  getCaseStudyVisuals,
  type ArchNode,
} from "@/components/case-study/visuals/registry";
import { CornerPlus } from "@/components/corner-plus";
import type { CaseStudy, ProjectData } from "@/lib/portfolio-data";
import { softEase } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

interface DetailArchitectureProps {
  project: ProjectData;
  caseStudy: CaseStudy;
  accent: string;
}

export function DetailArchitecture({
  project,
  caseStudy,
  accent,
}: DetailArchitectureProps): ReactNode {
  const architecture = getCaseStudyVisuals(project.id)?.architecture;

  // No diagram data → nothing to draw.
  if (!architecture || architecture.nodes.length === 0) return null;

  const { nodes, edges, viewBox, ariaLabel, diagramTitle } = architecture;
  const byId: Record<string, ArchNode> = Object.fromEntries(
    nodes.map((n) => [n.id, n])
  );

  const getAnchor = (n: ArchNode, side: "top" | "bottom") => ({
    x: n.x + n.w / 2,
    y: side === "top" ? n.y : n.y + n.h,
  });

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
            03 — Arquitectura
          </p>
          <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
            Cómo está{" "}
            <span className="font-sans font-semibold tracking-tight">
              armado por dentro
            </span>
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {caseStudy.architectureDescription}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: softEase }}
          className="relative border border-border bg-muted/40 p-4 sm:p-6"
        >
          <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
          <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
          <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
          <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

          {diagramTitle ? (
            <h3 className="mb-3 text-sm font-semibold tracking-tight text-foreground">
              {diagramTitle}
            </h3>
          ) : null}

          <svg
            viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
            className="h-auto w-full"
            role="img"
            aria-label={ariaLabel}
          >
            <defs>
              <marker
                id="arrowhead"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10 z" fill="currentColor" opacity="0.45" />
              </marker>
            </defs>

            <g
              className="text-muted-foreground"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="1.2"
              fill="none"
            >
              {edges.map((e, i) => {
                const from = byId[e.from];
                const to = byId[e.to];
                if (!from || !to) return null;
                const a = getAnchor(from, "bottom");
                const b = getAnchor(to, "top");
                const midY = (a.y + b.y) / 2;
                return (
                  <path
                    key={i}
                    d={`M ${a.x} ${a.y} C ${a.x} ${midY}, ${b.x} ${midY}, ${b.x} ${b.y}`}
                    markerEnd="url(#arrowhead)"
                  />
                );
              })}
            </g>

            <g>
              {nodes.map((n) => {
                const isPrimary = n.tone === "primary";
                const isAccent = n.tone === "accent";
                const fill = isPrimary
                  ? accent
                  : isAccent
                    ? `${accent}1A`
                    : "var(--color-background)";
                const stroke = isPrimary
                  ? accent
                  : isAccent
                    ? accent
                    : "var(--color-border)";
                const textColor = isPrimary
                  ? "#ffffff"
                  : "var(--color-foreground)";
                const subColor = isPrimary
                  ? "#ffffffbb"
                  : "var(--color-muted-foreground)";
                return (
                  <g key={n.id}>
                    <rect
                      x={n.x}
                      y={n.y}
                      width={n.w}
                      height={n.h}
                      rx="10"
                      ry="10"
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="1.2"
                      opacity={isPrimary ? 0.95 : 1}
                    />
                    <text
                      x={n.x + n.w / 2}
                      y={n.y + (n.sub ? n.h / 2 - 4 : n.h / 2 + 4)}
                      fill={textColor}
                      fontSize="14"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {n.label}
                    </text>
                    {n.sub ? (
                      <text
                        x={n.x + n.w / 2}
                        y={n.y + n.h / 2 + 14}
                        fill={subColor}
                        fontSize="11"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {n.sub}
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
