import {
  CalendarRange,
  Filter,
  Layers,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Budget-execution report (Ejecución presupuestaria).
 * A slim report header over a canvas of hand-rolled SVG chart tiles:
 *   - monthly budget-vs-actual bars with a dashed projection,
 *   - a Ppto -> Real waterfall bridge,
 *   - a per-area deviation table.
 * Brand blue drives every neutral/adverse mark; brand green is the SINGLE
 * accent, reserved for "favorable" contributions in the waterfall. No red:
 * adverse magnitude is carried by blue tints, never a semantic-red semaphore.
 * ------------------------------------------------------------------------ */

type Kpi = {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  /** Polyline points on a 0 0 60 20 viewBox (drawn in brand blue). */
  spark: string;
};

const KPIS: Kpi[] = [
  {
    label: "Presupuesto total",
    value: "48.450",
    unit: "MM",
    delta: "100%",
    spark: "0,16 12,14 24,12 36,9 48,6 60,3",
  },
  {
    label: "Real acumulado",
    value: "18.765",
    unit: "MM",
    delta: "38,7%",
    spark: "0,17 12,15 24,13 36,11 48,8 60,6",
  },
  {
    label: "Desviación vs ppto.",
    value: "−12,4",
    unit: "%",
    spark: "0,6 12,8 24,7 36,10 48,11 60,13",
  },
  {
    label: "Proyección anual",
    value: "46.120",
    unit: "MM",
    delta: "95,2%",
    spark: "0,15 12,13 24,12 36,9 48,7 60,4",
  },
];

/** Monthly cumulative execution (CLP MM). Real stops at the elapsed month. */
const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];
const BUDGET = [8.4, 12.6, 17.1, 21.8, 26.9, 31.2, 34.6, 37.8, 40.9, 43.6, 46.2, 48.45];
const ACTUAL = [3.6, 7.4, 11.1, 15.0, 18.765];
/** Projected cumulative real from the last elapsed month to year-end. */
const PROJECTION = [18.765, 22.4, 26.1, 29.9, 33.6, 37.2, 40.6, 46.12];

type WaterfallStep = {
  label: string;
  /** Signed contribution in CLP MM. */
  delta: number;
  kind: "anchor" | "favorable" | "adverse";
};

/** Ppto -> Real bridge (Q2). Anchors are absolute totals; steps are signed. */
const BRIDGE: WaterfallStep[] = [
  { label: "Ppto", delta: 12.4, kind: "anchor" },
  { label: "Oper.", delta: -1.18, kind: "adverse" },
  { label: "Comer.", delta: 0.34, kind: "favorable" },
  { label: "Mant.", delta: -0.62, kind: "adverse" },
  { label: "TI", delta: -0.41, kind: "adverse" },
  { label: "Otros", delta: 0.09, kind: "favorable" },
  { label: "Real", delta: 10.62, kind: "anchor" },
];

type AreaRow = {
  label: string;
  budget: number;
  actual: number;
  /** Deviation percentage (negative = under budget execution). */
  dev: number;
};

const AREAS: AreaRow[] = [
  { label: "Operaciones", budget: 14850, actual: 6120, dev: -15.8 },
  { label: "Mantención", budget: 9230, actual: 3420, dev: -10.2 },
  { label: "Administración", budget: 6800, actual: 2730, dev: -8.6 },
  { label: "Comercial", budget: 3400, actual: 2100, dev: -5.3 },
  { label: "TI", budget: 3110, actual: 1020, dev: -12.9 },
  { label: "Otros", budget: 9910, actual: 3495, dev: -12.3 },
];

type Chip = { label: string; icon: LucideIcon };

const FILTERS: Chip[] = [
  { label: "Escenario: Base", icon: Layers },
  { label: "Periodo: YTD", icon: CalendarRange },
];

/** Format a CLP MM figure with a thousands separator, no decimals. */
function fmtMM(n: number): string {
  return Math.round(n).toLocaleString("es-CL");
}

