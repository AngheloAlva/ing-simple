"use client";

import {
  BellRing,
  Database,
  FileText,
  GitBranch,
  Plus,
  Save,
  ShieldCheck,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { motion, type MotionStyle } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { useStepLoop } from "@/components/diagrams/use-step-loop";
import { softEase, useReducedMotion } from "@/lib/motion";

/**
 * n8n-style automation canvas.
 *
 * Everything lives in a FIXED-size design stage (STAGE_W × STAGE_H px) that is
 * centered inside the panel when the frame is wide enough. A compact flow
 * replaces it in narrower frames. Because the stage never resizes, node cards (absolute
 * px) and the SVG connectors (viewBox === stage px) share one 1:1 coordinate
 * system, so wires plug into ports exactly and the traveling packet stays on the
 * wire regardless of screen width — no aspect-ratio distortion.
 *
 * Z-ORDER: connectors render in a single <svg> at z-0, the traveling packet at
 * z-[1], and every node card at z-10. Wires + packet therefore always sit BEHIND the
 * cards and only show in the open canvas between ports.
 */

const STAGE_W = 1040;
const STAGE_H = 470;
const CW = 170; // card width
const CH = 62; // card height

/* ----------------------------------------------------------------------
 * Sequential run. Instead of five decorative pulses looping forever, ONE
 * ordered execution walks the flow: each step traverses one connector,
 * waits for its destination node to react, and only then moves on.
 * Progress accumulates within a cycle, the finished picture holds, then the
 * run starts over.
 * -------------------------------------------------------------------- */

export const RUN_STEPS = 4; // one step per traversed connector
/** Travel phase: the wire draws under the packet. */
export const STEP_TRAVEL_MS = 600;
/** Dwell phase: the packet rests on the node while the node reacts. */
export const STEP_DWELL_MS = 320;
/** The branch diagonal is longer, so it travels a little slower. */
const BRANCH_TRAVEL_MS = 820;
const RUN_PAUSE_MS = 4200;
/**
 * Index at which the run reaches "Validar datos". The two validation inputs
 * belong to that step, so they appear WITH it, never after it has been passed.
 */
export const VALIDATION_REVEAL_INDEX = 1;

/** Step number of the connector that activates each node (trigger is live from the start). */
const NODE_STEPS: Record<string, number> = {
  trigger: 0,
  validar: 1,
  condicion: 2,
  guardar: 3,
  notificar: 4,
};

export type EdgeRunState = "done" | "running" | "pending" | "idle";

/** A connector travels during step `step` (index step-1) and stays done from index `step` on. */
export function edgeRunState(step: number | null, index: number): EdgeRunState {
  if (step === null) return "idle";
  if (index >= step) return "done";
  if (index === step - 1) return "running";
  return "pending";
}

/** Travel time of step `index` (0-based). */
export function stepTravelMs(index: number): number {
  return index === 2 ? BRANCH_TRAVEL_MS : STEP_TRAVEL_MS;
}

/** A full step is travel + dwell, so the node reacts before the packet leaves. */
export function stepDuration(index: number): number {
  return stepTravelMs(index) + STEP_DWELL_MS;
}

/**
 * Step number of the node the run has reached. An arrival lands when the
 * current travel ends, so the dwell that follows is the visible pause in
 * which the node reacts before the run moves on.
 */
export function arrivedStep(index: number, travelDone: boolean): number {
  return Math.min(travelDone ? index + 1 : index, RUN_STEPS);
}

/** Validation inputs stay hidden until the run reaches validation, then stay. */
export function subNodesRevealed(arrived: number): boolean {
  return arrived >= VALIDATION_REVEAL_INDEX;
}

type NodeVariant = "trigger" | "default" | "branch";

type FlowNode = {
  id: string;
  x: number;
  y: number;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  variant: NodeVariant;
  /** Branch nodes expose two output ports instead of one. */
  outputs?: 1 | 2;
};

const NODES: FlowNode[] = [
  {
    id: "trigger",
    x: 6,
    y: 205,
    title: "Cuando llega una solicitud",
    subtitle: "Web · SOL-024",
    icon: Zap,
    variant: "trigger",
  },
  {
    id: "validar",
    x: 210,
    y: 205,
    title: "Validar datos",
    subtitle: "Reglas de negocio",
    icon: ShieldCheck,
    variant: "default",
  },
  {
    id: "condicion",
    x: 414,
    y: 205,
    title: "Condición",
    subtitle: "¿Cumple requisitos?",
    icon: GitBranch,
    variant: "branch",
    outputs: 2,
  },
  {
    id: "guardar",
    x: 618,
    y: 116,
    title: "Guardar registro",
    subtitle: "BD · SOL-024",
    icon: Save,
    variant: "default",
  },
  {
    id: "notificar",
    x: 822,
    y: 116,
    title: "Notificar al equipo",
    subtitle: "Aviso · SOL-024",
    icon: BellRing,
    variant: "default",
  },
  {
    id: "solicitar",
    x: 618,
    y: 294,
    title: "Solicitar revisión",
    subtitle: "Caso manual",
    icon: TriangleAlert,
    variant: "default",
  },
];

type SubNode = {
  id: string;
  x: number;
  y: number;
  title: string;
  icon: LucideIcon;
};

export const SUBW = 124;
const SUBH = 42;

export const SUBNODES: SubNode[] = [
  { id: "origen", x: 163, y: 356, title: "Origen de datos", icon: Database },
  { id: "plantilla", x: 303, y: 356, title: "Plantilla", icon: FileText },
];

/**
 * Flow-chart diamonds on the outgoing branch wires — the conventional Sí/No
 * marker. Each is anchored on its wire's midpoint (bezier t = 0.5), so the
 * line passes through the diamond's centre.
 */
const BRANCH_MARKERS = [
  { id: "si", label: "Sí", x: 601, y: 187, taken: true },
  { id: "no", label: "No", x: 601, y: 285, taken: false },
] as const;

/** Card-relative port tops for the branch outputs (two spine-aligned rows). */
const BRANCH_PORT_TOPS = [22, 40] as const;
/** Card-relative top of the branch input port (keeps the e2 wire horizontal). */
const BRANCH_INPUT_TOP = 31;

type EdgeTone = "primary" | "green" | "muted";

type Edge = {
  id: string;
  from: [number, number];
  to: [number, number];
  /** The two node ids this edge connects — drives hover highlighting. */
  a: string;
  b: string;
  tone: EdgeTone;
  dashed?: boolean;
  orientation?: "h" | "v";
  /** 1-based position of this connector in the sequential run; null/absent = never traversed. */
  step?: number;
};

const EDGES: Edge[] = [
  // Main spine
  {
    id: "e1",
    from: [176, 236],
    to: [210, 236],
    a: "trigger",
    b: "validar",
    tone: "primary",
    step: 1,
  },
  {
    id: "e2",
    from: [380, 236],
    to: [414, 236],
    a: "validar",
    b: "condicion",
    tone: "primary",
    step: 2,
  },
  // Branch — Aprobado (the single green "success" path, the branch the run takes)
  {
    id: "e3",
    from: [584, 227],
    to: [618, 147],
    a: "condicion",
    b: "guardar",
    tone: "green",
    step: 3,
  },
  // Branch — Rechazado (neutral alternative; visible but never traversed)
  {
    id: "e4",
    from: [584, 245],
    to: [618, 325],
    a: "condicion",
    b: "solicitar",
    tone: "muted",
  },
  {
    id: "e5",
    from: [788, 147],
    to: [822, 147],
    a: "guardar",
    b: "notificar",
    tone: "primary",
    step: 4,
  },
  // Dashed tool sub-nodes hanging below "Validar datos" — endpoints are the
  // widened cards' top centers (node.x + SUBW / 2).
  {
    id: "e6",
    from: [295, 267],
    to: [225, 356],
    a: "validar",
    b: "origen",
    tone: "muted",
    dashed: true,
    orientation: "v",
  },
  {
    id: "e7",
    from: [295, 267],
    to: [365, 356],
    a: "validar",
    b: "plantilla",
    tone: "muted",
    dashed: true,
    orientation: "v",
  },
  // Dangling "+" stubs
  {
    id: "e8",
    from: [992, 147],
    to: [1006, 147],
    a: "notificar",
    b: "plus1",
    tone: "primary",
  },
  {
    id: "e9",
    from: [788, 325],
    to: [802, 325],
    a: "solicitar",
    b: "plus2",
    tone: "muted",
  },
];

const PLUS_BUTTONS = [
  { id: "plus1", x: 1006, y: 135 },
  { id: "plus2", x: 802, y: 313 },
];

function edgePath(edge: Edge): string {
  const [x1, y1] = edge.from;
  const [x2, y2] = edge.to;
  if (edge.orientation === "v") {
    const dy = Math.max(24, Math.abs(y2 - y1) * 0.5);
    return `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`;
  }
  const dx = Math.max(28, Math.abs(x2 - x1) * 0.6);
  return `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;
}

function strokeClass(tone: EdgeTone, active: boolean): string {
  if (tone === "green") return active ? "text-brand-green" : "text-brand-green/55";
  if (tone === "muted")
    return active ? "text-muted-foreground/70" : "text-muted-foreground/35";
  return active ? "text-primary" : "text-primary/35";
}

/** Small rotated-square connection nub sitting on a card edge. */
function PortNub({
  side,
  top,
  active,
}: {
  side: "left" | "right";
  top: number | string;
  active: boolean;
}): ReactNode {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-2.5 w-2.5 -translate-y-1/2 rotate-45 rounded-[2px] border transition-colors ${
        active ? "border-primary bg-primary" : "border-border bg-background"
      }`}
      style={{
        top,
        [side]: -5,
      }}
    />
  );
}

