"use client"

import {
	ALL_SERVICES,
	CHART_MAX,
	SERVICES,
	UNITS,
	YEARS,
	difference,
	differencePct,
	filterByService,
	formatAmount,
	formatPct,
	type CostCentre,
	type MonthPoint,
	type Unit,
} from "@/components/diagrams/report/data"
import { DATA_TRANSITION, EASE } from "@/components/diagrams/visual/constants"
import { Figure } from "@/components/diagrams/visual/figure"
import { VisualFrame } from "@/components/diagrams/visual/frame"
import type { InputSpec } from "@/components/diagrams/visual/input-card"
import { StatusLine } from "@/components/diagrams/visual/status-line"
import { Tile } from "@/components/diagrams/visual/tile"
import { useEntrance } from "@/components/diagrams/visual/use-entrance"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { ChevronDown, Database, FileSpreadsheet, Users, Wifi } from "lucide-react"
import { motion } from "motion/react"
import { useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Reportabilidad — a management report the way the studio actually builds
 * them: slicers down the left, a KPI strip, plan-versus-execution bars with
 * the difference line, and the cost-centre table underneath.
 *
 * The sources sit above the report and feed it. It enters in the order the
 * data arrives: each source connects and fills the part of the report it
 * feeds. After that it is a working report — year, unit and service slicers,
 * the legend and the bars all respond.
 * ------------------------------------------------------------------------ */

/** In connection order. Each one unlocks the stage of the same index + 1. */
const SOURCES: InputSpec[] = [
	{ id: "erp", label: "ERP", meta: "Ventas y costos", icon: Database },
	{ id: "planillas", label: "Planillas", meta: "12 archivos · Excel", icon: FileSpreadsheet },
	{ id: "crm", label: "CRM", meta: "Clientes y contratos", icon: Users },
]

const STAGE_MS = [600, 1350, 2100]

/** Secondary axis for the difference line: ±DIF_RANGE % spans the plot height. */
const DIF_RANGE = 15
const difY = (pct: number): number =>
	50 - (Math.max(-DIF_RANGE, Math.min(DIF_RANGE, pct)) * 50) / DIF_RANGE

/* ----------------------------------- pieces ------------------------------- */

function Kpi({
	label,
	value,
	format,
	active,
	reduced,
	signed = false,
}: {
	label: string
	value: number
	format: (v: number) => string
	active: boolean
	reduced: boolean
	/** Colour a positive figure green; negatives stay quiet. */
	signed?: boolean
}): ReactNode {
	return (
		<div className="border-border bg-muted/30 min-w-0 rounded-sm border px-2.5 py-2">
			<p className="text-muted-foreground truncate text-[10px] font-medium tracking-wide">
				{label}
			</p>
			<p
				className={cn(
					"mt-0.5 truncate text-sm font-semibold tabular-nums transition-colors duration-300",
					signed && active && value < 0 && "text-muted-foreground"
				)}
				style={signed && active && value > 0 ? { color: "var(--brand-green-text)" } : undefined}
			>
				{active ? <Figure value={value} format={format} active={active} reduced={reduced} /> : "—"}
			</p>
		</div>
	)
}

function MonthGroup({
	point,
	index,
	unit,
	show,
	showPlan,
	showGestion,
	hovered,
	dimmed,
	onHover,
	reduced,
}: {
	point: MonthPoint
	index: number
	unit: Unit
	show: boolean
	showPlan: boolean
	showGestion: boolean
	hovered: boolean
	dimmed: boolean
	onHover: (index: number | null) => void
	reduced: boolean
}): ReactNode {
	const pct = differencePct(point.plan, point.gestion)
	const bar = (value: number, visible: boolean) =>
		`${visible && show ? (value / CHART_MAX) * 100 : 0}%`
	const barTransition = {
		...DATA_TRANSITION,
		duration: reduced ? 0 : 0.7,
		delay: reduced ? 0 : index * 0.04,
	}

	return (
		<div
			className={cn(
				"relative flex h-full flex-1 cursor-default items-end justify-center gap-1 transition-opacity duration-200",
				dimmed && "opacity-50"
			)}
			onMouseEnter={() => onHover(index)}
			onMouseLeave={() => onHover(null)}
			onFocus={() => onHover(index)}
			onBlur={() => onHover(null)}
			tabIndex={0}
			aria-label={`${point.label}: plan ${formatAmount(point.plan, unit)}, gestión ${formatAmount(point.gestion, unit)}, diferencia ${formatPct(pct)}`}
		>
			<motion.div
				className="bg-primary/40 w-3 rounded-t-xs"
				initial={{ height: 0 }}
				animate={{ height: bar(point.plan, showPlan) }}
				transition={barTransition}
			/>
			<motion.div
				className="bg-primary w-3 rounded-t-xs"
				initial={{ height: 0 }}
				animate={{ height: bar(point.gestion, showGestion) }}
				transition={barTransition}
			/>

			{/* Difference marker and its label: move with the line, on the same clock. */}
			<motion.span
				className="border-background bg-foreground pointer-events-none absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border"
				initial={{ opacity: 0 }}
				animate={{ opacity: show ? 1 : 0, top: `${difY(pct)}%` }}
				transition={{
					top: { ...DATA_TRANSITION, duration: reduced ? 0 : 0.7 },
					opacity: { duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.5 + index * 0.06 },
				}}
			/>
			<motion.span
				className="bg-background/90 text-muted-foreground pointer-events-none absolute left-1/2 -translate-x-1/2 -translate-y-[calc(100%+5px)] rounded-[2px] px-1 text-[9px] font-medium whitespace-nowrap tabular-nums"
				initial={{ opacity: 0 }}
				animate={{ opacity: show && !hovered ? 1 : 0, top: `${difY(pct)}%` }}
				transition={{
					top: { ...DATA_TRANSITION, duration: reduced ? 0 : 0.7 },
					opacity: {
						duration: reduced ? 0 : 0.3,
						delay: reduced || hovered ? 0 : 0.5 + index * 0.06,
					},
				}}
			>
				{formatPct(pct)}
			</motion.span>

			{hovered && show && (
				<motion.div
					role="tooltip"
					className="border-border bg-background pointer-events-none absolute top-0 left-1/2 z-20 w-max -translate-x-1/2 rounded-sm border px-2 py-1.5 text-[10px] shadow-md"
					initial={reduced ? false : { opacity: 0, y: 4 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.18, ease: EASE }}
				>
					<p className="font-semibold">{point.label}</p>
					<p className="text-muted-foreground mt-0.5 flex items-center gap-1.5 tabular-nums">
						<span className="bg-primary/40 h-1.5 w-1.5 rounded-[1px]" /> Plan{" "}
						{formatAmount(point.plan, unit)}
					</p>
					<p className="text-muted-foreground flex items-center gap-1.5 tabular-nums">
						<span className="bg-primary h-1.5 w-1.5 rounded-[1px]" /> Gestión{" "}
						{formatAmount(point.gestion, unit)}
					</p>
					<p className="mt-0.5 font-medium tabular-nums">Dif. {formatPct(pct)}</p>
				</motion.div>
			)}
		</div>
	)
}

function DifferenceLine({
	points,
	show,
	reduced,
}: {
	points: MonthPoint[]
	show: boolean
	reduced: boolean
}): ReactNode {
	const d = points
		.map((p, i) => {
			const x = (i + 0.5) * (600 / points.length)
			const y = difY(differencePct(p.plan, p.gestion))
			return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`
		})
		.join(" ")

	return (
		<svg
			className="pointer-events-none absolute inset-0 h-full w-full"
			viewBox="0 0 600 100"
			preserveAspectRatio="none"
			fill="none"
			aria-hidden="true"
		>
			<line
				x1={0}
				y1={50}
				x2={600}
				y2={50}
				stroke="var(--border)"
				vectorEffect="non-scaling-stroke"
			/>
			<motion.path
				stroke="var(--muted-foreground)"
				strokeWidth={1.25}
				strokeDasharray="4 4"
				strokeLinecap="round"
				vectorEffect="non-scaling-stroke"
				initial={{ d, pathLength: 0, opacity: 0 }}
				animate={{ d, pathLength: show ? 1 : 0, opacity: show ? 0.8 : 0 }}
				transition={{
					d: { ...DATA_TRANSITION, duration: reduced ? 0 : 0.7 },
					pathLength: { duration: reduced ? 0 : 0.9, ease: EASE, delay: reduced ? 0 : 0.4 },
					opacity: { duration: reduced ? 0 : 0.3, delay: reduced ? 0 : 0.4 },
				}}
			/>
		</svg>
	)
}

function LegendToggle({
	active,
	onClick,
	swatch,
	children,
}: {
	active: boolean
	onClick: () => void
	swatch: string
	children: ReactNode
}): ReactNode {
	return (
		<button
			type="button"
			aria-pressed={active}
			onClick={onClick}
			className={cn(
				"focus-ring flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-[10px] font-medium transition-opacity",
				active ? "text-foreground" : "text-muted-foreground line-through opacity-60"
			)}
		>
			<span className={cn("h-2 w-2 rounded-[1px]", swatch)} />
			{children}
		</button>
	)
}

function Pct({ value, className }: { value: number; className?: string }): ReactNode {
	return (
		<span
			className={cn("tabular-nums", value < 0 ? "text-muted-foreground" : "font-medium", className)}
			style={value > 0 ? { color: "var(--brand-green-text)" } : undefined}
		>
			{formatPct(value)}
		</span>
	)
}

function CentreRow({
	centre,
	unit,
	index,
	show,
	reduced,
}: {
	centre: CostCentre
	unit: Unit
	index: number
	show: boolean
	reduced: boolean
}): ReactNode {
	return (
		<motion.tr
			className="border-border/60 hover:bg-muted/50 border-b transition-colors"
			initial={reduced ? false : { opacity: 0, x: -6 }}
			animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
			transition={{ duration: reduced ? 0 : 0.35, ease: EASE, delay: reduced ? 0 : index * 0.07 }}
		>
			<td className="text-muted-foreground hidden py-1 pr-2 pl-2 tabular-nums sm:table-cell">
				{centre.code}
			</td>
			<td className="py-1 pr-2 pl-2 font-medium sm:pl-0">{centre.name}</td>
			<td className="py-1 pr-2 text-right tabular-nums">{formatAmount(centre.plan, unit)}</td>
			<td className="py-1 pr-2 text-right tabular-nums">{formatAmount(centre.gestion, unit)}</td>
			<td className="py-1 pr-2 text-right">
				<Pct value={differencePct(centre.plan, centre.gestion)} />
			</td>
		</motion.tr>
	)
}

/* ------------------------------------ report ------------------------------ */

export function ReportabilityReport(): ReactNode {
	const reduced = useReducedMotion()
	const { ref, stage } = useEntrance(STAGE_MS, reduced)

	const [yearIndex, setYearIndex] = useState(1)
	const [unit, setUnit] = useState<Unit>("MM$")
	const [service, setService] = useState(ALL_SERVICES)
	const [showPlan, setShowPlan] = useState(true)
	const [showGestion, setShowGestion] = useState(true)
	const [hovered, setHovered] = useState<number | null>(null)

	const data = filterByService(YEARS[yearIndex] ?? YEARS[0]!, service)
	const totalPlan = data.months.reduce((sum, m) => sum + m.plan, 0)
	const totalGestion = data.months.reduce((sum, m) => sum + m.gestion, 0)
	const centrePlan = data.centres.reduce((sum, c) => sum + c.plan, 0)
	const centreGestion = data.centres.reduce((sum, c) => sum + c.gestion, 0)

	const amount = (v: number) => formatAmount(v, unit)
	const showKpis = stage >= 1
	const showChart = stage >= 2
	const showTable = stage >= 3
	const synced = stage >= SOURCES.length

	return (
		<VisualFrame
			containerRef={ref}
			inputs={SOURCES}
			stage={stage}
			reduced={reduced}
			title="Análisis de gestión y plan"
			subtitle={`Valores en ${unit} · ${data.closing}`}
			status={
				<StatusLine
					icon={Wifi}
					label={synced ? "Sincronizado" : "Conectando fuentes…"}
					tone={synced ? "done" : "pending"}
					reduced={reduced}
				/>
			}
		>
			<div className="grid grid-cols-1 sm:grid-cols-[142px_minmax(0,1fr)]">
				{/* Slicer rail */}
				<div className="border-border bg-muted/30 flex flex-wrap gap-x-5 gap-y-2 border-b p-3 sm:block sm:space-y-3 sm:border-r sm:border-b-0">
					<div>
						<p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wide">
							Año
						</p>
						<div className="flex flex-wrap gap-1 sm:grid">
							{YEARS.map((y, i) => (
								<Tile key={y.year} active={i === yearIndex} onClick={() => setYearIndex(i)}>
									{y.year}
								</Tile>
							))}
						</div>
					</div>
					<div>
						<p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wide">
							Unidad
						</p>
						<div className="flex flex-wrap gap-1 sm:grid sm:grid-cols-3">
							{UNITS.map((u) => (
								<Tile
									key={u}
									active={u === unit}
									onClick={() => setUnit(u)}
									className="text-[10px] sm:px-0"
								>
									{u}
								</Tile>
							))}
						</div>
					</div>
					<div>
						<label
							htmlFor="report-service"
							className="text-muted-foreground mb-1.5 block text-[10px] font-medium tracking-wide"
						>
							Servicio
						</label>
						<div className="relative">
							<select
								id="report-service"
								value={service}
								onChange={(event) => setService(event.target.value)}
								className="focus-ring border-border bg-background text-foreground hover:border-primary/60 h-6 w-full cursor-pointer appearance-none rounded-sm border pr-5 pl-1.5 text-[11px] transition-colors"
							>
								{SERVICES.map((option) => (
									<option key={option} value={option}>
										{option}
									</option>
								))}
							</select>
							<ChevronDown
								className="text-muted-foreground pointer-events-none absolute top-1/2 right-1.5 h-3 w-3 -translate-y-1/2"
								aria-hidden="true"
							/>
						</div>
					</div>
				</div>

				{/* Report body */}
				<div className="space-y-3 p-3">
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
						<Kpi
							label="Planificado"
							value={totalPlan}
							format={amount}
							active={showKpis}
							reduced={reduced}
						/>
						<Kpi
							label="Gestionado"
							value={totalGestion}
							format={amount}
							active={showKpis}
							reduced={reduced}
						/>
						<Kpi
							label="Diferencia"
							value={difference(totalPlan, totalGestion)}
							format={amount}
							active={showKpis}
							reduced={reduced}
							signed
						/>
						<Kpi
							label="Diferencia %"
							value={differencePct(totalPlan, totalGestion)}
							format={formatPct}
							active={showKpis}
							reduced={reduced}
							signed
						/>
					</div>

					<div className="border-border rounded-sm border p-2.5">
						<div className="flex items-center justify-between gap-2">
							<p className="min-w-0 truncate text-[11px] font-medium">
								Saldo total vs. planificación
							</p>
							<div className="flex items-center gap-0.5">
								<LegendToggle
									active={showPlan}
									onClick={() => setShowPlan((v) => !v)}
									swatch="bg-primary/40"
								>
									Plan
								</LegendToggle>
								<LegendToggle
									active={showGestion}
									onClick={() => setShowGestion((v) => !v)}
									swatch="bg-primary"
								>
									Gestión
								</LegendToggle>
								<span className="text-muted-foreground ml-1 flex items-center gap-1.5 px-1.5 text-[10px] font-medium whitespace-nowrap">
									<span className="border-muted-foreground h-px w-3 border-t border-dashed" />
									Dif. %
								</span>
							</div>
						</div>

						<div className="relative mt-2 h-34">
							{/* Secondary axis: what the line's height means. */}
							<div
								className="text-muted-foreground pointer-events-none absolute inset-y-0 right-0 flex w-8 flex-col justify-between text-right text-[9px] tabular-nums"
								aria-hidden="true"
							>
								<span className="-translate-y-1/2">+{DIF_RANGE} %</span>
								<span className="-translate-y-1/2">0 %</span>
								<span className="-translate-y-1/2">−{DIF_RANGE} %</span>
							</div>
							<div className="absolute inset-y-0 right-9 left-0">
								<DifferenceLine points={data.months} show={showChart} reduced={reduced} />
								<div className="relative flex h-full">
									{data.months.map((point, i) => (
										<MonthGroup
											key={point.label}
											point={point}
											index={i}
											unit={unit}
											show={showChart}
											showPlan={showPlan}
											showGestion={showGestion}
											hovered={hovered === i}
											dimmed={hovered !== null && hovered !== i}
											onHover={setHovered}
											reduced={reduced}
										/>
									))}
								</div>
							</div>
						</div>
						<div className="border-border mt-1.5 flex border-t pt-1 pr-9">
							{data.months.map((point) => (
								<span
									key={point.label}
									className="text-muted-foreground flex-1 text-center text-[10px] font-medium tracking-wide uppercase"
								>
									{point.label}
								</span>
							))}
						</div>
					</div>

					<table className="w-full border-collapse text-[11px]">
						<thead>
							<tr className="bg-primary text-primary-foreground">
								<th className="hidden rounded-l-sm py-1 pr-2 pl-2 text-left text-[10px] font-medium sm:table-cell">
									CECO
								</th>
								<th className="rounded-l-sm py-1 pr-2 pl-2 text-left text-[10px] font-medium sm:rounded-none sm:pl-0">
									Centro de costo
								</th>
								<th className="py-1 pr-2 text-right text-[10px] font-medium">Plan</th>
								<th className="py-1 pr-2 text-right text-[10px] font-medium">Gestión</th>
								<th className="rounded-r-sm py-1 pr-2 text-right text-[10px] font-medium">
									Dif. %
								</th>
							</tr>
						</thead>
						<tbody>
							{data.centres.map((centre, i) => (
								<CentreRow
									key={centre.code}
									centre={centre}
									unit={unit}
									index={i}
									show={showTable}
									reduced={reduced}
								/>
							))}
							<motion.tr
								className="font-semibold"
								initial={reduced ? false : { opacity: 0 }}
								animate={{ opacity: showTable ? 1 : 0 }}
								transition={{ duration: 0.3, delay: reduced ? 0 : 0.45 }}
							>
								<td className="hidden py-1 sm:table-cell" />
								<td className="py-1 pr-2 pl-2 sm:pl-0">Total</td>
								<td className="py-1 pr-2 text-right tabular-nums">{amount(centrePlan)}</td>
								<td className="py-1 pr-2 text-right tabular-nums">{amount(centreGestion)}</td>
								<td className="py-1 pr-2 text-right">
									<Pct value={differencePct(centrePlan, centreGestion)} />
								</td>
							</motion.tr>
						</tbody>
					</table>
				</div>
			</div>
		</VisualFrame>
	)
}
