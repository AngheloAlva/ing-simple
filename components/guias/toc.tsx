"use client"

import { useReducedMotion } from "@/lib/motion"
import { motion } from "motion/react"
import { useLayoutEffect, useRef, useState, type ReactNode } from "react"

import type { GuiaHeading } from "@/lib/guias/render"

/** Distance from the viewport top under which a heading counts as "passed" (sticky nav + margin). */
const ACTIVE_OFFSET_PX = 120

/** How far the spine bends inward for a run of depth-3 items, in SVG-space px (== container px). */
const INDENT_X = 14

/**
 * Tracks which heading is currently active: the last heading whose top edge
 * has scrolled above `ACTIVE_OFFSET_PX`, falling back to the first heading
 * near the top of the article. Recomputed on scroll and resize (throttled to
 * one animation frame), which stays correct for long sections and for large
 * scroll jumps that an IntersectionObserver band would miss.
 */
function useActiveHeading(headings: GuiaHeading[]): number {
	const [activeIndex, setActiveIndex] = useState(0)

	useLayoutEffect(() => {
		const elements = headings.map((heading) => document.getElementById(heading.id))

		if (elements.length === 0) return

		let frame = 0

		function update(): void {
			frame = 0
			let current = 0
			for (let i = 0; i < elements.length; i++) {
				const el = elements[i]
				if (!el) continue
				if (el.getBoundingClientRect().top <= ACTIVE_OFFSET_PX) current = i
				else break
			}
			setActiveIndex(current)
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

	return activeIndex
}

type ItemLayout = { top: number; height: number; depth: 2 | 3 }

type Spine = {
	/** Path `d` attribute, drawn twice: once as the static rail, once as the sliding highlight. */
	d: string
	/** Total path length, in the same units as `d` (px). */
	totalLength: number
	/** [start, end] length range each heading "owns" along the path, same order as `headings`. */
	ranges: Array<{ start: number; end: number }>
	/** SVG viewBox height == container height. */
	height: number
}

/**
 * Builds one continuous polyline through every item's vertical center: a
 * straight run at `x = 0` for depth-2 items, bending to `x = INDENT_X` for a
 * run of depth-3 items and back out again. Each heading is assigned the
 * length range of the path that surrounds it (from the bend/midpoint before
 * it to the one after), so the active highlight can reveal exactly that
 * stretch with `pathOffset`/`pathLength`.
 */
function buildSpine(items: ItemLayout[]): Spine | null {
	if (items.length === 0) return null

	const xFor = (depth: 2 | 3): number => (depth === 3 ? INDENT_X : 0)
	const centers = items.map((item) => item.top + item.height / 2)

	let cursor = { x: xFor(items[0]!.depth), y: items[0]!.top }
	let d = `M ${cursor.x} ${cursor.y}`
	let length = 0
	const boundaries: number[] = []

	function addSegment(to: { x: number; y: number }): number {
		const segLen = Math.hypot(to.x - cursor.x, to.y - cursor.y)
		const midLength = length + segLen / 2
		length += segLen
		d += ` L ${to.x} ${to.y}`
		cursor = to
		return midLength
	}

	addSegment({ x: xFor(items[0]!.depth), y: centers[0]! })

	for (let i = 0; i < items.length - 1; i++) {
		const depthA = items[i]!.depth
		const depthB = items[i + 1]!.depth
		const xA = xFor(depthA)
		const xB = xFor(depthB)
		const yA = centers[i]!
		const yB = centers[i + 1]!

		if (depthA === depthB) {
			boundaries.push(addSegment({ x: xA, y: yB }))
			continue
		}

		const gapMid = (yA + yB) / 2
		const bendHeight = Math.min(12, Math.abs(yB - yA) * 0.4)
		addSegment({ x: xA, y: gapMid - bendHeight / 2 })
		boundaries.push(addSegment({ x: xB, y: gapMid + bendHeight / 2 }))
		addSegment({ x: xB, y: yB })
	}

	const last = items[items.length - 1]!
	addSegment({ x: xFor(last.depth), y: last.top + last.height })

	const ranges = items.map((_, i) => ({
		start: i === 0 ? 0 : boundaries[i - 1]!,
		end: i === items.length - 1 ? length : boundaries[i]!,
	}))

	return { d, totalLength: length, ranges, height: last.top + last.height }
}

/**
 * Measures every `<li>` (via `itemRefs`) and rebuilds the spine whenever the
 * heading list changes or the layout does (window resize covers reflow from
 * a width change; text height itself never changes after mount).
 */
function useSpine(headings: GuiaHeading[]) {
	const itemRefs = useRef<Array<HTMLLIElement | null>>([])
	const [spine, setSpine] = useState<Spine | null>(null)

	useLayoutEffect(() => {
		function measure(): void {
			const items: ItemLayout[] = []
			for (let i = 0; i < headings.length; i++) {
				const el = itemRefs.current[i]
				if (!el) return
				items.push({ top: el.offsetTop, height: el.offsetHeight, depth: headings[i]!.depth })
			}
			setSpine(buildSpine(items))
		}

		measure()
		window.addEventListener("resize", measure)
		return () => window.removeEventListener("resize", measure)
	}, [headings])

	return { itemRefs, spine }
}

function TocLink({
	heading,
	isActive,
	itemRef,
}: {
	heading: GuiaHeading
	isActive: boolean
	itemRef: (el: HTMLLIElement | null) => void
}): ReactNode {
	return (
		<li ref={itemRef} className={heading.depth === 3 ? "pl-3" : undefined}>
			<a
				href={`#${heading.id}`}
				aria-current={isActive ? "location" : undefined}
				className={`block py-1.5 text-sm leading-snug transition-colors duration-200 ${
					isActive ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground"
				}`}
			>
				{heading.text}
			</a>
		</li>
	)
}

/** Desktop sticky rail: `components/guias/toc.tsx` used from the `[slug]` page. */
export function GuiaToc({ headings }: { headings: GuiaHeading[] }): ReactNode {
	const activeIndex = useActiveHeading(headings)
	const { itemRefs, spine } = useSpine(headings)
	const reduced = useReducedMotion()

	if (headings.length === 0) return null

	const activeRange = spine?.ranges[activeIndex]
	const total = spine?.totalLength ?? 1

	return (
		<nav aria-label="Contenido de la guía">
			<p className="text-muted-foreground pb-3 pl-9 font-mono text-[11px] tracking-[0.1em] uppercase">
				Contenido
			</p>
			<div className="relative">
				{spine && (
					<svg
						className="pointer-events-none absolute top-0 left-0 h-full overflow-visible"
						style={{ width: INDENT_X }}
						viewBox={`0 0 ${INDENT_X} ${spine.height}`}
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<path
							d={spine.d}
							stroke="var(--border)"
							strokeWidth={1}
							fill="none"
							vectorEffect="non-scaling-stroke"
						/>
						{activeRange && (
							<motion.path
								d={spine.d}
								stroke="var(--primary)"
								strokeWidth={2}
								strokeLinecap="round"
								fill="none"
								vectorEffect="non-scaling-stroke"
								initial={false}
								animate={{
									pathLength: (activeRange.end - activeRange.start) / total,
									pathOffset: activeRange.start / total,
								}}
								transition={
									reduced ? { duration: 0.01 } : { duration: 0.35, ease: [0.4, 0, 0.2, 1] }
								}
							/>
						)}
					</svg>
				)}
				<ul className="pl-9">
					{headings.map((heading, i) => (
						<TocLink
							key={heading.id}
							heading={heading}
							isActive={i === activeIndex}
							itemRef={(el) => {
								itemRefs.current[i] = el
							}}
						/>
					))}
				</ul>
			</div>
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
