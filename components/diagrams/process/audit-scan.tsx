"use client"

import { useDiagramActive } from "@/components/diagrams/hover-context"
import { Reveal, RevealGroup } from "@/components/diagrams/reveal"
import { useStepLoop } from "@/components/diagrams/use-step-loop"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { animate, motion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Diagnóstico — the audit running, not a finished checklist. Each source is
 * reviewed in turn and gives back what it costs today; the recoverable total
 * at the bottom is the sum of those findings, which is the number the whole
 * conversation ends up being about.
 * ------------------------------------------------------------------------ */

type Source = {
	code: string
	name: string
	meta: string
	/** Hours a week this source is costing today. */
	hours: number
}

const SOURCES: Source[] = [
	{ code: "XL", name: "Planillas", meta: "12 archivos", hours: 4 },
	{ code: "ER", name: "ERP", meta: "Ventas y stock", hours: 3 },
	{ code: "OP", name: "Procesos", meta: "Manuales", hours: 4 },
]

const TOTAL_HOURS = SOURCES.reduce((sum, source) => sum + source.hours, 0)

const STEP_MS = 900
const PAUSE_MS = 4000

type RowState = "pending" | "scanning" | "done"

function SourceRow({ source, state }: { source: Source; state: RowState }): ReactNode {
	return (
		<Reveal>
			<div
				className={cn(
					"bg-background flex items-center gap-3 rounded-sm border px-3.5 py-2 transition-colors duration-300",
					state === "pending" ? "border-border border-dashed" : "border-border"
				)}
			>
				<span
					className={cn(
						"flex h-7 w-7 shrink-0 items-center justify-center text-[10px] font-semibold tracking-wide transition-colors duration-300",
						state === "pending"
							? "bg-muted text-muted-foreground/60"
							: "bg-muted text-muted-foreground"
					)}
				>
					{source.code}
				</span>

				<span className="min-w-0 flex-1 truncate text-sm">
					<span
						className={cn(
							"font-medium transition-colors duration-300",
							state === "pending" ? "text-muted-foreground" : "text-foreground"
						)}
					>
						{source.name}
					</span>
					<span className="text-muted-foreground"> · {source.meta}</span>
				</span>

				{/* One slot, three readings: not yet, looking, and what it costs. */}
				<span className="bg-muted text-muted-foreground inline-flex h-6 shrink-0 items-center gap-1 px-2.5 text-[11px] font-medium">
					{state === "done" ? (
						<>
							<Check className="text-brand-green h-3 w-3" aria-hidden="true" />
							{source.hours} h/semana
						</>
					) : state === "scanning" ? (
						<motion.span
							animate={{ opacity: [1, 0.45, 1] }}
							transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
						>
							Revisando
						</motion.span>
					) : (
						<span className="opacity-60">Sin revisar</span>
					)}
				</span>
			</div>
		</Reveal>
	)
}

/** Counts to the target from wherever it already is, never back to zero. */
function HoursTotal({ target, animated }: { target: number; animated: boolean }): ReactNode {
	const [value, setValue] = useState(target)
	const currentRef = useRef(target)

	useEffect(() => {
		currentRef.current = value
	}, [value])

	useEffect(() => {
		if (!animated) {
			currentRef.current = target
			setValue(target)
			return
		}

		const controls = animate(currentRef.current, target, {
			duration: 0.5,
			ease: "easeOut",
			onUpdate: setValue,
		})

		return () => controls.stop()
	}, [target, animated])

	return <>{Math.round(value)} h/semana</>
}

export function DiagramAuditScan(): ReactNode {
	const active = useDiagramActive()
	const prefersReduced = useReducedMotion()

	const loop = useStepLoop({
		active: active && !prefersReduced,
		steps: SOURCES.length,
		duration: STEP_MS,
		pauseMs: PAUSE_MS,
	})

	const rowState = (index: number): RowState => {
		if (!loop) return "done"
		if (loop.index === index) return "scanning"
		return loop.index > index ? "done" : "pending"
	}

	const foundHours = loop
		? SOURCES.filter((_, index) => rowState(index) === "done").reduce(
				(sum, source) => sum + source.hours,
				0
			)
		: TOTAL_HOURS

	return (
		<RevealGroup className="flex h-full flex-col justify-center gap-2" delay={0.1}>
			{SOURCES.map((source, index) => (
				<SourceRow key={source.code} source={source} state={rowState(index)} />
			))}

			<Reveal className="border-border mt-1 flex items-baseline justify-between border-t border-dotted pt-2.5">
				<span className="text-muted-foreground text-[11px]">Tiempo recuperable</span>
				<span className="text-foreground/80 font-mono text-[11px] tabular-nums">
					<HoursTotal target={foundHours} animated={Boolean(loop) && !prefersReduced} />
				</span>
			</Reveal>
		</RevealGroup>
	)
}
