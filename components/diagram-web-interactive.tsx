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
 * Soluciones Web — an empty browser that builds itself as the visitor hovers
 * each zone (header → hero → content → footer).
 * ------------------------------------------------------------------------ */

const KEYS = ["header", "hero", "cards", "footer"];

export function DiagramWebInteractive(): ReactNode {
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
      hint="Pasa el mouse para construir el sitio →"
      anyBuilt={anyBuilt}
      onReset={reset}
      containerRef={containerRef}
    >
      <div className="flex h-full flex-col gap-2 p-3">
        {/* Header */}
        <BuildZone {...zone("header")} label="Encabezado" className="h-9 shrink-0">
          <div className="flex h-full items-center gap-2 rounded-sm border border-border bg-background px-3">
            <span className="h-3.5 w-3.5 rounded-sm bg-primary" />
            <span className="h-2 w-12 rounded-full bg-foreground/40" />
            <span className="ml-auto hidden items-center gap-3 sm:flex">
              <span className="h-1.5 w-8 rounded-full bg-muted-foreground/30" />
              <span className="h-1.5 w-8 rounded-full bg-muted-foreground/30" />
              <span className="h-1.5 w-8 rounded-full bg-muted-foreground/30" />
            </span>
            <span className="h-5 w-14 rounded-sm bg-foreground/80" />
          </div>
        </BuildZone>

        {/* Hero */}
        <BuildZone {...zone("hero")} label="Portada" className="min-h-0 flex-1">
          <div className="flex h-full flex-col justify-center gap-2 rounded-sm border border-border bg-background px-4">
            <span className="h-3 w-2/3 rounded-full bg-foreground/70" />
            <span className="h-3 w-1/2 rounded-full bg-foreground/70" />
            <span className="mt-1 h-2 w-3/4 rounded-full bg-muted-foreground/30" />
            <span className="mt-2 flex gap-2">
              <span className="h-6 w-20 rounded-sm bg-primary" />
              <span className="h-6 w-20 rounded-sm border border-border" />
            </span>
          </div>
        </BuildZone>

        {/* Content cards */}
        <BuildZone {...zone("cards")} label="Contenido" className="h-24 shrink-0">
          <div className="grid h-full grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-1.5 rounded-sm border border-border bg-background p-2"
              >
                <span className="h-9 w-full rounded-sm bg-muted" />
                <span className="h-1.5 w-3/4 rounded-full bg-foreground/50" />
                <span className="h-1.5 w-full rounded-full bg-muted-foreground/25" />
              </div>
            ))}
          </div>
        </BuildZone>

        {/* Footer */}
        <BuildZone {...zone("footer")} label="Pie" className="h-7 shrink-0">
          <div className="flex h-full items-center justify-between rounded-sm border border-border bg-background px-3">
            <span className="h-1.5 w-16 rounded-full bg-muted-foreground/30" />
            <span className="flex gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
            </span>
          </div>
        </BuildZone>
      </div>
    </MockFrame>
  );
}
