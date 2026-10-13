"use client"

import { useEffect, useId, useRef } from "react"
import { useChallengeHover } from "@/components/challenge-card"
import { useReducedMotion } from "@/lib/motion"
import { duration, playbackAt, sources, stateAt } from "./model"
import art from "./art.json"
import "./scattered-cabinet.css"

const initial = stateAt(0)
const translate = (open: number) =>
	`translate(${(art.slide[0]! * open).toFixed(2)} ${(art.slide[1]! * open).toFixed(2)})`

export function DiagramScatteredCabinet() {
	const id = useId()
	const active = useChallengeHover()
	const reduced = useReducedMotion()
	const root = useRef<HTMLDivElement>(null)
	const drawers = useRef<(SVGGElement | null)[]>([])
	const values = useRef<(SVGTextElement | null)[]>([])
	const statuses = useRef<(HTMLSpanElement | null)[]>([])
	const caption = useRef<HTMLParagraphElement>(null)
	const summary = useRef<HTMLSpanElement>(null)
	const clock = useRef(0)
	const started = useRef(false)

	useEffect(() => {
		const element = root.current
		if (!element) return
		const draw = () => {
			const state = stateAt(clock.current)
			state.drawers.forEach((drawer, i) => {
				drawers.current[i]?.setAttribute("transform", translate(drawer.open))
				drawers.current[i]?.setAttribute("data-revealed", String(drawer.revealed))
				values.current[i]?.setAttribute("opacity", drawer.revealed ? "1" : "0")
				const label = statuses.current[i]
				if (label) label.textContent = drawer.status
			})
			if (caption.current) caption.current.textContent = state.caption
			if (summary.current) summary.current.textContent = state.summary
			element.dataset.stage =
				clock.current >= duration ? "complete" : started.current ? "running" : "ready"
			element.dataset.phase = state.phase
			element.dataset.consulted = String(state.consulted)
			element.dataset.sharedFields = String(state.sharedFields)
		}
		const playback = playbackAt(clock.current, active, reduced, started.current)
		started.current = playback.started
		clock.current = playback.time
		draw()
		if (!playback.running) return
		let frame = 0,
			last = 0,
			visible = false
		const stop = () => {
			cancelAnimationFrame(frame)
			frame = 0
			last = 0
		}
		const tick = (now: number) => {
			frame = 0
			clock.current = Math.min(
				duration,
				clock.current + (last ? Math.min((now - last) / 1000, 1 / 30) : 0)
			)
			last = now
			draw()
			if (clock.current < duration) frame = requestAnimationFrame(tick)
		}
		const run = () => {
			if (visible && document.visibilityState === "visible" && !frame && clock.current < duration) {
				last = 0
				frame = requestAnimationFrame(tick)
			}
		}
		const observer = new IntersectionObserver(
			(entries) => {
				visible = entries[entries.length - 1]?.isIntersecting ?? false
				if (visible) run()
				else stop()
			},
			{ threshold: 0.1 }
		)
		observer.observe(element)
		const visibility = () => (document.visibilityState === "visible" ? run() : stop())
		document.addEventListener("visibilitychange", visibility)
		return () => {
			stop()
			observer.disconnect()
			document.removeEventListener("visibilitychange", visibility)
		}
	}, [active, reduced])

	return (
		<div
			ref={root}
			data-scattered-cabinet=""
			data-stage="ready"
			data-phase="ready"
			data-consulted="0"
			data-shared-fields="0"
			className="scattered-cabinet flex h-full w-full flex-col gap-1 px-3 py-2"
		>
			<div className="flex shrink-0 items-baseline justify-between gap-2 text-[9px] leading-tight">
				<span className="text-foreground font-medium">Un pedido, tres fuentes</span>
				<span className="text-muted-foreground">Ejemplo · información separada</span>
			</div>
			<svg
				className="iso-svg min-h-0 flex-1"
				viewBox={`0 0 ${art.width} ${art.height}`}
				role="img"
				aria-labelledby={`${id}-title`}
				aria-describedby={`${id}-description`}
			>
				<title id={`${id}-title`}>
					Tres fuentes guardan partes del mismo pedido, pero no hay una vista conjunta para decidir.
				</title>
				<desc id={`${id}-description`}>
					Una planilla tiene la cantidad pedida: 12. Otro sistema tiene el stock: 8. Un correo
					confirma el pago. Los archivadores se abren por separado; la hoja común sigue sin
					completar. Para decidir, alguien debe cruzar las tres fuentes.
				</desc>
				{art.cabinets.map((cabinet, i) => (
					<g key={cabinet.id} data-source-cabinet={cabinet.id}>
						<g dangerouslySetInnerHTML={{ __html: cabinet.back }} />
						<g
							ref={(el) => {
								drawers.current[i] = el
							}}
							data-scattered-drawer={cabinet.id}
							data-revealed="false"
							transform={translate(0)}
						>
							<g dangerouslySetInnerHTML={{ __html: cabinet.drawer }} />
							<text
								ref={(el) => {
									values.current[i] = el
								}}
								data-source-value={cabinet.id}
								className="cabinet-number"
								transform={cabinet.numberTransform}
								fontSize="12"
								textAnchor="middle"
								opacity="0"
							>
								{sources[i]!.value}
							</text>
							<g dangerouslySetInnerHTML={{ __html: cabinet.lip }} />
						</g>
						<g dangerouslySetInnerHTML={{ __html: cabinet.front }} />
					</g>
				))}
				<g data-shared-report="">
					<g dangerouslySetInnerHTML={{ __html: art.report }} />
					{art.fields.map((field) => (
						<text
							key={field.id}
							data-shared-field={field.id}
							className="cabinet-number"
							transform={field.transform}
							fontSize="11"
							textAnchor="middle"
						>
							?
						</text>
					))}
					<text
						className="report-label"
						x={art.labelPoint[0]}
						y={art.labelPoint[1]}
						fontSize="14"
						textAnchor="middle"
					>
						{initial.report}
					</text>
				</g>
			</svg>
			<div className="grid shrink-0 grid-cols-3 gap-1 text-center text-[9px] leading-tight">
				{sources.map((source, i) => (
					<div key={source.id}>
						<span className="text-foreground">{source.name}</span>
						<span
							ref={(el) => {
								statuses.current[i] = el
							}}
							data-source-status={i}
							className="text-muted-foreground mt-0.5 block"
						>
							{initial.drawers[i]!.status}
						</span>
					</div>
				))}
			</div>
			<div className="shrink-0 text-center text-[9px] leading-tight">
				<span ref={summary} data-scattered-summary="" className="text-foreground font-medium">
					{initial.summary}
				</span>
				<p ref={caption} data-scattered-caption="" className="text-muted-foreground mt-0.5">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
