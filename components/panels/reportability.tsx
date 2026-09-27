import { CalendarRange, Layers, SlidersHorizontal, TrendingDown, TrendingUp, type LucideIcon } from "lucide-react"
import { motion, type Transition, type Variants } from "motion/react"
import type { ReactNode } from "react"
import { useStaggerEntrance } from "@/lib/motion"

/* --------------------------------------------------------------------------
 * Budget-execution report (Ejecución presupuestaria).
 * A slim filter bar over a canvas of hand-rolled SVG chart tiles:
 *   - monthly plan-vs-gestión bars with a dashed projection,
 *   - a plan -> gestión waterfall bridge,
 *   - a per-area deviation table.
 *
 * Every figure derives from ONE dataset: the per-area rows in `AREAS` (annual
 * plan + monthly gestión for the elapsed months) and the plan phasing in
 * `PHASING`. KPIs, series, bridge and table are computed, never hand-typed,
 * so they always agree with each other.
 *
 * Vocabulary and swatches follow the hero report: "Plan" is brand-blue at
 * 40 %, "Gestión" is solid brand-blue — decorative chart fills, never text.
 * Brand green is the single accent, reserved for favourable contributions in
 * the waterfall. No red.
 * ------------------------------------------------------------------------ */

/* ---- Entrance ------------------------------------------------------------ */

/** Stagger offset between the panel's staggered items (seconds): the four KPI
 * cards, then the execution chart, the waterfall and the table tile. */
export const ENTRANCE_STAGGER = 0.06
/** Tighter offset for the deviation-table rows, which follow their tile. */
export const ROW_STAGGER = 0.04

/** Variants + transition handed down from the panel's entrance recipe. */
type Entrance = { variants: Variants; transition: Transition }

/** Container for the deviation-table rows. It carries no `initial`/`animate`
 * of its own, so it inherits the panel's animated state; motion accumulates
 * orchestration delays down the tree, so the rows begin when the table tile
 * (the 7th staggered item) enters and the last row starts at
 * 6 × ENTRANCE_STAGGER + 5 × ROW_STAGGER = 0.56 s. Reduced motion builds the
 * same container through the entrance recipe, which returns a static one. */
type Area = {
	label: string
	/** Annual plan, CLP MM. */
	plan: number
	/** Gestión per elapsed month, CLP MM (Ene..May). */
	gestion: number[]
}

const AREAS: Area[] = [
	{ label: "Operaciones", plan: 14850, gestion: [880, 960, 1040, 1100, 1120] },
	{ label: "Mantención", plan: 9230, gestion: [610, 650, 700, 720, 740] },
	{ label: "Administración", plan: 6800, gestion: [520, 540, 550, 555, 565] },
	{ label: "Comercial", plan: 3400, gestion: [250, 280, 300, 310, 320] },
	{ label: "TI", plan: 3110, gestion: [190, 200, 215, 220, 225] },
	{ label: "Otros", plan: 9910, gestion: [700, 740, 790, 820, 850] },
]

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

/** Share of the annual plan phased into each month (sums to 1). */
const PHASING = [0.07, 0.075, 0.082, 0.088, 0.09, 0.088, 0.085, 0.085, 0.083, 0.085, 0.083, 0.086]

/** Elapsed months in the exercise (Ene..May). */
export const ELAPSED = AREAS[0]?.gestion.length ?? 0

/* ---- Derived figures ---------------------------------------------------- */

const sum = (values: number[]): number => values.reduce((total, v) => total + v, 0)

const annualPlan = sum(AREAS.map((a) => a.plan))
const ytdShare = sum(PHASING.slice(0, ELAPSED))

/** Monthly plan for the whole exercise. */
export const PLAN_BY_MONTH = PHASING.map((share) => annualPlan * share)
/** Monthly gestión, summed across areas, elapsed months only. */
export const GESTION_BY_MONTH = Array.from({ length: ELAPSED }, (_, m) =>
	sum(AREAS.map((a) => a.gestion[m] ?? 0))
)

