"use client";

import { AnimatePresence, motion } from "motion/react";
import { Pause, Play } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { PanelAutomation } from "@/components/panels/automation";
import { PanelReportability } from "@/components/panels/reportability";
import { PanelTraining } from "@/components/panels/training";
import { PanelWeb } from "@/components/panels/web";
import { WindowFrame } from "@/components/window-frame";
import { softEase, useReducedMotion } from "@/lib/motion";
import { SERVICES } from "@/lib/services";

const CYCLE_MS = 6000;

export const PANEL_BY_SLUG: Record<string, () => ReactNode> = {
  automatizaciones: PanelAutomation,
  "desarrollo-web": PanelWeb,
  reportabilidad: PanelReportability,
  capacitaciones: PanelTraining,
};

const ITEMS = SERVICES.map((service) => {
  const Panel = PANEL_BY_SLUG[service.slug];
  if (!Panel) throw new Error(`Missing showcase panel for service: ${service.slug}`);
  return { service, Panel };
});

/**
 * One factual sentence per panel, for assistive technology.
 *
 * The panels are illustrations built from fabricated records, so their contents
 * are hidden from the accessibility tree: announcing invented totals, dates and
 * "1 - 10 de 2.945" counters as real content is worse than saying nothing.
 * These descriptions replace them.
 */
export const PANEL_DESCRIPTION: Record<string, string> = {
  reportabilidad:
    "Ejemplo de dashboard operacional: indicadores de plan y gestión, ejecución mensual y desviación por área.",
  capacitaciones:
    "Ejemplo de ruta de capacitación: cursos con su avance y el certificado que se emite al completarla.",
  "desarrollo-web":
    "Ejemplo de sistema de gestión a medida: listado de solicitudes con estado por componente y por proyecto.",
  automatizaciones:
    "Ejemplo de flujo automatizado: una solicitud pasa por validación, condición y aviso al equipo.",
};

