"use client";

import {
  BuildZone,
  Connector,
  CountUp,
  MockFrame,
  useAutoBuild,
  useBuild,
} from "@/components/diagrams/interactive-diagram";
import { useReducedMotion } from "@/lib/motion";
import { Check, FileInput, ShieldCheck, UserRoundSearch } from "lucide-react";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Automatizaciones — a named flow that wires itself node by node and closes
 * with what the automation gives back: trigger → validation → approved or
 * manual review, then the time it saves.
 * ------------------------------------------------------------------------ */

type Saving = {
  label: string;
  to: number;
  decimals: number;
  suffix: string;
};

const SAVINGS: Saving[] = [
  { label: "Horas por semana", to: 8, decimals: 0, suffix: " h" },
  { label: "Casos por mes", to: 312, decimals: 0, suffix: "" },
  { label: "Sin intervención", to: 94, decimals: 0, suffix: "%" },
];

const KEYS = ["trigger", "process", "approved", "review", "ahorro"];

export function DiagramAutomationInteractive(): ReactNode {
  const prefersReduced = useReducedMotion();
  const { built, build, reset, anyBuilt } = useBuild();
  const containerRef = useAutoBuild(build, KEYS);

  const zone = (key: string) => ({
    zoneKey: key,
    isBuilt: built.has(key),
    onBuild: build,
    prefersReduced,
  });

  const branchActive = built.has("approved") || built.has("review");

  return (
    <MockFrame
      title="Flujo automatizado"
      frameClassName="max-w-[680px]"
      viewportClassName="h-[420px] sm:h-[490px]"
      anyBuilt={anyBuilt}
      onReset={reset}
      containerRef={containerRef}
    >
      <div className="flex h-full flex-col gap-3.5 p-3.5">
        <div className="flex shrink-0 items-baseline justify-between">
          <span className="text-[11px] font-medium text-foreground">
            Ingreso de solicitudes
          </span>
          <span className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
            En ejecución
          </span>
        </div>

        {/* Flow */}
        <div className="flex min-h-0 flex-1 items-stretch gap-1.5">
          {/* Trigger */}
          <BuildZone {...zone("trigger")} label="Disparador" className="flex-1">
            <div className="flex h-full flex-col justify-between rounded-md border border-border bg-background p-3">
              <div className="flex flex-col gap-2">
                <FileInput
                  className="h-4 w-4 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-medium leading-tight text-foreground">
                  Formulario web
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  Entra una solicitud nueva
                </span>
              </div>
              <span className="inline-flex w-fit items-center rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-foreground">
                24 hoy
              </span>
            </div>
          </BuildZone>

          <Connector
            active={built.has("process")}
            prefersReduced={prefersReduced}
            className="w-5 self-center sm:w-6"
          />

          {/* Process */}
          <BuildZone {...zone("process")} label="Validación" className="flex-1">
            <div className="flex h-full flex-col justify-between rounded-md border border-border bg-background p-3">
              <div className="flex flex-col gap-2">
                <ShieldCheck
                  className="h-4 w-4 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                <span className="text-[11px] font-medium leading-tight text-foreground">
                  Validación
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  Reglas de negocio y datos
                </span>
              </div>
              <span className="inline-flex w-fit items-center rounded-sm border border-border px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-foreground">
                6 reglas
              </span>
            </div>
          </BuildZone>

          <Connector
            active={branchActive}
            prefersReduced={prefersReduced}
            className="w-5 self-center sm:w-6"
          />

          {/* Branch */}
          <div className="flex flex-1 flex-col justify-center gap-2">
            <BuildZone {...zone("approved")} label="Aprobado" className="flex-1">
              <div className="flex h-full flex-col justify-center gap-1 rounded-md border border-brand-green/40 bg-brand-green/5 px-3">
                <span className="flex items-center gap-1.5">
                  <Check
                    className="h-3.5 w-3.5 text-brand-green-text"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-medium text-foreground">
                    Aprobado
                  </span>
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  Se registra y se notifica
                </span>
                <span className="text-[11px] font-semibold tabular-nums text-brand-green-text">
                  18 casos
                </span>
              </div>
            </BuildZone>

            <BuildZone {...zone("review")} label="Revisión manual" className="flex-1">
              <div className="flex h-full flex-col justify-center gap-1 rounded-md border border-border bg-background px-3">
                <span className="flex items-center gap-1.5">
                  <UserRoundSearch
                    className="h-3.5 w-3.5 text-muted-foreground"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-medium text-foreground">
                    Revisión manual
                  </span>
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  Solo los casos dudosos
                </span>
                <span className="text-[11px] font-semibold tabular-nums text-foreground">
                  6 casos
                </span>
              </div>
            </BuildZone>
          </div>
        </div>

        {/* What it gives back */}
        <BuildZone
          {...zone("ahorro")}
          label="Ahorro"
          className="h-[92px] shrink-0"
        >
          <div className="flex h-full flex-col justify-center gap-2 rounded-sm border border-brand-green/30 bg-brand-green/5 px-3.5">
            <span className="text-[10px] font-medium text-muted-foreground">
              Lo que devuelve el flujo
            </span>
            <div className="grid grid-cols-3 gap-2">
              {SAVINGS.map((saving, i) => (
                <div key={saving.label} className="min-w-0">
                  <p className="text-lg font-semibold tracking-tight tabular-nums text-brand-green-text">
                    <CountUp
                      to={saving.to}
                      decimals={saving.decimals}
                      suffix={saving.suffix}
                      delay={0.6 + i * 0.1}
                      prefersReduced={prefersReduced}
                    />
                  </p>
                  <p className="truncate text-[10px] leading-tight text-muted-foreground">
                    {saving.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </BuildZone>
      </div>
    </MockFrame>
  );
}
