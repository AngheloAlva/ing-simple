"use client";

import {
  BuildZone,
  CountUp,
  MockFrame,
  useAutoBuild,
  useBuild,
} from "@/components/diagrams/interactive-diagram";
import { useReducedMotion } from "@/lib/motion";
import { Gauge, Lock, Smartphone } from "lucide-react";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Soluciones Web — a browser that builds a real, labelled site section by
 * section and closes with the quality signals the build ships with.
 * ------------------------------------------------------------------------ */

const NAV = ["Inicio", "Servicios", "Casos", "Contacto"];

const CARDS = [
  { title: "Catálogo", desc: "Productos y stock al día" },
  { title: "Reservas", desc: "Agenda en línea" },
  { title: "Panel", desc: "Métricas del negocio" },
];

const SIGNALS = [
  { icon: Gauge, label: "PageSpeed", to: 98, suffix: "" },
  { icon: Smartphone, label: "Responsive", to: 100, suffix: "%" },
  { icon: Lock, label: "HTTPS", to: 100, suffix: "%" },
];

const KEYS = ["header", "hero", "cards", "señales"];

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
      frameClassName="max-w-[680px]"
      viewportClassName="h-[420px] sm:h-[490px]"
      anyBuilt={anyBuilt}
      onReset={reset}
      containerRef={containerRef}
    >
      <div className="flex h-full flex-col gap-2.5 p-3.5">
        {/* Header */}
        <BuildZone {...zone("header")} label="Encabezado" className="h-11 shrink-0">
          <div className="flex h-full items-center gap-3 rounded-sm border border-border bg-background px-3">
            <span className="flex items-center gap-1.5">
              <span className="h-4 w-4 rounded-sm bg-primary" />
              <span className="text-[11px] font-semibold tracking-tight text-foreground">
                Tu marca
              </span>
            </span>
            <span className="ml-auto hidden items-center gap-3.5 sm:flex">
              {NAV.map((item) => (
                <span key={item} className="text-[10px] text-muted-foreground">
                  {item}
                </span>
              ))}
            </span>
            <span className="inline-flex h-6 items-center rounded-sm bg-primary px-2.5 text-[10px] font-medium text-primary-foreground">
              Cotizar
            </span>
          </div>
        </BuildZone>

        {/* Hero */}
        <BuildZone {...zone("hero")} label="Portada" className="min-h-0 flex-1">
          <div className="flex h-full flex-col justify-center gap-2 rounded-sm border border-border bg-background px-5">
            <span className="text-lg font-semibold leading-tight tracking-tight text-foreground">
              Tu negocio, en línea
            </span>
            <span className="max-w-[85%] text-[11px] leading-relaxed text-muted-foreground">
              Un sitio rápido, medible y pensado para que tus clientes te
              encuentren y te compren.
            </span>
            <span className="mt-1.5 flex gap-2">
              <span className="inline-flex h-7 items-center rounded-sm bg-primary px-3 text-[10px] font-medium text-primary-foreground">
                Empezar
              </span>
              <span className="inline-flex h-7 items-center rounded-sm border border-border px-3 text-[10px] font-medium text-foreground">
                Ver casos
              </span>
            </span>
          </div>
        </BuildZone>

        {/* Content cards */}
        <BuildZone {...zone("cards")} label="Contenido" className="h-[92px] shrink-0">
          <div className="grid h-full grid-cols-3 gap-2">
            {CARDS.map((card) => (
              <div
                key={card.title}
                className="flex flex-col justify-center gap-1 rounded-sm border border-border bg-background px-2.5 py-2"
              >
                <span className="h-1 w-6 rounded-full bg-primary" />
                <span className="mt-0.5 truncate text-[11px] font-medium text-foreground">
                  {card.title}
                </span>
                <span className="text-[10px] leading-tight text-muted-foreground">
                  {card.desc}
                </span>
              </div>
            ))}
          </div>
        </BuildZone>

        {/* Quality signals */}
        <BuildZone {...zone("señales")} label="Calidad" className="h-[70px] shrink-0">
          <div className="grid h-full grid-cols-3 gap-2">
            {SIGNALS.map((signal, i) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.label}
                  className="flex items-center gap-2.5 rounded-sm border border-brand-green/30 bg-brand-green/5 px-3"
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-brand-green-text"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold tracking-tight tabular-nums text-brand-green-text">
                      <CountUp
                        to={signal.to}
                        suffix={signal.suffix}
                        delay={0.6 + i * 0.1}
                        prefersReduced={prefersReduced}
                      />
                    </span>
                    <span className="block truncate text-[10px] leading-tight text-muted-foreground">
                      {signal.label}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </BuildZone>
      </div>
    </MockFrame>
  );
}