const ytdPlan = sum(PLAN_BY_MONTH.slice(0, ELAPSED))
const ytdGestion = sum(GESTION_BY_MONTH)
const runRate = ytdGestion / ytdPlan
const deviationPct = (runRate - 1) * 100
/** Year-end projection: remaining plan executed at the year-to-date run rate. */
const projectedAnnual = ytdGestion + sum(PLAN_BY_MONTH.slice(ELAPSED)) * runRate
/** Run-rate projection per future month (Jun..Dic), CLP MM. One dataset: the
 * remaining plan phased at the observed year-to-date run rate. */
export const PROJECTED_BY_MONTH = PLAN_BY_MONTH.slice(ELAPSED).map((p) => p * runRate)

type AreaRow = {
	label: string
	/** Year-to-date plan, CLP MM. */
	plan: number
	/** Year-to-date gestión, CLP MM. */
	gestion: number
	/** Deviation % (negative = under plan). */
	dev: number
}

const AREA_ROWS: AreaRow[] = AREAS.map((a) => {
	const plan = a.plan * ytdShare
	const gestion = sum(a.gestion)
	return { label: a.label, plan, gestion, dev: ((gestion - plan) / plan) * 100 }
})

/* ---- Formatting --------------------------------------------------------- */

/** Format a CLP MM figure with a thousands separator, no decimals. */
function fmtMM(n: number): string {
	return Math.round(n).toLocaleString("es-CL")
}

function fmtPct(n: number, signed = false): string {
	const abs = Math.abs(n).toLocaleString("es-CL", {
		minimumFractionDigits: 1,
		maximumFractionDigits: 1,
	})
	if (n < 0) return `−${abs}%`
	return signed && n > 0 ? `+${abs}%` : `${abs}%`
}

/* ---- KPIs --------------------------------------------------------------- */

/** One deliberately distinct micro-visual per KPI — never four identical
 * sparklines. Each treatment encodes how its figure behaves over time. */
type KpiKind = "cumulative-plan" | "gestion-vs-target" | "deviation" | "projection-vs-plan"

type Kpi = {
	label: string
	value: string
	unit?: string
	/** Numeric secondary annotation under the micro-visual. */
	delta?: string
	/** Arrow direction for the annotation; deviation reads downward. */
	trend?: "up" | "down"
	kind: KpiKind
}

/** Deviation % per elapsed month (negative = under plan). */
const devByMonth = GESTION_BY_MONTH.map(
	(g, m) => ((g - (PLAN_BY_MONTH[m] ?? 0)) / (PLAN_BY_MONTH[m] ?? 1)) * 100
)
const lastMonthDev = devByMonth[ELAPSED - 1] ?? 0

export const KPIS: Kpi[] = [
	{
		label: "Plan total",
		value: fmtMM(ytdPlan),
		unit: "MM",
		delta: `${fmtPct(ytdShare * 100)} del año`,
		kind: "cumulative-plan",
	},
	{
		label: "Gestión acumulada",
		value: fmtMM(ytdGestion),
		unit: "MM",
		delta: `${fmtPct(runRate * 100)} del plan`,
		kind: "gestion-vs-target",
	},
	{
		label: "Desviación vs plan",
		value: fmtPct(deviationPct),
		delta: `Últ. mes: ${fmtPct(lastMonthDev, true)}`,
		trend: "down",
		kind: "deviation",
	},
	{
		label: "Proyección anual",
		value: fmtMM(projectedAnnual),
		unit: "MM",
		delta: `${fmtPct((projectedAnnual / annualPlan) * 100)} del plan`,
		kind: "projection-vs-plan",
	},
]

/* ---- Filter bar --------------------------------------------------------- */

type Chip = { label: string; icon: LucideIcon }

const FILTERS: Chip[] = [
	{ label: "Escenario: Base", icon: Layers },
	{ label: `Periodo: YTD · ${MONTHS[ELAPSED - 1]} 2026`, icon: CalendarRange },
]

