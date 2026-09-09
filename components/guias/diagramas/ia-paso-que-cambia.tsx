"use client"

import { EASE } from "@/components/diagrams/visual/constants"
import { useEntrance } from "@/components/diagrams/visual/use-entrance"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import type { ReactNode } from "react"

/**
 * `ia-paso-que-cambia` — guide diagram for `ia-en-procesos-por-donde-empezar.mdx`.
 * Two rows, "Hoy" and "Con IA", each one continuous bar split into segments
 * whose width is proportional to the TIME that step takes — not to the step
 * count. "Con IA" has one more step than "Hoy" (a review step) but the bar
 * still reads shorter: what changed is where the minutes go, not the number
 * of stops. The unused width on the "Con IA" row is drawn as the time the
 * process gives back.
 */

const KICKER = "text-muted-foreground font-mono text-[11px] tracking-[0.02em] uppercase"

type Segment = {
	label: string
	weight: number
	tone?: "primary" | "outline-dot" | "muted" | "freed"
}

const HOY: Segment[] = [
	{ label: "Llega el correo", weight: 1 },
	{ label: "Alguien lo lee e interpreta", weight: 6 },
	{ label: "Lo registra en el sistema", weight: 2 },
	{ label: "Se crea la tarea", weight: 1 },
]

const CON_IA: Segment[] = [
	{ label: "Llega el correo", weight: 1 },
	{ label: "La IA clasifica y extrae", weight: 0.5, tone: "primary" },
	{ label: "Alguien revisa", weight: 1.5, tone: "outline-dot" },
	{ label: "Se registra", weight: 0.5 },
	{ label: "Se crea la tarea", weight: 0.5 },
	{ label: "Tiempo que se libera", weight: 6, tone: "freed" },
]

/** Segments at or above this weight (out of a 10-unit row) fit their label inside the bar. */
const INSIDE_THRESHOLD = 2

function segmentFill(segment: Segment): string {
	if (segment.tone === "freed") return "border border-dashed border-border/70 bg-muted/20"
	if (segment.tone === "primary") return "bg-primary text-primary-foreground"
	if (segment.tone === "outline-dot") return "border border-border bg-background"
	return "bg-muted"
}

/**
 * One segment of the bar. A segment wide enough to hold its own label
 * (`weight >= INSIDE_THRESHOLD`) prints it centred inside the fill; a
 * narrower one — most of the "Con IA" row, since real steps shrank to make
 * room for the freed time — drops a short tick and prints its label below,
 * alternating between two vertical bands so two short neighbouring labels
 * never run into each other. The row aligns everything to the top
 * (`items-start` on `Row`), so the bar itself stays flush across every
 * segment regardless of which band its label lands in.
 */
function SegmentTile({
	segment,
	show,
	delay,
	reduced,
	band,
}: {
	segment: Segment
	show: boolean
	delay: number
	reduced: boolean
	band: 0 | 1
}): ReactNode {
	const inside = segment.weight >= INSIDE_THRESHOLD

	return (
		<motion.div
			className="flex min-w-[2rem] flex-col items-stretch"
			style={{ flexGrow: segment.weight, flexBasis: 0, transformOrigin: "left" }}
			initial={reduced ? false : { opacity: 0, scaleX: 0 }}
			animate={show ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
			transition={{ duration: reduced ? 0 : 0.5, ease: EASE, delay: reduced ? 0 : delay }}
		>
			<div
				className={cn(
					"flex h-9 min-w-0 items-center justify-center gap-1 rounded-sm px-1.5 text-center text-[10px] leading-tight font-medium sm:text-[11px]",
					segmentFill(segment),
					segment.tone === "freed" && "text-muted-foreground"
				)}
			>
				{segment.tone === "outline-dot" && (
					<span
						className="bg-brand-green inline-block h-1.5 w-1.5 shrink-0 rounded-full"
						aria-hidden="true"
					/>
				)}
				{inside && <span className="truncate">{segment.label}</span>}
			</div>
			{!inside && (
				<div className={cn("flex flex-col items-center", band === 1 && "mt-2.5")}>
					<span className={cn("bg-border w-px", band === 0 ? "h-1.5" : "h-4")} aria-hidden="true" />
					<span className="text-muted-foreground mt-0.5 text-[10px] leading-none whitespace-nowrap">
						{segment.label}
					</span>
				</div>
			)}
		</motion.div>
	)
}

function Row({
	kicker,
	segments,
	errorNote,
	show,
	baseDelay,
	reduced,
}: {
	kicker: string
	segments: Segment[]
	errorNote: string
	show: boolean
	baseDelay: number
	reduced: boolean
}): ReactNode {
	return (
		<div>
			<p className={`${KICKER} mb-2`}>{kicker}</p>

			{/* Desktop: one continuous horizontal bar, segments sized by weight. */}
			<div className="hidden items-start gap-0.5 sm:flex">
				{segments.map((segment, i) => (
					<SegmentTile
						key={segment.label}
						segment={segment}
						show={show}
						delay={reduced ? 0 : baseDelay + i * 0.06}
						reduced={reduced}
						band={i % 2 === 0 ? 0 : 1}
					/>
				))}
			</div>

			{/* Mobile: each step as a row, label at left (wraps, never truncates), proportional bar at right. */}
			<div className="flex flex-col gap-2.5 sm:hidden">
				{segments.map((segment, i) => (
					<div key={segment.label} className="flex items-center gap-2">
						<span className="text-muted-foreground w-[45%] shrink-0 text-[11px] leading-tight">
							{segment.label}
						</span>
						<div className="bg-muted/40 h-3 min-w-0 flex-1 overflow-hidden rounded-sm">
							<motion.div
								className={cn(
									"h-full rounded-sm",
									segment.tone === "freed" &&
										"border-border/70 border border-dashed bg-transparent",
									segment.tone === "primary" && "bg-primary",
									segment.tone === "outline-dot" && "border-border bg-background border",
									segment.tone === undefined && "bg-border",
									segment.tone === "muted" && "bg-border"
								)}
								style={{ width: `${(segment.weight / 10) * 100}%`, transformOrigin: "left" }}
								initial={reduced ? false : { scaleX: 0 }}
								animate={show ? { scaleX: 1 } : { scaleX: 0 }}
								transition={{
									duration: reduced ? 0 : 0.5,
									ease: EASE,
									delay: reduced ? 0 : baseDelay + i * 0.06,
								}}
							/>
						</div>
					</div>
				))}
			</div>

			<p className="text-muted-foreground mt-2 font-mono text-[11px]">
				Dónde aparece el error: <span className="text-foreground">{errorNote}</span>
			</p>
		</div>
	)
}

const STAGE_MS = [500, 1100]

export function IaPasoQueCambia(): ReactNode {
	const reduced = useReducedMotion()
	const { ref, stage } = useEntrance(STAGE_MS, reduced)

	return (
		<div ref={ref} className="border-border bg-muted/40 space-y-8 rounded-sm border p-4 sm:p-5">
			<Row
				kicker="Hoy"
				segments={HOY}
				errorNote="en la lectura, cuando llegan muchos seguidos"
				show={stage >= 1}
				baseDelay={0}
				reduced={reduced}
			/>
			<Row
				kicker="Con IA"
				segments={CON_IA}
				errorNote="lo raro llega marcado para revisión"
				show={stage >= 2}
				baseDelay={0}
				reduced={reduced}
			/>
			<p className="text-muted-foreground border-border border-t pt-3 text-[11px]">
				Ancho = tiempo por caso (proporción, no minutos)
			</p>
		</div>
	)
}
