"use client"

import { FLOWS, formatHours, type Flow, type Sample } from "@/components/diagrams/flow/data"
import { EASE, GREEN, GREEN_TEXT } from "@/components/diagrams/visual/constants"
import { Figure } from "@/components/diagrams/visual/figure"
import { VisualFrame } from "@/components/diagrams/visual/frame"
import type { InputSpec } from "@/components/diagrams/visual/input-card"
import { Tile } from "@/components/diagrams/visual/tile"
import { useEntrance } from "@/components/diagrams/visual/use-entrance"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { ArrowRight, Check, Inbox, ListChecks, Pause, Play, Plug, UserRound } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState, type ReactNode, type RefObject } from "react"

/* --------------------------------------------------------------------------
 * Automatizaciones — not the diagram of a flow but the flow running. Requests
 * come into the tray and move through the steps on their own; the ones the
 * rules cannot decide wait for a person; every request keeps its trail; and
 * the hours the team is not spending keep adding up.
 * ------------------------------------------------------------------------ */

const INPUTS: InputSpec[] = [
	{ id: "requests", label: "Solicitudes", meta: "Formulario y correo", icon: Inbox },
	{
		id: "rules",
		label: "Reglas del negocio",
		meta: "Montos y responsables",
		icon: ListChecks,
	},
	{ id: "systems", label: "Tus sistemas", meta: "ERP · SharePoint · Correo", icon: Plug },
]

const STAGE_MS = [600, 1350, 2100]

const TICK_MS = 1600
const SPAWN_EVERY = 3
const MANUAL_HOLD = 2
const DONE_LINGER = 2
const VISIBLE = 5

/**
 * How far the day's counter may climb while someone watches. The tray keeps
 * running, but a visitor who leaves the page open must not end up reading that
 * a purchase-approval flow cleared a hundred requests in ten minutes: the
 * figure would stop being a claim about the service and become an obvious lie.
 */
const MAX_WATCHED = 6

/* -------------------------------- simulation ------------------------------ */

type Item = {
	id: number
	sample: Sample
	step: number
	/** Ticks left waiting for a person. */
	hold: number
	held: boolean
	done: boolean
	doneTicks: number
}

type Sim = {
	tick: number
	nextId: number
	items: Item[]
	processed: number
}

const FRESH: Sim = { tick: 0, nextId: 1041, items: [], processed: 0 }

function advance(sim: Sim, flow: Flow): Sim {
	const last = flow.steps.length - 1
	let processed = sim.processed

	const items = sim.items
		.map((item): Item => {
			if (item.done) return { ...item, doneTicks: item.doneTicks + 1 }
			if (item.hold > 0) return { ...item, hold: item.hold - 1 }
			if (item.sample.manual && item.step === flow.manualStep && !item.held) {
				return { ...item, hold: MANUAL_HOLD, held: true }
			}
			if (item.step >= last) {
				processed += 1
				return { ...item, done: true }
			}
			return { ...item, step: item.step + 1 }
		})
		.filter((item) => !(item.done && item.doneTicks > DONE_LINGER))

	const tick = sim.tick + 1
	let nextId = sim.nextId
	if (tick % SPAWN_EVERY === 1) {
		const sample = flow.samples[nextId % flow.samples.length] ?? flow.samples[0]!
		items.unshift({ id: nextId, sample, step: 0, hold: 0, held: false, done: false, doneTicks: 0 })
		nextId += 1
	}

	return { tick, nextId, items: items.slice(0, VISIBLE), processed }
}

/**
 * True only while the visual is on screen and the tab is in the foreground.
 * `useEntrance` disconnects its observer once it has played, so the running
 * simulation needs an observer of its own: without one the interval keeps
 * ticking for the whole session, and in a background tab — where rAF is frozen
 * but timers are not — the rows it retires never finish their exit animation
 * and pile up in the DOM.
 */
function useOnScreen(ref: RefObject<HTMLDivElement | null>): boolean {
	const [inView, setInView] = useState(false)
	const [foreground, setForeground] = useState(true)

	useEffect(() => {
		const el = ref.current
		if (!el) return

		const observer = new IntersectionObserver(
			(entries) => setInView(entries[0]?.isIntersecting ?? false),
			{ threshold: 0 }
		)
		observer.observe(el)

		const readVisibility = (): void => setForeground(document.visibilityState === "visible")
		readVisibility()
		document.addEventListener("visibilitychange", readVisibility)

		return () => {
			observer.disconnect()
			document.removeEventListener("visibilitychange", readVisibility)
		}
	}, [ref])

	return inView && foreground
}

