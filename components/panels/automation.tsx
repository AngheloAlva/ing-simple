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
import { useState, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/motion";

/**
 * n8n-style automation canvas.
 *
 * Everything lives in a FIXED-size design stage (STAGE_W × STAGE_H px) that is
 * centered inside the panel and cropped by the frame's overflow when the
 * viewport is narrower. Because the stage never resizes, node cards (absolute
 * px) and the SVG connectors (viewBox === stage px) share one 1:1 coordinate
 * system, so wires plug into ports exactly and the traveling pulse stays on the
 * wire regardless of screen width — no aspect-ratio distortion.
 *
 * Z-ORDER: connectors render in a single <svg> at z-0, the pulse dots at z-[1],
 * and every node card at z-10. Wires + pulses therefore always sit BEHIND the
 * cards and only show in the open canvas between ports.
 */

const STAGE_W = 1040;
const STAGE_H = 470;
const CW = 170; // card width
const CH = 62; // card height

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
    subtitle: "Formulario web",
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
    subtitle: "Base de datos",
    icon: Save,
    variant: "default",
  },
  {
    id: "notificar",
    x: 822,
    y: 116,
    title: "Notificar al equipo",
    subtitle: "Correo · chat",
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

const SUBW = 110;
const SUBH = 42;

const SUBNODES: SubNode[] = [
  { id: "origen", x: 180, y: 356, title: "Origen de datos", icon: Database },
  { id: "plantilla", x: 300, y: 356, title: "Plantilla", icon: FileText },
];

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
  pulse?: boolean;
  delay?: number;
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
    pulse: true,
    delay: 0,
  },
  {
    id: "e2",
    from: [380, 236],
    to: [414, 236],
    a: "validar",
    b: "condicion",
    tone: "primary",
    pulse: true,
    delay: 0.55,
  },
  // Branch — Aprobado (the single green "success" path)
  {
    id: "e3",
    from: [584, 227],
    to: [618, 147],
    a: "condicion",
    b: "guardar",
    tone: "green",
    pulse: true,
    delay: 1.1,
  },
  // Branch — Rechazado (neutral)
  {
    id: "e4",
    from: [584, 245],
    to: [618, 325],
    a: "condicion",
    b: "solicitar",
    tone: "muted",
    pulse: true,
    delay: 1.1,
  },
  {
    id: "e5",
    from: [788, 147],
    to: [822, 147],
    a: "guardar",
    b: "notificar",
    tone: "primary",
    pulse: true,
    delay: 1.65,
  },
  // Dashed tool sub-nodes hanging below "Validar datos"
  {
    id: "e6",
    from: [295, 267],
    to: [235, 356],
    a: "validar",
    b: "origen",
    tone: "muted",
    dashed: true,
    orientation: "v",
  },
  {
    id: "e7",
    from: [295, 267],
    to: [355, 356],
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
  prefersReducedMotion,
  onEnter,
  onLeave,
}: {
  node: FlowNode;
  active: boolean;
  prefersReducedMotion: boolean;
  onEnter: () => void;
  onLeave: () => void;
}): ReactNode {
  const Icon = node.icon;
  const isTrigger = node.variant === "trigger";
  const isBranch = node.variant === "branch";

  return (
    <motion.div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`group absolute z-10 flex items-center gap-2.5 border bg-background px-3 shadow-sm transition-colors ${
        isTrigger ? "rounded-l-[30px] rounded-r-xl" : "rounded-xl"
      } ${active ? "border-primary shadow-md" : "border-border"}`}
      style={{ left: node.x, top: node.y, width: CW, height: CH }}
      animate={{ y: prefersReducedMotion ? 0 : active ? -2 : 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
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

      {/* Input nub (all but the trigger) */}
      {isTrigger ? null : <PortNub side="left" top="50%" active={active} />}

      {/* Output nub(s) */}
      {isBranch ? (
        <>
          <PortNub side="right" top={22} active={active} />
          <PortNub side="right" top={40} active={active} />
        </>
      ) : (
        <PortNub side="right" top="50%" active={active} />
      )}

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
  active,
  onEnter,
  onLeave,
}: {
  node: SubNode;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
}): ReactNode {
  const Icon = node.icon;
  return (
    <div
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`absolute z-10 flex items-center gap-1.5 rounded-lg border bg-background px-2 shadow-sm transition-colors ${
        active ? "border-primary" : "border-border"
      }`}
      style={{ left: node.x, top: node.y, width: SUBW, height: SUBH }}
    >
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
      </span>
      <span className="truncate text-[10px] font-medium text-muted-foreground">
        {node.title}
      </span>
    </div>
  );
}

export function PanelAutomation(): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const isEdgeActive = (edge: Edge): boolean =>
    hovered !== null && (hovered === edge.a || hovered === edge.b);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 px-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <Zap className="h-4 w-4 text-primary" strokeWidth={2} aria-hidden="true" />
          <div className="flex min-w-0 flex-col">
            <h2 className="truncate text-sm font-semibold tracking-tight">
              Flujo automatizado
            </h2>
            <p className="hidden text-[11px] text-muted-foreground sm:block">
              Ingreso de solicitudes
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
          <span className="relative flex h-1.5 w-1.5">
            {prefersReducedMotion ? null : (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
            )}
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          En ejecución
        </span>
      </div>

      {/* Canvas */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        {/* Dotted grid background */}
        <div className="pointer-events-none absolute inset-0 bg-muted/20" />
        <div
          className="pointer-events-none absolute inset-0 text-foreground/[0.09]"
          style={{
            backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        {/* Fixed design stage — nodes + SVG share these exact px coordinates */}
        <div
          className="relative shrink-0"
          style={{ width: STAGE_W, height: STAGE_H }}
        >
          {/* Connector layer (behind everything else) */}
          <svg
            className="absolute inset-0 z-0 h-full w-full"
            viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
            fill="none"
            aria-hidden="true"
          >
            {EDGES.map((edge) => {
              const active = isEdgeActive(edge);
              return (
                <path
                  key={edge.id}
                  d={edgePath(edge)}
                  stroke="currentColor"
                  className={strokeClass(edge.tone, active)}
                  strokeWidth={active ? 2.5 : 1.75}
                  strokeLinecap="round"
                  strokeDasharray={edge.dashed ? "5 6" : undefined}
                  style={{ transition: "stroke-width 150ms ease" }}
                />
              );
            })}
          </svg>

          {/* Traveling pulses — follow the curves via CSS offset-path.
              Omitted entirely when reduced motion is preferred. */}
          {prefersReducedMotion
            ? null
            : EDGES.filter((edge) => edge.pulse).map((edge) => (
                <motion.span
                  key={`pulse-${edge.id}`}
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
                    duration: 2.4,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: 0.4,
                    delay: edge.delay ?? 0,
                  }}
                />
              ))}

          {/* Branch labels */}
          <span
            className="absolute z-10 rounded-md border border-brand-green/30 bg-brand-green/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-brand-green"
            style={{ left: 592, top: 198 }}
          >
            Aprobado
          </span>
          <span
            className="absolute z-10 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground"
            style={{ left: 592, top: 258 }}
          >
            Rechazado
          </span>

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

          {/* Sub-nodes */}
          {SUBNODES.map((node) => (
            <SubNodeCard
              key={node.id}
              node={node}
              active={hovered === node.id}
              onEnter={() => setHovered(node.id)}
              onLeave={() => setHovered(null)}
            />
          ))}

          {/* Main nodes */}
          {NODES.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              active={hovered === node.id}
              prefersReducedMotion={prefersReducedMotion}
              onEnter={() => setHovered(node.id)}
              onLeave={() => setHovered(null)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
