"use client"

import { GREEN_TEXT } from "@/components/diagrams/visual/constants"
import type { LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import type { ReactNode } from "react"

export type StatusTone = "pending" | "ready" | "done"

/** The small state readout in a frame's header: blinks while pending, green when done. */
export function StatusLine({
	icon: Icon,
	label,
	tone,
	reduced,
}: {
	icon: LucideIcon
	label: string
	tone: StatusTone
	reduced: boolean
}): ReactNode {
	const pending = tone === "pending"
	const color =
		tone === "done"
			? GREEN_TEXT
			: tone === "ready"
				? "var(--foreground)"
				: "var(--muted-foreground)"

	return (
		<div
			className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium transition-colors duration-300"
			style={{ color }}
		>
			<motion.span
				className="flex"
				animate={{ opacity: pending && !reduced ? [0.35, 1, 0.35] : 1 }}
				transition={
					pending && !reduced
						? { duration: 1.2, repeat: Number.POSITIVE_INFINITY }
						: { duration: 0.3 }
				}
			>
				<Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
			</motion.span>
			<span>{label}</span>
		</div>
	)
}