function useSimulation(flow: Flow, running: boolean): Sim {
	const [sim, setSim] = useState<Sim>(FRESH)
	const [flowName, setFlowName] = useState(flow.name)

	if (flowName !== flow.name) {
		setFlowName(flow.name)
		setSim(FRESH)
	}

	useEffect(() => {
		if (!running) return
		const id = window.setInterval(() => setSim((prev) => advance(prev, flow)), TICK_MS)
		return () => window.clearInterval(id)
	}, [running, flow])

	return sim
}

/* ----------------------------------- pieces ------------------------------- */

/**
 * One step of the flow, with the rule it applies. The rule used to appear on
 * hover only, which put it out of reach on a touch screen, so the step is a
 * real button that toggles it as well. The frame clips its own overflow, so
 * the first and last rules anchor to their edge instead of centring.
 */
function StepNode({
	flow,
	index,
	active,
	open,
	onToggle,
	show,
	reduced,
}: {
	flow: Flow
	index: number
	active: boolean
	open: boolean
	onToggle: () => void
	show: boolean
	reduced: boolean
}): ReactNode {
	const step = flow.steps[index]!
	const isFirst = index === 0
	const isLast = index === flow.steps.length - 1
	return (
		<>
			<motion.div
				className="group relative min-w-0 flex-1"
				initial={reduced ? false : { opacity: 0, y: 6 }}
				animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
				transition={{ duration: reduced ? 0 : 0.35, ease: EASE, delay: reduced ? 0 : index * 0.08 }}
			>
				<button
					type="button"
					onClick={onToggle}
					aria-expanded={open}
					aria-label={`${step.name}: ${step.rule}`}
					className={cn(
						"focus-ring flex min-h-8 w-full items-center justify-center rounded-sm border px-1 py-1 text-center transition-colors duration-300 sm:px-1.5",
						active ? "border-primary bg-primary/10" : "border-border bg-background"
					)}
				>
					<p className="text-[9px] leading-tight font-medium break-words sm:truncate sm:text-[10px] sm:leading-normal">
						{step.name}
					</p>
				</button>
				<div
					role="tooltip"
					className={cn(
						"border-border bg-background pointer-events-none absolute top-[calc(100%+4px)] z-20 w-40 max-w-[60vw] rounded-sm border px-2 py-1.5 text-[10px] leading-snug shadow-md transition-opacity",
						isFirst && "left-0",
						isLast && "right-0",
						!isFirst && !isLast && "left-1/2 -translate-x-1/2",
						open
							? "opacity-100"
							: "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
					)}
				>
					{step.rule}
				</div>
			</motion.div>
			{!isLast && (
				<span className="bg-border relative h-px w-2 shrink-0 sm:w-3" aria-hidden="true">
					<motion.span
						className="bg-primary absolute inset-0"
						animate={{ opacity: active ? 1 : 0 }}
						transition={{ duration: 0.3 }}
					/>
				</span>
			)}
		</>
	)
}

