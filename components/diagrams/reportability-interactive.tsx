"use client";

import {
  BuildZone,
  CountUp,
  EASE,
  MockFrame,
  useAutoBuild,
  useBuild,
} from "@/components/diagrams/interactive-diagram";
import { useReducedMotion } from "@/lib/motion";
import { motion } from "motion/react";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Reportabilidad — an empty report canvas that fills with named KPIs, a
 * labelled monthly chart and detail widgets. It assembles itself on scroll;
 * hovering a zone builds it early.
 * ------------------------------------------------------------------------ */

type Kpi = {
  label: string;
  to: number;
  decimals: number;
  suffix: string;
  delta: string;
};

const KPIS: Kpi[] = [
  { label: "Solicitudes", to: 1.2, decimals: 1, suffix: "k", delta: "+12%" },
  { label: "Procesadas", to: 980, decimals: 0, suffix: "", delta: "+8%" },
  { label: "SLA", to: 98, decimals: 0, suffix: "%", delta: "+2%" },
  { label: "Tiempo medio", to: 4.2, decimals: 1, suffix: " h", delta: "-18%" },
];

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"];
const CHART = [40, 62, 50, 74, 58, 82, 70, 92];

const AREAS = [
  { name: "Operaciones", share: 88 },
  { name: "Comercial", share: 72 },
  { name: "Finanzas", share: 48 },
  { name: "Personas", share: 34 },
];

const DONUT_PCT = 65;
const DONUT_CIRCUMFERENCE = 94.25;
const KEYS = ["kpis", "chart", "detalle"];

export function DiagramReportabilityInteractive(): ReactNode {
  const prefersReduced = useReducedMotion();
  const { built, build, reset, anyBuilt } = useBuild();
  const containerRef = useAutoBuild(build, KEYS);

  const zone = (key: string) => ({
    zoneKey: key,
    isBuilt: built.has(key),
    onBuild: build,
    prefersReduced,
  });

  return (
    <MockFrame
      title="Dashboard operacional"
      frameClassName="max-w-[680px]"
      viewportClassName="h-[420px] sm:h-[490px]"
      anyBuilt={anyBuilt}
      onReset={reset}
      containerRef={containerRef}
    >
      <div className="flex h-full flex-col gap-2.5 p-3.5">
        {/* KPI row */}
        <BuildZone
          {...zone("kpis")}
          label="Indicadores"
          className="h-[88px] shrink-0"
        >
          <div className="grid h-full grid-cols-4 gap-2">
            {KPIS.map((kpi, i) => (
              <div
                key={kpi.label}
                className="flex flex-col justify-center gap-0.5 rounded-sm border border-border bg-background px-2.5 py-2"
              >
                <span className="truncate text-[10px] font-medium tracking-wide text-muted-foreground">
                  {kpi.label}
                </span>
                <span className="text-base font-semibold tracking-tight tabular-nums text-foreground">
                  <CountUp
                    to={kpi.to}
                    decimals={kpi.decimals}
                    suffix={kpi.suffix}
                    delay={0.6 + i * 0.08}
                    prefersReduced={prefersReduced}
                  />
                </span>
                <span className="text-[10px] font-medium tabular-nums text-brand-green-text">
                  {kpi.delta}
                </span>
              </div>
            ))}
          </div>
        </BuildZone>

        {/* Main chart */}
        <BuildZone
          {...zone("chart")}
          label="Solicitudes por mes"
          className="min-h-0 flex-1"
        >
          <div className="flex h-full flex-col rounded-sm border border-border bg-background p-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-medium text-foreground">
                Solicitudes por mes
              </span>
              <span className="text-[10px] text-muted-foreground">
                Últimos 8 meses
              </span>
            </div>

            <div className="mt-2.5 flex min-h-0 flex-1 items-end gap-1.5">
              {CHART.map((height, i) => (
                <motion.div
                  key={MONTHS[i]}
                  className={`w-full rounded-sm ${
                    i === CHART.length - 1
                      ? "bg-primary"
                      : "bg-muted-foreground/25"
                  }`}
                  initial={prefersReduced ? false : { height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.55,
                    ease: EASE,
                    delay: prefersReduced ? 0 : 0.6 + i * 0.05,
                  }}
                />
              ))}
            </div>

            <div className="mt-1.5 flex gap-1.5">
              {MONTHS.map((month, i) => (
                <span
                  key={month}
                  className={`w-full text-center text-[9px] ${
                    i === MONTHS.length - 1
                      ? "font-medium text-primary"
                      : "text-muted-foreground/70"
                  }`}
                >
                  {month}
                </span>
              ))}
            </div>
          </div>
        </BuildZone>

        {/* Detail widgets */}
        <BuildZone
          {...zone("detalle")}
          label="Detalle"
          className="h-[140px] shrink-0"
        >
          <div className="grid h-full grid-cols-2 gap-2">
            {/* Automation coverage */}
            <div className="flex items-center gap-3 rounded-sm border border-border bg-background p-3">
              <svg
                viewBox="0 0 36 36"
                className="h-14 w-14 shrink-0 -rotate-90"
                aria-hidden="true"
              >
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted-foreground/20"
                />
                <motion.circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={DONUT_CIRCUMFERENCE}
                  className="text-brand-green"
                  initial={
                    prefersReduced
                      ? false
                      : { strokeDashoffset: DONUT_CIRCUMFERENCE }
                  }
                  animate={{
                    strokeDashoffset:
                      DONUT_CIRCUMFERENCE * (1 - DONUT_PCT / 100),
                  }}
                  transition={{
                    duration: prefersReduced ? 0 : 0.9,
                    ease: EASE,
                    delay: prefersReduced ? 0 : 0.6,
                  }}
                />
              </svg>
              <div className="min-w-0">
                <p className="text-base font-semibold tracking-tight tabular-nums text-foreground">
                  <CountUp
                    to={DONUT_PCT}
                    suffix="%"
                    delay={0.6}
                    prefersReduced={prefersReduced}
                  />
                </p>
                <p className="text-[10px] font-medium leading-tight text-muted-foreground">
                  Reportes automatizados
                </p>
                <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground/70">
                  13 de 20 procesos
                </p>
              </div>
            </div>

            {/* Volume by area */}
            <div className="flex flex-col justify-center gap-1.5 rounded-sm border border-border bg-background p-3">
              <span className="text-[10px] font-medium text-muted-foreground">
                Volumen por área
              </span>
              {AREAS.map((area, i) => (
                <div key={area.name} className="flex items-center gap-2">
                  <span className="w-[68px] shrink-0 truncate text-[10px] text-foreground/80">
                    {area.name}
                  </span>
                  <span className="h-1.5 min-w-0 flex-1 rounded-full bg-muted">
                    <motion.span
                      className="block h-full rounded-full bg-primary/70"
                      initial={prefersReduced ? false : { width: 0 }}
                      animate={{ width: `${area.share}%` }}
                      transition={{
                        duration: prefersReduced ? 0 : 0.6,
                        ease: EASE,
                        delay: prefersReduced ? 0 : 0.6 + i * 0.08,
                      }}
                    />
                  </span>
                  <span className="w-6 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">
                    {area.share}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </BuildZone>
      </div>
    </MockFrame>
  );
}