function FilterBar(): ReactNode {
	return (
		<div className="border-border/60 flex shrink-0 flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b px-3 py-2 sm:px-4">
			<div className="flex flex-wrap items-center gap-1.5">
				{FILTERS.map((chip) => (
					<span
						key={chip.label}
						className="border-border/60 bg-muted/40 text-muted-foreground inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-medium"
					>
						<chip.icon className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
						{chip.label}
					</span>
				))}
				<span className="border-border/60 bg-muted/40 text-muted-foreground inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-medium">
					Área: Todas
				</span>
			</div>
			<span className="border-border/60 text-muted-foreground inline-flex items-center gap-1.5 rounded-sm border px-2 py-1 text-[11px] font-medium">
				<SlidersHorizontal className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
				Filtros
			</span>
		</div>
	)
}

/* ---- Tiles -------------------------------------------------------------- */

function Tile({
	title,
	subtitle,
	className,
	entrance,
	children,
}: {
	title: string
	subtitle?: string
	className?: string
	entrance: Entrance
	children: ReactNode
}): ReactNode {
	return (
		<motion.div
			variants={entrance.variants}
			transition={entrance.transition}
			className={`border-border/60 bg-background flex min-h-0 flex-col overflow-hidden rounded-lg border p-3 ${
				className ?? ""
			}`}
		>
			<div className="flex shrink-0 items-baseline justify-between gap-2">
				<h3 className="text-[12px] font-semibold tracking-tight">{title}</h3>
				{subtitle ? (
					<span className="text-muted-foreground truncate text-[10px]">{subtitle}</span>
				) : null}
			</div>
			<div className="mt-2 flex min-h-0 flex-1 flex-col">{children}</div>
		</motion.div>
	)
}

/* KPI micro-visuals. Every treatment is drawn on a 96 × 32 box and rendered at
 * exactly that size (h-8 w-24), so no shape is ever distorted by a stretched
 * viewBox and every shape keeps real amplitude. Each one encodes a different
 * behaviour, so a scanning reader can tell the cards apart by shape before
 * reading a single number. */

const KPI_VB_W = 96
const KPI_VB_H = 32

/** Plan total: the year as twelve discrete month cells, the elapsed ones lit.
 * Reads as a calendar strip — never as another line. */
function PlanPacingVisual(): ReactNode {
	const cells = MONTHS.length
	const gap = 1.5
	const cellW = (KPI_VB_W - gap * (cells - 1)) / cells
	return (
		<svg
			viewBox={`0 0 ${KPI_VB_W} ${KPI_VB_H}`}
			data-visual="month-cells"
			className="text-brand-blue h-8 w-24 shrink-0"
			aria-hidden="true"
		>
			{Array.from({ length: cells }, (_, i) => {
				const elapsed = i < ELAPSED
				return (
					<rect
						key={i}
						x={i * (cellW + gap)}
						y="6"
						width={cellW}
						height="20"
						rx="2"
						fill="currentColor"
						fillOpacity={elapsed ? 0.75 : 0.12}
					/>
				)
			})}
		</svg>
	)
}

/** Gestión acumulada: paired plan/gestión mini columns, the same faint/solid
 * encoding as the monthly execution chart. */
function GestionVsTargetVisual(): ReactNode {
	const max = Math.max(...PLAN_BY_MONTH.slice(0, ELAPSED), ...GESTION_BY_MONTH)
	const slot = KPI_VB_W / ELAPSED
	const barW = 8
	const pairW = barW * 2 + 2
	const baseline = KPI_VB_H - 2
	const hOf = (v: number): number => (v / max) * 26
	return (
		<svg
			viewBox={`0 0 ${KPI_VB_W} ${KPI_VB_H}`}
			data-visual="paired-columns"
			className="text-brand-blue h-8 w-24 shrink-0"
			aria-hidden="true"
		>
			{GESTION_BY_MONTH.map((g, m) => {
				const p = PLAN_BY_MONTH[m] ?? 0
				const x0 = m * slot + (slot - pairW) / 2
				return (
					<g key={m}>
						<rect
							x={x0}
							y={baseline - hOf(p)}
							width={barW}
							height={hOf(p)}
							rx="1"
							fill="currentColor"
							fillOpacity="0.35"
						/>
						<rect
							x={x0 + barW + 2}
							y={baseline - hOf(g)}
							width={barW}
							height={hOf(g)}
							rx="1"
							fill="currentColor"
						/>
					</g>
				)
			})}
		</svg>
	)
}