function NodeCard({
  node,
  active,
  lifted,
  arrived,
  entranceDelay,
  prefersReducedMotion,
  onEnter,
  onLeave,
}: {
  node: FlowNode;
  /** Visually marked (border) — hover or reached by the run. */
  active: boolean;
  /** Hover-only lift, so traversed nodes keep their place. */
  lifted: boolean;
  /** The run just arrived here: the node pops so the arrival is legible. */
  arrived: boolean;
  /** Stagger slot for the panel's entrance, in seconds. */
  entranceDelay: number;
  prefersReducedMotion: boolean;
  onEnter: () => void;
  onLeave: () => void;
}): ReactNode {
  const Icon = node.icon;
  const isTrigger = node.variant === "trigger";
  const isBranch = node.variant === "branch";
  const settle = { type: "spring" as const, stiffness: 320, damping: 24 };

  return (
    <motion.div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group absolute z-10 flex items-center gap-2.5 border bg-background px-3 shadow-sm transition-colors duration-[250ms] ${
        isTrigger ? "rounded-l-[30px] rounded-r-xl" : "rounded-xl"
      } ${active ? "border-primary shadow-md" : "border-border"}`}
      style={{ left: node.x, top: node.y, width: CW, height: CH }}
      initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
      animate={
        prefersReducedMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: arrived ? [1, 1.03, 1] : 1, y: lifted ? -2 : 0 }
      }
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              opacity: { duration: 0.28, ease: softEase, delay: entranceDelay },
              scale: { duration: 0.34, ease: softEase, times: [0, 0.4, 1] },
              y: settle,
            }
      }
    >
      {/* Trigger badge — lightning nub overlapping the rounded-left edge */}
      {isTrigger ? (
        <span
          aria-hidden="true"
          className="absolute -left-2.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full border border-primary/30 bg-primary text-primary-foreground shadow-sm"
        >
          <Zap className="h-3 w-3" strokeWidth={2.5} />
        </span>
      ) : null}

      {/* Input nub (all but the trigger; branch keeps its spine-aligned port) */}
      {isTrigger ? null : (
        <PortNub side="left" top={isBranch ? BRANCH_INPUT_TOP : "50%"} active={active} />
      )}

      {/* Output nub(s) */}
      {isBranch
        ? BRANCH_PORT_TOPS.map((top) => (
            <PortNub key={`port-${top}`} side="right" top={top} active={active} />
          ))
        : <PortNub side="right" top="50%" active={active} />}

      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg transition-colors ${
          isTrigger || active
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary"
        }`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} aria-hidden="true" />
      </span>

      <span className="flex min-w-0 flex-col leading-tight">
        <span className="line-clamp-2 text-[12px] font-semibold tracking-tight">
          {node.title}
        </span>
        <span className="truncate text-[10.5px] text-muted-foreground">
          {node.subtitle}
        </span>
      </span>
    </motion.div>
  );
}

