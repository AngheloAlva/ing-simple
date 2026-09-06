"use client"

import { useReducedMotion } from "@/lib/motion"
import { motion } from "motion/react"
import { useEffect, useState, type ReactNode } from "react"

import type { GuiaHeading } from "@/lib/guias/render"

/** Distance from the viewport top under which a heading counts as "passed" (sticky nav + margin). */
const ACTIVE_OFFSET_PX = 120

/**
 * Tracks which heading is currently active: the last heading whose top edge
 * has scrolled above `ACTIVE_OFFSET_PX`, falling back to the first heading
 * near the top of the article. Recomputed on scroll and resize (throttled to
 * one animation frame), which stays correct for long sections and for large
 * scroll jumps that an IntersectionObserver band would miss.
 */
function useActiveHeading(headings: GuiaHeading[]): string | undefined {
	const [activeId, setActiveId] = useState<string | undefined>(headings[0]?.id)

	useEffect(() => {
		const elements = headings
			.map((heading) => document.getElementById(heading.id))
			.filter((el): el is HTMLElement => el !== null)

		if (elements.length === 0) return

		let frame = 0

		function update(): void {
			frame = 0
			let current = elements[0]
			for (const element of elements) {
				if (element.getBoundingClientRect().top <= ACTIVE_OFFSET_PX) current = element
				else break
			}
			if (current) setActiveId(current.id)
		}

		function schedule(): void {
			if (frame !== 0) return
			frame = window.requestAnimationFrame(update)
		}

		update()
		window.addEventListener("scroll", schedule, { passive: true })
		window.addEventListener("resize", schedule)
		return () => {
			window.removeEventListener("scroll", schedule)
			window.removeEventListener("resize", schedule)
			if (frame !== 0) window.cancelAnimationFrame(frame)
		}
	}, [headings])

	return activeId
}

function TocLink({ heading, isActive }: { heading: GuiaHeading; isActive: boolean }): ReactNode {
	const prefersReducedMotion = useReducedMotion()

	return (
		<li className={heading.depth === 3 ? "pl-4" : undefined}>
			<a
				href={`#${heading.id}`}
				aria-current={isActive ? "location" : undefined}
				className={`relative block py-1.5 pl-4 text-sm leading-snug transition-colors duration-200 ${
					isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
				}`}
			>
				{isActive ? (
					<motion.span
						layoutId="toc-indicator"
						className="bg-primary absolute inset-y-1 left-0 w-px"
						transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.25 }}
					/>
				) : null}
				{heading.text}
			</a>
		</li>
	)
}

/** Desktop sticky rail: `components/guias/toc.tsx` used from the `[slug]` page. */
export function GuiaToc({ headings }: { headings: GuiaHeading[] }): ReactNode {
	const activeId = useActiveHeading(headings)

	if (headings.length === 0) return null

	return (
		<nav aria-label="Contenido de la guía" className="border-border border-l">
			<p className="text-muted-foreground pb-3 pl-4 font-mono text-[11px] tracking-[0.1em] uppercase">
				Contenido
			</p>
			<ul>
				{headings.map((heading) => (
					<TocLink key={heading.id} heading={heading} isActive={heading.id === activeId} />
				))}
			</ul>
		</nav>
	)
}

/** Mobile equivalent: a collapsed `<details>` above the article. */
export function GuiaTocMobile({ headings }: { headings: GuiaHeading[] }): ReactNode {
	if (headings.length === 0) return null

	return (
		<details className="border-border bg-muted/40 group rounded-sm border p-4 lg:hidden">
			<summary className="text-sm font-medium tracking-tight [&::-webkit-details-marker]:hidden">
				Contenido
			</summary>
			<ul className="mt-3 space-y-2">
				{headings.map((heading) => (
					<li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
						<a
							href={`#${heading.id}`}
							className="text-muted-foreground hover:text-primary text-sm leading-snug"
						>
							{heading.text}
						</a>
					</li>
				))}
			</ul>
		</details>
	)
}
