"use client";

import {
  BuildZone,
  MockFrame,
  useAutoBuild,
  useBuild,
} from "@/components/interactive-diagram";
import { useReducedMotion } from "@/lib/motion";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Reportabilidad — an empty report canvas that fills with KPIs, a chart and
 * detail widgets as the visitor hovers each zone.
 * ------------------------------------------------------------------------ */

const KPIS = [
  { value: "80", delta: "+8%" },
  { value: "1.2k", delta: "+12%" },
  { value: "20", delta: "+3" },
  { value: "98%", delta: "+2%" },
];

const CHART = [40, 62, 50, 74, 58, 82, 70, 92];
const DETAIL_BARS = [72, 48, 88, 34];
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
      hint="Pasa el mouse para armar el dashboard →"
      anyBuilt={anyBuilt}
      onReset={reset}
      containerRef={containerRef}
    >
      <div className="flex h-full flex-col gap-2 p-3">
        {/* KPI row */}
        <BuildZone {...zone("kpis")} label="Indicadores" className="h-16 shrink-0">
          <div className="grid h-full grid-cols-4 gap-2">
            {KPIS.map((kpi) => (
              <div
                key={kpi.value}
                className="flex flex-col justify-center gap-1 rounded-sm border border-border bg-background px-2 py-1.5"
              >
                <span className="h-1.5 w-8 rounded-full bg-muted-foreground/30" />
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  {kpi.value}
                </span>
                <span className="text-[9px] font-medium text-primary">
                  {kpi.delta}
                </span>
              </div>
            ))}
          </div>
        </BuildZone>

        {/* Main chart */}
        <BuildZone {...zone("chart")} label="Gráfico principal" className="min-h-0 flex-1">
          <div className="flex h-full items-end gap-1.5 rounded-sm border border-border bg-background p-3">
            {CHART.map((height, i) => (
              <div
                key={i}
                className={`w-full rounded-sm ${
                  i === CHART.length - 1
                    ? "bg-primary"
                    : "bg-muted-foreground/25"
                }`}
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </BuildZone>

        {/* Detail widgets */}
        <BuildZone {...zone("detalle")} label="Detalle" className="h-24 shrink-0">
          <div className="grid h-full grid-cols-2 gap-2">
            {/* Donut */}
            <div className="flex items-center gap-3 rounded-sm border border-border bg-background p-3">
              <svg viewBox="0 0 36 36" className="h-14 w-14 -rotate-90">
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-muted-foreground/20"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="94.25"
                  strokeDashoffset="33"
                  className="text-primary"
                />
              </svg>
              <div className="flex flex-col gap-1.5">
                <span className="text-sm font-semibold text-foreground">65%</span>
                <span className="h-1.5 w-12 rounded-full bg-muted-foreground/25" />
              </div>
            </div>

            {/* Ranked bars */}
            <div className="flex flex-col justify-center gap-2 rounded-sm border border-border bg-background p-3">
              {DETAIL_BARS.map((width, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="h-1.5 w-6 shrink-0 rounded-full bg-muted-foreground/25" />
                  <span
                    className="h-1.5 rounded-full bg-primary/70"
                    style={{ width: `${width}%` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </BuildZone>
      </div>
    </MockFrame>
  );
}
