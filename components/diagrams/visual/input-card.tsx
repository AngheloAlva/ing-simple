"use client"

import { EASE, GREEN } from "@/components/diagrams/visual/constants"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { motion } from "motion/react"
import type { ReactNode } from "react"

export type InputSpec = {
	id: string
	label: string
	meta: string
	icon: LucideIcon
}

/**
 * One of the inputs that feed a visual: a card above the frame with a line
 * dropping into it. On connect the line fills green and the status dot pings
 * once, then gets out of the way.
 */
export function InputCard({
	input,
	connected,
	reduced,
}: {
	input: InputSpec
	connected: boolean
	reduced: boolean
}): ReactNode {
	const Icon = input.icon
	return (
		<div className="flex h-full flex-col items-center">
			<div
				className={cn(
					"bg-background flex w-full flex-1 flex-col items-center justify-center gap-1 rounded-sm border px-1.5 py-2 text-center transition-colors duration-300 sm:flex-row sm:gap-2.5 sm:px-2.5 sm:text-left",
					connected ? "border-border" : "border-border/70 border-dashed"
				)}
			>
				<span
					className={cn(
						"flex h-6 w-6 shrink-0 items-center justify-center rounded-sm transition-colors duration-300 sm:h-8 sm:w-8",
						connected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground/60"
					)}
				>
					<Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
				</span>
				<span className="w-full min-w-0 sm:flex-1">
					<span
						className={cn(
							"line-clamp-2 block text-[10px] leading-tight font-semibold transition-colors duration-300 sm:block sm:truncate sm:text-xs sm:leading-normal",
							connected ? "text-foreground" : "text-muted-foreground"
						)}
					>
						{input.label}
					</span>
					<span className="text-muted-foreground hidden truncate text-[10px] sm:block">
						{input.meta}
					</span>
				</span>
				<span className="relative hidden h-2 w-2 shrink-0 sm:flex" aria-hidden="true">
					{connected && !reduced && (
						<motion.span
							className="absolute inset-0 rounded-full"
							style={{ background: GREEN }}
							initial={{ scale: 1, opacity: 0.7 }}
							animate={{ scale: 3, opacity: 0 }}
							transition={{ duration: 0.8, ease: "easeOut" }}
						/>
					)}
					<motion.span
						className={cn(
							"h-2 w-2 rounded-full transition-colors duration-300",
							!connected && "bg-muted-foreground/30"
						)}
						style={connected ? { background: GREEN } : {}}
						animate={{ opacity: connected ? 0 : 1 }}
						transition={{ duration: reduced ? 0 : 0.4, delay: reduced || !connected ? 0 : 1.1 }}
					/>
				</span>
			</div>

			<span className="bg-border relative h-7 w-px" aria-hidden="true">
				<motion.span
					className="absolute inset-x-0 top-0"
					style={{ background: GREEN }}
					initial={{ height: 0 }}
					animate={{ height: connected ? "100%" : 0 }}
					transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
				/>
			</span>
		</div>
	)
}
