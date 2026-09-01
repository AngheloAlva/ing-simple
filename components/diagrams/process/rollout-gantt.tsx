"use client"

import { useDiagramActive } from "@/components/diagrams/hover-context"
import { Reveal, RevealGroup } from "@/components/diagrams/reveal"
import { useReducedMotion } from "@/lib/motion"
import { Check } from "lucide-react"
import {
	animate,
	motion,
	useMotionValue,
	useMotionValueEvent,
	useTransform,
	type MotionValue,
} from "motion/react"
import { useEffect, useRef, useState, type ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Implementación — the plan as a Gantt that actually runs. Stages overlap and
 * close one by one as the playhead crosses them. What happens after delivery
 * is the next step's picture, so this chart ends where the training does.
 * ------------------------------------------------------------------------ */

type Track = {
	label: string
	/** Start and length in weeks. */
	start: number
	span: number
}

const TOTAL_WEEKS = 6

const TRACKS: Track[] = [
	{ label: "Base y datos", start: 0, span: 3 },
	{ label: "Automatizaciones", start: 2, span: 3 },
	{ label: "Capacitación", start: 4.5, span: 1.5 },
]

/** First useful version ships here, and it is the number people remember. */
const MILESTONE_WEEK = 3

const SWEEP_S = 6
const HOLD_MS = 4000
/** The rows are still arriving for about this long; the rewind waits them out. */
const ENTRANCE_MS = 400
/** Rewinding on screen instead of snapping back to zero between passes. */
const REWIND_S = 0.5

const LABEL_COL = "6.5rem"
const COL_GAP = "0.75rem"
/** Where the track area begins, past the label column and its gap. */
const TRACK_OFFSET = `calc(${LABEL_COL} + ${COL_GAP})`

function percent(week: number): string {
	return `${(week / TOTAL_WEEKS) * 100}%`
}

function GanttRow({ track, progress }: { track: Track; progress: MotionValue<number> }): ReactNode {
	const startRatio = track.start / TOTAL_WEEKS
	const endRatio = (track.start + track.span) / TOTAL_WEEKS

	const scaleX = useTransform(progress, [startRatio, endRatio], [0, 1], { clamp: true })
	const doneOpacity = useTransform(progress, [endRatio - 0.015, endRatio + 0.01], [0, 1], {
		clamp: true,
	})

	return (
		<Reveal
			className="grid items-center"
			style={{ gridTemplateColumns: `${LABEL_COL} 1fr`, gap: COL_GAP }}
		>
			<span className="text-muted-foreground truncate text-[10px] leading-none">{track.label}</span>

			<div className="relative h-2.5">
				{/* Planned window: what the proposal committed to. */}
				<span
					className="border-border absolute top-1/2 h-2.5 -translate-y-1/2 rounded-[1px] border border-dashed"
					style={{ left: percent(track.start), width: percent(track.span) }}
					aria-hidden="true"
				/>

				{/* Actual progress. */}
				<motion.span
					className="bg-brand-blue absolute top-1/2 h-2.5 origin-left -translate-y-1/2 rounded-[1px]"
					style={{ left: percent(track.start), width: percent(track.span), scaleX }}
					aria-hidden="true"
				/>

				<motion.span
					className="text-brand-green absolute top-1/2 -translate-y-1/2"
					style={{
						left: `calc(${percent(track.start + track.span)} + 4px)`,
						opacity: doneOpacity,
					}}
					aria-hidden="true"
				>
					<Check className="h-3 w-3" strokeWidth={2.5} />
				</motion.span>
			</div>
		</Reveal>
	)
}

export function DiagramRolloutGantt(): ReactNode {
	const active = useDiagramActive()
	const prefersReduced = useReducedMotion()

	const progress = useMotionValue(1)
	const playheadLeft = useTransform(progress, [0, 1], ["0%", "100%"])

	const [stageIndex, setStageIndex] = useState<number | null>(null)
	const stageRef = useRef<number | null>(null)

	useMotionValueEvent(progress, "change", (value) => {
		let next = -1
		for (let index = 0; index < TRACKS.length; index++) {
			const track = TRACKS[index]
			if (track && value >= track.start / TOTAL_WEEKS) next = index
		}

		const resolved = next < 0 ? null : next
		if (resolved !== stageRef.current) {
			stageRef.current = resolved
			setStageIndex(resolved)
		}
	})

	useEffect(() => {
		if (prefersReduced) {
			progress.set(1)
			return
		}

		// Losing visibility pauses the chart where it stands. Snapping it to the
		// finished state instead read as a freeze, because a full chart and a
		// stopped one look identical.
		if (!active) return

		let cancelled = false
		let timer: ReturnType<typeof setTimeout> | undefined
		let controls: ReturnType<typeof animate> | undefined

		// `progress.set` does not cancel a running animation, so a leftover one
		// would fight this one for the same value.
		const sweep = () => {
			if (cancelled) return
			controls?.stop()
			controls = animate(progress, 1, {
				duration: SWEEP_S,
				ease: "linear",
				onComplete: () => {
					if (cancelled) return
					timer = setTimeout(rewind, HOLD_MS)
				},
			})
		}

		// The finished chart used to jump straight back to empty, which reads as a
		// stall followed by a restart. Winding it back on screen makes the loop
		// legible as a loop.
		const rewind = () => {
			if (cancelled) return
			controls?.stop()
			controls = animate(progress, 0, {
				duration: REWIND_S,
				ease: "easeInOut",
				onComplete: () => {
					if (cancelled) return
					sweep()
				},
			})
		}

		// Let the rows finish arriving, then wind the finished chart back and play.
		timer = setTimeout(rewind, ENTRANCE_MS)

		return () => {
			cancelled = true
			controls?.stop()
			if (timer) clearTimeout(timer)
		}
	}, [active, prefersReduced, progress])

	const running = active && !prefersReduced
	const stageLabel =
		running && stageIndex !== null ? (TRACKS[stageIndex]?.label ?? "En curso") : "En curso"

	return (
		<RevealGroup className="flex h-full flex-col justify-center gap-3" delay={0.1}>
			<Reveal className="flex items-center justify-between">
				<span className="text-foreground text-sm font-medium">Puesta en marcha</span>
				<span className="bg-muted text-muted-foreground inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium">
					<span className="bg-brand-green h-1.5 w-1.5 rounded-full" />
					{stageLabel}
				</span>
			</Reveal>

			<div className="relative flex flex-col gap-2">
				{TRACKS.map((track) => (
					<GanttRow key={track.label} track={track} progress={progress} />
				))}

				{/* Overlay lives in the track area only, past the label column. */}
				<div
					className="pointer-events-none absolute inset-y-0 right-0"
					style={{ left: TRACK_OFFSET }}
					aria-hidden="true"
				>
					<span
						className="border-border absolute inset-y-0 border-l border-dashed"
						style={{ left: percent(MILESTONE_WEEK) }}
					/>
					<motion.span
						className="bg-brand-blue absolute inset-y-0 w-px"
						style={{ left: playheadLeft }}
					/>
				</div>
			</div>

			<Reveal className="border-border flex items-baseline justify-between border-t border-dotted pt-2.5">
				<span className="text-muted-foreground text-[11px]">Primera versión útil</span>
				<span className="text-foreground/80 font-mono text-[11px]">semana {MILESTONE_WEEK}</span>
			</Reveal>
		</RevealGroup>
	)
}