/** Desviación: zero-centered diverging columns on a FIXED ±10 % domain mapped
 * to the full half-height (clamped), so small deviations keep visible
 * amplitude instead of collapsing into dashes. The zero line stays visible. */
const DEV_DOMAIN_PCT = 10
const DEV_HALF_H = 13

function DeviationVisual(): ReactNode {
	const barH = (dev: number): number =>
		Math.max(Math.min(Math.abs(dev) / DEV_DOMAIN_PCT, 1) * DEV_HALF_H, 2.5)
	const slot = KPI_VB_W / ELAPSED
	const barW = 12
	const zero = KPI_VB_H / 2
	return (
		<svg
			viewBox={`0 0 ${KPI_VB_W} ${KPI_VB_H}`}
			data-visual="zero-centered-columns"
			className="text-brand-blue h-8 w-24 shrink-0"
			aria-hidden="true"
		>
			<line
				x1="0"
				y1={zero}
				x2={KPI_VB_W}
				y2={zero}
				stroke="currentColor"
				strokeOpacity="0.25"
				strokeWidth="1"
				vectorEffect="non-scaling-stroke"
			/>
			{devByMonth.map((dev, m) => {
				const h = barH(dev)
				return (
					<rect
						key={m}
						x={m * slot + (slot - barW) / 2}
						y={dev >= 0 ? zero - h : zero}
						width={barW}
						height={h}
						rx="1"
						fill="currentColor"
						fillOpacity={dev >= 0 ? 0.85 : 0.6}
					/>
				)
			})}
		</svg>
	)
}

/** Proyección anual: a bullet chart — the annual plan as the track, gestión
 * acumulada as the filled bar, the forward projection as a marker and the plan
 * target as the end tick. It reads as a bar with markers, not as a line. */
function ProjectionScaleVisual(): ReactNode {
	const mid = KPI_VB_H / 2
	const xOf = (v: number): number => Math.min(Math.max(v / annualPlan, 0), 1) * (KPI_VB_W - 2)
	const barH = 9
	return (
		<svg
			viewBox={`0 0 ${KPI_VB_W} ${KPI_VB_H}`}
			data-visual="projection-bullet"
			className="text-brand-blue h-8 w-24 shrink-0"
			aria-hidden="true"
		>
			{/* Track: the annual plan. */}
			<rect
				x="0"
				y={mid - barH / 2}
				width={KPI_VB_W}
				height={barH}
				rx="1"
				fill="currentColor"
				fillOpacity="0.12"
			/>
			{/* Gestión acumulada: what is already executed. */}
			<rect
				x="0"
				y={mid - barH / 2}
				width={Math.max(xOf(ytdGestion), 2)}
				height={barH}
				rx="1"
				fill="currentColor"
				fillOpacity="0.55"
			/>
			{/* Forward projection: a marker above and below the track. */}
			<line
				x1={xOf(projectedAnnual)}
				y1={mid - barH / 2 - 6}
				x2={xOf(projectedAnnual)}
				y2={mid + barH / 2 + 6}
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
			/>
			{/* Annual plan target: end tick. */}
			<line
				x1={KPI_VB_W - 1}
				y1={mid - barH}
				x2={KPI_VB_W - 1}
				y2={mid + barH}
				stroke="currentColor"
				strokeOpacity="0.7"
				strokeWidth="1.5"
				vectorEffect="non-scaling-stroke"
			/>
		</svg>
	)
}

