"use client"

import { useChallengeHover } from "@/components/challenge-card"
import { DiagramCanvas, Reveal } from "@/components/diagrams/challenge/shared"
import { CountUp } from "@/components/diagrams/interactive-diagram"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { Hand, Inbox, Keyboard, SearchCheck, Send, type LucideIcon } from "lucide-react"
import { animate, motion } from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Procesos manuales — the same flow, every single day. The signal moves
 * instantly through what is automated and stalls on every step a person has
 * to do by hand, where a timer starts and the running cost climbs. It is not
 * one slow step: it is the total at the bottom, paid again tomorrow.
 * ------------------------------------------------------------------------ */

type Step = {
	icon: LucideIcon
	label: string
	/** Minutes a person burns here. 0 means the step is already automated. */
	minutes: number
}

const STEPS: Step[] = [
	{ icon: Inbox, label: "Pedido", minutes: 0 },
	{ icon: Keyboard, label: "Carga", minutes: 25 },
	{ icon: SearchCheck, label: "Control", minutes: 40 },
	{ icon: Send, label: "Envío", minutes: 15 },
]

const TOTAL_MINUTES = STEPS.reduce((sum, step) => sum + step.minutes, 0)

type Event = { kind: "node" | "link"; index: number }

const SEQUENCE: Event[] = STEPS.flatMap((_, index) =>
	index < STEPS.length - 1
		? [
				{ kind: "node" as const, index },
				{ kind: "link" as const, index },
			]
		: [{ kind: "node" as const, index }]
)

const PASS_MS = 360
const WORK_MS = 950
const LINK_MS = 320
const RESTART_MS = 1600

function eventDuration(event: Event): number {
	if (event.kind === "link") return LINK_MS
	return (STEPS[event.index]?.minutes ?? 0) > 0 ? WORK_MS : PASS_MS
}

function formatMinutes(minutes: number): string {
	if (minutes < 60) return `${minutes} min`
	const hours = Math.floor(minutes / 60)
	const rest = minutes % 60
	return rest === 0 ? `${hours} h` : `${hours} h ${rest}`
}

/** Minutes burned by the time the loop reaches `cursor`. */
function minutesAt(cursor: number): number {
	if (cursor >= SEQUENCE.length) return TOTAL_MINUTES

	return SEQUENCE.slice(0, cursor + 1)
		.filter((event) => event.kind === "node")
		.reduce((sum, event) => sum + (STEPS[event.index]?.minutes ?? 0), 0)
}

/** Walks the flow, pausing on every manual step, then starts over. */
function useFlowLoop(enabled: boolean): number | null {
	const [cursor, setCursor] = useState<number | null>(null)

	useEffect(() => {
		if (!enabled) {
			setCursor(null)
			return
		}

		let cancelled = false
		const timers: ReturnType<typeof setTimeout>[] = []

		const step = (next: number) => {
			if (cancelled) return
			setCursor(next)

			if (next >= SEQUENCE.length) {
				timers.push(setTimeout(() => step(0), RESTART_MS))
				return
			}

			const event = SEQUENCE[next]
			if (!event) return

			timers.push(setTimeout(() => step(next + 1), eventDuration(event)))
		}

		step(0)

		return () => {
			cancelled = true
			timers.forEach(clearTimeout)
		}
	}, [enabled])

	return cursor
}

/** Counts from wherever it already is to the new target, never back to zero. */
function RunningTotal({ target, animated }: { target: number; animated: boolean }): ReactNode {
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
			duration: 0.65,
			ease: "easeOut",
			onUpdate: (next) => setValue(next),
		})

		return () => controls.stop()
	}, [target, animated])

	return <>{formatMinutes(Math.round(value))}</>
}

