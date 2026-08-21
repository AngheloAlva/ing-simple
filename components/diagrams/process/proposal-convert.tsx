"use client"

import { useDiagramActive } from "@/components/diagrams/hover-context"
import { Reveal, RevealGroup } from "@/components/diagrams/reveal"
import { useStepLoop } from "@/components/diagrams/use-step-loop"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { MoveRight } from "lucide-react"
import { motion } from "motion/react"
import type { ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Propuesta — the scope being closed, one line at a time. Each thing the team
 * does by hand today is converted into something the system does, and the
 * proposal is finished only when every line has crossed over.
 * ------------------------------------------------------------------------ */

type Conversion = { from: string; to: string }

const CONVERSIONS: Conversion[] = [
	{ from: "Informe manual", to: "Dashboard" },
	{ from: "Correo de aprobación", to: "Flujo automático" },
	{ from: "Planilla compartida", to: "Sistema web" },
]

const STEP_MS = 900
const PAUSE_MS = 4000

type RowState = "pending" | "converting" | "done"

function ConversionRow({
	conversion,
	state,
	prefersReduced,
}: {
	conversion: Conversion
	state: RowState
	prefersReduced: boolean
}): ReactNode {
	const converted = state === "done"

	return (
		<Reveal>
			<div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
				<span
					className={cn(
						"bg-background truncate rounded-sm border px-2.5 py-2 font-mono text-xs transition-colors duration-300",
						converted
							? "border-border text-muted-foreground/60 border-dashed"
							: "border-border text-muted-foreground"
					)}
				>
					{conversion.from}
				</span>

				{/* The arrow only travels while this line is being converted. */}
				<motion.span
					className={cn(
						"transition-colors duration-300",
						state === "pending" ? "text-muted-foreground/40" : "text-brand-blue"
					)}
					animate={
						state === "converting" && !prefersReduced
							? { x: [0, 4, 0], opacity: [0.6, 1, 0.6] }
							: { x: 0, opacity: 1 }
					}
					transition={
						state === "converting" && !prefersReduced
							? { duration: 0.7, repeat: Infinity, ease: "easeInOut" }
							: { duration: 0.3 }
					}
					aria-hidden="true"
				>
					<MoveRight className="h-3.5 w-3.5" />
				</motion.span>

				<span
					className={cn(
						"bg-background truncate rounded-sm border border-l-2 px-2.5 py-2 font-mono text-xs transition-colors duration-300",
						converted
							? "border-border border-l-brand-green text-foreground"
							: "border-border border-l-border text-muted-foreground/40"
					)}
				>
					{conversion.to}
				</span>
			</div>
		</Reveal>
	)
}

export function DiagramProposalConvert(): ReactNode {
	const active = useDiagramActive()
	const prefersReduced = useReducedMotion()

	const loop = useStepLoop({
		active: active && !prefersReduced,
		steps: CONVERSIONS.length,
		duration: STEP_MS,
		pauseMs: PAUSE_MS,
	})

	const rowState = (index: number): RowState => {
		if (!loop) return "done"
		if (loop.index === index) return "converting"
		return loop.index > index ? "done" : "pending"
	}

	const closed = !loop || loop.index >= CONVERSIONS.length
	const convertedCount = loop
		? CONVERSIONS.filter((_, index) => rowState(index) === "done").length
		: CONVERSIONS.length

	return (
		<RevealGroup className="flex h-full flex-col justify-center gap-2" delay={0.1}>
			{CONVERSIONS.map((conversion, index) => (
				<ConversionRow
					key={conversion.from}
					conversion={conversion}
					state={rowState(index)}
					prefersReduced={prefersReduced}
				/>
			))}

			<Reveal className="border-border mt-1 flex items-baseline justify-between border-t border-dotted pt-2.5">
				<span
					className={cn(
						"text-[11px] transition-colors duration-300",
						closed ? "text-foreground/80" : "text-muted-foreground"
					)}
				>
					{closed ? "Alcance cerrado" : "Definiendo alcance"}
				</span>
				<span className="text-foreground/80 font-mono text-[11px] tabular-nums">
					{convertedCount} entregables
				</span>
			</Reveal>
		</RevealGroup>
	)
}
