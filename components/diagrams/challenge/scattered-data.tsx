"use client"

import { useChallengeHover } from "@/components/challenge-card"
import { DiagramCanvas, Reveal } from "@/components/diagrams/challenge/shared"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import {
	ClipboardList,
	FileSpreadsheet,
	LayoutDashboard,
	Mail,
	type LucideIcon,
} from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Datos dispersos — four systems that each hold a piece of the same picture
 * and none of them reach the shared view in the middle. On hover the sources
 * light up one by one and push their signal toward the centre, where the link
 * is cut: the break flashes, the signal dies, and the whole thing starts over
 * a beat later. It keeps retrying and it never connects.
 * ------------------------------------------------------------------------ */

type Node = {
	icon: LucideIcon
	label: string
	/** Position of the node centre, in % of the canvas. */
	x: number
	y: number
}

const NODES: Node[] = [
	{ icon: FileSpreadsheet, label: "Planillas", x: 8, y: 23 },
	{ icon: LayoutDashboard, label: "Dashboard", x: 92, y: 23 },
	{ icon: Mail, label: "Correo", x: 8, y: 77 },
	{ icon: ClipboardList, label: "Formularios", x: 92, y: 77 },
]

const CENTRE = { x: 50, y: 50 }

/** Where the link leaves the icon and where it dies, as a fraction of the run. */
const LINK_START = 0.2
const LINK_END = 0.8

const TRAVEL_MS = 820
const FAIL_MS = 520
const RESTART_MS = 1200

function linkPoints(node: Node): { x1: number; y1: number; x2: number; y2: number } {
	const dx = CENTRE.x - node.x
	const dy = CENTRE.y - node.y

	return {
		x1: node.x + dx * LINK_START,
		y1: node.y + dy * LINK_START,
		x2: node.x + dx * LINK_END,
		y2: node.y + dy * LINK_END,
	}
}

type Phase = { index: number; stage: "travel" | "fail"; cycle: number } | null

/** Drives the retry loop: source lights up, signal travels, break flashes, repeat. */
function useRetryLoop(enabled: boolean): Phase {
	const [phase, setPhase] = useState<Phase>(null)

	useEffect(() => {
		if (!enabled) {
			setPhase(null)
			return
		}

		let cancelled = false
		const timers: ReturnType<typeof setTimeout>[] = []

		const schedule = (fn: () => void, ms: number) => {
			timers.push(setTimeout(fn, ms))
		}

		const run = (index: number, cycle: number) => {
			if (cancelled) return
			setPhase({ index, stage: "travel", cycle })

			schedule(() => {
				if (cancelled) return
				setPhase({ index, stage: "fail", cycle })

				schedule(() => {
					if (cancelled) return
					const next = index + 1

					if (next < NODES.length) {
						run(next, cycle)
					} else {
						setPhase(null)
						schedule(() => run(0, cycle + 1), RESTART_MS)
					}
				}, FAIL_MS)
			}, TRAVEL_MS)
		}

		run(0, 0)

		return () => {
			cancelled = true
			timers.forEach(clearTimeout)
		}
	}, [enabled])

	return phase
}

function SourceNode({ node, lit }: { node: Node; lit: boolean }): ReactNode {
	const Icon = node.icon

	return (
		<div
			className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
			style={{ left: `${node.x}%`, top: `${node.y}%` }}
		>
			<Reveal className="flex flex-col items-center gap-1.5">
				<span
					className={cn(
						"bg-background flex h-12 w-12 items-center justify-center rounded-sm border transition-colors duration-300",
						lit ? "border-brand-blue/50" : "border-border border-dashed"
					)}
				>
					<Icon
						className={cn(
							"h-5 w-5 transition-colors duration-300",
							lit ? "text-brand-blue" : "text-muted-foreground/70"
						)}
						strokeWidth={1.75}
						aria-hidden="true"
					/>
				</span>
				<span
					className={cn(
						"text-[10px] leading-none whitespace-nowrap transition-colors duration-300",
						lit ? "text-foreground" : "text-muted-foreground"
					)}
				>
					{node.label}
				</span>
			</Reveal>
		</div>
	)
}

/** The cut in the middle: where every link dies. */
function BreakMarker({ flashing }: { flashing: boolean }): ReactNode {
	return (
		<div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
			<Reveal pop>
				<motion.span
					className={cn(
						"bg-background flex h-8 w-8 items-center justify-center rounded-sm border transition-colors duration-200",
						flashing ? "border-foreground/50" : "border-border border-dashed"
					)}
					animate={flashing ? { scale: [1, 1.14, 1] } : { scale: 1 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					aria-hidden="true"
				>
					<svg viewBox="0 0 12 12" className="h-4 w-4" fill="none">
						<path
							d="M3 3l6 6M9 3l-6 6"
							stroke="currentColor"
							strokeWidth={1.5}
							strokeLinecap="round"
							className={cn(
								"transition-colors duration-200",
								flashing ? "text-foreground" : "text-muted-foreground/50"
							)}
						/>
					</svg>
				</motion.span>
			</Reveal>
		</div>
	)
}

export function DiagramScatteredData(): ReactNode {
	const active = useChallengeHover()
	const prefersReduced = useReducedMotion()
	const phase = useRetryLoop(active && !prefersReduced)

	return (
		<DiagramCanvas caption="Cada sistema tiene su parte y ninguno llega a la vista común.">
			<div className="relative h-full w-full">
				{NODES.map((node, index) => (
					<SourceNode key={node.label} node={node} lit={phase?.index === index} />
				))}

				{/* Links sit behind the nodes: z-0 against the nodes' z-10. */}
				<Reveal className="pointer-events-none absolute inset-0 z-0">
					<svg
						className="h-full w-full"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
						fill="none"
						aria-hidden="true"
					>
						{NODES.map((node, index) => {
							const points = linkPoints(node)
							const isTravelling = phase?.index === index && phase.stage === "travel"
							const isFailing = phase?.index === index && phase.stage === "fail"

							if (isTravelling || isFailing) {
								return (
									<motion.line
										key={`${index}-${phase.stage}-${phase.cycle}`}
										{...points}
										stroke="currentColor"
										strokeWidth={1}
										strokeLinecap="round"
										vectorEffect="non-scaling-stroke"
										className="text-brand-blue"
										initial={
											isTravelling ? { pathLength: 0, opacity: 1 } : { pathLength: 1, opacity: 1 }
										}
										animate={
											isTravelling ? { pathLength: 1, opacity: 1 } : { pathLength: 1, opacity: 0 }
										}
										transition={{
											duration: (isTravelling ? TRAVEL_MS : FAIL_MS) / 1000,
											ease: isTravelling ? "easeIn" : "easeOut",
										}}
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

				<BreakMarker flashing={phase?.stage === "fail"} />
			</div>
		</DiagramCanvas>
	)
}