const KPI_VISUALS: Record<KpiKind, () => ReactNode> = {
	"cumulative-plan": PlanPacingVisual,
	"gestion-vs-target": GestionVsTargetVisual,
	deviation: DeviationVisual,
	"projection-vs-plan": ProjectionScaleVisual,
}

function KpiTile({ kpi, entrance }: { kpi: Kpi; entrance: Entrance }): ReactNode {
	const Visual = KPI_VISUALS[kpi.kind]
	return (
		<motion.div
			data-kpi={kpi.kind}
			variants={entrance.variants}
			transition={entrance.transition}
			className="border-border/60 bg-background flex flex-col justify-between rounded-lg border p-3"
		>
			<span className="text-muted-foreground text-[11px]">{kpi.label}</span>
			<div className="mt-2 flex flex-wrap items-end justify-between gap-2">
				<span className="text-lg leading-none font-semibold tracking-tight tabular-nums">
					{kpi.value}
					{kpi.unit ? (
						<span className="text-muted-foreground ml-1 text-[11px] font-medium">{kpi.unit}</span>
					) : null}
				</span>
				<span className="ml-auto flex flex-col items-end gap-1">
					<Visual />
					{kpi.delta ? (
						<span className="text-primary flex items-center gap-0.5 text-[10px] font-medium whitespace-nowrap tabular-nums">
							{kpi.trend === "down" ? (
								<TrendingDown className="h-2.5 w-2.5" aria-hidden="true" />
							) : (
								<TrendingUp className="h-2.5 w-2.5" aria-hidden="true" />
							)}
							{kpi.delta}
						</span>
					) : null}
				</span>
			</div>
		</motion.div>
	)
}

/* ---- Monthly plan vs gestión, with a dashed projection ------------------ */

/** Horizontal geometry of the execution chart (the svg stretches via
 * preserveAspectRatio="none"); exported so tests can reason about x positions. */
export const EXEC_GEOMETRY = {
	w: 600,
	padLeft: 6,
	padRight: 6,
	slot: (600 - 12) / MONTHS.length,
} as const

/** x of the boundary between the last elapsed month and the first future one:
 * where the dashed projection leaves the actuals behind. */
export const PROJECTION_START_X = EXEC_GEOMETRY.padLeft + ELAPSED * EXEC_GEOMETRY.slot

function Legend({ swatch, children }: { swatch: ReactNode; children: ReactNode }): ReactNode {
	return (
		<span className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
			{swatch}
			{children}
		</span>
	)
}

