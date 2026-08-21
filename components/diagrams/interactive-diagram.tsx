"use client";

import { RotateCcw } from "lucide-react";
import { animate, motion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Ref,
  type ReactNode,
  type RefObject,
} from "react";

/* --------------------------------------------------------------------------
 * Shared building blocks for the interactive "build it on hover" service
 * diagrams. Each diagram starts empty; hovering / focusing / tapping a zone
 * draws its outline, then reveals the real content, which stays in place.
 * ------------------------------------------------------------------------ */

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Build-state hook. Keys are opaque strings owned by each diagram. */
export function useBuild(): {
  built: Set<string>;
  build: (key: string) => void;
  reset: () => void;
  anyBuilt: boolean;
} {
  const [built, setBuilt] = useState<Set<string>>(new Set());
  const build = useCallback((key: string): void => {
    setBuilt((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  }, []);
  const reset = useCallback((): void => setBuilt(new Set()), []);
  return { built, build, reset, anyBuilt: built.size > 0 };
}

/**
 * Auto-builds the given zone keys in sequence the first time the returned ref
 * enters the viewport, so the diagram assembles itself even without hover
 * (e.g. on mobile). Hover / tap / reset still work afterwards. Pass a stable
 * `keys` array (module constant) to avoid re-running the effect each render.
 */
export function useAutoBuild(
  build: (key: string) => void,
  keys: string[],
  opts?: { staggerMs?: number; startDelayMs?: number },
): RefObject<HTMLDivElement | null> {
  const ref = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const stagger = opts?.staggerMs ?? 600;
  const startDelay = opts?.startDelayMs ?? 250;

  useEffect(() => {
    const el = ref.current;
    if (!el || startedRef.current) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timers: number[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();
        keys.forEach((key, i) => {
          const delay = prefersReduced ? 0 : startDelay + i * stagger;
          timers.push(window.setTimeout(() => build(key), delay));
        });
      },
      { threshold: 0.35 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [build, keys, stagger, startDelay]);

  return ref;
}

/**
 * A hoverable region that draws its outline, then reveals `children`.
 *
 * IMPORTANT: this lives at module scope on purpose. Declaring an animated
 * component inline inside a parent makes React remount it on every parent
 * render, which replays the draw-in of already-built zones.
 */
export function BuildZone({
  zoneKey,
  label,
  isBuilt,
  onBuild,
  prefersReduced,
  className,
  revealDelay = 0.55,
  children,
}: {
  zoneKey: string;
  label: string;
  isBuilt: boolean;
  onBuild: (key: string) => void;
  prefersReduced: boolean;
  className?: string;
  revealDelay?: number;
  children: ReactNode;
}): ReactNode {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Construir ${label}`}
      aria-pressed={isBuilt}
      onMouseEnter={() => onBuild(zoneKey)}
      onFocus={() => onBuild(zoneKey)}
      onClick={() => onBuild(zoneKey)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onBuild(zoneKey);
        }
      }}
      className={`focus-ring relative cursor-pointer ${className ?? ""}`}
    >
      {isBuilt ? (
        <div className="relative h-full w-full">
          {prefersReduced ? null : (
            <svg
              className="pointer-events-none absolute inset-0 z-10 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              fill="none"
              aria-hidden="true"
            >
              <motion.rect
                x="1"
                y="1"
                width="98"
                height="98"
                className="text-primary"
                stroke="currentColor"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1, opacity: [1, 1, 0] }}
                transition={{
                  pathLength: { duration: 0.75, ease: "easeInOut" },
                  opacity: { duration: 1.2, times: [0, 0.62, 1], ease: "easeIn" },
                }}
              />
            </svg>
          )}
          <motion.div
            className="h-full w-full"
            initial={prefersReduced ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: prefersReduced ? 0 : 0.4,
              ease: EASE,
              delay: prefersReduced ? 0 : revealDelay,
            }}
          >
            {children}
          </motion.div>
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-sm border border-dashed border-border/70 bg-muted/20 px-1 text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 transition-colors hover:border-primary/60 hover:text-primary">
          {label}
        </div>
      )}
    </div>
  );
}

/** A line/connector that fills with brand blue once `active`. */
export function Connector({
  active,
  prefersReduced,
  vertical = false,
  className,
}: {
  active: boolean;
  prefersReduced: boolean;
  vertical?: boolean;
  className?: string;
}): ReactNode {
  return (
    <div
      className={`relative shrink-0 bg-border ${
        vertical ? "w-px" : "h-px"
      } ${className ?? ""}`}
    >
      <motion.div
        className={`absolute bg-primary ${
          vertical ? "inset-x-0 top-0" : "inset-y-0 left-0"
        }`}
        initial={
          prefersReduced
            ? false
            : vertical
              ? { height: 0 }
              : { width: 0 }
        }
        animate={
          vertical
            ? { height: active ? "100%" : 0 }
            : { width: active ? "100%" : 0 }
        }
        transition={{ duration: prefersReduced ? 0 : 0.5, ease: EASE }}
      />
    </div>
  );
}

/** Reusable window chrome (macOS-style) with a hint overlay and reset control. */
export function MockFrame({
  title,
  hint,
  frameClassName,
  anyBuilt,
  onReset,
  viewportClassName,
  containerRef,
  children,
}: {
  /** When omitted, a neutral URL pill is shown (browser look). */
  title?: string;
  /** Overlay shown until the first zone is built. Omit for diagrams that assemble themselves. */
  hint?: string;
  /** Overrides the outer width constraint. */
  frameClassName?: string;
  anyBuilt: boolean;
  onReset: () => void;
  viewportClassName?: string;
  /** Attached to the outer container — used by `useAutoBuild` for in-view detection. */
  containerRef?: Ref<HTMLDivElement>;
  children: ReactNode;
}): ReactNode {
  return (
    <div
      ref={containerRef}
      className={`mx-auto w-full ${frameClassName ?? "max-w-[560px]"}`}
    >
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-xl shadow-black/[0.06]">
        <div className="flex h-9 items-center gap-1.5 border-b border-border px-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          {title ? (
            <span className="ml-3 text-xs font-medium text-muted-foreground">
              {title}
            </span>
          ) : (
            <div className="mx-3 h-4 w-full max-w-[240px] rounded-full bg-muted" />
          )}
          {anyBuilt ? (
            <button
              type="button"
              onClick={onReset}
              aria-label="Reiniciar"
              className="focus-ring ml-auto flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ) : null}
        </div>

        <div className={`relative ${viewportClassName ?? "h-[300px] sm:h-[340px]"}`}>
          {hint && !anyBuilt ? (
            <div className="pointer-events-none absolute inset-x-0 top-3 z-10 flex justify-center">
              <span className="rounded-full border border-border bg-background/90 px-3 py-1 text-[11px] font-medium text-muted-foreground shadow-sm">
                {hint}
              </span>
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}

/**
 * Counts from 0 up to `to` once mounted, so revealed figures land instead of
 * appearing. Renders the final value immediately when motion is reduced.
 */
export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  delay = 0,
  prefersReduced,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  delay?: number;
  prefersReduced: boolean;
}): ReactNode {
  const [value, setValue] = useState(prefersReduced ? to : 0);

  useEffect(() => {
    if (prefersReduced) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 0.9,
      delay,
      ease: EASE,
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [to, delay, prefersReduced]);

  return (
    <>
      {prefix}
      {value.toLocaleString("es", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </>
  );
}
