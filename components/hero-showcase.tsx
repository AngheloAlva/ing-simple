"use client";

import { AnimatePresence, motion } from "motion/react";
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

const CYCLE_MS = 6000;

type ShowcaseItem = {
  id: string;
  /** Window title bar label. */
  label: string;
  /** Short tab name shown in the indicator row. */
  service: string;
  Panel: () => ReactNode;
};

const ITEMS: ShowcaseItem[] = [
  {
    id: "reportability",
    label: "Dashboard operacional",
    service: "Reportabilidad",
    Panel: PanelReportability,
  },
  {
    id: "web",
    label: "ERP a medida",
    service: "Soluciones Web",
    Panel: PanelWeb,
  },
  {
    id: "training",
    label: "Ruta de capacitación",
    service: "Capacitaciones",
    Panel: PanelTraining,
  },
  {
    id: "automation",
    label: "Flujo automatizado",
    service: "Automatizaciones",
    Panel: PanelAutomation,
  },
];

export function HeroShowcase(): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Progress is driven by a rAF loop that writes the bar width straight to the
  // DOM (no per-frame React state), so the fill stays perfectly smooth and is
  // never restarted by an unrelated re-render. Pause is a plain ref toggled on
  // hover only — deliberately NOT on focus, since a mouse click leaves the tab
  // focused and a focus-pause would freeze the bar until the next blur.
  const fillRef = useRef<HTMLSpanElement | null>(null);
  const pausedRef = useRef(false);

  const select = useCallback((index: number) => {
    setActiveIndex(((index % ITEMS.length) + ITEMS.length) % ITEMS.length);
  }, []);

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
    [activeIndex, select]
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

  return (
    <div
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* Persistent window frame: only the inner panel content crossfades,
          layered on the frame's solid background. Because the frame itself
          never fades, the busy hero backdrop can't bleed through mid-
          transition, and the title label + active tab stay in sync with the
          incoming panel (no `mode="wait"` lag or rapid-change hang). */}
      <WindowFrame label={active.label}>
        <div className="relative h-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={active.id}
              role="tabpanel"
              id={`hero-panel-${active.id}`}
              aria-labelledby={`hero-tab-${active.id}`}
              className="absolute inset-0 bg-background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
            >
              <ActivePanel />
            </motion.div>
          </AnimatePresence>
        </div>
      </WindowFrame>

      {/* Indicators */}
      <div
        role="tablist"
        aria-label="Servicios de IngSimple"
        className="mx-auto mt-6 grid max-w-[1100px] grid-cols-2 gap-3 sm:grid-cols-4"
      >
        {ITEMS.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`hero-tab-${item.id}`}
              aria-selected={isActive}
              aria-controls={`hero-panel-${item.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={onTabKeyDown}
              className="focus-ring group flex flex-col gap-2 text-left"
            >
              <span
                className={`text-[13px] font-medium tracking-tight transition-colors ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              >
                {item.service}
              </span>

              {/* Flat rectangular track — sharp corners, no radius. */}
              <span className="relative block h-1 w-full overflow-hidden bg-border">
                {isActive ? (
                  <span
                    ref={fillRef}
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: prefersReducedMotion ? "100%" : "0%" }}
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
