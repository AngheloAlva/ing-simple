"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

interface Member {
  name: string;
  role: string;
  linkedin: string;
}

// TODO: replace with the real team (name / role / LinkedIn URL).
const members: Member[] = [
  { name: "Nombre Apellido", role: "Rol del integrante", linkedin: "#" },
  { name: "Nombre Apellido", role: "Rol del integrante", linkedin: "#" },
  { name: "Nombre Apellido", role: "Rol del integrante", linkedin: "#" },
  { name: "Nombre Apellido", role: "Rol del integrante", linkedin: "#" },
  { name: "Nombre Apellido", role: "Rol del integrante", linkedin: "#" },
  { name: "Nombre Apellido", role: "Rol del integrante", linkedin: "#" },
];

export function NosotrosTeam() {
  const x = useMotionValue(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const maxScroll = useMotionValue(1);

  const progressScale = useTransform(x, (v) => {
    const max = maxScroll.get();
    if (max <= 0) return 1;
    return Math.min(1, Math.max(0, -v / max));
  });

  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      if (!track) return;
      const viewWidth = track.parentElement?.clientWidth ?? 0;
      maxScroll.set(Math.max(0, track.scrollWidth - viewWidth));
    };
    update();
    const ro = new ResizeObserver(update);
    if (trackRef.current) {
      ro.observe(trackRef.current);
      if (trackRef.current.parentElement) ro.observe(trackRef.current.parentElement);
    }
    return () => ro.disconnect();
  }, [maxScroll]);

  const targetX = useRef(0);
  const animRef = useRef<ReturnType<typeof animate> | null>(null);

  const step = () => {
    const first = trackRef.current?.firstElementChild as HTMLElement | null;
    const gap = 16;
    return (first?.offsetWidth ?? 300) + gap;
  };

  const runTo = (value: number) => {
    targetX.current = value;
    animRef.current?.stop();
    animRef.current = animate(x, value, { duration: 0.5, ease: [0.22, 1, 0.36, 1] });
  };

  const prev = () => {
    runTo(Math.min(0, targetX.current + step()));
  };
  const next = () => {
    const trackWidth = trackRef.current?.scrollWidth ?? 0;
    const viewWidth = trackRef.current?.parentElement?.clientWidth ?? 0;
    const min = Math.min(0, viewWidth - trackWidth);
    runTo(Math.max(min, targetX.current - step()));
  };

  return (
    <section className="w-full overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-[0.4fr_2fr] lg:gap-12">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex w-fit items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground lg:mt-2"
          >
            <span className="h-2 w-2 bg-[#2f80ff]" />
            EQUIPO
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl text-pretty font-serif text-xl font-normal leading-tight tracking-tight text-foreground sm:text-2xl md:text-3xl lg:text-4xl"
          >
            Un equipo apasionado por la tecnología, obsesionado con los detalles
            que la mayoría pasa por alto, y comprometido con entregar las
            soluciones que las organizaciones realmente necesitan.
          </motion.h2>
        </div>

        <div className="relative mt-12">
          <div className="overflow-hidden">
            <motion.div ref={trackRef} style={{ x }} className="flex gap-4">
              {members.map((m, i) => (
                <article
                  key={i}
                  className="flex h-[280px] w-[calc(100%-0px)] shrink-0 flex-col border border-border bg-card p-3 sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
                >
                  <div className="p-2">
                    <p className="text-lg font-medium text-foreground">
                      {m.name}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                      {m.role}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pl-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      LinkedIn
                    </span>
                    <a
                      href={m.linkedin}
                      target={m.linkedin === "#" ? undefined : "_blank"}
                      rel={m.linkedin === "#" ? undefined : "noopener noreferrer"}
                      className="grid h-9 w-9 place-items-center bg-[#2f80ff] text-white transition-opacity hover:opacity-90"
                      aria-label={`LinkedIn de ${m.name}`}
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="relative h-px flex-1 overflow-hidden bg-border">
              <motion.div
                className="absolute inset-y-0 left-0 right-0 origin-left bg-foreground"
                style={{ scaleX: progressScale }}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="grid h-10 w-10 place-items-center border border-border bg-card text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Anterior"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                className="grid h-10 w-10 place-items-center border border-border bg-card text-muted-foreground transition-colors hover:bg-muted"
                aria-label="Siguiente"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
