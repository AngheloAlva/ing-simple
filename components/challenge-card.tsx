"use client"

import { DiagramActiveProvider, useDiagramActive } from "@/components/diagrams/hover-context"
import { cn } from "@/lib/utils"
import { useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Bento tile for a single challenge. Owns the hover/focus state and hands it
 * down through context, so each diagram can animate without the section
 * itself becoming a client component. The tile is focusable, so the
 * interaction is never mouse-only.
 * ------------------------------------------------------------------------ */

/** True while the surrounding tile is hovered or keyboard-focused. */
export function useChallengeHover(): boolean {
	return useDiagramActive()
}

export type ChallengeCardProps = {
	title: string
	body: string
	/** The diagram rendered in the tile's visual area. */
	children: ReactNode
	className?: string
}

const TILE_RADIUS = "2px"

export function ChallengeCard({ title, body, children, className }: ChallengeCardProps): ReactNode {
	const [active, setActive] = useState(false)

	return (
		<div
			tabIndex={0}
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}
			onFocus={() => setActive(true)}
			onBlur={() => setActive(false)}
			style={{ borderRadius: TILE_RADIUS }}
			className={cn(
				"group border-border bg-muted/40 dark:bg-card flex flex-col overflow-hidden border transition-colors duration-300 outline-none",
				"hover:border-foreground/25 focus-visible:border-foreground/25 focus-visible:ring-brand-blue/50 focus-visible:ring-2",
				className
			)}
		>
			<div className="border-border bg-background/60 relative h-52 shrink-0 overflow-hidden border-b sm:h-56">
				{/* Dotted canvas, matching the grid used by the service panels. */}
				<div className="bg-muted/20 pointer-events-none absolute inset-0 z-0" />
				<div
					className="text-foreground/[0.09] pointer-events-none absolute inset-0 z-0"
					style={{
						backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
						backgroundSize: "22px 22px",
					}}
				/>

				<div className="relative z-10 h-full w-full">
					<DiagramActiveProvider active={active}>{children}</DiagramActiveProvider>
				</div>
			</div>

			<div className="p-5">
				<p className="text-sm font-semibold tracking-tight">{title}</p>
				<p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{body}</p>
			</div>
		</div>
	)
}