function ExecutionTile({ entrance }: { entrance: Entrance }): ReactNode {
	const W = EXEC_GEOMETRY.w
	const H = 200
	// No bottom padding is reserved for labels: the month axis is real HTML
	// below the chart, so text never lives inside the vertically-scaled SVG
	// (where `preserveAspectRatio="none"` squashes and clips it).
	const pad = { top: 16, bottom: 6, left: EXEC_GEOMETRY.padLeft, right: EXEC_GEOMETRY.padRight }
	const chartH = H - pad.top - pad.bottom
	const baseline = H - pad.bottom
	const max = Math.max(...PLAN_BY_MONTH) * 1.05
	const slot = EXEC_GEOMETRY.slot
	const barW = 9
	const gap = 3

	const yOf = (v: number): number => baseline - (v / max) * chartH
	const centerOf = (i: number): number => pad.left + i * slot + slot / 2

	// The projection leaves the actuals at the boundary after the last elapsed
	// month: it anchors there at the last gestión level and then rides the
	// projected months, so it never reads as a flat line floating mid-chart.
	const projPoints = [
		`${PROJECTION_START_X},${yOf(GESTION_BY_MONTH[ELAPSED - 1] ?? 0)}`,
		...PROJECTED_BY_MONTH.map((p, i) => `${centerOf(ELAPSED + i)},${yOf(p)}`),
	].join(" ")

	return (
		<Tile title="Ejecución mensual" subtitle="Plan vs. gestión" className="lg:col-span-2" entrance={entrance}>
			<div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 pb-1">
				<Legend swatch={<span className="bg-brand-blue/40 h-1.5 w-1.5 rounded-full" />}>
					Plan
				</Legend>
				<Legend swatch={<span className="bg-brand-blue h-1.5 w-1.5 rounded-full" />}>
					Gestión
				</Legend>
				<Legend
					swatch={
						<span className="border-brand-blue/60 bg-brand-blue/10 h-2 w-3 rounded-[2px] border border-dashed" />
					}
				>
					Proyectado
				</Legend>
				<Legend
					swatch={<span className="border-muted-foreground/60 h-px w-4 border-t border-dashed" />}
				>
					Proyección
				</Legend>
			</div>

			<div className="text-brand-blue relative min-h-24 min-w-0 flex-1">
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
						const cx = centerOf(i)
						const pY = yOf(PLAN_BY_MONTH[i] ?? 0)
						const hasGestion = i < ELAPSED
						const gY = hasGestion ? yOf(GESTION_BY_MONTH[i] ?? 0) : baseline
						const projY = yOf(PROJECTED_BY_MONTH[i - ELAPSED] ?? 0)
						return (
							<g key={label}>
								{/* Plan */}
								<rect
									x={cx - barW - gap / 2}
									y={pY}
									width={barW}
									height={baseline - pY}
									rx="2"
									fill="currentColor"
									fillOpacity="0.4"
								/>
								{/* Gestión for elapsed months; a distinct projected value (faint
								    fill + dashed outline) in the gestión slot for future ones, so
								    every month reads as a paired comparison. */}
								{hasGestion ? (
									<rect
										x={cx + gap / 2}
										y={gY}
										width={barW}
										height={baseline - gY}
										rx="2"
										fill="currentColor"
									/>
								) : (
									<rect
										x={cx + gap / 2}
										y={projY}
										width={barW}
										height={baseline - projY}
										rx="2"
										fill="currentColor"
										fillOpacity="0.12"
										stroke="currentColor"
										strokeOpacity="0.55"
										strokeDasharray="3 3"
										strokeWidth="1"
										vectorEffect="non-scaling-stroke"
									/>
								)}
							</g>
						)
					})}

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

			{/* Month axis as real HTML: a 12-column row whose proportional side
			    padding mirrors the chart's own padding, so every label centers
			    exactly under its month slot at any rendered width. Elapsed months
			    read in the foreground; future months stay muted. */}
			<div
				className="text-muted-foreground grid shrink-0 grid-cols-12 pt-1 text-[10px] leading-none"
				style={{
					paddingLeft: `${(pad.left / W) * 100}%`,
					paddingRight: `${(pad.right / W) * 100}%`,
				}}
			>
				{MONTHS.map((label, i) => (
					<span
						key={label}
						className={
							i < ELAPSED ? "text-center text-foreground font-medium" : "text-center"
						}
					>
						{label}
					</span>
				))}
			</div>
		</Tile>
	)
}

/* ---- Plan -> gestión waterfall bridge ----------------------------------- */

type BridgeKind = "anchor" | "favorable" | "adverse"

type BridgeColumn = {
	label: string
	kind: BridgeKind
	/** Absolute total for anchors, signed contribution for steps. */
	value: number
	topVal: number
	/** null = anchor, drawn down to the floor. */
	botVal: number | null
	/** Running total the dashed connector rides to the next bar. */
	endLevel: number
}

/** Short labels for the bridge; areas not listed fold into "Resto". */
const BRIDGE_LABELS: Record<string, string> = {
	Operaciones: "Oper.",
	Mantención: "Mant.",
	Comercial: "Comer.",
	TI: "TI",
}

