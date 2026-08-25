import { CalendarRange, Layers, SlidersHorizontal, TrendingUp, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

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
 * Vocabulary and swatches follow the hero report: "Plan" is primary at 40 %,
 * "Gestión" is solid primary. Brand green is the single accent, reserved for
 * favourable contributions in the waterfall. No red.
 * ------------------------------------------------------------------------ */

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
const ELAPSED = AREAS[0]?.gestion.length ?? 0

/* ---- Derived figures ---------------------------------------------------- */

const sum = (values: number[]): number => values.reduce((total, v) => total + v, 0)

const annualPlan = sum(AREAS.map((a) => a.plan))
const ytdShare = sum(PHASING.slice(0, ELAPSED))

/** Monthly plan for the whole exercise. */
const planByMonth = PHASING.map((share) => annualPlan * share)
/** Monthly gestión, summed across areas, elapsed months only. */
const gestionByMonth = Array.from({ length: ELAPSED }, (_, m) =>
	sum(AREAS.map((a) => a.gestion[m] ?? 0))
)

const ytdPlan = sum(planByMonth.slice(0, ELAPSED))
const ytdGestion = sum(gestionByMonth)
const runRate = ytdGestion / ytdPlan
const deviationPct = (runRate - 1) * 100
/** Year-end projection: remaining plan executed at the year-to-date run rate. */
const projectedAnnual = ytdGestion + sum(planByMonth.slice(ELAPSED)) * runRate

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

/** Polyline points on a 0 0 60 20 viewBox from a short series. */
function sparkline(values: number[]): string {
	const min = Math.min(...values)
	const max = Math.max(...values)
	const span = max - min || 1
	const step = values.length > 1 ? 60 / (values.length - 1) : 0
	return values
		.map((v, i) => `${(i * step).toFixed(1)},${(18 - ((v - min) / span) * 16).toFixed(1)}`)
		.join(" ")
}

/* ---- KPIs --------------------------------------------------------------- */

type Kpi = {
	label: string
	value: string
	unit?: string
	delta?: string
	spark: string
}

const cumulative = (values: number[]): number[] => {
	let running = 0
	return values.map((v) => (running += v))
}

const KPIS: Kpi[] = [
	{
		label: "Plan total",
		value: fmtMM(ytdPlan),
		unit: "MM",
		delta: `${fmtPct(ytdShare * 100)} del año`,
		spark: sparkline(cumulative(planByMonth.slice(0, ELAPSED))),
	},
	{
		label: "Gestión acumulada",
		value: fmtMM(ytdGestion),
		unit: "MM",
		delta: `${fmtPct(runRate * 100)} del plan`,
		spark: sparkline(cumulative(gestionByMonth)),
	},
	{
		label: "Desviación vs plan",
		value: fmtPct(deviationPct),
		spark: sparkline(
			gestionByMonth.map((g, m) => ((g - (planByMonth[m] ?? 0)) / (planByMonth[m] ?? 1)) * 100)
		),
	},
	{
		label: "Proyección anual",
		value: fmtMM(projectedAnnual),
		unit: "MM",
		delta: `${fmtPct((projectedAnnual / annualPlan) * 100)} del plan`,
		spark: sparkline(
			cumulative([...gestionByMonth, ...planByMonth.slice(ELAPSED).map((p) => p * runRate)])
		),
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
	children,
}: {
	title: string
	subtitle?: string
	className?: string
	children: ReactNode
}): ReactNode {
	return (
		<div
			className={`border-border/60 bg-background flex min-h-0 flex-col rounded-lg border p-3 ${
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
		</div>
	)
}

function KpiTile({ kpi }: { kpi: Kpi }): ReactNode {
	return (
		<div className="border-border/60 bg-background flex flex-col justify-between rounded-lg border p-3">
			<span className="text-muted-foreground text-[11px]">{kpi.label}</span>
			<div className="mt-2 flex items-end justify-between gap-2">
				<span className="text-lg leading-none font-semibold tracking-tight tabular-nums">
					{kpi.value}
					{kpi.unit ? (
						<span className="text-muted-foreground ml-1 text-[11px] font-medium">{kpi.unit}</span>
					) : null}
				</span>
				<span className="flex flex-col items-end gap-1">
					<svg
						viewBox="0 0 60 20"
						preserveAspectRatio="none"
						className="text-primary h-4 w-14"
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
						<span className="text-primary flex items-center gap-0.5 text-[10px] font-medium whitespace-nowrap tabular-nums">
							<TrendingUp className="h-2.5 w-2.5" aria-hidden="true" />
							{kpi.delta}
						</span>
					) : null}
				</span>
			</div>
		</div>
	)
}

/* ---- Monthly plan vs gestión, with a dashed projection ------------------ */

function Legend({ swatch, children }: { swatch: ReactNode; children: ReactNode }): ReactNode {
	return (
		<span className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
			{swatch}
			{children}
		</span>
	)
}

function ExecutionTile(): ReactNode {
	const W = 600
	const H = 200
	const pad = { top: 16, bottom: 24, left: 6, right: 6 }
	const chartH = H - pad.top - pad.bottom
	const baseline = H - pad.bottom
	const max = Math.max(...planByMonth) * 1.05
	const slot = (W - pad.left - pad.right) / MONTHS.length
	const barW = 9
	const gap = 3

	const yOf = (v: number): number => baseline - (v / max) * chartH
	const centerOf = (i: number): number => pad.left + i * slot + slot / 2

	// Projection rides from the last elapsed month's gestión to year-end at the
	// year-to-date run rate.
	const projPoints = [
		`${centerOf(ELAPSED - 1)},${yOf(gestionByMonth[ELAPSED - 1] ?? 0)}`,
		...planByMonth.slice(ELAPSED).map((p, i) => `${centerOf(ELAPSED + i)},${yOf(p * runRate)}`),
	].join(" ")

	return (
		<Tile title="Ejecución mensual" subtitle="Plan vs. gestión" className="lg:col-span-2">
			<div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 pb-1">
				<Legend swatch={<span className="bg-primary/40 h-1.5 w-1.5 rounded-full" />}>Plan</Legend>
				<Legend swatch={<span className="bg-primary h-1.5 w-1.5 rounded-full" />}>Gestión</Legend>
				<Legend
					swatch={<span className="border-muted-foreground/60 h-px w-4 border-t border-dashed" />}
				>
					Proyección
				</Legend>
			</div>

			<div className="text-primary relative min-h-36 flex-1">
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
						const pY = yOf(planByMonth[i] ?? 0)
						const hasGestion = i < ELAPSED
						const gY = hasGestion ? yOf(gestionByMonth[i] ?? 0) : baseline
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
								{/* Gestión (elapsed months only) */}
								{hasGestion ? (
									<rect
										x={cx + gap / 2}
										y={gY}
										width={barW}
										height={baseline - gY}
										rx="2"
										fill="currentColor"
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

function WaterfallTile(): ReactNode {
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
		if (kind === "anchor") return "fill-primary"
		if (kind === "favorable") return "fill-brand-green"
		return "fill-primary/40"
	}

	return (
		<Tile title="Puente plan → gestión" subtitle="YTD · CLP MM">
			<div className="flex shrink-0 items-center gap-3 pb-1">
				<Legend swatch={<span className="bg-brand-green h-1.5 w-1.5 rounded-full" />}>
					Favorable
				</Legend>
				<Legend swatch={<span className="bg-primary/40 h-1.5 w-1.5 rounded-full" />}>
					Adverso
				</Legend>
			</div>

			<div className="relative h-40 lg:h-auto lg:min-h-32 lg:flex-1">
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

function AreaTableTile(): ReactNode {
	const maxDev = Math.max(...AREA_ROWS.map((a) => Math.abs(a.dev)))

	return (
		<Tile title="Ejecución por área" subtitle="Plan vs. gestión · YTD" className="lg:col-span-3">
			<div className="text-muted-foreground grid grid-cols-[1.4fr_0.9fr_0.9fr_1.3fr] items-center gap-x-3 pb-1 text-[10px] font-medium tracking-wide uppercase">
				<span>Área</span>
				<span className="text-right">Plan</span>
				<span className="text-right">Gestión</span>
				<span className="text-right">Desv. %</span>
			</div>

			<ul className="flex min-h-0 flex-1 flex-col justify-between">
				{AREA_ROWS.map((row) => {
					const intensity = Math.abs(row.dev) / maxDev // 0..1
					const barW = 20 + intensity * 60 // % width of the deviation bar
					return (
						<li
							key={row.label}
							className="border-border/40 grid grid-cols-[1.4fr_0.9fr_0.9fr_1.3fr] items-center gap-x-3 border-b py-[3px] text-[11px] last:border-b-0"
						>
							<span className="flex items-center gap-1.5 truncate">
								<span
									className="bg-primary h-1.5 w-1.5 shrink-0 rounded-full"
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
											row.dev >= 0 ? "bg-brand-green left-1/2" : "bg-primary/45 right-1/2"
										}`}
										style={{ width: `${barW / 2}%` }}
										aria-hidden="true"
									/>
								</span>
								<span className="text-foreground w-12 text-right font-medium tabular-nums">
									{fmtPct(row.dev, true)}
								</span>
							</span>
						</li>
					)
				})}
			</ul>
		</Tile>
	)
}

export function PanelReportability(): ReactNode {
	return (
		<div className="flex h-full w-full flex-col overflow-hidden">
			<FilterBar />

			<main className="flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4">
				{/* KPI row */}
				<div className="grid shrink-0 grid-cols-2 gap-3 lg:grid-cols-4">
					{KPIS.map((kpi) => (
						<KpiTile key={kpi.label} kpi={kpi} />
					))}
				</div>

				{/* Visual canvas */}
				<div className="grid min-h-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-3">
					<ExecutionTile />
					<WaterfallTile />
					<AreaTableTile />
				</div>
			</main>
		</div>
	)
}
