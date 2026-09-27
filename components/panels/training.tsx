import {
  Award,
  Check,
  Circle,
  CircleDot,
  Clock,
  Gauge,
  GraduationCap,
  Signal,
  User,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { motion, type Transition, type Variants } from "motion/react";
import { useStaggerEntrance } from "@/lib/motion";

/* --------------------------------------------------------------------------
 * Capacitaciones panel: ONE course, ONE learner's journey.
 *
 * The old panel showed four unrelated courses with averaged progress; it had
 * no subject, no modality/duration/level/instructor, and used green twice.
 * This redesign simulates a single concrete program (Power BI, consistent
 * with the `capacitaciones` temario in `lib/services.ts`) partway through:
 *
 *   1. course identity — name + modality / duration / level / instructor,
 *   2. overall progress toward completion (the focal element),
 *   3. module/lesson breakdown with per-item status,
 *   4. the current lesson, highlighted in the timeline,
 *   5. the completion outcome: the certificate, the panel's only green.
 *
 * Everything derives from the single `MODULES` dataset below — lesson counts,
 * overall percent and module status are computed, never hand-typed, so they
 * always agree. No red anywhere; the palette stays quiet so the one green
 * payoff reads as the ending of the story.
 * ------------------------------------------------------------------------ */

type LessonStatus = "completed" | "current" | "pending";

/* ---- Entrance ------------------------------------------------------------- */

/** Stagger offset of the panel's single entrance chain (seconds): header and
 * progress hero first, then the four modules, the certificate strip last. The
 * 7th item (the certificate) starts at 6 × ENTRANCE_STAGGER = 0.30 s. */
export const ENTRANCE_STAGGER = 0.05;

/** Variants + transition handed down from the panel's entrance recipe. */
type Entrance = { variants: Variants; transition: Transition };

type Lesson = {
  title: string;
  /** Simulated lesson length, shown right-aligned in tabular-nums. */
  duration: string;
  status: LessonStatus;
};

type Module = {
  title: string;
  lessons: Lesson[];
};

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

/* ---- Course identity (the learner's context) ----------------------------- */

const COURSE = {
  title: "Power BI de básico a avanzado",
  audience: "Equipo de control de gestión",
  modality: "Online en vivo",
  duration: "4 semanas · 8 sesiones",
  level: "Básico a avanzado",
  instructor: "Instructor IngSimple",
} as const;

/* ---- Derived figures (single source: MODULES) ---------------------------- */

const LESSONS = MODULES.flatMap((m) => m.lessons);
const TOTAL_LESSONS = LESSONS.length;
const COMPLETED_LESSONS = LESSONS.filter((l) => l.status === "completed").length;
const OVERALL = Math.round((COMPLETED_LESSONS / TOTAL_LESSONS) * 100);

type ModuleStatus = "completed" | "in-progress" | "pending";

function moduleStatus(module: Module): ModuleStatus {
  if (module.lessons.every((l) => l.status === "completed")) return "completed";
  if (module.lessons.some((l) => l.status === "current")) return "in-progress";
  return "pending";
}

const MODULE_STATUS_LABEL: Record<ModuleStatus, string> = {
  completed: "Completado",
  "in-progress": "En curso",
  pending: "Pendiente",
};

/* ---- Header --------------------------------------------------------------- */

function Header({ entrance }: { entrance: Entrance }): ReactNode {
  return (
    <motion.div
      variants={entrance.variants}
      transition={entrance.transition}
      className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 sm:px-5"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10">
          <GraduationCap className="h-4 w-4 text-primary" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="flex min-w-0 flex-col">
          <h2 className="truncate text-sm font-semibold tracking-tight">{COURSE.title}</h2>
          <p className="hidden text-[11px] text-muted-foreground sm:block">
            Capacitación a medida · {COURSE.audience}
          </p>
        </div>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
        <Signal className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
        {COURSE.modality}
      </span>
    </motion.div>
  );
}

/* ---- Focal element: overall progress ------------------------------------- */

type MetaChip = { icon: LucideIcon; label: string };

const META: MetaChip[] = [
  { icon: Clock, label: COURSE.duration },
  { icon: Gauge, label: COURSE.level },
  { icon: User, label: COURSE.instructor },
];

function ProgressHero({ entrance }: { entrance: Entrance }): ReactNode {
  return (
    <motion.section
      aria-label="Avance del programa"
      variants={entrance.variants}
      transition={entrance.transition}
      className="shrink-0"
    >
      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 items-baseline gap-2.5">
          <span className="text-3xl font-semibold leading-none tracking-tight tabular-nums">
            {OVERALL}%
          </span>
          <span className="truncate text-[12px] text-muted-foreground">
            {COMPLETED_LESSONS} de {TOTAL_LESSONS} lecciones completadas
          </span>
        </div>
        <span className="hidden shrink-0 text-[11px] uppercase tracking-wide text-muted-foreground sm:block">
          Avance del programa
        </span>
      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${OVERALL}%` }} />
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
        {META.map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground"
          >
            <Icon className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
    </motion.section>
  );
}

/* ---- Module timeline ------------------------------------------------------ */

function LessonRow({ lesson }: { lesson: Lesson }): ReactNode {
  if (lesson.status === "current") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-md border border-primary/40 bg-primary/5 px-2 py-1">
        <span className="flex min-w-0 items-center gap-2">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
          <span className="truncate text-xs font-medium tracking-tight">{lesson.title}</span>
        </span>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-primary">
          En curso
        </span>
      </div>
    );
  }

  const completed = lesson.status === "completed";
  return (
    <div className="flex items-center justify-between gap-3 px-2 py-1">
      <span className="flex min-w-0 items-center gap-2">
        <Check
          className={`h-3 w-3 shrink-0 ${completed ? "text-primary" : "text-muted-foreground/40"}`}
          strokeWidth={2.5}
          aria-hidden="true"
        />
        <span
          className={`truncate text-xs tracking-tight ${
            completed ? "text-foreground/80" : "text-muted-foreground"
          }`}
        >
          {lesson.title}
        </span>
      </span>
      <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
        {lesson.duration}
      </span>
    </div>
  );
}

function ModuleTimeline({ entrance }: { entrance: Entrance }): ReactNode {
  return (
    <div
      aria-label="Módulos del curso"
      className="flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      {MODULES.map((module, index) => {
        const status = moduleStatus(module);
        const done = module.lessons.filter((l) => l.status === "completed").length;
        return (
          <motion.div
            key={module.title}
            variants={entrance.variants}
            transition={entrance.transition}
            className="flex min-h-0 gap-3"
          >
            {/* Rail: status icon on top, connector line filling the rest */}
            <div className="flex flex-col items-center pt-0.5">
              {status === "completed" ? (
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
              ) : status === "in-progress" ? (
                <CircleDot
                  className="h-5 w-5 shrink-0 text-primary"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              ) : (
                <Circle
                  className="h-5 w-5 shrink-0 text-muted-foreground/50"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              )}
              {index < MODULES.length - 1 ? (
                <span className="w-px flex-1 bg-border/60" aria-hidden="true" />
              ) : null}
            </div>

            <div className={index < MODULES.length - 1 ? "min-w-0 flex-1 pb-2.5" : "min-w-0 flex-1"}>
              <div className="flex items-baseline justify-between gap-3 pt-0.5">
                <h3
                  className={`truncate text-[13px] font-semibold tracking-tight ${
                    status === "pending" ? "text-muted-foreground" : ""
                  }`}
                >
                  {module.title}
                </h3>
                <span className="shrink-0 text-[11px] text-muted-foreground">
                  {MODULE_STATUS_LABEL[status]} · {done} de {module.lessons.length}
                </span>
              </div>
              <div className="mt-0.5 flex flex-col gap-0.5">
                {module.lessons.map((lesson) => (
                  <LessonRow key={lesson.title} lesson={lesson} />
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---- Completion outcome: the panel's single green accent ------------------ */

function CertificateStrip({ entrance }: { entrance: Entrance }): ReactNode {
  return (
    <motion.div
      variants={entrance.variants}
      transition={entrance.transition}
      className="flex shrink-0 items-center gap-3 rounded-lg border border-brand-green/30 bg-brand-green/10 p-3"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-green text-brand-green-foreground">
        <Award className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate text-[13px] font-semibold tracking-tight">
          Certificado IngSimple
        </span>
        <span className="truncate text-[11px] text-muted-foreground">
          Se emite al completar las {TOTAL_LESSONS} lecciones · faltan{" "}
          {TOTAL_LESSONS - COMPLETED_LESSONS}
        </span>
      </span>
    </motion.div>
  );
}

/* ---- Panel ---------------------------------------------------------------- */

export function PanelTraining(): ReactNode {
  const { container, item, itemTransition } = useStaggerEntrance(ENTRANCE_STAGGER);
  const entrance: Entrance = { variants: item, transition: itemTransition };

  return (
    // One coherent chain: header + progress → timeline → certificate (the
    // payoff enters last). Mount-based, so it plays when the tab activates.
    <motion.div
      className="flex h-full flex-col"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      <Header entrance={entrance} />

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden p-4 sm:px-5">
        <ProgressHero entrance={entrance} />
        <ModuleTimeline entrance={entrance} />
        <CertificateStrip entrance={entrance} />
      </div>
    </motion.div>
  );
}
