"use client"

import { useEffect, useId, useRef } from "react"
import { useChallengeHover } from "@/components/challenge-card"
import { useReducedMotion } from "@/lib/motion"
import { duration, home, penHome, playbackAt, stateAt, type Point } from "./model"
import art from "./art.json"
import "./manual-desk.css"

const initial = stateAt(0)
function transform(p: Point, origin = home) {
	const delta = [p.x - origin.x, p.y - origin.y, p.z - origin.z]
	const axis = (i: number) => delta.reduce((sum, v, j) => sum + v * art.axes[j]![i]!, 0).toFixed(2)
	return `translate(${axis(0)} ${axis(1)})`
}

export function DiagramManualDesk() {
	const id = useId()
	const active = useChallengeHover()
	const reduced = useReducedMotion()
	const root = useRef<HTMLDivElement>(null)
	const paper = useRef<SVGGElement>(null)
	const next = useRef<SVGGElement>(null)
	const pen = useRef<SVGGElement>(null)
	const quantity = useRef<SVGTextElement>(null)
	const caption = useRef<HTMLParagraphElement>(null)
	const summary = useRef<HTMLSpanElement>(null)
	const statuses = useRef<(HTMLSpanElement | null)[]>([])
	const clock = useRef(0)
	const started = useRef(false)

	useEffect(() => {
		const element = root.current
		if (!element) return
		const draw = () => {
			const state = stateAt(clock.current)
			paper.current?.setAttribute("transform", transform(state.paperPosition))
			pen.current?.setAttribute("transform", transform(state.penPosition, penHome))
			next.current?.setAttribute("opacity", String(state.nextOpacity))
			if (quantity.current) {
				quantity.current.textContent =
					state.copiedQuantity === null ? "" : String(state.copiedQuantity)
				quantity.current.setAttribute("data-error", String(state.error))
			}
			state.steps.forEach((step, i) => {
				const label = statuses.current[i]
				if (label) label.textContent = step.status
			})
			if (caption.current) caption.current.textContent = state.caption
			if (summary.current) summary.current.textContent = state.summary
			element.dataset.stage =
				clock.current >= duration ? "complete" : started.current ? "running" : "ready"
			element.dataset.phase = state.stage
			element.dataset.sent = String(state.sent)
			element.dataset.corrections = String(state.corrections)
			element.dataset.pending = String(state.pending)
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
			data-manual-desk=""
			data-stage="ready"
			data-phase="ready"
			data-sent="0"
			data-corrections="0"
			data-pending="0"
			className="manual-desk flex h-full w-full flex-col gap-1 px-3 py-2"
		>
			<div className="flex shrink-0 items-baseline justify-between gap-2 text-[9px] leading-tight">
				<span className="text-foreground font-medium">Tramitación manual</span>
				<span className="text-muted-foreground">
					Ejemplo · pedido de {initial.sourceQuantity} uds.
				</span>
			</div>
			<svg
				className="iso-svg min-h-0 flex-1"
				viewBox={`0 0 ${art.width} ${art.height}`}
				role="img"
				aria-labelledby={`${id}-title`}
				aria-describedby={`${id}-description`}
			>
				<title id={`${id}-title`}>
					Una copia errónea obliga a corregir y revisar antes de enviar. Otro pedido espera repetir
					el trabajo.
				</title>
				<desc id={`${id}-description`}>
					La persona está presente. Copia 12 unidades como 21, revisa el pedido, detecta la
					diferencia y vuelve a la carga para corregirla. Tras revisar de nuevo, envía el pedido.
					Llega otro para repetir las mismas tareas manuales.
				</desc>
				<g dangerouslySetInnerHTML={{ __html: art.chair }} />
				<g data-manual-worker="" dangerouslySetInnerHTML={{ __html: art.person }} />
				<g dangerouslySetInnerHTML={{ __html: art.desk }} />
				<g dangerouslySetInnerHTML={{ __html: art.source }} />
				<g ref={paper} data-manual-paper="" transform={transform(initial.paperPosition)}>
					<g dangerouslySetInnerHTML={{ __html: art.paper }} />
					<text
						ref={quantity}
						data-manual-quantity=""
						data-error="false"
						className="manual-number"
						transform={art.fieldTransform}
						fontSize="13"
						textAnchor="middle"
					>
						{initial.copiedQuantity ?? ""}
					</text>
				</g>
				<g
					ref={next}
					data-manual-next=""
					opacity="0"
					dangerouslySetInnerHTML={{ __html: art.paper }}
				/>
				<g
					ref={pen}
					data-manual-pen=""
					transform={transform(initial.penPosition, penHome)}
					dangerouslySetInnerHTML={{ __html: art.pen }}
				/>
			</svg>
			<div className="grid shrink-0 grid-cols-3 gap-1 text-center text-[9px] leading-tight">
				{initial.steps.map((step, i) => (
					<div key={step.name}>
						<span className="text-foreground">{step.name}</span>
						<span
							ref={(el) => {
								statuses.current[i] = el
							}}
							data-manual-step={i}
							className="text-muted-foreground mt-0.5 block"
						>
							{step.status}
						</span>
					</div>
				))}
			</div>
			<div className="shrink-0 text-center text-[9px] leading-tight">
				<span ref={summary} data-manual-summary="" className="text-foreground font-medium">
					{initial.summary}
				</span>
				<p ref={caption} data-manual-caption="" className="text-muted-foreground mt-0.5">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
