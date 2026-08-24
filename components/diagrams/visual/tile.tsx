"use client"

import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

/** A slicer tile: the little toggle buttons down a report's rail. */
export function Tile({
	active,
	onClick,
	children,
	className,
}: {
	active: boolean
	onClick: () => void
	children: ReactNode
	className?: string
}): ReactNode {
	return (
		<button
			type="button"
			aria-pressed={active}
			onClick={onClick}
			className={cn(
				"focus-ring h-6 rounded-sm px-2.5 text-[11px] font-medium tabular-nums transition-colors duration-200",
				active
					? "bg-primary text-primary-foreground"
					: "bg-muted text-muted-foreground hover:bg-border hover:text-foreground",
				className
			)}
		>
			{children}
		</button>
	)
}
