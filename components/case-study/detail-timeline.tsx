"use client";

import type {
  CaseStudy,
  CaseStudyMilestone,
  CaseStudyMilestoneIcon,
} from "@/lib/portfolio-data";
import { softEase } from "@/lib/motion";
import {
  Activity,
  Code2,
  Handshake,
  Rocket,
  TestTube,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface DetailTimelineProps {
  caseStudy: CaseStudy;
  accent: string;
}

const ICON_MAP: Record<CaseStudyMilestoneIcon, LucideIcon> = {
  kickoff: Handshake,
  build: Code2,
  beta: TestTube,
  launch: Rocket,
  current: Activity,
};

function Node({
  progress,
  at,
  Icon,
  isCurrent,
  accent,
}: {
  progress: MotionValue<number>;
  at: number;
  Icon: LucideIcon;
  isCurrent: boolean;
  accent: string;
}): ReactNode {
  const start = Math.max(0, at - 0.12);
  const mid = Math.min(1, at + 0.02);
  const scale = useTransform(progress, [start, mid], [0.6, 1]);
  const opacity = useTransform(progress, [start, mid], [0.25, 1]);
  const [reached, setReached] = useState(false);

  useMotionValueEvent(progress, "change", (v) => {
    setReached(v >= mid - 0.001);
  });

  const isActive = reached || isCurrent;

  return (
    <div className="relative grid place-items-center">
      {/* Mask so the rail does not show through the node */}
      <span className="absolute h-14 w-14 bg-background" />
      <span className="absolute h-14 w-14 border border-border" />
      {isActive ? (
        <motion.span
          aria-hidden="true"
          className="absolute h-12 w-12"
          style={{ backgroundColor: accent }}
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{
            duration: 1.6,
            repeat: isCurrent ? Infinity : 0,
            ease: "easeOut",
          }}
        />
      ) : null}
      <motion.span
        style={{
          scale,
          opacity,
          backgroundColor: isActive ? accent : "var(--color-foreground)",
          color: isActive ? "#ffffff" : "var(--color-background)",
        }}
        transition={{ duration: 0.35 }}
        className="relative grid h-12 w-12 place-items-center"
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </motion.span>
    </div>
  );
}

function Card({ milestone }: { milestone: CaseStudyMilestone }): ReactNode {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.6, ease: softEase }}
      className="w-full border border-border bg-background p-5 sm:p-6"
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {milestone.date}
      </span>
      <h3 className="mt-2 text-base font-semibold tracking-tight text-foreground sm:text-lg">
        {milestone.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {milestone.description}
      </p>
    </motion.article>
  );
}

export function DetailTimeline({
  caseStudy,
  accent,
}: DetailTimelineProps): ReactNode {
  const timeline = caseStudy.timeline;
  const ref = useRef<HTMLDivElement>(null);
  const firstNodeRef = useRef<HTMLDivElement>(null);
  const lastNodeRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useMotionValue(0);
  const [lineBounds, setLineBounds] = useState({ top: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const tick = () => {
      const container = ref.current;
      const first = firstNodeRef.current;
      const last = lastNodeRef.current;
      if (container && first && last) {
        const win = container.ownerDocument.defaultView ?? window;
        const vh =
          win.innerHeight || container.ownerDocument.documentElement.clientHeight;
        const containerRect = container.getBoundingClientRect();
        const firstRect = first.getBoundingClientRect();
        const lastRect = last.getBoundingClientRect();
        const firstCenterY = firstRect.top + firstRect.height / 2;
        const lastCenterY = lastRect.top + lastRect.height / 2;
        const activate = vh * 0.55;
        const span = lastCenterY - firstCenterY;
        if (span > 0) {
          const p = (activate - firstCenterY) / span;
          scrollYProgress.set(Math.min(1, Math.max(0, p)));
        }
        const top = firstCenterY - containerRect.top;
        const height = lastCenterY - firstCenterY;
        setLineBounds((prev) =>
          prev.top === top && prev.height === height ? prev : { top, height }
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [scrollYProgress]);

  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  if (!timeline || timeline.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="relative mx-auto flex w-full flex-col items-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          06 — Línea de tiempo
        </p>
        <h2 className="mt-5 text-balance text-center font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          Del{" "}
          <span className="font-sans font-semibold tracking-tight">
            kickoff a hoy
          </span>
        </h2>
        <p className="mt-4 max-w-sm text-center text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Cada hito del proyecto, desde el primer contacto hasta la operación
          actual.
        </p>

        <div ref={ref} className="relative mt-16 w-full sm:mt-24">
          <div
            aria-hidden="true"
            style={{ top: lineBounds.top, height: lineBounds.height }}
            className="absolute left-1/2 w-px -translate-x-1/2 border-l border-dashed border-border"
          />
          <motion.div
            aria-hidden="true"
            style={{
              top: lineBounds.top,
              height: lineBounds.height,
              scaleY: lineScale,
              transformOrigin: "top",
              backgroundColor: accent,
            }}
            className="absolute left-1/2 w-px -translate-x-1/2"
          />

          <div className="flex flex-col gap-12 sm:gap-16">
            {timeline.map((milestone, i) => {
              const Icon = ICON_MAP[milestone.icon];
              const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
              const at = i / Math.max(1, timeline.length - 1);
              const isFirst = i === 0;
              const isLast = i === timeline.length - 1;
              return (
                <div
                  key={`${milestone.date}-${milestone.title}`}
                  className="relative flex flex-col items-center md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-x-8 lg:gap-x-12"
                >
                  <div className="hidden md:col-start-1 md:block">
                    {side === "left" ? <Card milestone={milestone} /> : null}
                  </div>
                  <div
                    ref={isFirst ? firstNodeRef : isLast ? lastNodeRef : undefined}
                    className="relative z-10 md:col-start-2"
                  >
                    <Node
                      progress={scrollYProgress}
                      at={at}
                      Icon={Icon}
                      isCurrent={!!milestone.isCurrent}
                      accent={accent}
                    />
                  </div>
                  <div className="hidden md:col-start-3 md:block">
                    {side === "right" ? <Card milestone={milestone} /> : null}
                  </div>
                  <div className="mt-6 w-full md:hidden">
                    <Card milestone={milestone} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