function RequestRow({
	item,
	flow,
	open,
	onToggle,
	reduced,
}: {
	item: Item
	flow: Flow
	open: boolean
	onToggle: () => void
	reduced: boolean
}): ReactNode {
	const waiting = item.hold > 0
	const status = item.done
		? "Completada"
		: waiting
			? flow.manualLabel
			: (flow.steps[item.step]?.name ?? "")

	return (
		<motion.div
			layout={!reduced}
			initial={reduced ? false : { opacity: 0, y: -8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
			transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
			className="border-border/60 border-b last:border-0"
		>
			<button
				type="button"
				aria-expanded={open}
				onClick={onToggle}
				className="focus-ring hover:bg-muted/50 flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left transition-colors"
			>
				<span className="text-muted-foreground w-9 shrink-0 text-[10px] tabular-nums">
					#{item.id}
				</span>
				<span className="min-w-0 flex-1">
					<span className="block truncate text-[11px] font-medium">{item.sample.label}</span>
					<span className="text-muted-foreground block truncate text-[10px]">
						{item.sample.detail}
					</span>
				</span>
				<span
					className={cn(
						"flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-0.5 text-[9px] font-medium transition-colors duration-300",
						item.done
							? "text-brand-green-foreground"
							: waiting
								? "bg-muted text-foreground"
								: "bg-primary/10 text-primary"
					)}
					style={item.done ? { background: GREEN } : {}}
				>
					{item.done ? (
						<Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden="true" />
					) : waiting ? (
						<UserRound className="h-2.5 w-2.5" strokeWidth={2.25} aria-hidden="true" />
					) : (
						<span
							className="bg-primary h-1.5 w-1.5 animate-pulse rounded-full"
							aria-hidden="true"
						/>
					)}
					{status}
				</span>
			</button>
			{open && (
				<motion.ol
					className="text-muted-foreground mx-2 mb-1.5 space-y-0.5 border-l pl-3 text-[10px]"
					initial={reduced ? false : { opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.2 }}
					aria-label="Registro de la solicitud"
				>
					{flow.steps.map((step, i) => {
						const past = item.done || i < item.step
						const current = !item.done && i === item.step
						return (
							<li
								key={step.name}
								className={cn("flex items-center gap-1.5", current && "text-foreground")}
							>
								{past ? (
									<Check
										className="h-2.5 w-2.5"
										strokeWidth={2.5}
										style={{ color: GREEN_TEXT }}
										aria-hidden="true"
									/>
								) : (
									<span
										className={cn("h-1.5 w-1.5 rounded-full", current ? "bg-primary" : "bg-border")}
										aria-hidden="true"
									/>
								)}
								<span className={cn(past && "text-foreground")}>{step.name}</span>
								{current && waiting && (
									<span className="text-muted-foreground">· {flow.manualLabel}</span>
								)}
								{past && <span className="text-muted-foreground">· ok</span>}
							</li>
						)
					})}
				</motion.ol>
			)}
		</motion.div>
	)
}

function Counter({
	label,
	children,
	caption,
	highlight,
	show,
	index,
	reduced,
}: {
	label: string
	children: ReactNode
	caption?: ReactNode
	highlight?: boolean
	show: boolean
	index: number
	reduced: boolean
}): ReactNode {
	return (
		<motion.div
			className="border-border bg-muted/30 min-w-0 rounded-sm border px-2.5 py-2"
			initial={reduced ? false : { opacity: 0, y: 6 }}
			animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
			transition={{ duration: reduced ? 0 : 0.35, ease: EASE, delay: reduced ? 0 : index * 0.09 }}
		>
			<p className="text-muted-foreground truncate text-[10px] font-medium tracking-wide">
				{label}
			</p>
			<p
				className="mt-0.5 truncate text-sm font-semibold tabular-nums"
				style={highlight ? { color: GREEN_TEXT } : {}}
			>
				{show ? children : "—"}
			</p>
			{caption && <p className="text-muted-foreground mt-0.5 truncate text-[9px]">{caption}</p>}
		</motion.div>
	)
}

/* ------------------------------------ flow -------------------------------- */

export function AutomationFlow(): ReactNode {
	const reduced = useReducedMotion()
	const { ref, stage } = useEntrance(STAGE_MS, reduced)

	const [flowIndex, setFlowIndex] = useState(0)
	const [live, setLive] = useState(true)
	const [openId, setOpenId] = useState<number | null>(null)
	const [openStep, setOpenStep] = useState<number | null>(null)

	const flow = FLOWS[flowIndex] ?? FLOWS[0]!
	const showSteps = stage >= 1
	const showTray = stage >= 2
	const showCounters = stage >= 3

	const onScreen = useOnScreen(ref)
	const sim = useSimulation(flow, live && showTray && onScreen)
	const activeSteps = new Set(sim.items.filter((i) => !i.done && i.hold === 0).map((i) => i.step))
	const processedToday = flow.processedToday + Math.min(sim.processed, MAX_WATCHED)
	const hoursSaved = processedToday * flow.hoursPerItem

	return (
		<VisualFrame
			containerRef={ref}
			inputs={INPUTS}
			stage={stage}
			reduced={reduced}
			title={flow.name}
			subtitle={`${flow.engine} · corre solo`}
			status={
				<div className="flex shrink-0 items-center gap-1" role="group" aria-label="Ejecución">
					<Tile
						active={live}
						onClick={() => setLive(true)}
						className="flex items-center gap-1.5 px-2"
					>
						<Play className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
						En vivo
					</Tile>
					<Tile
						active={!live}
						onClick={() => setLive(false)}
						className="flex items-center gap-1.5 px-2"
					>
						<Pause className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
						Pausar
					</Tile>
				</div>
			}
		>
			<div className="grid grid-cols-1 sm:grid-cols-[142px_minmax(0,1fr)]">
				{/* Flow rail */}
				<div className="border-border bg-muted/30 flex flex-wrap gap-x-5 gap-y-2 border-b p-3 sm:block sm:space-y-3 sm:border-r sm:border-b-0">
					<p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wide">
						Flujo
					</p>
					<div className="flex flex-wrap gap-1 sm:grid">
						{FLOWS.map((f, i) => (
							<Tile
								key={f.name}
								active={i === flowIndex}
								onClick={() => {
									setFlowIndex(i)
									setOpenId(null)
									setOpenStep(null)
								}}
								className="h-auto px-1.5 py-1.5 leading-tight text-balance"
							>
								{f.name}
							</Tile>
						))}
					</div>
				</div>

				{/* Body */}
				<div className="space-y-3 p-3">
					{/* Steps */}
					<div className="border-border rounded-sm border p-2.5">
						<div className="flex items-center justify-between text-[11px]">
							<p className="font-medium">Pasos del flujo</p>
							<p className="text-muted-foreground text-[10px]">
								<span className="sm:hidden">Toca un paso para ver su regla</span>
								<span className="hidden sm:inline">Pasa el mouse para ver la regla</span>
							</p>
						</div>
						<div key={flow.name} className="mt-2 flex items-center">
							{flow.steps.map((_, i) => (
								<StepNode
									key={i}
									flow={flow}
									index={i}
									active={activeSteps.has(i)}
									open={openStep === i}
									onToggle={() => setOpenStep((prev) => (prev === i ? null : i))}
									show={showSteps}
									reduced={reduced}
								/>
							))}
						</div>
					</div>

					{/* Tray */}
					<div className="border-border rounded-sm border p-2">
						<div className="flex items-center justify-between px-2 text-[11px]">
							<p className="font-medium">Bandeja</p>
							<p className="text-muted-foreground flex items-center gap-1.5 text-[10px]">
								<span
									className={cn("h-1.5 w-1.5 rounded-full", live && showTray && "animate-pulse")}
									style={{ background: live && showTray ? GREEN : "var(--muted-foreground)" }}
									aria-hidden="true"
								/>
								{live && showTray ? "En ejecución" : "En pausa"}{" "}
								<span className="hidden sm:inline">
									· haz clic en una solicitud para ver su registro
								</span>
							</p>
						</div>
						<div className="mt-1.5 min-h-[168px]">
							<AnimatePresence initial={false}>
								{sim.items.map((item) => (
									<RequestRow
										key={item.id}
										item={item}
										flow={flow}
										open={openId === item.id}
										onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
										reduced={reduced}
									/>
								))}
							</AnimatePresence>
							{sim.items.length === 0 && (
								<p className="text-muted-foreground px-2 py-6 text-center text-[10px]">
									Esperando solicitudes…
								</p>
							)}
						</div>
					</div>

					{/* Counters */}
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
						<Counter label="Procesadas hoy" show={showCounters} index={0} reduced={reduced}>
							<Figure
								value={processedToday}
								format={(v) => `${Math.round(v)}`}
								active={showCounters}
								reduced={reduced}
							/>
						</Counter>
						<Counter
							label="Horas ahorradas hoy"
							highlight
							show={showCounters}
							index={1}
							reduced={reduced}
						>
							<Figure
								value={hoursSaved}
								format={formatHours}
								active={showCounters}
								reduced={reduced}
							/>
						</Counter>
						<Counter
							label="Errores de digitación"
							highlight
							caption={`Antes: ${flow.before.errors}`}
							show={showCounters}
							index={2}
							reduced={reduced}
						>
							0
						</Counter>
						<Counter
							label="Tiempo por solicitud"
							highlight
							caption={
								<span className="flex items-center gap-1">
									Antes: {flow.before.perRequest}
									<ArrowRight className="h-2.5 w-2.5" aria-hidden="true" />
									ahora
								</span>
							}
							show={showCounters}
							index={3}
							reduced={reduced}
						>
							{flow.after.perRequest}
						</Counter>
					</div>
				</div>
			</div>
		</VisualFrame>
	)
}