function StepNode({
	step,
	state,
	prefersReduced,
}: {
	step: Step
	state: "idle" | "done" | "active"
	prefersReduced: boolean
}): ReactNode {
	const Icon = step.icon
	const isManual = step.minutes > 0
	const lit = state !== "idle"

	return (
		<Reveal className="flex w-14 shrink-0 flex-col items-center gap-1.5">
			<span
				className={cn(
					"bg-background relative flex h-11 w-11 items-center justify-center rounded-sm border transition-colors duration-300",
					lit && !isManual
						? "border-brand-blue/50"
						: lit
							? "border-foreground/40"
							: "border-border",
					isManual && !lit && "border-dashed"
				)}
			>
				<Icon
					className={cn(
						"h-[18px] w-[18px] transition-colors duration-300",
						isManual
							? lit
								? "text-foreground"
								: "text-muted-foreground/70"
							: lit
								? "text-brand-blue"
								: "text-brand-blue/60"
					)}
					strokeWidth={1.75}
					aria-hidden="true"
				/>

				{/* Manual steps carry the hand: this one only moves if someone moves it. */}
				{isManual ? (
					<motion.span
						className={cn(
							"bg-background absolute -top-2.5 -right-2.5 flex h-5.5 w-5.5 items-center justify-center rounded-full border transition-colors duration-300",
							state === "active"
								? "border-foreground/40 text-foreground"
								: "border-border text-muted-foreground/70"
						)}
						animate={
							state === "active" && !prefersReduced ? { rotate: [0, -12, 10, 0] } : { rotate: 0 }
						}
						transition={{ duration: 0.7, ease: "easeInOut" }}
					>
						<Hand className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
					</motion.span>
				) : null}
			</span>

			<span
				className={cn(
					"text-[10px] leading-none transition-colors duration-300",
					lit ? "text-foreground" : "text-muted-foreground"
				)}
			>
				{step.label}
			</span>

			{/* Reserved slot so the row never reflows when the cost appears. */}
			<span className="text-muted-foreground flex h-3.5 items-center text-[10px] leading-none tabular-nums">
				{state === "active" && isManual ? (
					<CountUp to={step.minutes} suffix="′" prefersReduced={prefersReduced} />
				) : null}
			</span>
		</Reveal>
	)
}

function Connector({ filled }: { filled: boolean }): ReactNode {
	return (
		<Reveal className="relative mt-[21px] h-px min-w-4 flex-1 overflow-hidden" aria-hidden>
			<span className="border-border absolute inset-0 border-t border-dashed" />
			<motion.span
				className="bg-brand-blue absolute inset-0 origin-left"
				initial={false}
				animate={{ scaleX: filled ? 1 : 0 }}
				transition={{ duration: LINK_MS / 1000, ease: "linear" }}
			/>
		</Reveal>
	)
}

export function DiagramManualSteps(): ReactNode {
	const active = useChallengeHover()
	const prefersReduced = useReducedMotion()
	const cursor = useFlowLoop(active && !prefersReduced)
	const running = cursor !== null

	const nodeState = (index: number): "idle" | "done" | "active" => {
		if (!running) return "idle"
		const event = SEQUENCE[cursor]
		if (event?.kind === "node" && event.index === index) return "active"

		const position = SEQUENCE.findIndex(
			(candidate) => candidate.kind === "node" && candidate.index === index
		)
		return position < cursor ? "done" : "idle"
	}

	const linkFilled = (index: number): boolean => {
		if (!running) return false
		const position = SEQUENCE.findIndex(
			(candidate) => candidate.kind === "link" && candidate.index === index
		)
		return position <= cursor
	}

	return (
		<DiagramCanvas caption="Cada paso a mano vuelve a costar lo mismo, todos los días.">
			<div className="flex h-full flex-col justify-center">
				<div className="flex items-start justify-between">
					{STEPS.map((step, index) => (
						<div key={step.label} className="contents">
							<StepNode step={step} state={nodeState(index)} prefersReduced={prefersReduced} />
							{index < STEPS.length - 1 ? <Connector filled={linkFilled(index)} /> : null}
						</div>
					))}
				</div>

				<Reveal className="border-border mt-3 flex items-baseline justify-between border-t border-dotted pt-2.5">
					<span className="text-muted-foreground text-[10px]">Por pedido, a mano</span>
					<span className="text-foreground/80 text-[13px] font-semibold tracking-tight tabular-nums">
						<RunningTotal
							target={running ? minutesAt(cursor) : TOTAL_MINUTES}
							animated={running && !prefersReduced}
						/>
					</span>
				</Reveal>
			</div>
		</DiagramCanvas>
	)
}
