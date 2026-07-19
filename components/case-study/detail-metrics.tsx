"use client";

import type { CaseStudy } from "@/lib/portfolio-data";
import { useReducedMotion } from "@/lib/motion";
import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";

interface DetailMetricsProps {
  caseStudy: CaseStudy;
  accent: string;
}

interface ParsedMetric {
  prefix: string;
  target: number;
  suffix: string;
  decimals: number;
  usePad: boolean;
  padLength: number;
  original: string;
}

function parseMetric(value: string): ParsedMetric {
  const match = value.match(/^([^\d.,-]*)([\d.,-]+)(.*)$/);
  if (!match || match[2] === undefined) {
    return {
      prefix: "",
      target: 0,
      suffix: value,
      decimals: 0,
      usePad: false,
      padLength: 0,
      original: value,
    };
  }
  const prefix = match[1] ?? "";
  const numericRaw = match[2];
  const suffix = match[3] ?? "";
  const numeric = numericRaw.replace(",", ".");
  const target = parseFloat(numeric) || 0;
  const decimalPart = numeric.split(".")[1] ?? "";
  const decimals = decimalPart.length;
  const intPart = (numeric.split(".")[0] ?? "").replace("-", "");
  const usePad = intPart.startsWith("0") && intPart.length > 1;
  return {
    prefix,
    target,
    suffix,
    decimals,
    usePad,
    padLength: intPart.length,
    original: value,
  };
}

function CountUp({
  metric,
  inView,
  reduce,
  duration = 2.2,
}: {
  metric: ParsedMetric;
  inView: boolean;
  reduce: boolean;
  duration?: number;
}): ReactNode {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;

    const render = (v: number) => {
      let numeric: string;
      if (metric.decimals > 0) {
        numeric = v.toFixed(metric.decimals);
      } else {
        numeric = Math.round(v).toString();
      }
      if (metric.usePad) numeric = numeric.padStart(metric.padLength, "0");
      el.textContent = `${metric.prefix}${numeric}${metric.suffix}`;
    };

    if (reduce) {
      render(metric.target);
      return;
    }

    const controls = animate(0, metric.target, {
      duration,
      ease: [0.33, 1, 0.68, 1],
      onUpdate: render,
    });
    return () => controls.stop();
  }, [metric, inView, reduce, duration]);

  return <span ref={ref}>{metric.original}</span>;
}

export function DetailMetrics({
  caseStudy,
  accent,
}: DetailMetricsProps): ReactNode {
  const reduce = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef, { once: true, margin: "-80px" });

  const metrics = caseStudy.metrics.map((m) => ({
    ...m,
    parsed: parseMetric(m.value),
  }));

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="mb-10 max-w-2xl sm:mb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          07 — Cómo impacta hoy
        </p>
        <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          La plataforma{" "}
          <span className="font-sans font-semibold tracking-tight">
            en operación
          </span>
        </h2>
      </div>

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
      >
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 * i }}
            className="relative flex min-h-[17rem] flex-col justify-between border border-border bg-background p-6 sm:min-h-[21rem] sm:p-8"
          >
            {/* Restrained accent detail */}
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-0.5"
              style={{ backgroundColor: accent }}
            />
            <span className="block font-serif text-4xl font-normal leading-none tracking-[-0.02em] tabular-nums text-foreground sm:text-5xl lg:text-[3.25rem]">
              <CountUp metric={metric.parsed} inView={inView} reduce={reduce} />
            </span>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium leading-snug text-foreground sm:text-base">
                {metric.label}
              </span>
              {metric.caption ? (
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {metric.caption}
                </span>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