function SubNodeCard({
  node,
  revealIndex,
  prefersReducedMotion,
  active,
  onEnter,
  onLeave,
}: {
  node: SubNode;
  /** Position in the staggered reveal. */
  revealIndex: number;
  prefersReducedMotion: boolean;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}): ReactNode {
  const Icon = node.icon;
  return (
    <motion.div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-subnode={node.id}
      className={`absolute z-10 flex items-center gap-1.5 rounded-lg border bg-background px-2 shadow-sm transition-colors duration-[250ms] ${
        active ? "border-primary" : "border-border"
      }`}
      style={{ left: node.x, top: node.y, width: SUBW, height: SUBH }}
      initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.34, ease: softEase, delay: revealIndex * 0.06 }
      }
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="truncate text-[10px] font-medium text-muted-foreground">
        {node.title}
      </span>
    </motion.div>
  );
}

function RequestSummary(): ReactNode {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Solicitud de ejemplo</p>
      <p className="mt-1 text-sm font-semibold tracking-tight">SOL-024 · Inspección de equipo</p>
      <p className="mt-1 text-[11px] text-muted-foreground">Equipo EQ-07 · Área de operaciones</p>
    </div>
  );
}

function RunResult({ arrived }: { arrived: number }): ReactNode {
  const finished = arrived >= RUN_STEPS;
  return (
    <div
      data-result-state={finished ? "done" : "pending"}
      className={`min-w-0 self-start rounded-lg border bg-background p-3 ${finished ? "border-brand-green/25" : "border-border"}`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Resultado de SOL-024</p>
      <p className={`mt-1 text-xs font-semibold ${finished ? "text-brand-green-text" : "text-muted-foreground"}`}>
        {arrived >= 3 ? "Registro SOL-024 guardado" : "Esperando registro y aviso"}
      </p>
      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
        {arrived >= 4 ? "Equipo de mantenimiento · SOL-024" : arrived >= 3 ? "Aviso al equipo pendiente" : "Validación en curso."}
      </p>
    </div>
  );
}

export function PanelAutomation(): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  // ONE sequential run through the whole flow. Reduced motion renders the
  // final, fully-executed frame with no animation and no loop; while no loop
  // is running (SSR, first paint) we also show that finished picture.
  const loop = useStepLoop({
    active: !prefersReducedMotion,
    steps: RUN_STEPS,
    duration: stepDuration,
    pauseMs: RUN_PAUSE_MS,
  });
  const runIndex = !prefersReducedMotion && loop ? loop.index : RUN_STEPS;
  const cycle = loop?.cycle ?? 0;

  // Inside a step the wire travels first and the arrival rests afterwards: the
  // destination node lights up the moment the packet lands, and the remaining
  // dwell is the pause the reader sees before the next connector starts.
  // Storing the index whose travel finished (rather than a boolean) means a new
  // step invalidates the flag without setting state during the effect.
  const [travelDoneFor, setTravelDoneFor] = useState<number | null>(null);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setTimeout(() => setTravelDoneFor(runIndex), stepTravelMs(runIndex));
    return () => clearTimeout(id);
  }, [runIndex, prefersReducedMotion]);

  const travelDone = travelDoneFor === runIndex;
  const arrived = prefersReducedMotion ? RUN_STEPS : arrivedStep(runIndex, travelDone);
  const revealed = subNodesRevealed(arrived);
  const finished = arrived >= RUN_STEPS;
  const compactState = (id: string): "done" | "running" | "pending" => {
    const step = NODE_STEPS[id] ?? RUN_STEPS;
    if (finished || step < arrived) return "done";
    return step === arrived ? "running" : "pending";
  };

  const isEdgeActive = (edge: Edge): boolean =>
    hovered !== null && (hovered === edge.a || hovered === edge.b);

  const nodeRunStep = (id: string): number | null => NODE_STEPS[id] ?? null;

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 py-2 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <Zap className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden="true" />
          <div className="flex min-w-0 flex-col">
            <h2 className="text-sm font-semibold leading-5 tracking-tight">
              Flujo automatizado
            </h2>
            <p className="hidden text-[11px] text-muted-foreground sm:block">
              Ingreso de solicitudes
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            {prefersReducedMotion || finished ? null : (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          {finished ? "Finalizado" : "En ejecución"}
        </span>
      </div>

      {/* Canvas: the available frame width, not viewport width, selects the layout. */}
      <div className="relative flex min-h-0 flex-1 items-start justify-center overflow-hidden [container-type:inline-size]">
        {/* Dotted grid background */}
        <div className="pointer-events-none absolute inset-0 bg-muted/20" />
        <div
          className="pointer-events-none absolute inset-0 text-foreground/[0.09]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Both layouts read the same arrival state; no separate mobile timer. */}
        <div className="relative z-10 grid w-full max-w-3xl gap-2 px-4 py-3 @[520px]:grid-cols-2 @[1040px]:hidden">
          <div className="@[520px]:col-span-2"><RequestSummary /></div>
          <ol className="flex min-w-0 flex-col gap-1.5 @[520px]:row-span-2">
            {NODES.filter((node) => node.id !== "solicitar").map((node, index) => {
              const state = compactState(node.id);
              const Icon = node.icon;
              return (
                <li
                  key={node.id}
                  data-compact-step={node.id}
                  data-state={state}
                  className={`min-w-0 rounded-lg border bg-background p-2 transition-colors ${
                    state === "running" ? "border-primary bg-primary/5" :
                    state === "done" ? "border-brand-green/30" : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-semibold tabular-nums ${state === "done" ? "bg-brand-green/10 text-brand-green-text" : "bg-primary/10 text-primary"}`}>
                      {state === "done" ? "✓" : index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold">
                        <Icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                        {node.title}
                      </div>
                      <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                        {node.id === "trigger" ? "Formulario · SOL-024" :
                         node.id === "guardar" ? "Base de datos · SOL-024" :
                         node.id === "notificar" ? "Correo · chat · mantenimiento" : node.subtitle}
                      </p>
                      {state === "running" ? <p className="mt-1 text-[10px] font-semibold text-primary">Paso actual</p> : null}
                      {node.id === "validar" ? (
                        <div className="mt-2 grid gap-1 border-t border-dashed border-border pt-2 text-[10px] leading-4 text-muted-foreground">
                          <span>Origen de datos · Equipo EQ-07</span>
                          <span>Plantilla · Inspección técnica</span>
                        </div>
                      ) : null}
                      {node.id === "condicion" ? <p className={`mt-1 text-[10px] ${arrived >= 2 ? "text-brand-green-text" : "text-muted-foreground"}`}>{arrived >= 2 ? "Aprobado" : "Pendiente de evaluación"}</p> : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
          <RunResult arrived={arrived} />
          <div className="min-w-0 self-start rounded-lg border border-dashed border-border bg-background/80 p-3">
            <p className="text-[10px] font-medium text-muted-foreground">Rechazado · ruta alternativa</p>
            <div className="mt-1 flex items-center gap-2 text-xs font-semibold"><TriangleAlert className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />Solicitar revisión</div>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground">Faltan datos → revisión manual</p>
            <p className="mt-1 text-[10px] leading-4 text-muted-foreground">No se guarda ni se envía el aviso.</p>
          </div>
        </div>

        {/* Fixed design stage — nodes + SVG share these exact px coordinates */}
        <div
          className="relative hidden shrink-0 @[1040px]:block @[1040px]:self-center"
          style={{ width: STAGE_W, height: STAGE_H }}
        >
          <div className="absolute left-6 top-4"><RequestSummary /></div>
          <div className="absolute right-12 bottom-4 w-80"><RunResult arrived={arrived} /></div>
          {/* Connector layer (behind everything else). Segments already
              traversed stay done for the whole cycle; the segment under way
              carries a single traveling packet; the rest stay pending. */}
          <svg
            className="absolute inset-0 z-0 h-full w-full"
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            fill="none"
            aria-hidden="true"
          >
            {EDGES.map((edge) => {
              const runState = edgeRunState(edge.step ?? null, runIndex);

              // A dashed tool connector belongs to its sub-node card: while the
              // card is hidden the wire must not render on its own.
              if (edge.dashed) {
                if (!revealed) return null;
                const revealDelay = edge.id === "e7" ? 0.06 : 0;
                return (
                  <motion.path
                    key={`${edge.id}-${cycle}`}
                    d={edgePath(edge)}
                    data-edge={edge.id}
                    data-state="revealed"
                    stroke="currentColor"
                    className="text-muted-foreground/60"
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeDasharray="5 6"
                    initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.34, ease: softEase, delay: revealDelay }}
                  />
                );
              }

              const active = runState === "done" || isEdgeActive(edge);

              // The wire draws under the packet as the step travels, so the
              // run reads as one continuous movement through the flow.
              if (runState === "running") {
                return (
                  <motion.path
                    key={`${edge.id}-${cycle}`}
                    d={edgePath(edge)}
                    data-edge={edge.id}
                    data-state="running"
                    stroke="currentColor"
                    className={strokeClass(edge.tone, true)}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: stepTravelMs((edge.step ?? 1) - 1) / 1000, ease: "linear" }
                    }
                  />
                );
              }

              return (
                <path
                  key={edge.id}
                  d={edgePath(edge)}
                  data-edge={edge.id}
                  data-state={runState}
                  stroke="currentColor"
                  className={strokeClass(edge.tone, active)}
                  strokeWidth={active ? 2.5 : 1.75}
                  strokeLinecap="round"
                  style={{ transition: "stroke-width 250ms ease" }}
                />
              );
            })}
          </svg>

          {/* The traveling packet — one per in-flight connector, following the
              curve via CSS offset-path. Omitted entirely under reduced motion
              (which renders the final frame, so nothing is ever "in flight"). */}
          {EDGES.filter(
            (edge) => edgeRunState(edge.step ?? null, runIndex) === "running",
          ).map((edge) => (
            <motion.span
              key={`packet-${edge.id}-${loop?.cycle ?? 0}`}
              aria-hidden="true"
              className={`pointer-events-none absolute left-0 top-0 z-[1] h-2 w-2 rounded-full ${
                edge.tone === "green"
                  ? "bg-brand-green shadow-[0_0_8px_2px] shadow-brand-green/40"
                  : "bg-primary shadow-[0_0_8px_2px] shadow-primary/40"
              }`}
              style={
                {
                  offsetPath: `path('${edgePath(edge)}')`,
                  offsetRotate: "0deg",
                  offsetDistance: "0%",
                } as MotionStyle
              }
              animate={{ offsetDistance: ["0%", "100%"] }}
              transition={{
                duration: stepTravelMs((edge.step ?? 1) - 1) / 1000,
                ease: "linear",
              }}
            />
          ))}

          {/* Branch markers — the conventional flow-chart diamond with its
              Sí/No label, anchored on each outgoing wire's midpoint. */}
          {BRANCH_MARKERS.map((marker) => {
            const emphasized =
              marker.taken && runIndex >= (NODE_STEPS.condicion ?? 0);
            return (
              <span
                key={marker.id}
                data-branch-marker={marker.id}
                aria-hidden="true"
                className="absolute z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2"
                style={{ left: marker.x, top: marker.y }}
              >
                <span
                  className={`absolute inset-0 rotate-45 rounded-[2px] border transition-colors duration-[250ms] ${
                    emphasized
                      ? "border-brand-green bg-background"
                      : "border-border bg-background"
                  }`}
                />
                <span
                  className={`absolute top-1/2 right-full mr-1.5 -translate-y-1/2 text-[10px] font-semibold tracking-tight transition-colors duration-[250ms] ${
                    emphasized ? "text-brand-green-text" : "text-muted-foreground"
                  }`}
                >
                  {marker.label}
                </span>
              </span>
            );
          })}
          {/* "+" add-next affordances */}
          {PLUS_BUTTONS.map((plus) => (
            <button
              key={plus.id}
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              className="absolute z-10 grid h-6 w-6 place-items-center rounded-md border border-dashed border-border bg-background text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              style={{ left: plus.x, top: plus.y }}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
            </button>
          ))}

          {/* Sub-nodes — they belong to the Validar datos step, so the cards
              and their dashed connectors appear together with it and stay. */}
          {revealed
            ? SUBNODES.map((node, index) => (
                <SubNodeCard
                  key={node.id}
                  node={node}
                  revealIndex={index}
                  prefersReducedMotion={prefersReducedMotion}
                  active={hovered === node.id}
                  onEnter={() => setHovered(node.id)}
                  onLeave={() => setHovered(null)}
                />
              ))
            : null}

          {/* Main nodes */}
          {NODES.map((node, index) => {
            const step = nodeRunStep(node.id);
            const runActive = step !== null && arrived >= step;
            return (
              <NodeCard
                key={node.id}
                node={node}
                active={runActive || hovered === node.id}
                lifted={hovered === node.id}
                arrived={
                  runActive && !prefersReducedMotion && arrived === step && travelDone
                }
                entranceDelay={index * 0.05}
                prefersReducedMotion={prefersReducedMotion}
                onEnter={() => setHovered(node.id)}
                onLeave={() => setHovered(null)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
