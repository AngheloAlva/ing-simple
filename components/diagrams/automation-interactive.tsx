"use client";

import {
  BuildZone,
  Connector,
  MockFrame,
  useAutoBuild,
  useBuild,
} from "@/components/diagrams/interactive-diagram";
import { useReducedMotion } from "@/lib/motion";
import { Check, Play, Settings2, X } from "lucide-react";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Automatizaciones — a flow that wires itself node by node as the visitor
 * hovers: trigger → process → approved / rejected branch.
 * ------------------------------------------------------------------------ */

const KEYS = ["trigger", "process", "approved", "rejected"];

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

  const branchActive = built.has("approved") || built.has("rejected");

  return (
    <MockFrame
      title="Flujo automatizado"
      hint="Pasa el mouse para conectar el flujo →"
      anyBuilt={anyBuilt}
      onReset={reset}
      containerRef={containerRef}
    >
      <div className="flex h-full items-stretch gap-1.5 p-3">
        {/* Trigger */}
        <BuildZone {...zone("trigger")} label="Disparador" className="flex-1">
          <div className="flex h-full flex-col justify-center gap-1.5 rounded-md border border-border bg-background p-2.5">
            <span className="flex items-center gap-1.5">
              <Play className="h-3 w-3 text-primary" aria-hidden="true" />
              <span className="h-1.5 w-10 rounded-full bg-foreground/50" />
            </span>
            <span className="h-1.5 w-full rounded-full bg-muted-foreground/25" />
            <span className="h-1.5 w-2/3 rounded-full bg-muted-foreground/25" />
          </div>
        </BuildZone>

        <Connector
          active={built.has("process")}
          prefersReduced={prefersReduced}
          className="w-5 self-center sm:w-6"
        />

        {/* Process */}
        <BuildZone {...zone("process")} label="Proceso" className="flex-1">
          <div className="flex h-full flex-col justify-center gap-1.5 rounded-md border border-border bg-background p-2.5">
            <span className="flex items-center gap-1.5">
              <Settings2 className="h-3 w-3 text-primary" aria-hidden="true" />
              <span className="h-1.5 w-10 rounded-full bg-foreground/50" />
            </span>
            <span className="h-1.5 w-full rounded-full bg-muted-foreground/25" />
            <span className="h-1.5 w-2/3 rounded-full bg-muted-foreground/25" />
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
            <div className="flex h-full flex-col justify-center gap-1.5 rounded-md border border-primary/50 bg-background p-2.5">
              <span className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-primary" aria-hidden="true" />
                <span className="h-1.5 w-10 rounded-full bg-primary/60" />
              </span>
              <span className="h-1.5 w-3/4 rounded-full bg-muted-foreground/25" />
            </div>
          </BuildZone>

          <BuildZone {...zone("rejected")} label="Rechazado" className="flex-1">
            <div className="flex h-full flex-col justify-center gap-1.5 rounded-md border border-border bg-background p-2.5">
              <span className="flex items-center gap-1.5">
                <X className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
                <span className="h-1.5 w-10 rounded-full bg-foreground/40" />
              </span>
              <span className="h-1.5 w-3/4 rounded-full bg-muted-foreground/25" />
            </div>
          </BuildZone>
        </div>
      </div>
    </MockFrame>
  );
}
