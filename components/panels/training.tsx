import { Award, Check, CircleDot, Lock, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { StaggerContainer, StaggerItem } from "@/lib/motion";

const CUT =
  "[clip-path:polygon(5px_0,100%_0,100%_calc(100%-5px),calc(100%-5px)_100%,0_100%,0_5px)]";

type ModuleStatus = "completed" | "in-progress" | "locked";

type Course = {
  title: string;
  progress: number;
  status: ModuleStatus;
};

const COURSES: Course[] = [
  { title: "Power BI", progress: 100, status: "completed" },
  { title: "Excel avanzado", progress: 100, status: "completed" },
  { title: "Power Apps", progress: 60, status: "in-progress" },
  { title: "Automatización de procesos", progress: 0, status: "locked" },
];

const OVERALL = Math.round(
  COURSES.reduce((sum, c) => sum + c.progress, 0) / COURSES.length
);

const RECENT_LESSONS: string[] = [
  "Modelado de datos",
  "Tablas dinámicas",
  "Consultas con Power Query",
];

function StatusIcon({ status }: { status: ModuleStatus }): ReactNode {
  if (status === "completed") {
    return (
      <Check className="h-3.5 w-3.5 text-primary" strokeWidth={2.5} aria-hidden="true" />
    );
  }
  if (status === "in-progress") {
    return (
      <CircleDot
        className="h-3.5 w-3.5 text-primary"
        strokeWidth={2}
        aria-hidden="true"
      />
    );
  }
  return (
    <Lock
      className="h-3.5 w-3.5 text-muted-foreground/60"
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}

function CourseRow({ course }: { course: Course }): ReactNode {
  const locked = course.status === "locked";
  const statusLabel =
    course.status === "completed"
      ? "Completado"
      : course.status === "in-progress"
        ? "En progreso"
        : "Bloqueado";

  return (
    <div
      className={`rounded-lg border border-border/60 bg-background p-3 ${
        locked ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <StatusIcon status={course.status} />
          <span className="truncate text-[13px] font-medium tracking-tight">
            {course.title}
          </span>
        </div>
        <span className="shrink-0 text-[11px] text-muted-foreground">
          {statusLabel}
        </span>
      </div>

      <div className="mt-2.5 flex items-center gap-2.5">
        <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <span className="w-9 shrink-0 text-right text-[11px] font-medium tabular-nums text-muted-foreground">
          {course.progress}%
        </span>
      </div>
    </div>
  );
}

function OverallHeader(): ReactNode {
  return (
    <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 sm:px-5">
      <div className="flex min-w-0 flex-col">
        <h2 className="truncate text-sm font-semibold tracking-tight">
          Ruta de capacitación
        </h2>
        <p className="hidden text-[11px] text-muted-foreground sm:block">
          Progreso general · {OVERALL}%
        </p>
      </div>
      <div className="flex items-center gap-2.5">
        <div className="hidden h-2 w-28 overflow-hidden rounded-full bg-muted sm:block">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${OVERALL}%` }}
          />
        </div>
        <span className="text-sm font-semibold tabular-nums">{OVERALL}%</span>
      </div>
    </div>
  );
}

function LiveFeed(): ReactNode {
  return (
    <div className="flex min-h-0 flex-col rounded-lg border border-border/60 bg-background p-4">
      <div className="flex items-center gap-1.5">
        <Sparkles
          className="h-3.5 w-3.5 text-primary"
          strokeWidth={2}
          aria-hidden="true"
        />
        <h3 className="text-[13px] font-semibold tracking-tight">
          Lecciones completadas
        </h3>
      </div>

      <StaggerContainer className="mt-3 flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
        {RECENT_LESSONS.map((lesson) => (
          <StaggerItem
            key={lesson}
            className="flex items-center gap-2.5 rounded-md border border-border/60 bg-muted/20 px-3 py-2"
          >
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10">
              <Check
                className="h-3 w-3 text-primary"
                strokeWidth={2.5}
                aria-hidden="true"
              />
            </span>
            <span className="min-w-0 flex-1 truncate text-xs font-medium tracking-tight">
              {lesson}
            </span>
            <span className="shrink-0 text-[10px] text-muted-foreground">
              recién
            </span>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Certificate badge — the single green accent for this panel */}
      <div
        className={`mt-3 flex shrink-0 items-center gap-3 border border-brand-green/30 bg-brand-green/10 p-3 ${CUT}`}
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-green text-brand-green-foreground">
          <Award className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-[13px] font-semibold tracking-tight">
            Certificado IngSimple
          </span>
          <span className="truncate text-[11px] text-muted-foreground">
            Se emite al completar la ruta
          </span>
        </span>
      </div>
    </div>
  );
}

export function PanelTraining(): ReactNode {
  return (
    <div className="flex h-full flex-col">
      <OverallHeader />

      <main className="grid min-h-0 flex-1 grid-cols-1 gap-3 p-3 sm:p-4 lg:grid-cols-2">
        <div className="flex min-h-0 flex-col gap-2.5 overflow-hidden">
          {COURSES.map((course) => (
            <CourseRow key={course.title} course={course} />
          ))}
        </div>
        <LiveFeed />
      </main>
    </div>
  );
}
