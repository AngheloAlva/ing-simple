"use client"

import { EASE } from "@/components/diagrams/visual/constants"
import { useEntrance } from "@/components/diagrams/visual/use-entrance"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react"

/**
 * `ia-que-proceso` — guide diagram for `ia-en-procesos-por-donde-empezar.mdx`.
 * Replaces the old 2x2 map (`ia-donde-rinde`, not understood): two yes/no
 * questions leading to three outcomes. Reads top to bottom either way.
 */

const BRANCH = "font-mono text-[10px] tracking-[0.08em] uppercase"

const IA_CHIPS = [
	"Clasificar solicitudes",
	"Extraer datos de facturas",
	"Resumir reuniones",
	"Primer borrador de correos",
]

/** Boxes appear, then outcomes, then the connectors draw across them. */
const STAGE_MS = [500, 900, 1350]

function QuestionTile({
	children,
	show,
	reduced,
	boxRef,
}: {
	children: ReactNode
	show: boolean
	reduced: boolean
	boxRef?: RefObject<HTMLDivElement | null>
}): ReactNode {
	return (
		<motion.div
			ref={boxRef}
			className="border-border bg-background flex min-h-16 items-center rounded-sm border p-3.5"
			initial={reduced ? false : { opacity: 0, y: 8 }}
			animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
			transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
		>
			<p className="text-sm font-medium tracking-tight">{children}</p>
		</motion.div>
	)
}

function OutcomeTile({
	title,
	sub,
	chips,
	tone,
	show,
	delay,
	reduced,
	boxRef,
}: {
	title: string
	sub?: string
	chips?: string[]
	tone: "muted" | "dashed" | "primary"
	show: boolean
	delay: number
	reduced: boolean
	boxRef?: RefObject<HTMLDivElement | null>
}): ReactNode {
	return (
		<motion.div
			ref={boxRef}
			className={cn(
				"rounded-sm border p-3.5",
				tone === "primary" && "border-primary bg-primary text-primary-foreground",
				tone === "muted" && "border-border bg-muted/30",
				tone === "dashed" && "border-border/70 bg-muted/20 border-dashed"
			)}
			initial={reduced ? false : { opacity: 0, y: 8 }}
			animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
			transition={{ duration: reduced ? 0 : 0.4, ease: EASE, delay: reduced ? 0 : delay }}
		>
			<p className="text-sm font-semibold tracking-tight">{title}</p>
			{sub !== undefined && (
				<p
					className={cn(
						"mt-1.5 text-[13px] leading-relaxed",
						tone === "primary" ? "text-primary-foreground/80" : "text-muted-foreground"
					)}
				>
					{sub}
				</p>
			)}
			{chips !== undefined && (
				<div className="mt-3 flex flex-wrap gap-1.5">
					{chips.map((chip) => (
						<span
							key={chip}
							className="border-primary-foreground/30 bg-primary-foreground/10 rounded-sm border px-2 py-1 text-[11px]"
						>
							{chip}
						</span>
					))}
				</div>
			)}
		</motion.div>
	)
}

type Connector = { d: string; labelX: number; labelY: number }

type Connectors = {
	q1ToA: Connector
	q1ToQ2: Connector
	q2ToB: Connector
	q2ToC: Connector
	width: number
	height: number
}

type BoxRect = { top: number; left: number; width: number; height: number }

function rectOf(el: HTMLElement): BoxRect {
	return { top: el.offsetTop, left: el.offsetLeft, width: el.offsetWidth, height: el.offsetHeight }
}

/**
 * Measures the five boxes (via `offsetTop`/`offsetLeft`, unaffected by the
 * entrance transform, unlike `getBoundingClientRect`) relative to the
 * container — the same technique as the TOC spine — and builds four
 * connectors that start and end exactly on a box edge: two straight lines
 * (Q1 → A, Q1 → Q2) and two elbows sharing one mid-x (Q2 → B, Q2 → C).
 * Re-measured on resize and whenever the container's own size settles
 * (`ResizeObserver`), so a line never drifts from the box it points at.
 */
