"use client"

import { EASE } from "@/components/diagrams/visual/constants"
import { InputCard, type InputSpec } from "@/components/diagrams/visual/input-card"
import { motion } from "motion/react"
import type { ReactNode, RefObject } from "react"

/**
 * The shell every home service visual shares: the inputs that feed it above,
 * then a bordered frame with a title, a status readout and whatever the
 * service's artefact is. Input `i` reads as connected once `stage > i`.
 */
export function VisualFrame({
	containerRef,
	inputs,
	stage,
	reduced,
	title,
	subtitle,
	status,
	children,
}: {
	containerRef: RefObject<HTMLDivElement | null>
	inputs: InputSpec[]
	stage: number
	reduced: boolean
	title: string
	subtitle: string
	status: ReactNode
	children: ReactNode
}): ReactNode {
	return (
		<div ref={containerRef} className="mx-auto w-full max-w-180">
			<div className="grid grid-cols-3 gap-1.5 px-2 sm:gap-3 sm:px-6">
				{inputs.map((input, i) => (
					<InputCard key={input.id} input={input} connected={stage >= i + 1} reduced={reduced} />
				))}
			</div>

			<motion.div
				className="border-border bg-background text-foreground overflow-hidden rounded-sm border shadow-xl shadow-black/6"
				initial={reduced ? false : { opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: EASE }}
			>
				<div className="border-border flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b px-3.5 py-2.5">
					<div className="min-w-0">
						<p className="truncate text-sm font-semibold tracking-tight">{title}</p>
						<p className="text-muted-foreground truncate text-[10px]">{subtitle}</p>
					</div>
					{status}
				</div>
				{children}
			</motion.div>
		</div>
	)
}
