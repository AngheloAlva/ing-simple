import { Award, Check, Circle, CircleDot, Clock, Gauge, GraduationCap, Signal, User, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { motion, type Transition, type Variants } from "motion/react";
import { useStaggerEntrance } from "@/lib/motion";

type LessonStatus = "completed" | "current" | "pending";
type Lesson = { title: string; duration: string; status: LessonStatus };
type Module = { title: string; lessons: Lesson[] };
type Entrance = { variants: Variants; transition: Transition };

/** Seven entrance items: header, lesson, progress/certificate, four modules. */
export const ENTRANCE_STAGGER = 0.05;

const MODULES: Module[] = [
  {
    title: "Conectar y transformar datos",
    lessons: [
      { title: "Origen de datos y Power Query", duration: "35 min", status: "completed" },
      { title: "Consultas con Power Query", duration: "40 min", status: "completed" },
    ],
  },
  {
    title: "Modelado de datos",
    lessons: [
      { title: "Relaciones y tablas de fechas", duration: "30 min", status: "completed" },
      { title: "Esquema estrella", duration: "45 min", status: "completed" },
    ],
  },
  {
    title: "Medidas con DAX",
    lessons: [
      { title: "Medidas y KPIs", duration: "40 min", status: "completed" },
      { title: "Time intelligence", duration: "35 min", status: "current" },
    ],
  },
  {
    title: "Dashboards y publicación",
    lessons: [
      { title: "Tableros interactivos", duration: "45 min", status: "pending" },
      { title: "Publicación y actualización automática", duration: "30 min", status: "pending" },
    ],
  },
];

const COURSE = {
  title: "Power BI de básico a avanzado",
  audience: "Equipo de control de gestión",
  modality: "Online en vivo",
  duration: "4 semanas · 8 sesiones",
  level: "Básico a avanzado",
  instructor: "Instructor IngSimple",
} as const;

const LESSONS = MODULES.flatMap((module) => module.lessons);
const TOTAL_LESSONS = LESSONS.length;
const COMPLETED_LESSONS = LESSONS.filter((lesson) => lesson.status === "completed").length;
const OVERALL = Math.round((COMPLETED_LESSONS / TOTAL_LESSONS) * 100);
const CURRENT_LESSON = LESSONS.find((lesson) => lesson.status === "current")!;

type ModuleStatus = "completed" | "in-progress" | "pending";
function moduleStatus(module: Module): ModuleStatus {
  if (module.lessons.every((lesson) => lesson.status === "completed")) return "completed";
  if (module.lessons.some((lesson) => lesson.status === "current")) return "in-progress";
  return "pending";
}
const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  completed: "Completado", "in-progress": "En curso", pending: "Pendiente",
};
const META: { icon: LucideIcon; label: string }[] = [
  { icon: Signal, label: COURSE.modality },
  { icon: Clock, label: COURSE.duration },
  { icon: Gauge, label: COURSE.level },
  { icon: User, label: COURSE.instructor },
];

// Illustrative totals share a single source for bars, values and calculation.
const SALES = [{ month: "Abril", amount: 10000 }, { month: "Mayo", amount: 12000 }] as const;
const PREVIOUS = SALES[0].amount;
const CURRENT = SALES[1].amount;
const CHANGE = Math.round(((CURRENT - PREVIOUS) / PREVIOUS) * 100);
const formatAmount = (amount: number): string => new Intl.NumberFormat("es-CL").format(amount);

