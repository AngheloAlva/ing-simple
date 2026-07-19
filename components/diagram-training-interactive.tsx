"use client";

import {
  BuildZone,
  Connector,
  EASE,
  MockFrame,
  useAutoBuild,
  useBuild,
} from "@/components/interactive-diagram";
import { useReducedMotion } from "@/lib/motion";
import { motion } from "motion/react";
import { Fragment, type ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Capacitaciones — a learning path that completes step by step as the visitor
 * hovers each module; a progress bar tracks how far the route has advanced.
 * ------------------------------------------------------------------------ */

const STEPS = [
  { key: "s1", n: "1", label: "Fundamentos" },
  { key: "s2", n: "2", label: "Aplicación" },
  { key: "s3", n: "3", label: "Proyecto" },
  { key: "s4", n: "4", label: "Certificación" },
];

const KEYS = STEPS.map((step) => step.key);

export function DiagramTrainingInteractive(): ReactNode {
  const prefersReduced = useReducedMotion();
  const { built, build, reset, anyBuilt } = useBuild();
  const containerRef = useAutoBuild(build, KEYS);

  const progress = built.size / STEPS.length;

  return (
    <MockFrame
      title="Ruta de capacitación"
      hint="Pasá el mouse para avanzar la ruta →"
      anyBuilt={anyBuilt}
      onReset={reset}
      containerRef={containerRef}
    >
      <div className="flex h-full flex-col justify-center gap-8 p-4">
        {/* Steps */}
        <div className="flex items-stretch">
          {STEPS.map((step, i) => (
            <Fragment key={step.key}>
              {i > 0 ? (
                <Connector
                  active={built.has(step.key)}
                  prefersReduced={prefersReduced}
                  className="mt-8 w-4 shrink-0 sm:w-8"
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
                <div className="flex h-full flex-col items-center justify-center gap-2 rounded-md border border-border bg-background p-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                    {step.n}
                  </span>
                  <span className="text-center text-[10px] font-medium leading-tight text-foreground/70">
                    {step.label}
                  </span>
                </div>
              </BuildZone>
            </Fragment>
          ))}
        </div>

        {/* Progress bar */}
        <div className="mx-auto w-full max-w-[85%]">
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-primary"
              initial={prefersReduced ? false : { width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: prefersReduced ? 0 : 0.5, ease: EASE }}
            />
          </div>
          <div className="mt-1.5 text-right text-[11px] font-medium text-primary">
            {Math.round(progress * 100)}% completado
          </div>
        </div>
      </div>
    </MockFrame>
  );
}
