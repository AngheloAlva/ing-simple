"use client"

import { useChallengeHover } from "@/components/challenge-card"
import { DiagramCanvas, Reveal } from "@/components/diagrams/challenge/shared"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import {
	FileText,
	Package,
	ShoppingCart,
	UserRound,
	UserRoundX,
	type LucideIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Conocimiento que no circula — every thread in the operation ends at the one
 * person who knows how it is done. On hover each area sends its request in and
 * the queue grows; then that person is not available and nothing moves. The
 * requests do not reroute, because there is nowhere else for them to go.
 * ------------------------------------------------------------------------ */

type Area = { icon: LucideIcon; label: string; y: number }

const AREAS: Area[] = [
	{ icon: ShoppingCart, label: "Ventas", y: 16 },
	{ icon: Package, label: "Depósito", y: 50 },
	{ icon: FileText, label: "Administración", y: 84 },
]

/** Where the request line leaves the area chip and where it reaches the person. */
const LINE_X1 = 40
const LINE_X2 = 72
const HUB_Y = 50

const SEND_MS = 520
const QUEUE_MS = 280
const BLOCK_MS = 1400
const RESTART_MS = 900

type Stage = "send" | "queue" | "block"
type Phase = { index: number; stage: Stage; cycle: number } | null

function stageDuration(stage: Stage): number {
	if (stage === "send") return SEND_MS
	if (stage === "queue") return QUEUE_MS
	return BLOCK_MS + RESTART_MS
}

/** Each area asks in turn, the queue piles up, and then the person is gone. */
function useQueueLoop(enabled: boolean): Phase {
	const [phase, setPhase] = useState<Phase>(null)

	useEffect(() => {
		if (!enabled) {
			setPhase(null)
			return
		}

		let cancelled = false
		const timers: ReturnType<typeof setTimeout>[] = []

		const advance = (index: number, stage: Stage, cycle: number) => {
			if (cancelled) return
			setPhase({ index, stage, cycle })

			timers.push(
				setTimeout(() => {
					if (cancelled) return

					if (stage === "send") return advance(index, "queue", cycle)

					if (stage === "queue") {
						const next = index + 1
						return next < AREAS.length
							? advance(next, "send", cycle)
							: advance(index, "block", cycle)
					}

					advance(0, "send", cycle + 1)
				}, stageDuration(stage))
			)
		}

		advance(0, "send", 0)

		return () => {
			cancelled = true
			timers.forEach(clearTimeout)
		}
	}, [enabled])

	return phase
}

function AreaChip({
	area,
	state,
}: {
	area: Area
	state: "idle" | "asking" | "waiting"
}): ReactNode {
	const Icon = area.icon

	return (
		<div className="absolute left-0 z-10 w-[38%] -translate-y-1/2" style={{ top: `${area.y}%` }}>
			<Reveal>
				<span
					className={cn(
						"bg-background flex h-8 w-full items-center gap-1.5 rounded-sm border px-2 transition-colors duration-300",
						state === "asking" ? "border-brand-blue/50" : "border-border border-dashed"
					)}
				>
					<Icon
						className={cn(
							"h-3.5 w-3.5 shrink-0 transition-colors duration-300",
							state === "asking" ? "text-brand-blue" : "text-muted-foreground/70"
						)}
						strokeWidth={1.75}
						aria-hidden="true"
					/>
					<span
						className={cn(
							"text-[10px] leading-none whitespace-nowrap transition-colors duration-300",
							state === "asking" ? "text-foreground" : "text-muted-foreground"
						)}
					>
						{area.label}
					</span>
				</span>
			</Reveal>
		</div>
	)
}

/** The single person every thread ends at. */
function Hub({ queued, blocked }: { queued: number; blocked: boolean }): ReactNode {
	const Icon = blocked ? UserRoundX : UserRound

	return (
		<div className="absolute top-1/2 right-0 z-10 w-[26%] -translate-y-1/2">
			<Reveal pop>
				<motion.div
					className={cn(
						"bg-background flex w-full flex-col items-center gap-1.5 rounded-sm border px-2 py-2.5 transition-colors duration-300",
						blocked ? "border-border border-dashed" : "border-foreground/40"
					)}
					animate={blocked ? { opacity: 0.75 } : { opacity: 1 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
				>
					<Icon
						className={cn(
							"h-5 w-5 transition-colors duration-300",
							blocked ? "text-muted-foreground/70" : "text-foreground"
						)}
						strokeWidth={1.75}
						aria-hidden="true"
					/>
					<span className="text-muted-foreground text-center text-[10px] leading-tight text-balance">
						Quien sabe hacerlo
					</span>
					<span
						className={cn(
							"text-[10px] leading-none tabular-nums transition-colors duration-300",
							blocked ? "text-foreground" : "text-muted-foreground"
						)}
					>
						{queued} en espera
					</span>
				</motion.div>
			</Reveal>
		</div>
	)
}

export function DiagramSinglePoint(): ReactNode {
	const active = useChallengeHover()
	const prefersReduced = useReducedMotion()
	const phase = useQueueLoop(active && !prefersReduced)
	const running = phase !== null

	const blocked = !running || phase.stage === "block"

	const queued = running
		? phase.stage === "block"
			? AREAS.length
			: phase.index + (phase.stage === "queue" ? 1 : 0)
		: AREAS.length

	const areaState = (index: number): "idle" | "asking" | "waiting" => {
		if (!running) return "waiting"
		if (phase.stage === "send" && phase.index === index) return "asking"
		return phase.index >= index ? "waiting" : "idle"
	}

	return (
		<DiagramCanvas caption="Si esa persona no está, todo lo demás queda esperando.">
			<div className="relative h-full w-full">
				{AREAS.map((area, index) => (
					<AreaChip key={area.label} area={area} state={areaState(index)} />
				))}

				{/* Request lines sit behind the chips: z-0 against their z-10. */}
				<Reveal className="pointer-events-none absolute inset-0 z-0" aria-hidden>
					<svg
						className="h-full w-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
						fill="none"
						aria-hidden="true"
					>
						{AREAS.map((area, index) => {
							const points = { x1: LINE_X1, y1: area.y, x2: LINE_X2, y2: HUB_Y }
							const sending = running && phase.stage === "send" && phase.index === index

							if (sending) {
								return (
									<motion.line
										key={`${index}-send-${phase.cycle}`}
										{...points}
										stroke="currentColor"
										strokeWidth={1}
										strokeLinecap="round"
										vectorEffect="non-scaling-stroke"
										className="text-brand-blue"
										initial={{ pathLength: 0 }}
										animate={{ pathLength: 1 }}
										transition={{ duration: SEND_MS / 1000, ease: "easeInOut" }}
									/>
								)
							}

							return (
								<line
									key={index}
									{...points}
									stroke="currentColor"
									strokeWidth={1}
									strokeDasharray="2 4"
									vectorEffect="non-scaling-stroke"
									className="text-muted-foreground/30"
								/>
							)
						})}
					</svg>
				</Reveal>

				<Hub queued={queued} blocked={blocked} />
			</div>
		</DiagramCanvas>
	)
}
