"use client"

import { useDiagramActive } from "@/components/diagrams/hover-context"
import { Reveal, RevealGroup } from "@/components/diagrams/reveal"
import { useStepLoop } from "@/components/diagrams/use-step-loop"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { motion } from "motion/react"
import type { ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Acompañamiento — what arrives after delivery, and what happens to it. The
 * requests come in one by one and get resolved; the channel at the bottom
 * never closes, because this stage has no end date.
 * ------------------------------------------------------------------------ */

type Request = {
	title: string
}

const REQUESTS: Request[] = [
	{ title: "Ajuste de indicador" },
	{ title: "Nueva vista de stock" },
	{ title: "Refuerzo de capacitación" },
]

const STEP_MS = 1100
const PAUSE_MS = 4000

type RowState = "pending" | "working" | "done"

function RequestRow({ request, state }: { request: Request; state: RowState }): ReactNode {
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
						"min-w-0 flex-1 truncate text-sm font-medium transition-colors duration-300",
						state === "pending" ? "text-muted-foreground" : "text-foreground"
					)}
				>
					{request.title}
				</span>

				{/* One slot, three readings: just arrived, being handled, closed. */}
				<span className="bg-muted text-muted-foreground inline-flex h-6 shrink-0 items-center gap-1 px-2.5 text-[11px] font-medium">
					{state === "done" ? (
						<>
							<Check className="text-brand-green h-3 w-3" aria-hidden="true" />
							Resuelto
						</>
					) : state === "working" ? (
						<motion.span
							animate={{ opacity: [1, 0.45, 1] }}
							transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut" }}
						>
							En curso
						</motion.span>
					) : (
						<span className="opacity-60">Recibido</span>
					)}
				</span>
			</div>
		</Reveal>
	)
}

export function DiagramSupportFeed(): ReactNode {
	const active = useDiagramActive()
	const prefersReduced = useReducedMotion()

	const loop = useStepLoop({
		active: active && !prefersReduced,
		steps: REQUESTS.length,
		duration: STEP_MS,
		pauseMs: PAUSE_MS,
	})

	const rowState = (index: number): RowState => {
		if (!loop) return "done"
		if (loop.index === index) return "working"
		return loop.index > index ? "done" : "pending"
	}

	return (
		<RevealGroup className="flex h-full flex-col justify-center gap-2" delay={0.1}>
			{REQUESTS.map((request, index) => (
				<RequestRow key={request.title} request={request} state={rowState(index)} />
			))}

			{/* The channel stays open no matter where the loop is. */}
			<Reveal className="border-border mt-1 flex items-baseline justify-between border-t border-dotted pt-2.5">
				<span className="text-muted-foreground text-[11px]">Canal de soporte</span>
				<span className="text-foreground/80 inline-flex items-center gap-1.5 font-mono text-[11px]">
					{prefersReduced ? (
						<span className="bg-brand-green h-1.5 w-1.5 rounded-full" aria-hidden="true" />
					) : (
						<motion.span
							className="bg-brand-green h-1.5 w-1.5 rounded-full"
							animate={{ opacity: [1, 0.35, 1] }}
							transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
							aria-hidden="true"
						/>
					)}
					activo
				</span>
			</Reveal>
		</RevealGroup>
	)
}
