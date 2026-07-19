import {
  ArrowUpRight,
  CalendarDays,
  Filter,
  LayoutGrid,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

/* --------------------------------------------------------------------------
 * Power BI–style operational report.
 * A slim report header over a canvas of diverse, hand-rolled SVG chart tiles.
 * Brand blue drives every data mark; green is used once (donut "Completadas").
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
    label: "Usuarios activos",
    value: "80",
    delta: "+8",
    spark: "0,15 12,13 24,14 36,9 48,7 60,4",
  },
  {
    label: "Órdenes / mes",
    value: "100+",
    delta: "12%",
    spark: "0,16 12,12 24,13 36,8 48,9 60,5",
  },
  {
    label: "Módulos integrados",
    value: "20",
    delta: "+3",
    spark: "0,14 12,12 24,10 36,10 48,7 60,6",
  },
  {
    label: "En producción",
    value: "13",
    unit: "meses",
    spark: "0,12 12,11 24,9 36,10 48,7 60,5",
  },
];

type Bar = { label: string; value: number };

const ORDERS_BY_AREA: Bar[] = [
  { label: "Minería", value: 42 },
  { label: "Planta", value: 34 },
  { label: "Mant.", value: 28 },
  { label: "Bodega", value: 20 },
  { label: "Calidad", value: 15 },
  { label: "Admin", value: 9 },
];

type Segment = {
  label: string;
  value: number;
  count: string;
  /** Tailwind stroke class for the donut arc / legend dot background. */
  stroke: string;
  dot: string;
};

/** Percentages sum to 100; one green segment ("Completadas") is the accent. */
const ORDER_STATUS: Segment[] = [
  {
    label: "Completadas",
    value: 48,
    count: "104",
    stroke: "stroke-brand-green",
    dot: "bg-brand-green",
  },
  {
    label: "En proceso",
    value: 30,
    count: "65",
    stroke: "stroke-primary",
    dot: "bg-primary",
  },
  {
    label: "Pendientes",
    value: 14,
    count: "30",
    stroke: "stroke-primary/55",
    dot: "bg-primary/55",
  },
  {
    label: "Atrasadas",
    value: 8,
    count: "17",
    stroke: "stroke-primary/25",
    dot: "bg-primary/25",
  },
];

type Chip = { label: string; icon: LucideIcon };

const FILTERS: Chip[] = [
  { label: "Área: Todas", icon: LayoutGrid },
  { label: "Periodo: 30 días", icon: CalendarDays },
];