function buildBridge(): BridgeColumn[] {
	const named = AREA_ROWS.filter((r) => r.label in BRIDGE_LABELS)
	const rest = AREA_ROWS.filter((r) => !(r.label in BRIDGE_LABELS))
	const steps = [
		...named.map((r) => ({ label: BRIDGE_LABELS[r.label] ?? r.label, delta: r.gestion - r.plan })),
		{ label: "Resto", delta: sum(rest.map((r) => r.gestion - r.plan)) },
	]

	let running = ytdPlan
	const cols: BridgeColumn[] = [
		{
			label: "Plan",
			kind: "anchor",
			value: ytdPlan,
			topVal: ytdPlan,
			botVal: null,
			endLevel: ytdPlan,
		},
	]
	for (const step of steps) {
		const prev = running
		running += step.delta
		cols.push({
			label: step.label,
			kind: step.delta >= 0 ? "favorable" : "adverse",
			value: step.delta,
			topVal: Math.max(prev, running),
			botVal: Math.min(prev, running),
			endLevel: running,
		})
	}
	cols.push({
		label: "Gestión",
		kind: "anchor",
		value: running,
		topVal: running,
		botVal: null,
		endLevel: running,
	})
	return cols
}

const BRIDGE = buildBridge()

function WaterfallTile({ entrance }: { entrance: Entrance }): ReactNode {
	// Panoramic viewBox (wider than the tile) so `meet` fits to width and the
	// bars span the whole card instead of being letterboxed with side gaps.
	const W = 360
	const H = 150
	const pad = { top: 18, bottom: 20 }
	const chartH = H - pad.top - pad.bottom
	const baseline = H - pad.bottom

	// Zoom the y-domain to the band where the action happens so small step
	// deltas gain readable height instead of vanishing against the anchors.
	const dataVals = BRIDGE.flatMap((c) => (c.botVal === null ? [c.topVal] : [c.topVal, c.botVal]))
	const dataMin = Math.min(...dataVals)
	const dataMax = Math.max(...dataVals)
	const spread = dataMax - dataMin || 1
	const floor = dataMin - spread * 0.55
	const ceil = dataMax + spread * 0.12

	const slot = W / BRIDGE.length
	const barW = slot * 0.66
	const yOf = (v: number): number => baseline - ((v - floor) / (ceil - floor)) * chartH
	const centerOf = (i: number): number => i * slot + slot / 2

	const fillFor = (kind: BridgeKind): string => {
		if (kind === "anchor") return "fill-brand-blue"
		if (kind === "favorable") return "fill-brand-green"
		return "fill-brand-blue/40"
	}

	return (
		<Tile title="Puente plan → gestión" subtitle="YTD · CLP MM" entrance={entrance}>
			<div className="flex shrink-0 items-center gap-3 pb-1">
				<Legend swatch={<span className="bg-brand-green h-1.5 w-1.5 rounded-full" />}>
					Favorable
				</Legend>
				<Legend swatch={<span className="bg-brand-blue/40 h-1.5 w-1.5 rounded-full" />}>
					Adverso
				</Legend>
			</div>

			<div className="relative h-40 lg:h-auto lg:min-h-0 lg:flex-1">
				<svg
					viewBox={`0 0 ${W} ${H}`}
					preserveAspectRatio="xMidYMid meet"
					className="h-full w-full"
					aria-hidden="true"
				>
					{BRIDGE.map((c, i) => {
						const cx = centerOf(i)
						const yTop = yOf(c.topVal)
						const yBottom = c.botVal === null ? baseline : yOf(c.botVal)
						const h = Math.max(yBottom - yTop, 2)
						const nextX = i < BRIDGE.length - 1 ? centerOf(i + 1) : null
						const connY = yOf(c.endLevel)
						return (
							<g key={c.label}>
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
									fontSize="11"
								>
									{c.kind === "anchor"
										? fmtMM(c.value)
										: `${c.value >= 0 ? "+" : "−"}${fmtMM(Math.abs(c.value))}`}
								</text>
								<text
									x={cx}
									y={H - 6}
									textAnchor="middle"
									className="fill-muted-foreground"
									fontSize="11"
								>
									{c.label}
								</text>
							</g>
						)
					})}
				</svg>
			</div>
		</Tile>
	)
}

