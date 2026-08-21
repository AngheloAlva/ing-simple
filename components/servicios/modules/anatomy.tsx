"use client";

import { PanelReportability } from "@/components/panels/reportability";
import { WindowFrame } from "@/components/window-frame";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type Zone = {
  id: string;
  label: string;
  title: string;
  desc: string;
  /** Highlight box over the window frame, in percentages (lg viewports). */
  box: { top: string; left: string; width: string; height: string };
};

const ZONES: Zone[] = [
  {
    id: "kpis",
    label: "KPIs",
    title: "Indicadores ejecutivos de un vistazo",
    desc: "Los números que la gerencia necesita, arriba y sin buscar: presupuesto, real, desviación y proyección. Definimos contigo cuáles son y contra qué meta se comparan.",
    box: { top: "12%", left: "1.5%", width: "97%", height: "17%" },
  },
  {
    id: "tendencia",
    label: "Tendencia",
    title: "La historia detrás del número",
    desc: "Presupuesto vs. real mes a mes, con proyección al cierre. No solo cuánto llevas: hacia dónde vas si nada cambia. Ideal para anticiparse, no para lamentarse.",
    box: { top: "30.5%", left: "1.5%", width: "64%", height: "33%" },
  },
  {
    id: "desviaciones",
    label: "Desviaciones",
    title: "Dónde se abre la brecha",
    desc: "El puente presupuesto → real muestra qué áreas explican la diferencia y cuánto aporta cada una. Se acabó el 'ver quién sabe por qué estamos abajo'.",
    box: { top: "30.5%", left: "67%", width: "31.5%", height: "33%" },
  },
  {
    id: "detalle",
    label: "Detalle",
    title: "Del resumen al detalle en un click",
    desc: "Cada área con su ejecución y desviación. Los tableros se navegan con drill-down: partes en la foto general y llegas a la fila que explica el problema.",
    box: { top: "65.5%", left: "1.5%", width: "97%", height: "32%" },
  },
  {
    id: "filtros",
    label: "Filtros",
    title: "Una fuente, muchas vistas",
    desc: "Escenario, período, área: cada persona filtra el mismo modelo de datos y ve su versión, sin duplicar planillas ni pedirle el archivo a nadie.",
    box: { top: "3.5%", left: "55%", width: "43.5%", height: "7%" },
  },
];

export function ModuleAnatomy(): ReactNode {
  const [activeId, setActiveId] = useState<string>(ZONES[0]?.id ?? "kpis");
  const active =
    ZONES.find((zone) => zone.id === activeId) ?? (ZONES[0] as Zone);

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <p className="text-sm font-medium text-muted-foreground">
          Anatomía de un dashboard
        </p>
        <h2 className="mt-4 text-balance font-serif text-3xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          Recorre un tablero real,{" "}
          <span className="font-sans font-semibold tracking-tight">
            pieza por pieza
          </span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
          Este es el tipo de reporte que construimos. Explora cada zona y mira
          qué resuelve.
        </p>
      </div>

      <div className="relative">
        <WindowFrame label="Ejecución presupuestaria — Power BI">
          <PanelReportability />
        </WindowFrame>

        {/* Zone highlight — desktop only; percentages track the lg layout */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-7 bottom-0 mx-auto hidden max-w-[1100px] lg:block"
        >
          <AnimatePresence>
            <motion.div
              key={active.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute border-2 border-primary/70 bg-primary/[0.04]"
              style={{ ...active.box }}
            >
              <span className="absolute -left-px -top-px h-2 w-2 border-l-2 border-t-2 border-primary" />
              <span className="absolute -right-px -top-px h-2 w-2 border-r-2 border-t-2 border-primary" />
              <span className="absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 border-primary" />
              <span className="absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 border-primary" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Zone selector + explanation */}
      <div className="mx-auto mt-8 max-w-[1100px]">
        <div
          role="tablist"
          aria-label="Zonas del dashboard"
          className="flex flex-wrap items-center justify-center gap-2"
        >
          {ZONES.map((zone) => {
            const isActive = zone.id === activeId;
            return (
              <button
                key={zone.id}
                role="tab"
                aria-selected={isActive}
                aria-controls="anatomy-detail"
                type="button"
                onClick={() => setActiveId(zone.id)}
                onMouseEnter={() => setActiveId(zone.id)}
                className={`focus-ring border px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-dotted border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {zone.label}
              </button>
            );
          })}
        </div>

        <div
          id="anatomy-detail"
          role="tabpanel"
          className="relative mx-auto mt-6 max-w-2xl text-center"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active?.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
            >
              <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                {active?.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {active?.desc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
