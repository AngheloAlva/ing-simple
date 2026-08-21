"use client";

import {
  BuildZone,
  Connector,
  CountUp,
  EASE,
  MockFrame,
  useAutoBuild,
  useBuild,
} from "@/components/diagrams/interactive-diagram";
import { useReducedMotion } from "@/lib/motion";
import { Check } from "lucide-react";
import { motion } from "motion/react";
import { Fragment, type ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Capacitaciones — a named learning path that completes module by module and
 * closes with the outcome the team walks away with. It advances on scroll;
 * hovering a module completes it early.
 * ------------------------------------------------------------------------ */

const STEPS = [
  { key: "s1", n: "1", label: "Fundamentos", hours: "3 h" },
  { key: "s2", n: "2", label: "Aplicación", hours: "4 h" },
  { key: "s3", n: "3", label: "Proyecto", hours: "3 h" },
  { key: "s4", n: "4", label: "Certificación", hours: "2 h" },
];

type Outcome = {
  label: string;
  to: number;
  decimals: number;
  suffix: string;
};

const OUTCOMES: Outcome[] = [
  { label: "Personas certificadas", to: 24, decimals: 0, suffix: "" },
  { label: "Horas de práctica", to: 12, decimals: 0, suffix: "" },
  { label: "Satisfacción", to: 4.8, decimals: 1, suffix: " / 5" },
];

const KEYS = [...STEPS.map((step) => step.key), "resultado"];

export function DiagramTrainingInteractive(): ReactNode {
  const prefersReduced = useReducedMotion();
  const { built, build, reset, anyBuilt } = useBuild();
  const containerRef = useAutoBuild(build, KEYS);

  const done = STEPS.filter((step) => built.has(step.key)).length;
  const progress = done / STEPS.length;
  const complete = done === STEPS.length;

  return (
    <MockFrame
      title="Ruta de capacitación"
      frameClassName="max-w-[680px]"
      viewportClassName="h-[420px] sm:h-[490px]"
      anyBuilt={anyBuilt}
      onReset={reset}
      containerRef={containerRef}
    >
      <div className="flex h-full flex-col gap-3.5 p-3.5">
        {/* Course header */}
        <div className="flex shrink-0 items-baseline justify-between">
          <span className="text-[11px] font-medium text-foreground">
            Power BI · Nivel intermedio
          </span>
          <span className="text-[10px] text-muted-foreground">
            4 módulos · 12 h
          </span>
        </div>

        {/* Modules */}
        <div className="flex h-[150px] shrink-0 items-stretch">
          {STEPS.map((step, i) => (
            <Fragment key={step.key}>
              {i > 0 ? (
                <Connector
                  active={built.has(step.key)}
                  prefersReduced={prefersReduced}
                  className="mt-[60px] w-4 shrink-0 sm:w-7"
                />
              ) : null}
              <BuildZone
                zoneKey={step.key}
                label={step.label}
                isBuilt={built.has(step.key)}
                onBuild={build}
                prefersReduced={prefersReduced}
                className="flex-1"
              >
                <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border border-brand-green/40 bg-brand-green/5 p-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green text-brand-green-foreground">
                    <Check className="h-4 w-4" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  <span className="text-center text-[11px] font-medium leading-tight text-foreground">
                    {step.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {step.hours}
                  </span>
                  <span className="text-[9px] font-medium uppercase tracking-wider text-brand-green-text">
                    Completado
                  </span>
                </div>
              </BuildZone>
            </Fragment>
          ))}
        </div>

        {/* Progress */}
        <div className="shrink-0">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-brand-green"
              initial={prefersReduced ? false : { width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: prefersReduced ? 0 : 0.5, ease: EASE }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[11px]">
            <span className="text-muted-foreground">
              {done} de {STEPS.length} módulos
            </span>
            <span className="font-medium text-brand-green-text">
              {Math.round(progress * 100)}% completado
            </span>
          </div>
        </div>

        {/* Outcome */}
        <BuildZone
          zoneKey="resultado"
          label="Resultado"
          isBuilt={built.has("resultado")}
          onBuild={build}
          prefersReduced={prefersReduced}
          className="min-h-0 flex-1"
        >
          <div className="flex h-full flex-col justify-center gap-3 rounded-sm border border-border bg-background p-4">
            <span className="text-[10px] font-medium text-muted-foreground">
              Resultado del programa
            </span>
            <div className="grid grid-cols-3 gap-2">
              {OUTCOMES.map((outcome, i) => (
                <div key={outcome.label} className="min-w-0">
                  <p className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
                    <CountUp
                      to={outcome.to}
                      decimals={outcome.decimals}
                      suffix={outcome.suffix}
                      delay={0.6 + i * 0.1}
                      prefersReduced={prefersReduced}
                    />
                  </p>
                  <p className="truncate text-[10px] leading-tight text-muted-foreground">
                    {outcome.label}
                  </p>
                </div>
              ))}
            </div>
            {complete ? (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-brand-green/30 bg-brand-green/10 px-2 py-1 text-[10px] font-medium text-brand-green-text">
                <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                Equipo autónomo en la herramienta
              </span>
            ) : null}
          </div>
        </BuildZone>
      </div>
    </MockFrame>
  );
}