export function HeroShowcase(): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [userPaused, setUserPaused] = useState(false);
  const userPausedRef = useRef(false);
  const hoveringRef = useRef(false);
  const tablistRef = useRef<HTMLDivElement | null>(null);
  const [scrollShadows, setScrollShadows] = useState({ start: false, end: false });

  // Progress is driven by a rAF loop that writes the bar width straight to the
  // DOM (no per-frame React state), so the fill stays perfectly smooth and is
  // never restarted by an unrelated re-render. The loop reads one ref for
  // both persistent user pause and temporary hover pause.
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const pausedRef = useRef(false);

  const select = useCallback((index: number) => {
    setActiveIndex(((index % ITEMS.length) + ITEMS.length) % ITEMS.length);
  }, []);

  const syncScrollShadows = useCallback(() => {
    const list = tablistRef.current;
    if (!list) return;
    const max = list.scrollWidth - list.clientWidth;
    setScrollShadows({
      start: list.scrollLeft > 1,
      end: max > 1 && list.scrollLeft < max - 1,
    });
  }, []);

  // Keep the active tab inside the strip by moving the strip's own scrollLeft,
  // never the document. The carousel also advances while the reader is far
  // below the hero, and `scrollIntoView` would drag the page back up to the
  // showcase on every single cycle.
  useEffect(() => {
    const list = tablistRef.current;
    const tab = tabRefs.current[activeIndex];
    if (!list || !tab) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const offset = tabRect.left - listRect.left;

    if (offset < 0) list.scrollLeft += offset;
    else if (offset + tabRect.width > listRect.width) {
      list.scrollLeft += offset + tabRect.width - listRect.width;
    }
    syncScrollShadows();
  }, [activeIndex, syncScrollShadows]);

  // Edge fades are the only cue that the strip scrolls: without them a narrow
  // viewport shows two of the four services with no sign that more exist.
  useEffect(() => {
    const list = tablistRef.current;
    if (!list) return;

    syncScrollShadows();
    list.addEventListener("scroll", syncScrollShadows, { passive: true });
    const observer = new ResizeObserver(syncScrollShadows);
    observer.observe(list);

    return () => {
      list.removeEventListener("scroll", syncScrollShadows);
      observer.disconnect();
    };
  }, [syncScrollShadows]);

  // Auto-advance: accumulate elapsed time only while unpaused; when the active
  // panel's fill reaches 100%, move to the next one. Re-runs (and resets) on
  // every activeIndex change, so a click/keyboard jump restarts cleanly.
  useEffect(() => {
    if (prefersReducedMotion) return;

    const el = fillRef.current;
    if (el) el.style.width = "0%";

    let raf = 0;
    let last: number | null = null;
    let elapsed = 0;

    const tick = (now: number): void => {
      if (last === null) last = now;
      // Clamp so a backgrounded tab (throttled rAF) doesn't jump on return.
      const delta = Math.min(now - last, 100);
      last = now;

      if (!pausedRef.current) elapsed += delta;
      const progress = Math.min(elapsed / CYCLE_MS, 1);
      if (el) el.style.width = `${progress * 100}%`;

      if (progress >= 1) {
        setActiveIndex((i) => (i + 1) % ITEMS.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeIndex, prefersReducedMotion]);

  const onTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        const next = (activeIndex + 1) % ITEMS.length;
        select(next);
        tabRefs.current[next]?.focus();
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        const prev = (activeIndex - 1 + ITEMS.length) % ITEMS.length;
        select(prev);
        tabRefs.current[prev]?.focus();
      }
    },
    [activeIndex, select],
  );

  // Short, symmetric crossfade of the inner panel content, composited over
  // the frame's solid background so the busy hero backdrop never bleeds
  // through. Kept brief so the mid-transition overlap between two panels is
  // barely perceptible. The transition *style* is intentionally simple and
  // easy to swap (fade / slide / clip-wipe) once the visual direction is set.
  const fadeTransition = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.3, ease: softEase };

  const active = ITEMS[activeIndex];
  if (!active) return null;
  const ActivePanel = active.Panel;
  const id = active.service.slug;

  return (
    <div
      onMouseEnter={() => {
        hoveringRef.current = true;
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        hoveringRef.current = false;
        pausedRef.current = userPausedRef.current;
      }}
    >
      {/* Persistent window frame: only the inner panel content crossfades,
          layered on the frame's solid background. Because the frame itself
          never fades, the busy hero backdrop can't bleed through mid-
          transition, and the active tab stays in sync with the incoming panel
          (no `mode="wait"` lag or rapid-change hang). */}
      <WindowFrame
        tabs={
          <>
            <div
              ref={tablistRef}
              role="tablist"
              aria-label="Servicios de Ingeniería Simple"
              className="flex min-w-0 flex-1 items-stretch overflow-x-auto"
              style={{
                maskImage: tablistMask(scrollShadows),
                WebkitMaskImage: tablistMask(scrollShadows),
              }}
            >
              {/* Natural tab width (shrink-0) keeps the strip scrollable below
                  `lg`; on desktop `lg:flex-1` lets the four tabs divide the
                  space left of the pause button equally. */}
              {ITEMS.map((item, index) => {
                const isActive = index === activeIndex;
                const tabId = item.service.slug;
                return (
                  <button
                    key={tabId}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`hero-tab-${tabId}`}
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(index)}
                    onKeyDown={onTabKeyDown}
                    className={`focus-ring relative shrink-0 px-3 text-center text-[13px] font-medium tracking-tight transition-colors lg:flex-1 ${isActive ? "bg-foreground/10 text-foreground" : "text-foreground/70 hover:text-foreground"}`}
                  >
                    {item.service.shortName}
                    {isActive && (
                      <span
                        ref={fillRef}
                        className="bg-primary absolute bottom-0 left-0 h-0.5"
                        style={{ width: prefersReducedMotion ? "100%" : "0%" }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
            {!prefersReducedMotion && (
              <button
                type="button"
                aria-label={
                  userPaused
                    ? "Reanudar el recorrido de servicios"
                    : "Pausar el recorrido de servicios"
                }
                aria-pressed={userPaused}
                onClick={() => {
                  const next = !userPausedRef.current;
                  userPausedRef.current = next;
                  pausedRef.current = next || hoveringRef.current;
                  setUserPaused(next);
                }}
                className="focus-ring border-border/60 text-foreground/70 hover:text-foreground flex w-10 shrink-0 items-center justify-center border-l"
              >
                {userPaused ? (
                  <Play size={14} aria-hidden="true" />
                ) : (
                  <Pause size={14} aria-hidden="true" />
                )}
              </button>
            )}
          </>
        }
      >
        <div className="relative h-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={id}
              role="tabpanel"
              id={`hero-panel-${id}`}
              aria-labelledby={`hero-tab-${id}`}
              className="bg-background absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <p className="sr-only">
                {`${active.service.shortName}: ${PANEL_DESCRIPTION[id] ?? "Ejemplo de lo que construimos para tu operación."}`}
              </p>
              <div aria-hidden="true" className="h-full">
                <ActivePanel />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </WindowFrame>
    </div>
  );
}

/**
 * Edge fades for the tab strip, built as a mask so they never paint over the
 * tabs. Only the sides that actually hide content are faded.
 */
function tablistMask({ start, end }: { start: boolean; end: boolean }): string {
  const head = start ? "transparent 0, black 16px" : "black 0";
  const tail = end ? "black calc(100% - 16px), transparent 100%" : "black 100%";
  return `linear-gradient(to right, ${head}, ${tail})`;
}