function useConnectors(): {
	containerRef: RefObject<HTMLDivElement | null>
	q1Ref: RefObject<HTMLDivElement | null>
	q2Ref: RefObject<HTMLDivElement | null>
	aRef: RefObject<HTMLDivElement | null>
	bRef: RefObject<HTMLDivElement | null>
	cRef: RefObject<HTMLDivElement | null>
	connectors: Connectors | null
} {
	const containerRef = useRef<HTMLDivElement>(null)
	const q1Ref = useRef<HTMLDivElement>(null)
	const q2Ref = useRef<HTMLDivElement>(null)
	const aRef = useRef<HTMLDivElement>(null)
	const bRef = useRef<HTMLDivElement>(null)
	const cRef = useRef<HTMLDivElement>(null)
	const [connectors, setConnectors] = useState<Connectors | null>(null)

	useLayoutEffect(() => {
		const container = containerRef.current
		if (!container) return

		function measure(): void {
			const c = containerRef.current
			const q1 = q1Ref.current
			const q2 = q2Ref.current
			const a = aRef.current
			const b = bRef.current
			const outcome = cRef.current
			if (!c || !q1 || !q2 || !a || !b || !outcome) return

			const q1r = rectOf(q1)
			const q2r = rectOf(q2)
			const ar = rectOf(a)
			const br = rectOf(b)
			const cr = rectOf(outcome)

			const q1Right = q1r.left + q1r.width
			const q1CenterX = q1r.left + q1r.width / 2
			const q1CenterY = q1r.top + q1r.height / 2
			const q2Right = q2r.left + q2r.width
			const q2CenterY = q2r.top + q2r.height / 2
			const bCenterY = br.top + br.height / 2
			const cCenterY = cr.top + cr.height / 2
			const midX = (q2Right + br.left) / 2

			setConnectors({
				q1ToA: {
					d: `M ${q1Right} ${q1CenterY} L ${ar.left} ${q1CenterY}`,
					labelX: (q1Right + ar.left) / 2,
					labelY: q1CenterY,
				},
				q1ToQ2: {
					d: `M ${q1CenterX} ${q1r.top + q1r.height} L ${q1CenterX} ${q2r.top}`,
					labelX: q1CenterX,
					labelY: (q1r.top + q1r.height + q2r.top) / 2,
				},
				q2ToB: {
					d: `M ${q2Right} ${q2CenterY} L ${midX} ${q2CenterY} L ${midX} ${bCenterY} L ${br.left} ${bCenterY}`,
					labelX: (midX + br.left) / 2,
					labelY: bCenterY,
				},
				q2ToC: {
					d: `M ${q2Right} ${q2CenterY} L ${midX} ${q2CenterY} L ${midX} ${cCenterY} L ${cr.left} ${cCenterY}`,
					labelX: (midX + cr.left) / 2,
					labelY: cCenterY,
				},
				width: c.offsetWidth,
				height: c.offsetHeight,
			})
		}

		measure()
		const observer = new ResizeObserver(measure)
		observer.observe(container)
		window.addEventListener("resize", measure)
		return () => {
			observer.disconnect()
			window.removeEventListener("resize", measure)
		}
	}, [])

	return { containerRef, q1Ref, q2Ref, aRef, bRef, cRef, connectors }
}

function ConnectorLabel({
	label,
	x,
	y,
	show,
	reduced,
}: {
	label: string
	x: number
	y: number
	show: boolean
	reduced: boolean
}): ReactNode {
	return (
		<motion.span
			className={cn(BRANCH, "bg-background text-muted-foreground absolute px-1")}
			style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
			initial={reduced ? false : { opacity: 0 }}
			animate={{ opacity: show ? 1 : 0 }}
			transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
		>
			{label}
		</motion.span>
	)
}

function ConnectorPath({
	d,
	show,
	reduced,
}: {
	d: string
	show: boolean
	reduced: boolean
}): ReactNode {
	return (
		<motion.path
			d={d}
			stroke="var(--border)"
			strokeWidth={1}
			fill="none"
			vectorEffect="non-scaling-stroke"
			initial={reduced ? false : { pathLength: 0 }}
			animate={{ pathLength: show ? 1 : 0 }}
			transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
		/>
	)
}