/* ---- Per-area deviation table ------------------------------------------ */

function AreaTableTile({ entrance }: { entrance: Entrance }): ReactNode {
	const maxDev = Math.max(...AREA_ROWS.map((a) => Math.abs(a.dev)))
	// Reduced motion returns a static container and instant items, so the rows
	// do not pop in one after another when motion is not wanted.
	const { container: rowContainer, item: rowItem, itemTransition: rowTransition } =
		useStaggerEntrance(ROW_STAGGER)

	return (
		<Tile title="Ejecución por área" subtitle="Plan vs. gestión · YTD" className="lg:col-span-3" entrance={entrance}>
			<div className="text-muted-foreground grid grid-cols-[1.4fr_0.9fr_0.9fr_1.3fr] items-center gap-x-3 pb-1 text-[10px] font-medium tracking-wide uppercase">
				<span>Área</span>
				<span className="text-right">Plan</span>
				<span className="text-right">Gestión</span>
				<span className="text-right">Desv. %</span>
			</div>

			<motion.ul className="flex min-h-0 flex-1 flex-col justify-between" variants={rowContainer}>
				{AREA_ROWS.map((row) => {
					const intensity = Math.abs(row.dev) / maxDev // 0..1
					const barW = 20 + intensity * 60 // % width of the deviation bar
					return (
						<motion.li
							key={row.label}
							variants={rowItem}
							transition={rowTransition}
							className="border-border/40 grid grid-cols-[1.4fr_0.9fr_0.9fr_1.3fr] items-center gap-x-3 border-b py-[2px] text-[11px] leading-tight last:border-b-0"
						>
							<span className="flex items-center gap-1.5 truncate">
								<span
									className="bg-brand-blue h-1.5 w-1.5 shrink-0 rounded-full"
									style={{ opacity: 0.35 + intensity * 0.65 }}
									aria-hidden="true"
								/>
								<span className="text-foreground truncate">{row.label}</span>
							</span>
							<span className="text-muted-foreground text-right tabular-nums">
								{fmtMM(row.plan)}
							</span>
							<span className="text-foreground text-right tabular-nums">{fmtMM(row.gestion)}</span>
							<span className="flex items-center justify-end gap-2">
								<span className="bg-muted relative hidden h-1.5 w-14 overflow-hidden rounded-full sm:block">
									<span
										className={`absolute inset-y-0 rounded-full ${
											row.dev >= 0 ? "bg-brand-green left-1/2" : "bg-brand-blue/45 right-1/2"
										}`}
										style={{ width: `${barW / 2}%` }}
										aria-hidden="true"
									/>
								</span>
								<span className="text-foreground w-12 text-right font-medium tabular-nums">
									{fmtPct(row.dev, true)}
								</span>
							</span>
						</motion.li>
					)
				})}
			</motion.ul>
		</Tile>
	)
}

export function PanelReportability(): ReactNode {
	const { container, item, itemTransition } = useStaggerEntrance(ENTRANCE_STAGGER)
	const entrance: Entrance = { variants: item, transition: itemTransition }

	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			<FilterBar />

			{/* Mount-based stagger: the panel plays when its tab activates, so
			    there is no scroll trigger inside the frame. Depth-first reading
			    order: KPI row → execution chart → waterfall → table (whose rows
			    follow inside the table tile's own tighter stagger). */}
			<motion.div
				className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4"
				initial="hidden"
				animate="visible"
				variants={container}
			>
				{/* KPI row */}
				<div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
					{KPIS.map((kpi) => (
						<KpiTile key={kpi.label} kpi={kpi} entrance={entrance} />
					))}
				</div>

				{/* Visual canvas */}
				<div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-3">
					<ExecutionTile entrance={entrance} />
					<WaterfallTile entrance={entrance} />
					<AreaTableTile entrance={entrance} />
				</div>
			</motion.div>
		</div>
	)
}
