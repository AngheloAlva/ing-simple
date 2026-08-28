"use client"

import {
	LEVELS,
	PARTICIPANTS,
	TOOLS,
	competencyNow,
	dependency,
	program,
	type Level,
	type Session,
	type Tool,
} from "@/components/diagrams/program/data"
import { DATA_TRANSITION, EASE, GREEN, GREEN_TEXT } from "@/components/diagrams/visual/constants"
import { Figure } from "@/components/diagrams/visual/figure"
import { VisualFrame } from "@/components/diagrams/visual/frame"
import type { InputSpec } from "@/components/diagrams/visual/input-card"
import { StatusLine } from "@/components/diagrams/visual/status-line"
import { Tile } from "@/components/diagrams/visual/tile"
import { useEntrance } from "@/components/diagrams/visual/use-entrance"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { Check, ClipboardList, Database, Gauge, GraduationCap, Users } from "lucide-react"
import { motion } from "motion/react"
import { useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Capacitaciones — a programme tailored to the team, and the team getting
 * more capable as it goes through it. The diagnosis feeds in from above;
 * tool and level slicers regenerate the sessions; ticking a session off lifts
 * the team's competencies and the closing figures. Cause and effect, by hand.
 * ------------------------------------------------------------------------ */

const INPUTS: InputSpec[] = [
	{ id: "team", label: `${PARTICIPANTS} participantes`, meta: "Área de operaciones", icon: Users },
	{ id: "level", label: "Nivel real", meta: "Power BI básico", icon: Gauge },
	{ id: "data", label: "Tus datos", meta: "Ventas y stock 2024–2025", icon: Database },
]

const STAGE_MS = [600, 1350, 2100]

/* ----------------------------------- pieces ------------------------------- */

function SessionRow({
	session,
	index,
	done,
	show,
	onToggle,
	reduced,
}: {
	session: Session
	index: number
	done: boolean
	show: boolean
	onToggle: () => void
	reduced: boolean
}): ReactNode {
	return (
		<motion.button
			type="button"
			aria-pressed={done}
			onClick={onToggle}
			className="focus-ring hover:bg-muted/50 flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left transition-colors"
			initial={reduced ? false : { opacity: 0, x: -6 }}
			animate={show ? { opacity: 1, x: 0 } : { opacity: 0, x: -6 }}
			transition={{ duration: reduced ? 0 : 0.35, ease: EASE, delay: reduced ? 0 : index * 0.09 }}
		>
			<span
				className={cn(
					"flex h-6 w-6 shrink-0 items-center justify-center rounded-sm text-[10px] font-semibold tabular-nums transition-colors duration-300",
					done ? "text-brand-green-foreground" : "bg-muted text-muted-foreground"
				)}
				style={done ? { background: GREEN } : {}}
				aria-hidden="true"
			>
				{done ? <Check className="h-3.5 w-3.5" strokeWidth={2.5} /> : index + 1}
			</span>
			<span className="min-w-0 flex-1">
				<span className="block truncate text-[11px] font-medium">{session.title}</span>
				<span className="text-muted-foreground block truncate text-[10px]">{session.topics}</span>
			</span>
			<span className="flex shrink-0 items-center gap-1.5">
				{session.ownData && (
					<span className="border-border text-muted-foreground rounded-sm border px-1 text-[9px] font-medium">
						tus datos
					</span>
				)}
				<span className="text-muted-foreground w-6 text-right text-[10px] tabular-nums">
					{session.hours} h
				</span>
			</span>
		</motion.button>
	)
}

function CompetencyRow({
	name,
	start,
	now,
	index,
	show,
	complete,
	reduced,
}: {
	name: string
	start: number
	now: number
	index: number
	show: boolean
	complete: boolean
	reduced: boolean
}): ReactNode {
	return (
		<motion.div
			initial={reduced ? false : { opacity: 0, y: 6 }}
			animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
			transition={{ duration: reduced ? 0 : 0.35, ease: EASE, delay: reduced ? 0 : index * 0.09 }}
		>
			<div className="flex items-center justify-between text-[11px]">
				<span className="font-medium">{name}</span>
				<span
					className="text-muted-foreground tabular-nums transition-colors duration-300"
					style={complete ? { color: GREEN_TEXT } : {}}
				>
					<Figure
						value={now}
						format={(v) => `${Math.round(v)} %`}
						active={show}
						reduced={reduced}
					/>
				</span>
			</div>
			<div className="bg-muted relative mt-1 h-1.5 overflow-hidden rounded-sm">
				<motion.div
					className="bg-primary/30 absolute inset-y-0 left-0 rounded-sm"
					initial={{ width: 0 }}
					animate={{ width: show ? `${start}%` : 0 }}
					transition={{
						...DATA_TRANSITION,
						duration: reduced ? 0 : 0.7,
						delay: reduced ? 0 : 0.15 + index * 0.09,
					}}
				/>
				<motion.div
					className="absolute inset-y-0 left-0 rounded-sm"
					initial={{ width: 0 }}
					animate={{ width: show ? `${now}%` : 0, backgroundColor: GREEN }}
					transition={{ ...DATA_TRANSITION, duration: reduced ? 0 : 0.7 }}
				/>
			</div>
		</motion.div>
	)
}

function Outcome({
	label,
	children,
	highlight,
	show,
	index,
	reduced,
}: {
	label: string
	children: ReactNode
	highlight: boolean
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
				className="mt-0.5 truncate text-sm font-semibold tabular-nums transition-colors duration-300"
				style={highlight ? { color: GREEN_TEXT } : {}}
			>
				{show ? children : "—"}
			</p>
		</motion.div>
	)
}

/* ---------------------------------- programme ----------------------------- */

export function TrainingProgram(): ReactNode {
	const reduced = useReducedMotion()
	const { ref, stage } = useEntrance(STAGE_MS, reduced)

	const [tool, setTool] = useState<Tool>("Power BI")
	const [level, setLevel] = useState<Level>("Básico")
	const [done, setDone] = useState<Set<number>>(new Set())

	const current = program(tool, level)
	const total = current.sessions.length
	const doneCount = done.size
	const complete = doneCount === total
	const hours = current.sessions.reduce((sum, s) => sum + s.hours, 0)
	const doneHours = current.sessions.reduce((sum, s, i) => sum + (done.has(i) ? s.hours : 0), 0)
	const reports = (current.reports * doneCount) / total

	const showSessions = stage >= 1
	const showCompetencies = stage >= 2
	const showOutcomes = stage >= 3

	const pick = (nextTool: Tool, nextLevel: Level) => {
		setTool(nextTool)
		setLevel(nextLevel)
		setDone(new Set())
	}
	const toggle = (index: number) => {
		setDone((prev) => {
			const next = new Set(prev)
			if (next.has(index)) next.delete(index)
			else next.add(index)
			return next
		})
	}

	return (
		<VisualFrame
			containerRef={ref}
			inputs={INPUTS}
			stage={stage}
			reduced={reduced}
			title={`Programa ${tool} · Nivel ${level.toLowerCase()}`}
			subtitle={`${total} sesiones · ${hours} h · ${PARTICIPANTS} participantes`}
			status={
				<StatusLine
					icon={complete ? GraduationCap : ClipboardList}
					label={
						complete
							? "Equipo autónomo"
							: showOutcomes
								? "Programa a medida listo"
								: "Diseñando programa…"
					}
					tone={complete ? "done" : showOutcomes ? "ready" : "pending"}
					reduced={reduced}
				/>
			}
		>
			<div className="grid grid-cols-1 sm:grid-cols-[142px_minmax(0,1fr)]">
				{/* Slicer rail */}
				<div className="border-border bg-muted/30 flex flex-wrap gap-x-5 gap-y-2 border-b p-3 sm:block sm:space-y-3 sm:border-r sm:border-b-0">
					<div>
						<p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wide">
							Herramienta
						</p>
						<div className="flex flex-wrap gap-1 sm:grid">
							{TOOLS.map((t) => (
								<Tile key={t} active={t === tool} onClick={() => pick(t, level)}>
									{t}
								</Tile>
							))}
						</div>
					</div>
					<div>
						<p className="text-muted-foreground mb-1.5 text-[10px] font-medium tracking-wide">
							Nivel
						</p>
						<div className="flex flex-wrap gap-1 sm:grid">
							{LEVELS.map((l) => (
								<Tile key={l} active={l === level} onClick={() => pick(tool, l)}>
									{l}
								</Tile>
							))}
						</div>
					</div>
				</div>

				{/* Programme body */}
				<div className="space-y-3 p-3">
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
						{/* Sessions */}
						<div className="border-border rounded-sm border p-2">
							<div className="flex items-center justify-between px-2 text-[11px]">
								<p className="font-medium">Sesiones</p>
								<p className="text-muted-foreground tabular-nums">
									{doneCount} de {total} · {doneHours} h
								</p>
							</div>
							<div className="bg-muted mx-2 mt-1.5 h-1 overflow-hidden rounded-sm">
								<motion.div
									className="h-full rounded-sm"
									initial={{ width: 0 }}
									animate={{
										width: `${(doneCount / total) * 100}%`,
										backgroundColor: complete ? GREEN : "var(--primary)",
									}}
									transition={{ ...DATA_TRANSITION, duration: reduced ? 0 : 0.5 }}
								/>
							</div>
							<div key={`${tool}-${level}`} className="mt-1.5 space-y-0.5">
								{current.sessions.map((s, i) => (
									<SessionRow
										key={s.title}
										session={s}
										index={i}
										done={done.has(i)}
										show={showSessions}
										onToggle={() => toggle(i)}
										reduced={reduced}
									/>
								))}
							</div>
						</div>

						{/* Competencies */}
						<div className="border-border rounded-sm border p-3">
							<div className="flex items-center justify-between text-[11px]">
								<p className="font-medium">Competencias del equipo</p>
							</div>
							<div className="text-muted-foreground mt-1 flex items-center gap-3 text-[10px]">
								<span className="flex items-center gap-1.5">
									<span className="bg-primary/30 h-2 w-2 rounded-[1px]" /> Al inicio
								</span>
								<span className="flex items-center gap-1.5">
									<span className="bg-brand-green h-2 w-2 rounded-[1px]" /> Hoy
								</span>
							</div>
							<div className="mt-3 space-y-3">
								{current.competencies.map((c, i) => (
									<CompetencyRow
										key={`${tool}-${c.name}`}
										name={c.name}
										start={c.start}
										now={competencyNow(c, i, done)}
										index={i}
										show={showCompetencies}
										complete={complete}
										reduced={reduced}
									/>
								))}
							</div>
							{showCompetencies && !complete && (
								<p className="text-muted-foreground mt-3 text-[10px]">
									Marca las sesiones como hechas para ver cómo sube el equipo.
								</p>
							)}
						</div>
					</div>

					{/* What the team can do on its own */}
					<div className="grid grid-cols-3 gap-2">
						<Outcome
							label="Reportes del equipo"
							highlight={complete}
							show={showOutcomes}
							index={0}
							reduced={reduced}
						>
							<Figure
								value={reports}
								format={(v) => `${Math.round(v)} al mes`}
								active={showOutcomes}
								reduced={reduced}
							/>
						</Outcome>
						<Outcome
							label="Dependencia externa"
							highlight={complete}
							show={showOutcomes}
							index={1}
							reduced={reduced}
						>
							{dependency(doneCount, total)}
						</Outcome>
						<Outcome
							label="Horas de práctica"
							highlight={complete}
							show={showOutcomes}
							index={2}
							reduced={reduced}
						>
							<Figure
								value={doneHours}
								format={(v) => `${Math.round(v)} h`}
								active={showOutcomes}
								reduced={reduced}
							/>
						</Outcome>
					</div>
				</div>
			</div>
		</VisualFrame>
	)
}