function ReportHeader(): ReactNode {
  return (
    <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border/60 px-4 py-3 sm:px-5">
      <div className="flex min-w-0 flex-col">
        <h2 className="truncate text-sm font-semibold tracking-tight">
          Reporte operacional
        </h2>
        <p className="text-[11px] text-muted-foreground">
          Últimos 30 días · Actualizado recién
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
        <span className="text-lg font-semibold leading-none tracking-tight">
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
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-primary">
              <ArrowUpRight className="h-2.5 w-2.5" aria-hidden="true" />
              {kpi.delta}
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
}

function BarTile(): ReactNode {
  const max = Math.max(...ORDERS_BY_AREA.map((b) => b.value));
  const slot = 50;
  const barW = 26;
  const baseline = 120;
  const maxH = 100;

  return (
    <Tile title="Órdenes por área" subtitle="Este mes">
      <svg
        viewBox="0 0 300 150"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full text-primary"
        aria-hidden="true"
      >
        {ORDERS_BY_AREA.map((bar, i) => {
          const h = (bar.value / max) * maxH;
          const x = i * slot + (slot - barW) / 2;
          const y = baseline - h;
          return (
            <g key={bar.label}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={h}
                rx="3"
                fill="currentColor"
                fillOpacity={i === 0 ? 1 : 0.85 - i * 0.08}
              />
              <text
                x={i * slot + slot / 2}
                y={y - 5}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="9"
              >
                {bar.value}
              </text>
              <text
                x={i * slot + slot / 2}
                y={140}
                textAnchor="middle"
                className="fill-muted-foreground"
                fontSize="9"
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </Tile>
  );
}

function DonutTile(): ReactNode {
  // Precompute the starting offset of each arc so the render stays pure.
  const arcs = ORDER_STATUS.map((seg, i) => ({
    seg,
    offset: -ORDER_STATUS.slice(0, i).reduce((sum, s) => sum + s.value, 0),
  }));

  return (
    <Tile title="Estado de órdenes" subtitle="216 totales" className="lg:row-span-2">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 py-1">
        <div className="relative aspect-square w-full max-w-[150px]">
          <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
            <circle
              cx="50"
              cy="50"
              r="38"
              fill="none"
              className="stroke-muted"
              strokeWidth="14"
            />
            {arcs.map(({ seg, offset }) => (
              <circle
                key={seg.label}
                cx="50"
                cy="50"
                r="38"
                fill="none"
                pathLength={100}
                className={seg.stroke}
                strokeWidth="14"
                strokeDasharray={`${seg.value} ${100 - seg.value}`}
                strokeDashoffset={offset}
                transform="rotate(-90 50 50)"
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-semibold leading-none tracking-tight">
              216
            </span>
            <span className="text-[10px] text-muted-foreground">órdenes</span>
          </div>
        </div>

        <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-1.5">
          {ORDER_STATUS.map((seg) => (
            <li
              key={seg.label}
              className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${seg.dot}`}
                aria-hidden="true"
              />
              <span className="truncate">{seg.label}</span>
              <span className="ml-auto font-medium tabular-nums text-foreground">
                {seg.count}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Tile>
  );
}

function AreaTile(): ReactNode {
  return (
    <Tile
      title="Actividad operacional"
      subtitle="Registradas vs. completadas"
      className="lg:col-span-2"
    >
      <div className="flex shrink-0 items-center gap-4 pb-1">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          Registradas
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
          Completadas
        </span>
      </div>

      <div className="relative min-h-0 flex-1 text-primary">
        <svg
          viewBox="0 0 600 200"
          preserveAspectRatio="none"
          className="h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="reportFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.16" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[40, 80, 120, 160].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="600"
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}

          {/* Completadas (muted, dashed) */}
          <path
            d="M0,165 C40,160 50,150 90,150 C140,150 150,128 190,126 C240,124 250,140 300,132 C350,124 360,104 410,100 C460,96 470,108 510,104 C550,101 570,92 600,90"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />

          {/* Registradas area */}
          <path
            d="M0,140 C30,130 30,128 60,120 C90,112 100,138 120,135 C150,131 155,98 180,95 C210,92 215,114 240,110 C270,106 280,72 300,70 C330,68 335,88 360,85 C390,82 400,57 420,55 C450,53 455,78 480,75 C510,72 520,42 540,40 C570,38 580,54 600,52 L600,200 L0,200 Z"
            fill="url(#reportFill)"
            stroke="none"
          />
          {/* Registradas line */}
          <path
            d="M0,140 C30,130 30,128 60,120 C90,112 100,138 120,135 C150,131 155,98 180,95 C210,92 215,114 240,110 C270,106 280,72 300,70 C330,68 335,88 360,85 C390,82 400,57 420,55 C450,53 455,78 480,75 C510,72 520,42 540,40 C570,38 580,54 600,52"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </Tile>
  );
}

function GaugeTile(): ReactNode {
  return (
    <Tile title="Cumplimiento SLA" subtitle="Meta 90%">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="relative w-full max-w-[180px]">
          <svg viewBox="0 0 100 58" className="h-full w-full" aria-hidden="true">
            <path
              d="M10,50 A40,40 0 0 1 90,50"
              fill="none"
              className="stroke-muted"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M10,50 A40,40 0 0 1 90,50"
              fill="none"
              pathLength={100}
              className="stroke-primary"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray="92 100"
            />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
            <span className="text-2xl font-semibold leading-none tracking-tight">
              92%
            </span>
            <span className="mt-0.5 text-[10px] text-muted-foreground">
              a tiempo
            </span>
          </div>
        </div>
      </div>
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
          <AreaTile />
          <DonutTile />
          <BarTile />
          <GaugeTile />
        </div>
      </main>
    </div>
  );
}