function ReportHeader(): ReactNode {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border/60 px-4 py-3 sm:px-5">
      <div className="flex min-w-0 flex-col">
        <h2 className="truncate text-sm font-semibold tracking-tight">
          Ejecución presupuestaria
        </h2>
        <p className="text-[11px] text-muted-foreground">
          Ejercicio 2026 · CLP MM · Actualizado recién
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {FILTERS.map((chip) => (
          <span
            key={chip.label}
            className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-[11px] font-medium text-muted-foreground"
          >
            <chip.icon
              className="h-3 w-3"
              strokeWidth={1.75}
              aria-hidden="true"
            />
            {chip.label}
          </span>
        ))}
        <span className="inline-flex items-center gap-1.5 rounded-md border border-border/60 px-2 py-1 text-[11px] font-medium text-muted-foreground">
          <Filter className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
          Filtros
        </span>
      </div>
    </div>
  );
}

function Tile({
  title,
  subtitle,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  children: ReactNode;
}): ReactNode {
  return (
    <div
      className={`flex min-h-0 flex-col rounded-lg border border-border/60 bg-background p-3 ${
        className ?? ""
      }`}
    >
      <div className="flex shrink-0 items-baseline justify-between gap-2">
        <h3 className="text-[12px] font-semibold tracking-tight">{title}</h3>
        {subtitle ? (
          <span className="truncate text-[10px] text-muted-foreground">
            {subtitle}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

function KpiTile({ kpi }: { kpi: Kpi }): ReactNode {
  return (
    <div className="flex flex-col justify-between rounded-lg border border-border/60 bg-background p-3">
      <span className="text-[11px] text-muted-foreground">{kpi.label}</span>
      <div className="mt-2 flex items-end justify-between gap-2">
        <span className="text-lg font-semibold leading-none tracking-tight tabular-nums">
          {kpi.value}
          {kpi.unit ? (
            <span className="ml-1 text-[11px] font-medium text-muted-foreground">
              {kpi.unit}
            </span>
          ) : null}
        </span>
        <span className="flex flex-col items-end gap-1">
          <svg
            viewBox="0 0 60 20"
            preserveAspectRatio="none"
            className="h-4 w-14 text-primary"
            aria-hidden="true"
          >
            <polyline
              points={kpi.spark}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          {kpi.delta ? (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-primary tabular-nums">
              <TrendingUp className="h-2.5 w-2.5" aria-hidden="true" />
              {kpi.delta}
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

/* ---- Monthly budget vs actual, with a dashed projection ---------------- */

function ExecutionTile(): ReactNode {
  const W = 600;
  const H = 200;
  const pad = { top: 16, bottom: 24, left: 6, right: 6 };
  const chartH = H - pad.top - pad.bottom;
  const baseline = H - pad.bottom;
  const max = Math.max(...BUDGET);
  const slot = (W - pad.left - pad.right) / MONTHS.length;
  const barW = 9;
  const gap = 3;

  const yOf = (v: number): number => baseline - (v / max) * chartH;
  const centerOf = (i: number): number => pad.left + i * slot + slot / 2;

  const projPoints = PROJECTION.map((v, i) => {
    // Projection spans the last elapsed month (May, index 4) to Dec (index 11).
    const monthIndex = ACTUAL.length - 1 + i;
    return `${centerOf(monthIndex)},${yOf(v)}`;
  }).join(" ");

  return (
    <Tile
      title="Ejecución mensual"
      subtitle="Presupuesto vs. real"
      className="lg:col-span-2"
    >
      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 pb-1">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Presupuesto
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/45" />
          Real
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-px w-4 border-t border-dashed border-muted-foreground/60" />
          Proyección
        </span>
      </div>

      <div className="relative min-h-0 flex-1 text-primary">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden="true"
        >
          {[0.25, 0.5, 0.75, 1].map((f) => (
            <line
              key={f}
              x1={pad.left}
              y1={baseline - f * chartH}
              x2={W - pad.right}
              y2={baseline - f * chartH}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {MONTHS.map((label, i) => {
            const cx = centerOf(i);
            const bY = yOf(BUDGET[i] ?? 0);
            const hasActual = i < ACTUAL.length;
            const aY = hasActual ? yOf(ACTUAL[i] ?? 0) : baseline;
            return (
              <g key={label}>
                {/* Presupuesto */}
                <rect
                  x={cx - barW - gap / 2}
                  y={bY}
                  width={barW}
                  height={baseline - bY}
                  rx="2"
                  fill="currentColor"
                  fillOpacity="0.9"
                />
                {/* Real (only elapsed months) */}
                {hasActual ? (
                  <rect
                    x={cx + gap / 2}
                    y={aY}
                    width={barW}
                    height={baseline - aY}
                    rx="2"
                    fill="currentColor"
                    fillOpacity="0.4"
                  />
                ) : null}
                <text
                  x={cx}
                  y={H - 8}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize="9"
                >
                  {label}
                </text>
              </g>
            );
          })}

          {/* Projection */}
          <polyline
            points={projPoints}
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.55"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </Tile>
  );
}

/* ---- Ppto -> Real waterfall bridge ------------------------------------- */

function WaterfallTile(): ReactNode {
  // Panoramic viewBox (wider than the tile) so `meet` fits to width and the
  // bars span the whole card instead of being letterboxed with side gaps.
  const W = 360;
  const H = 150;
  const pad = { top: 18, bottom: 20 };
  const chartH = H - pad.top - pad.bottom;
  const baseline = H - pad.bottom;

  // Build cumulative geometry in a single pure pass. Each column carries the
  // value levels of its bar top/bottom (anchors sit on the zoomed floor) plus
  // `endLevel`, the running total the dashed connector rides to the next bar.
  let running = 0;
  const cols = BRIDGE.map((step) => {
    const isAnchor = step.kind === "anchor";
    const prev = running;
    const end = isAnchor ? step.delta : running + step.delta;
    running = end;
    return {
      ...step,
      isAnchor,
      value: step.delta,
      endLevel: end,
      topVal: isAnchor ? step.delta : Math.max(prev, end),
      // null bottom = anchor, drawn down to the floor.
      botVal: isAnchor ? null : Math.min(prev, end),
    };
  });

  // Zoom the y-domain to the band where the action happens: the floor sits well
  // below the lowest bar so small step deltas gain real, readable height
  // instead of vanishing against full-height anchors on a from-zero axis.
  const dataVals = cols.flatMap((c) =>
    c.isAnchor ? [c.topVal] : [c.topVal, c.botVal as number]
  );
  const dataMin = Math.min(...dataVals);
  const dataMax = Math.max(...dataVals);
  const spread = dataMax - dataMin || 1;
  const floor = dataMin - spread * 0.55;
  const ceil = dataMax + spread * 0.12;

  const slot = W / cols.length;
  const barW = slot * 0.66;
  const yOf = (v: number): number =>
    baseline - ((v - floor) / (ceil - floor)) * chartH;
  const centerOf = (i: number): number => i * slot + slot / 2;

  const fillFor = (kind: WaterfallStep["kind"]): string => {
    if (kind === "anchor") return "fill-primary";
    if (kind === "favorable") return "fill-brand-green";
    return "fill-primary/40";
  };

  return (
    <Tile title="Puente ppto → real" subtitle="Q2 · CLP MM">
      <div className="flex shrink-0 items-center gap-3 pb-1">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
          Favorable
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/40" />
          Adverso
        </span>
      </div>

      <div className="relative min-h-0 flex-1">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
          aria-hidden="true"
        >
          {cols.map((c, i) => {
            const cx = centerOf(i);
            const yTop = yOf(c.topVal);
            const yBottom = c.botVal === null ? baseline : yOf(c.botVal);
            const h = Math.max(yBottom - yTop, 2);
            const nextX = i < cols.length - 1 ? centerOf(i + 1) : null;
            const connY = yOf(c.endLevel);
            return (
              <g key={c.label}>
                {/* Connector riding this column's running total to the next bar */}
                {nextX !== null ? (
                  <line
                    x1={cx + barW / 2}
                    y1={connY}
                    x2={nextX - barW / 2}
                    y2={connY}
                    stroke="currentColor"
                    className="text-muted-foreground"
                    strokeOpacity="0.35"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}
                <rect
                  x={cx - barW / 2}
                  y={yTop}
                  width={barW}
                  height={h}
                  rx="2"
                  className={fillFor(c.kind)}
                />
                <text
                  x={cx}
                  y={yTop - 5}
                  textAnchor="middle"
                  className={
                    c.kind === "favorable"
                      ? "fill-brand-green tabular-nums"
                      : "fill-muted-foreground tabular-nums"
                  }
                  fontSize="9"
                >
                  {c.kind === "anchor"
                    ? fmtMM(c.value * 1000)
                    : `${c.delta > 0 ? "+" : "−"}${fmtMM(Math.abs(c.delta) * 1000)}`}
                </text>
                <text
                  x={cx}
                  y={H - 6}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize="9"
                >
                  {c.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </Tile>
  );
}

/* ---- Per-area deviation table ------------------------------------------ */

function AreaTableTile(): ReactNode {
  const maxDev = Math.max(...AREAS.map((a) => Math.abs(a.dev)));

  return (
    <Tile
      title="Ejecución por área"
      subtitle="Real vs. presupuesto"
      className="lg:col-span-3"
    >
      <div className="grid grid-cols-[1.4fr_0.9fr_0.9fr_1.3fr] items-center gap-x-3 pb-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        <span>Área</span>
        <span className="text-right">Ppto.</span>
        <span className="text-right">Real</span>
        <span className="text-right">Desv. %</span>
      </div>

      <ul className="flex min-h-0 flex-1 flex-col justify-between">
        {AREAS.map((row) => {
          const intensity = Math.abs(row.dev) / maxDev; // 0..1
          const barW = 20 + intensity * 60; // % width of the deviation bar
          return (
            <li
              key={row.label}
              className="grid grid-cols-[1.4fr_0.9fr_0.9fr_1.3fr] items-center gap-x-3 border-b border-border/40 py-1 text-[11px] last:border-b-0"
            >
              <span className="flex items-center gap-1.5 truncate">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                  style={{ opacity: 0.35 + intensity * 0.65 }}
                  aria-hidden="true"
                />
                <span className="truncate text-foreground">{row.label}</span>
              </span>
              <span className="text-right tabular-nums text-muted-foreground">
                {fmtMM(row.budget)}
              </span>
              <span className="text-right tabular-nums text-foreground">
                {fmtMM(row.actual)}
              </span>
              <span className="flex items-center justify-end gap-2">
                <span className="relative hidden h-1.5 w-14 overflow-hidden rounded-full bg-muted sm:block">
                  <span
                    className="absolute inset-y-0 right-1/2 rounded-full bg-primary/45"
                    style={{ width: `${barW / 2}%` }}
                    aria-hidden="true"
                  />
                </span>
                <span className="w-12 text-right font-medium tabular-nums text-foreground">
                  {row.dev.toLocaleString("es-CL", {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}
                  %
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </Tile>
  );
}

export function PanelReportability(): ReactNode {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <ReportHeader />

      <main className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4">
        {/* KPI row */}
        <div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
          {KPIS.map((kpi) => (
            <KpiTile key={kpi.label} kpi={kpi} />
          ))}
        </div>

        {/* Visual canvas */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-3 lg:grid-rows-2">
          <ExecutionTile />
          <WaterfallTile />
          <AreaTableTile />
        </div>
      </main>
    </div>
  );
}
