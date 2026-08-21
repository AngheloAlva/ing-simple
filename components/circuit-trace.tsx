"use client"

import { motion, useReducedMotion } from "motion/react"
import type { ReactNode } from "react"

/**
 * Decorative circuit traces — orthogonal runs that elbow at 45° and land on
 * ring nodes, echoing the brand logo's own trace-and-node language.
 *
 * The runs travel right to left and begin at the viewBox's right edge, so
 * anchoring the box past the viewport makes them arrive from off screen
 * rather than starting in mid air.
 *
 * Purely ambient: absolutely positioned, non-interactive and hidden from
 * assistive tech. A light pulse travels each trace on a loop; with reduced
 * motion the traces render static.
 */

type Trace = {
	/** Path geometry inside the 320×200 viewBox. */
	d: string
	/** Node coordinates the trace terminates on. */
	node: [number, number]
	/** Seconds before this trace's pulse starts, so runs feel staggered. */
	delay: number
	/** Outcome nodes borrow the brand green; the rest stay blue. */
	accent?: boolean
}

const TRACES: Trace[] = [
	{ d: "M320,6 H200 L178,28 H58", node: [50, 28], delay: 0 },
	{ d: "M320,38 H240 L218,60 H58", node: [50, 60], delay: 1.1, accent: true },
	{ d: "M320,70 H160 L138,92 H58", node: [50, 92], delay: 2.2 },
	{ d: "M320,102 H260 L238,124 H58", node: [50, 124], delay: 0.6 },
	{ d: "M320,134 H130 L108,156 H58", node: [50, 156], delay: 2.8, accent: true },
]

/** Junction dots dropped mid-run, the way a real board branches a track. */
const JUNCTIONS: [number, number][] = [
	[260, 6],
	[280, 38],
	[230, 70],
	[290, 134],
]

const PULSE_DURATION = 3.2
const CYCLE = 4.4

export function CircuitTrace({ className = "" }: { className?: string }): ReactNode {
	const reduce = useReducedMotion()

	return (
		<div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
			<svg
				viewBox="0 0 320 200"
				preserveAspectRatio="xMaxYMid meet"
				fill="none"
				className="h-full w-full"
			>
				{/* Static bed — the traces themselves, always visible. */}
				{TRACES.map((trace) => (
					<path
						key={trace.d}
						d={trace.d}
						stroke="var(--primary)"
						strokeOpacity={0.18}
						strokeWidth={1.25}
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				))}

				{/* Travelling pulse — a short lit segment sliding along each run. */}
				{!reduce &&
					TRACES.map((trace) => (
						<motion.path
							key={`pulse-${trace.d}`}
							d={trace.d}
							pathLength={1}
							stroke={trace.accent ? "var(--brand-green)" : "var(--primary)"}
							strokeOpacity={0.85}
							strokeWidth={1.5}
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeDasharray="0.14 0.86"
							initial={{ strokeDashoffset: 1 }}
							animate={{ strokeDashoffset: -0.14 }}
							transition={{
								duration: PULSE_DURATION,
								ease: "linear",
								repeat: Number.POSITIVE_INFINITY,
								repeatDelay: CYCLE - PULSE_DURATION,
								delay: trace.delay,
							}}
						/>
					))}

				{JUNCTIONS.map(([cx, cy]) => (
					<circle
						key={`${cx}-${cy}`}
						cx={cx}
						cy={cy}
						r={2.25}
						fill="var(--primary)"
						fillOpacity={0.3}
					/>
				))}

				{/* Terminal nodes — ring plus core, lifted as the pulse lands. */}
				{TRACES.map((trace) => {
					const [cx, cy] = trace.node
					const color = trace.accent ? "var(--brand-green)" : "var(--primary)"
					const arrival = trace.delay + PULSE_DURATION * 0.95

					return (
						<g key={`node-${cx}-${cy}`}>
							<circle
								cx={cx}
								cy={cy}
								r={5}
								stroke={color}
								strokeOpacity={0.3}
								strokeWidth={1.25}
								fill="var(--background)"
							/>
							{reduce ? (
								<circle cx={cx} cy={cy} r={1.9} fill={color} fillOpacity={0.35} />
							) : (
								<motion.circle
									cx={cx}
									cy={cy}
									r={1.9}
									fill={color}
									initial={{ opacity: 0.25 }}
									animate={{ opacity: [0.25, 1, 0.25] }}
									transition={{
										duration: 1.1,
										ease: "easeOut",
										repeat: Number.POSITIVE_INFINITY,
										repeatDelay: CYCLE - 1.1,
										delay: arrival,
									}}
								/>
							)}
						</g>
					)
				})}
			</svg>
		</div>
	)
}

export default CircuitTrace
