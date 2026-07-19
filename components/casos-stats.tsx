"use client";

import { CornerPlus } from "@/components/corner-plus";
import { useReducedMotion } from "@/lib/motion";
import { portfolioProjects } from "@/lib/portfolio-data";
import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const CASES = portfolioProjects.filter(
  (project) => project.isFlagship && project.caseStudy
);

const UNIQUE_CLIENTS = new Set(
  CASES.map((project) => project.caseStudy!.clientName)
).size;

type Stat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

const STATS: Stat[] = [
  { value: CASES.length, label: "Plataformas en producción" },
  { value: UNIQUE_CLIENTS, label: "Empresas cliente" },
  { value: 100, suffix: "%", label: "En uso real, no demos" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function StatNumber({
  value,
  prefix,
  suffix,
  inView,
  reduce,
  delay,
}: {
  value: number;
  prefix: string;
  suffix: string;
  inView: boolean;
  reduce: boolean;
  delay: number;
}): ReactNode {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const raf = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(raf);
    }
    const controls = animate(0, value, {
      duration: 1.6,
      delay,
      ease: EASE,
      onUpdate: (latest) => setDisplay(latest),
    });
    return () => controls.stop();
  }, [inView, reduce, value, delay]);

  return (
    <span className="block font-serif text-5xl font-normal leading-none tracking-[-0.02em] tabular-nums sm:text-6xl">
      <span aria-hidden="true">{`${prefix}${Math.round(display)}${suffix}`}</span>
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
    </span>
  );
}

export function CasosStats(): ReactNode {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(panelRef, { once: true, margin: "-80px" });

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div
        ref={panelRef}
        className="relative grid grid-cols-1 border border-border sm:grid-cols-3"
      >
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        {STATS.map((stat, i) => (
          <div
            key={stat.label}
            className={`relative px-6 py-9 sm:px-8 sm:py-11 ${
              i > 0 ? "border-t border-border sm:border-l sm:border-t-0" : ""
            }`}
          >
            <StatNumber
              value={stat.value}
              prefix={stat.prefix ?? ""}
              suffix={stat.suffix ?? ""}
              inView={inView}
              reduce={reduce}
              delay={i * 0.12}
            />
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
