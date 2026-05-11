"use client"

import { motion } from "motion/react"

import { CATEGORY_LABELS } from "@/lib/portfolio-data"
import { cn } from "@/lib/utils"

import { FILTERS, type FilterValue } from "./constants"

interface FilterBarProps {
	active: FilterValue
	onChange: (next: FilterValue) => void
	total: number
}

export function FilterBar({ active, onChange, total }: FilterBarProps) {
	return (
		<div className="border-border flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center">
			<span className="text-muted-foreground shrink-0 text-xs font-medium tracking-[0.2em] uppercase">
				Filtrar
			</span>
			<div className="relative flex flex-wrap gap-2">
				{FILTERS.map((f) => (
					<button
						key={f}
						onClick={() => onChange(f)}
						className={cn(
							"relative isolate cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium tracking-[0.15em] uppercase transition-colors",
							active === f
								? "text-background"
								: "bg-muted text-muted-foreground hover:text-foreground"
						)}
					>
						{active === f && (
							<motion.span
								layoutId="portfolio-pill"
								transition={{ type: "spring", stiffness: 400, damping: 32 }}
								className="bg-accent absolute inset-0 -z-10 rounded-full"
							/>
						)}
						{CATEGORY_LABELS[f]}
					</button>
				))}
			</div>
			<span className="text-muted-foreground text-xs tracking-[0.15em] uppercase sm:ml-auto">
				{total} {total === 1 ? "proyecto" : "proyectos"}
			</span>
		</div>
	)
}
