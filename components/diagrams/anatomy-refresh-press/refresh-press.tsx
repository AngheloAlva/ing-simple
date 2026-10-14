"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/motion"
import { areas, definition, duration, loopTime, playbackAt, stateAt } from "./model"
import art from "./art.json"
import "./refresh-press.css"

const initial = stateAt(0)
const lower = (ram: number) =>
	`translate(${(art.slide[0]! * ram).toFixed(2)} ${(art.slide[1]! * ram).toFixed(2)})`
// Hands in the clock face's own plane: 0° points to 12, clockwise.
const hourAngle = (minutes: number) => ((minutes / 60) % 12) * 30
const minuteAngle = (minutes: number) => (minutes % 60) * 6

export function DiagramRefreshPress() {
	const id = useId()
	const reduced = useReducedMotion()
	const [active, setActive] = useState(false)
	const root = useRef<HTMLDivElement>(null)
	const die = useRef<SVGGElement>(null)
	const numbers = useRef<(SVGTextElement | null)[]>([])
	const hour = useRef<SVGLineElement>(null)
	const minute = useRef<SVGLineElement>(null)
	const light = useRef<SVGCircleElement>(null)
	const values = useRef<(HTMLSpanElement | null)[]>([])
	const caption = useRef<HTMLParagraphElement>(null)
	const summary = useRef<HTMLSpanElement>(null)
	const clock = useRef(0)
	const started = useRef(false)

	// No hover target inside a guide: the story starts the first time most of
	// the figure is on screen, then loops with a pause on the final pose.
	useEffect(() => {
		const element = root.current
		if (!element || active) return
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) setActive(true)
			},
			{ threshold: 0.45 }
		)
		observer.observe(element)
		return () => observer.disconnect()
	}, [active])

	useEffect(() => {
		const element = root.current
		if (!element) return
		const draw = () => {
			const time = reduced ? duration : loopTime(clock.current)
			const state = stateAt(time)
			die.current?.setAttribute("transform", lower(state.ram))
			state.areas.forEach((area, i) => {
				numbers.current[i]?.setAttribute("visibility", area.value ? "visible" : "hidden")
				const label = values.current[i]
				if (label) label.textContent = area.value ?? "Esperando"
			})
			hour.current?.setAttribute("transform", `rotate(${hourAngle(state.minutes).toFixed(1)})`)
			minute.current?.setAttribute("transform", `rotate(${minuteAngle(state.minutes).toFixed(1)})`)
			light.current?.setAttribute("data-on", String(state.light))
			if (caption.current) caption.current.textContent = state.caption
			if (summary.current) summary.current.textContent = state.summary
			element.dataset.stage = time >= duration ? "complete" : started.current ? "running" : "ready"
			element.dataset.phase = state.phase
			element.dataset.stamped = String(state.stamped)
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
			clock.current += last ? Math.min((now - last) / 1000, 1 / 30) : 0
			last = now
			draw()
			frame = requestAnimationFrame(tick)
		}
		const run = () => {
			if (visible && document.visibilityState === "visible" && !frame) {
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
			data-refresh-press=""
			data-stage="ready"
			data-phase="ready"
			data-stamped="false"
			className="refresh-press border-border flex w-full flex-col gap-3 rounded-sm border px-4 py-5 sm:px-6"
		>
			<div className="flex items-baseline justify-between gap-3 text-xs leading-tight">
				<span className="text-foreground font-medium">Una definición, un número</span>
				<span className="text-muted-foreground">Ejemplo ilustrativo</span>
			</div>
			<svg
				className="iso-svg aspect-[560/420] w-full"
				viewBox={`0 0 ${art.width} ${art.height}`}
				role="img"
				aria-labelledby={`${id}-title`}
				aria-describedby={`${id}-description`}
			>
				<title id={`${id}-title`}>
					A las 06:00 el modelo estampa la misma cifra, desde una sola definición, en el informe de
					cada área.
				</title>
				<desc id={`${id}-description`}>
					Un reloj conectado a una prensa llega a las 06:00 y enciende su control. La prensa baja
					una sola placa grabada con la definición «Ventas netas = facturado − notas de crédito» y
					estampa de un golpe las hojas de Ventas, Finanzas y Operaciones: las tres quedan con 118.
				</desc>
				<g dangerouslySetInnerHTML={{ __html: art.back }} />
				<circle
					ref={light}
					className="press-light"
					data-on="false"
					cx={art.light[0]}
					cy={art.light[1]}
					r="1.6"
				/>
				{art.sheets.map((svg, i) => (
					<g key={areas[i]!.id} data-sheet={areas[i]!.id}>
						<g dangerouslySetInnerHTML={{ __html: svg }} />
						<text
							ref={(el) => {
								numbers.current[i] = el
							}}
							className="press-number"
							transform={art.numberMatrices[i]}
							fontSize="7"
							textAnchor="middle"
							visibility="hidden"
						>
							118
						</text>
					</g>
				))}
				<g
					ref={die}
					data-die=""
					transform={lower(0)}
					dangerouslySetInnerHTML={{ __html: art.die }}
				/>
				<g dangerouslySetInnerHTML={{ __html: art.front }} />
				<g dangerouslySetInnerHTML={{ __html: art.clock }} />
				<g transform={art.clockMatrix} className="press-clock" data-clock="">
					<circle r="6.4" />
					{Array.from({ length: 12 }, (_, i) => (
						<line
							key={i}
							y1="-6.4"
							y2={i % 3 === 0 ? "-5" : "-5.6"}
							transform={`rotate(${i * 30})`}
						/>
					))}
					<line
						ref={hour}
						className="press-hour"
						y2="-3.4"
						transform={`rotate(${hourAngle(300)})`}
					/>
					<line ref={minute} className="press-minute" y2="-5.2" transform="rotate(0)" />
					<circle className="press-pin" r="0.6" />
				</g>
			</svg>
			<div className="grid grid-cols-3 gap-2 text-center text-xs leading-tight">
				{areas.map((area, i) => (
					<div key={area.id}>
						<span className="text-foreground block">{area.name}</span>
						<span
							ref={(el) => {
								values.current[i] = el
							}}
							data-area-value={area.id}
							className="text-muted-foreground mt-0.5 block tabular-nums"
						>
							Esperando
						</span>
					</div>
				))}
			</div>
			<div className="text-center text-xs leading-tight">
				<p className="text-muted-foreground font-mono text-[11px]">{definition}</p>
				<span
					ref={summary}
					data-press-summary=""
					className="text-foreground mt-1 block font-medium"
				>
					{initial.summary}
				</span>
				<p ref={caption} data-press-caption="" className="text-muted-foreground mt-1">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
