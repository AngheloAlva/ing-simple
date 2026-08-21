"use client";

import { CutButton } from "@/components/cut-button";
import {
  DUOTONE_BASE,
  DUOTONE_CONTAINER,
  DuotoneOverlay,
} from "@/components/duotone";
import { useReducedMotion } from "@/lib/motion";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode } from "react";

const IMAGES: string[] = [
  "/img/portfolio/is-360.png",
  "/img/portfolio/dashboard-reportes.png",
  "/img/portfolio/gis.png",
  "/img/portfolio/monitoreo-ambiental.png",
  "/img/portfolio/pipeline-operations-system.png",
  "/img/portfolio/auditoria-mockup.png",
  "/img/portfolio/aula-girasoles.png",
  "/img/portfolio/emprende-tu-vida.png",
  "/img/portfolio/inmobiliaria.png",
  "/img/portfolio/algorithm-system-playground.png",
  "/img/portfolio/game-demo.png",
  "/img/portfolio/turismochiletours/hero.png",
];

const COLUMNS: string[][] = [0, 1, 2].map((col) =>
  IMAGES.filter((_, i) => i % 3 === col),
);

/** Clamped 0→1 ramp across [from, to]; holds 0 before and 1 after. */
function ramp(value: number, from: number, to: number): number {
  if (value <= from) return 0;
  if (value >= to) return 1;
  return (value - from) / (to - from);
}


function DuotoneImage({ src }: { src: string }): ReactNode {
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden rounded-sm ${DUOTONE_CONTAINER}`}
    >
      <div
        style={{ backgroundImage: `url(${src})` }}
        className={`absolute inset-0 bg-cover bg-center ${DUOTONE_BASE}`}
      />
      <DuotoneOverlay />
    </div>
  );
}

function Heading(): ReactNode {
  return (
    <h2 className="mx-auto max-w-4xl text-balance font-serif text-4xl font-normal leading-[1.08] tracking-[-0.01em] sm:text-5xl lg:text-[3.5rem]">
      Del dato a la{" "}
      <span className="font-sans font-semibold tracking-tight">acción</span>, en
      proyectos reales
    </h2>
  );
}

function CallToAction(): ReactNode {
  return (
    <CutButton href="/portafolio" icon="arrow" className="mt-8">
      Ver portafolio
    </CutButton>
  );
}

type TileProps = {
  progress: MotionValue<number>;
  src: string;
  colIndex: number;
  pos: number;
  colLen: number;
};

function Tile({ progress, src, colIndex, pos, colLen }: TileProps): ReactNode {
  const fromTop = colIndex % 2 === 0;
  const isCenter = colIndex === 1;

  // Timings are packed into the first ~85% of the pin so the sequence
  // finishes with room to spare and the final headline-only frame is held
  // long enough to read.
  const order = fromTop ? colLen - 1 - pos : pos;
  const start = 0.02 + order * 0.04;
  const end = start + 0.24;

  const revealY = useTransform(
    progress,
    [start, end],
    [fromTop ? "-90vh" : "90vh", "0vh"],
    { clamp: true },
  );

  const mid = Math.floor(colLen / 2);
  const spreadTo = isCenter ? `${(pos < mid ? -1 : 1) * 42}%` : "0%";
  const spreadY = useTransform(progress, [0.48, 0.86], ["0%", spreadTo], {
    clamp: true,
  });

  return (
    <motion.div style={{ y: revealY }} className="will-change-transform">
      <motion.div style={{ y: spreadY }} className="will-change-transform">
        <DuotoneImage src={src} />
      </motion.div>
    </motion.div>
  );
}

function StaticCoverage(): ReactNode {
  return (
    <section
      id="platform"
      className="mx-auto max-w-[1440px] px-5 py-32 sm:px-8 sm:py-44 lg:px-10"
    >
      <div className="text-center">
        <Heading />
        <div className="flex justify-center">
          <CallToAction />
        </div>
      </div>

      <div className="mx-auto mt-14 grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
        {IMAGES.map((src) => (
          <DuotoneImage key={src} src={src} />
        ))}
      </div>
    </section>
  );
}

export function CoverageGrid(): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0.46, 0.88], [1, 2.05]);
  const leftX = useTransform(scrollYProgress, [0.48, 0.88], ["0%", "-55%"]);
  const rightX = useTransform(scrollYProgress, [0.48, 0.88], ["0%", "55%"]);

  // Opacities use the callback form of `useTransform`. The keyframe-array
  // form does not hold its end value here once the pin completes, which made
  // the whole panel snap to invisible in a single scroll step.
  const gridOpacity = useTransform(scrollYProgress, (p) =>
    // Fade in over the first sliver, then dissolve gradually while the tiles
    // zoom past the frame, so only the headline is left at the end.
    p < 0.02 ? ramp(p, 0, 0.02) : 1 - ramp(p, 0.56, 0.88),
  );

  const titleOpacity = useTransform(scrollYProgress, (p) =>
    ramp(p, 0.02, 0.12),
  );
  const titleY = useTransform(
    scrollYProgress,
    [0.02, 0.12, 0.56, 0.78],
    [28, 0, 0, -8],
  );

  const bodyOpacity = useTransform(scrollYProgress, (p) => ramp(p, 0.54, 0.72));
  const bodyY = useTransform(scrollYProgress, [0.54, 0.72], [16, 0]);
  const bodyPointer = useTransform(scrollYProgress, (v) =>
    v > 0.56 ? "auto" : "none",
  );

  if (prefersReducedMotion) {
    return <StaticCoverage />;
  }

  return (
    <section id="platform" ref={sectionRef} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-background">
        <motion.div
          style={{ opacity: gridOpacity }}
          className="absolute inset-0 z-0 flex items-center justify-center"
        >
          <motion.div
            style={{ scale }}
            className="w-[min(86vw,760px)] will-change-transform"
          >
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {COLUMNS.map((col, colIndex) => (
                <motion.div
                  key={colIndex}
                  style={{
                    x: colIndex === 0 ? leftX : colIndex === 2 ? rightX : 0,
                  }}
                  className="flex flex-col gap-3 will-change-transform sm:gap-4"
                >
                  {col.map((src, pos) => (
                    <Tile
                      key={src}
                      progress={scrollYProgress}
                      src={src}
                      colIndex={colIndex}
                      pos={pos}
                      colLen={col.length}
                    />
                  ))}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
          <motion.div style={{ opacity: titleOpacity, y: titleY }}>
            <Heading />
          </motion.div>

          <motion.div
            style={{ opacity: bodyOpacity, y: bodyY, pointerEvents: bodyPointer }}
            className="flex flex-col items-center"
          >
            <CallToAction />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
