"use client"

import { EASE } from "@/components/diagrams/visual/constants"
import { useEntrance } from "@/components/diagrams/visual/use-entrance"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import type { ReactNode } from "react"

/**
 * `ley-linea-de-tiempo` — guide diagram for
 * `ley-21719-que-hacer-antes-del-1-de-diciembre.mdx`. A single hairline spine
 * runs edge to edge from the first milestone to the last, with the four dots
 * sitting on it; only the amnesty stretch (1 dic 2026 → dic 2027) is dashed.
 * The one that matters most ("Entra en vigencia") gets the primary dot and a
 * bigger label.
 */

type Milestone = {
	label: string
	emphasis?: boolean
}

const MILESTONES: Milestone[] = [
	{ label: "Dic 2024 · Se publica la Ley 21.719" },
	{ label: "1 dic 2026 · Entra en vigencia", emphasis: true },
	{ label: "Dic 2027 · Régimen de sanciones completo" },
]

const PERIOD_LABEL =
	"Dic 2026 – nov 2027 · Primer año: para empresas de menor tamaño la Agencia puede amonestar en vez de multar"

function Dot({
	emphasis,
	show,
	reduced,
}: {
	emphasis?: boolean
	show: boolean
	reduced: boolean
}): ReactNode {
	return (
		<motion.span
			className={cn(
				// `inline-block` matters here: a bare `<span>` ignores width/height
				// unless it's a flex/grid item (true for the desktop dots, not for
				// the mobile ones, which sit inside a plain positioned `<span>`).
				"inline-block shrink-0 rounded-full",
				emphasis
					? "bg-primary ring-primary/20 h-3.5 w-3.5 ring-4"
					: "bg-muted-foreground/40 h-2.5 w-2.5"
			)}
			initial={reduced ? false : { opacity: 0, scale: 0.4 }}
			animate={show ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
			transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
			aria-hidden="true"
		/>
	)
}

const STAGE_MS = [500, 900]

export function LeyLineaDeTiempo(): ReactNode {
	const reduced = useReducedMotion()
	const { ref, stage } = useEntrance(STAGE_MS, reduced)
	const showSpine = stage >= 1
	const showDots = stage >= 2

	return (
		<div ref={ref} className="border-border rounded-sm border p-5">
			{/*
				Desktop: labels and dots share the SAME 4-column grid, so each dot
				sits exactly under its label's centre — the line then only needs to
				know where those two centres are (37.5% and 87.5%) for the dashed
				amnesty stretch, instead of guessing from an unrelated `justify-between`.
			*/}
			<div className="hidden sm:block">
				<div className="grid grid-cols-4 gap-x-2">
					<p className="text-muted-foreground px-1 text-center text-[11px] leading-snug">
						{MILESTONES[0]!.label}
					</p>
					<p className="text-primary px-1 text-center text-sm leading-snug font-semibold">
						{MILESTONES[1]!.label}
					</p>
					<p className="text-muted-foreground px-1 text-center text-[11px] leading-snug">
						{PERIOD_LABEL}
					</p>
					<p className="text-muted-foreground px-1 text-center text-[11px] leading-snug">
						{MILESTONES[2]!.label}
					</p>
				</div>

				<div className="relative mt-3 h-3.5">
					{/* Solid spine, edge to edge. */}
					<motion.span
						className="border-border absolute inset-x-0 top-1/2 -translate-y-1/2 border-t"
						style={{ transformOrigin: "left" }}
						initial={reduced ? false : { scaleX: 0 }}
						animate={showSpine ? { scaleX: 1 } : { scaleX: 0 }}
						transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
						aria-hidden="true"
					/>
					{/* Dashed amnesty stretch: from the "entra en vigencia" dot (col 2 centre, 37.5%) to the "régimen completo" dot (col 4 centre, 87.5%). */}
					<motion.span
						className="border-border absolute top-1/2 -translate-y-1/2 border-t border-dashed"
						style={{ left: "37.5%", width: "50%", transformOrigin: "left" }}
						initial={reduced ? false : { scaleX: 0, opacity: 0 }}
						animate={showSpine ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
						transition={{ duration: reduced ? 0 : 0.6, ease: EASE, delay: reduced ? 0 : 0.15 }}
						aria-hidden="true"
					/>

					<div className="relative grid h-full grid-cols-4">
						<div className="flex items-center justify-center">
							<Dot show={showDots} reduced={reduced} />
						</div>
						<div className="flex items-center justify-center">
							<Dot emphasis show={showDots} reduced={reduced} />
						</div>
						<div aria-hidden="true" />
						<div className="flex items-center justify-center">
							<Dot show={showDots} reduced={reduced} />
						</div>
					</div>
				</div>
			</div>

			{/* Mobile: one continuous vertical rail, dashed for the amnesty segment. */}
			<div className="relative ml-[5px] sm:hidden">
				<motion.span
					className="border-border absolute top-1 bottom-1 left-0 border-l"
					style={{ transformOrigin: "top" }}
					initial={reduced ? false : { scaleY: 0 }}
					animate={showSpine ? { scaleY: 1 } : { scaleY: 0 }}
					transition={{ duration: reduced ? 0 : 0.6, ease: EASE }}
					aria-hidden="true"
				/>
				<motion.span
					className="border-border absolute left-0 border-l border-dashed"
					style={{ top: "33%", bottom: "33%", transformOrigin: "top" }}
					initial={reduced ? false : { scaleY: 0, opacity: 0 }}
					animate={showSpine ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
					transition={{ duration: reduced ? 0 : 0.6, ease: EASE, delay: reduced ? 0 : 0.15 }}
					aria-hidden="true"
				/>

				<ol className="space-y-5">
					<li className="relative pl-5">
						<span className="absolute top-1 left-0 -translate-x-1/2">
							<Dot show={showDots} reduced={reduced} />
						</span>
						<p className="text-[13px] leading-snug">{MILESTONES[0]!.label}</p>
					</li>
					<li className="relative pl-5">
						<span className="absolute top-0.5 left-0 -translate-x-1/2">
							<Dot emphasis show={showDots} reduced={reduced} />
						</span>
						<p className="text-primary text-sm leading-snug font-semibold">
							{MILESTONES[1]!.label}
						</p>
					</li>
					<li className="relative pl-5">
						<p className="text-muted-foreground text-[12px] leading-snug">{PERIOD_LABEL}</p>
					</li>
					<li className="relative pl-5">
						<span className="absolute top-1 left-0 -translate-x-1/2">
							<Dot show={showDots} reduced={reduced} />
						</span>
						<p className="text-[13px] leading-snug">{MILESTONES[2]!.label}</p>
					</li>
				</ol>
			</div>
		</div>
	)
}
