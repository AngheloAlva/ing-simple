"use client"

import { Reveal, RevealGroup } from "@/components/diagrams/reveal"
import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Shared shell for the four "El desafío" diagrams. They must read as one
 * family: same canvas, same padding, same caption slot, same muted palette.
 * Blue marks the live signal — what moves and the little that works. Nothing
 * here earns the brand green, because nothing here is solved yet.
 * ------------------------------------------------------------------------ */

export { Reveal } from "@/components/diagrams/reveal"

export function DiagramCanvas({
	children,
	caption,
	className,
}: {
	children: ReactNode
	caption: ReactNode
	className?: string
}): ReactNode {
	return (
		<RevealGroup
			className={cn("flex h-full w-full flex-col justify-center gap-2.5 p-4", className)}
		>
			<div className="min-h-0 flex-1">{children}</div>

			{/* The caption is the last beat: the picture first, then the words. */}
			<Reveal className="shrink-0">
				<p className="text-muted-foreground text-center text-[10px] leading-tight">{caption}</p>
			</Reveal>
		</RevealGroup>
	)
}