function Header({ entrance }: { entrance: Entrance }): ReactNode {
  return (
    <motion.div variants={entrance.variants} transition={entrance.transition}
      className="shrink-0 border-b border-border/60 px-4 py-3 sm:px-5">
      <div className="flex min-w-0 items-start gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10">
          <GraduationCap className="h-4 w-4 text-primary" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold leading-snug tracking-tight">{COURSE.title}</h2>
          <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{COURSE.audience}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {META.map(({ icon: Icon, label }) => (
          <span key={label} className="inline-flex items-center gap-1 text-[10px] leading-snug text-muted-foreground">
            <Icon className="h-3 w-3 shrink-0" strokeWidth={1.75} aria-hidden="true" />{label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function PracticalLesson({ entrance }: { entrance: Entrance }): ReactNode {
  return (
    <motion.section aria-label="Lección actual" variants={entrance.variants} transition={entrance.transition}
      className="min-w-0 rounded-lg border border-primary/25 bg-primary/5 p-3 sm:p-4 lg:flex lg:min-h-0 lg:flex-col">
      <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] font-medium text-primary">
        <span>Lección actual · {LESSONS.indexOf(CURRENT_LESSON) + 1} de {TOTAL_LESSONS}</span>
        <span>En curso · {CURRENT_LESSON.duration}</span>
      </div>
      <h3 className="mt-1 text-xl font-semibold leading-tight tracking-tight">{CURRENT_LESSON.title}</h3>
      <p className="mt-1 text-[12px] leading-snug text-muted-foreground">Compara las ventas con el mes anterior en Power BI.</p>
      <figure className="mt-3 rounded-lg border border-border/60 bg-background/80 p-3 lg:flex lg:min-h-0 lg:flex-1 lg:flex-col lg:p-4">
        <figcaption className="flex flex-wrap justify-between gap-1 text-[10px] text-muted-foreground">
          <span className="font-medium text-foreground">Ventas mensuales · u.m.</span><span>Datos ficticios</span>
        </figcaption>
        <dl className="mt-3 space-y-2 lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:space-y-4">
          {SALES.map(({ month, amount }) => (
            <div key={month} className="grid grid-cols-[2.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-[11px]">
              <dt className="text-muted-foreground">{month}</dt>
              <div className="h-3 rounded-full bg-muted lg:h-6" aria-hidden="true">
                <div className={`h-full rounded-full ${amount === CURRENT ? "bg-primary" : "bg-primary/35"}`} style={{ width: `${(amount / CURRENT) * 100}%` }} />
              </div>
              <dd className="text-right font-medium tabular-nums">{formatAmount(amount)}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-3 border-t border-border/60 pt-2">
          <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-2xl font-semibold tracking-tight tabular-nums text-primary">+{CHANGE}%</span>
            <span className="text-[11px] text-muted-foreground">Mayo vs. abril</span>
          </p>
          <p className="mt-1 text-[10px] tabular-nums text-muted-foreground">({formatAmount(CURRENT)} − {formatAmount(PREVIOUS)}) / {formatAmount(PREVIOUS)}</p>
        </div>
      </figure>
      <p className="mt-2 text-[11px] leading-snug text-muted-foreground">Aplicación DAX: desplaza el contexto de fechas un mes con DATEADD y compara ambas medidas.</p>
    </motion.section>
  );
}

function ProgressAndCertificate({ entrance }: { entrance: Entrance }): ReactNode {
  return (
    <motion.section aria-label="Avance del programa" variants={entrance.variants} transition={entrance.transition}>
      <div className="flex flex-wrap items-baseline justify-between gap-1 text-[11px]">
        <span className="text-muted-foreground">{COMPLETED_LESSONS} de {TOTAL_LESSONS} lecciones completadas</span>
        <span className="font-semibold tabular-nums">{OVERALL}%</span>
      </div>
      <div role="progressbar" aria-label="Lecciones completadas" aria-valuemin={0} aria-valuemax={TOTAL_LESSONS} aria-valuenow={COMPLETED_LESSONS}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${OVERALL}%` }} />
      </div>
      <div className="mt-2 flex items-center gap-2 rounded-lg border border-brand-green/30 bg-brand-green/10 p-2">
        <Award className="h-5 w-5 shrink-0 text-brand-green" aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold leading-snug">Certificado IngSimple</p>
          <p className="text-[10px] leading-snug text-muted-foreground">Al completar las {TOTAL_LESSONS} lecciones · faltan {TOTAL_LESSONS - COMPLETED_LESSONS}</p>
        </div>
      </div>
    </motion.section>
  );
}

function ModuleOverview({ entrance }: { entrance: Entrance }): ReactNode {
  return (
    <section aria-label="Módulos del curso" className="min-w-0">
      <h3 className="mb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground lg:mb-2">Temario del programa</h3>
      <div className="space-y-1 lg:space-y-2">
        {MODULES.map((module) => {
          const status = moduleStatus(module);
          const done = module.lessons.filter((lesson) => lesson.status === "completed").length;
          const Icon = status === "completed" ? Check : status === "in-progress" ? CircleDot : Circle;
          return (
            <motion.div key={module.title} variants={entrance.variants} transition={entrance.transition}
              className="flex items-start gap-2 border-b border-border/40 pb-1 lg:pb-2 last:border-0 last:pb-0">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${status === "pending" ? "text-muted-foreground/50" : "text-primary"}`} aria-hidden="true" />
              <div className="min-w-0">
                <h4 className="text-[12px] font-medium leading-snug">{module.title}</h4>
                <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{MODULE_STATUS_LABEL[status]} · {done} de {module.lessons.length}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export function PanelTraining(): ReactNode {
  const { container, item, itemTransition } = useStaggerEntrance(ENTRANCE_STAGGER);
  const entrance: Entrance = { variants: item, transition: itemTransition };
  return (
    // Natural content sizing avoids bottom-pinning the certificate on mobile.
    // The showcase retains ownership of the illustrative aria-hidden boundary.
    <motion.div className="flex h-full flex-col" initial="hidden" animate="visible" variants={container}>
      <Header entrance={entrance} />
      <div className="grid min-w-0 content-start gap-2 p-3 sm:p-4 lg:min-h-0 lg:flex-1 lg:content-stretch lg:gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <PracticalLesson entrance={entrance} />
        <div className="min-w-0 space-y-2 lg:space-y-3">
          <ProgressAndCertificate entrance={entrance} />
          <ModuleOverview entrance={entrance} />
        </div>
      </div>
    </motion.div>
  );
}