export function IaQueProceso(): ReactNode {
	const reduced = useReducedMotion()
	const { ref, stage } = useEntrance(STAGE_MS, reduced)
	const showQuestions = stage >= 1
	const showOutcomes = stage >= 2
	const showConnectors = stage >= 3
	const { containerRef, q1Ref, q2Ref, aRef, bRef, cRef, connectors } = useConnectors()

	return (
		<div ref={ref} className="border-border rounded-sm border p-4 sm:p-5">
			{/* Desktop: questions in a left column, outcomes in a right column, connected by a measured SVG overlay. */}
			<div
				ref={containerRef}
				className="relative hidden sm:grid sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-x-12 sm:gap-y-10"
			>
				{connectors && (
					<svg
						className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-visible"
						viewBox={`0 0 ${connectors.width} ${connectors.height}`}
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<ConnectorPath d={connectors.q1ToA.d} show={showConnectors} reduced={reduced} />
						<ConnectorPath d={connectors.q1ToQ2.d} show={showConnectors} reduced={reduced} />
						<ConnectorPath d={connectors.q2ToB.d} show={showConnectors} reduced={reduced} />
						<ConnectorPath d={connectors.q2ToC.d} show={showConnectors} reduced={reduced} />
					</svg>
				)}
				{connectors && (
					<>
						<ConnectorLabel
							label="Sí"
							x={connectors.q1ToA.labelX}
							y={connectors.q1ToA.labelY}
							show={showConnectors}
							reduced={reduced}
						/>
						<ConnectorLabel
							label="No"
							x={connectors.q1ToQ2.labelX}
							y={connectors.q1ToQ2.labelY}
							show={showConnectors}
							reduced={reduced}
						/>
						<ConnectorLabel
							label="No"
							x={connectors.q2ToB.labelX}
							y={connectors.q2ToB.labelY}
							show={showConnectors}
							reduced={reduced}
						/>
						<ConnectorLabel
							label="Sí"
							x={connectors.q2ToC.labelX}
							y={connectors.q2ToC.labelY}
							show={showConnectors}
							reduced={reduced}
						/>
					</>
				)}

				<div className="col-start-1 row-start-1">
					<QuestionTile show={showQuestions} reduced={reduced} boxRef={q1Ref}>
						¿La regla ya está escrita y es exacta?
					</QuestionTile>
				</div>
				<div className="col-start-2 row-start-1">
					<OutcomeTile
						title="Automatización tradicional"
						sub="Más barata y más confiable. Ejemplo: copiar cada pedido nuevo a la planilla de despacho."
						tone="muted"
						show={showOutcomes}
						delay={0}
						reduced={reduced}
						boxRef={aRef}
					/>
				</div>

				<div className="col-start-1 row-span-2 row-start-2 flex items-center">
					<QuestionTile show={showQuestions} reduced={reduced} boxRef={q2Ref}>
						¿Alguien puede revisar el resultado antes de usarlo?
					</QuestionTile>
				</div>
				<div className="col-start-2 row-start-2">
					<OutcomeTile
						title="Todavía no"
						sub="Primero pon a alguien a revisar o rediseña el proceso."
						tone="dashed"
						show={showOutcomes}
						delay={reduced ? 0 : 0.08}
						reduced={reduced}
						boxRef={bRef}
					/>
				</div>
				<div className="col-start-2 row-start-3">
					<OutcomeTile
						title="Aquí rinde la IA"
						chips={IA_CHIPS}
						tone="primary"
						show={showOutcomes}
						delay={reduced ? 0 : 0.16}
						reduced={reduced}
						boxRef={cRef}
					/>
				</div>
			</div>

			{/* Mobile: vertical list, each question followed by its two indented branches. */}
			<div className="flex flex-col gap-3 sm:hidden">
				<QuestionTile show={showQuestions} reduced={reduced}>
					¿La regla ya está escrita y es exacta?
				</QuestionTile>
				<div className="border-border ml-3 space-y-3 border-l pl-4">
					<div>
						<p className={cn(BRANCH, "text-muted-foreground mb-1.5")}>Sí →</p>
						<OutcomeTile
							title="Automatización tradicional"
							sub="Más barata y más confiable. Ejemplo: copiar cada pedido nuevo a la planilla de despacho."
							tone="muted"
							show={showOutcomes}
							delay={0}
							reduced={reduced}
						/>
					</div>
					<div>
						<p className={cn(BRANCH, "text-muted-foreground mb-1.5")}>No → siguiente pregunta</p>
					</div>
				</div>

				<QuestionTile show={showQuestions} reduced={reduced}>
					¿Alguien puede revisar el resultado antes de usarlo?
				</QuestionTile>
				<div className="border-border ml-3 space-y-3 border-l pl-4">
					<div>
						<p className={cn(BRANCH, "text-muted-foreground mb-1.5")}>No →</p>
						<OutcomeTile
							title="Todavía no"
							sub="Primero pon a alguien a revisar o rediseña el proceso."
							tone="dashed"
							show={showOutcomes}
							delay={reduced ? 0 : 0.08}
							reduced={reduced}
						/>
					</div>
					<div>
						<p className={cn(BRANCH, "text-muted-foreground mb-1.5")}>Sí →</p>
						<OutcomeTile
							title="Aquí rinde la IA"
							chips={IA_CHIPS}
							tone="primary"
							show={showOutcomes}
							delay={reduced ? 0 : 0.16}
							reduced={reduced}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
