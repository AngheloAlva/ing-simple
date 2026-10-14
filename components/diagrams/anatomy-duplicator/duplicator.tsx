"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/motion"
import { duration, playbackAt, stateAt } from "./model"
import art from "./art.json"
import "./duplicator.css"

const initial = stateAt(0)
const { x: ax, y: ay, z: az } = art.axes
const project = ([x, y, z]: number[]) => [
	x! * ax[0]! + y! * ay[0]! + z! * az[0]!,
	x! * ax[1]! + y! * ay[1]! + z! * az[1]!,
]
const smooth = (value: number) => {
	const t = Math.max(0, Math.min(1, value))
	return t * t * (3 - 2 * t)
}
/** World offset of the moving sheet from its rest pose on the output tray. */
function sheetOffset(progress: number, error: boolean, good: number) {
	const out = smooth(progress / 0.35)
	const land = smooth((progress - 0.35) / 0.65)
	const slit = 7
	if (!error) return [0, -5 * (1 - out), slit + (good * art.outputStep - slit) * land]
	// Into the reject bin, past the tray's front edge.
	const binFloor = -35
	return [-10 * land, -5 * (1 - out) + 16 * land, slit + (binFloor - slit) * land + 6 * Math.sin(Math.PI * land)]
}
const crank = (angle: number) => {
	const L = art.crankLength
	const [ex, ey] = project([0, Math.cos(angle) * L, Math.sin(angle) * L])
	const [kx, ky] = project([6, 0, 0])
	const end = [art.hub[0]! + ex!, art.hub[1]! + ey!]
	return { end, knob: [end[0]! + kx!, end[1]! + ky!] }
}

export function DiagramDuplicator() {
	const id = useId()
	const reduced = useReducedMotion()
	const [active, setActive] = useState(false)
	const root = useRef<HTMLDivElement>(null)
	const feed = useRef<(SVGGElement | null)[]>([])
	const output = useRef<(SVGGElement | null)[]>([])
	const rejects = useRef<(SVGGElement | null)[]>([])
	const sheet = useRef<SVGGElement>(null)
	const arm = useRef<SVGLineElement>(null)
	const knob = useRef<SVGLineElement>(null)
	const needle = useRef<SVGLineElement>(null)
	const counter = useRef<SVGTextElement>(null)
	const made = useRef<HTMLSpanElement>(null)
	const hours = useRef<HTMLSpanElement>(null)
	const rejected = useRef<HTMLSpanElement>(null)
	const caption = useRef<HTMLParagraphElement>(null)
	const summary = useRef<HTMLSpanElement>(null)
	const clock = useRef(0)
	const started = useRef(false)

	// No hover target on the service page: the story starts the first time
	// most of the figure is on screen, and never resets.
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
			const state = stateAt(clock.current)
			feed.current.forEach((el, i) => el?.setAttribute("visibility", i < state.feed ? "visible" : "hidden"))
			output.current.forEach((el, i) =>
				el?.setAttribute("visibility", i < state.good ? "visible" : "hidden")
			)
			rejects.current.forEach((el, i) =>
				el?.setAttribute("visibility", i < state.rejected ? "visible" : "hidden")
			)
			const moving = sheet.current
			if (moving) {
				const [dx, dy] = project(sheetOffset(state.sheet.progress, state.sheet.error, state.good))
				moving.setAttribute("visibility", state.sheet.visible ? "visible" : "hidden")
				moving.setAttribute("transform", `translate(${dx!.toFixed(2)} ${dy!.toFixed(2)})`)
				moving.dataset.error = String(state.sheet.error)
			}
			const { end, knob: tip } = crank(state.angle)
			arm.current?.setAttribute("x2", end[0]!.toFixed(2))
			arm.current?.setAttribute("y2", end[1]!.toFixed(2))
			knob.current?.setAttribute("x1", end[0]!.toFixed(2))
			knob.current?.setAttribute("y1", end[1]!.toFixed(2))
			knob.current?.setAttribute("x2", tip[0]!.toFixed(2))
			knob.current?.setAttribute("y2", tip[1]!.toFixed(2))
			// The hour meter turns once every eight hours.
			needle.current?.setAttribute("transform", `rotate(${((state.hours / 8) * 360).toFixed(1)})`)
			if (counter.current) counter.current.textContent = String(state.made).padStart(3, "0")
			if (made.current) made.current.textContent = String(state.made)
			if (hours.current) hours.current.textContent = `${String(state.hours).replace(".", ",")} h`
			if (rejected.current) rejected.current.textContent = String(state.rejected)
			if (caption.current) caption.current.textContent = state.caption
			if (summary.current) summary.current.textContent = state.summary
			element.dataset.stage =
				clock.current >= duration ? "complete" : started.current ? "running" : "ready"
			element.dataset.phase = state.phase
			element.dataset.made = String(state.made)
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

	const rest = crank(0)

	return (
		<div
			ref={root}
			data-duplicator=""
			data-stage="ready"
			data-phase="ready"
			data-made="0"
			className="duplicator flex h-full w-full flex-col gap-3 px-5 py-6 sm:px-8 lg:py-10"
		>
			<div className="flex shrink-0 items-baseline justify-between gap-3 text-xs leading-tight">
				<span className="text-foreground font-medium">El mismo documento, a manivela</span>
				<span className="text-muted-foreground">Ejemplo ilustrativo</span>
			</div>
			<svg
				className="iso-svg min-h-0 flex-1"
				viewBox={`0 0 ${art.width} ${art.height}`}
				role="img"
				aria-labelledby={`${id}-title`}
				aria-describedby={`${id}-description`}
			>
				<title id={`${id}-title`}>
					Una copiadora que funciona a manivela: cada copia del mismo documento cuesta tiempo de una
					persona.
				</title>
				<desc id={`${id}-description`}>
					Cada vuelta de la manivela toma una hoja en blanco, imprime el mismo documento y suma
					quince minutos al horómetro. Dos de las diez copias salen con error y caen a la bandeja de
					rechazo. Al final: diez copias, dos horas y media de manivela y dos copias para rehacer.
				</desc>
				<g dangerouslySetInnerHTML={{ __html: art.stand }} />
				<g transform={art.dialMatrix} className="duplicator-dial">
					<circle r="6.6" />
					{Array.from({ length: 8 }, (_, i) => (
						<line key={i} y1="-6.6" y2="-5.2" transform={`rotate(${i * 45})`} />
					))}
					<line ref={needle} className="duplicator-needle" y2="-5" />
					<circle className="duplicator-pin" r="0.7" />
				</g>
				{art.crumpled.map((svg, i) => (
					<g
						key={i}
						ref={(el) => {
							rejects.current[i] = el
						}}
						data-reject={i}
						visibility="hidden"
						dangerouslySetInnerHTML={{ __html: svg }}
					/>
				))}
				<g dangerouslySetInnerHTML={{ __html: art.machineBack }} />
				{art.feed.map((svg, i) => (
					<g
						key={i}
						ref={(el) => {
							feed.current[i] = el
						}}
						data-blank={i}
						dangerouslySetInnerHTML={{ __html: svg }}
					/>
				))}
				<g dangerouslySetInnerHTML={{ __html: art.machineFront }} />
				<text
					ref={counter}
					data-copy-counter=""
					className="duplicator-digits"
					transform={art.counterMatrix}
					fontSize="3.2"
					textAnchor="middle"
				>
					000
				</text>
				{art.output.map((svg, i) => (
					<g
						key={i}
						ref={(el) => {
							output.current[i] = el
						}}
						data-copy={i}
						visibility="hidden"
						dangerouslySetInnerHTML={{ __html: svg }}
					/>
				))}
				<g className="duplicator-crank" data-crank="">
					<line ref={arm} x1={art.hub[0]} y1={art.hub[1]} x2={rest.end[0]} y2={rest.end[1]} />
					<line
						ref={knob}
						className="duplicator-knob"
						x1={rest.end[0]}
						y1={rest.end[1]}
						x2={rest.knob[0]}
						y2={rest.knob[1]}
					/>
					<circle cx={art.hub[0]} cy={art.hub[1]} r="1.6" />
				</g>
				<g ref={sheet} data-moving-sheet="" data-error="false" visibility="hidden">
					<g dangerouslySetInnerHTML={{ __html: art.sheet }} />
					<g className="duplicator-smudge-layer" dangerouslySetInnerHTML={{ __html: art.smudge }} />
				</g>
				<g dangerouslySetInnerHTML={{ __html: art.binFront }} />
			</svg>
			<div className="grid shrink-0 grid-cols-3 gap-2 text-center text-xs leading-tight">
				<div>
					<span className="text-muted-foreground block">Copias</span>
					<span ref={made} data-made="" className="text-foreground mt-0.5 block font-semibold tabular-nums">
						0
					</span>
				</div>
				<div>
					<span className="text-muted-foreground block">Manivela</span>
					<span ref={hours} data-hours="" className="text-foreground mt-0.5 block font-semibold tabular-nums">
						0 h
					</span>
				</div>
				<div>
					<span className="text-muted-foreground block">Con error</span>
					<span
						ref={rejected}
						data-rejected=""
						className="text-foreground mt-0.5 block font-semibold tabular-nums"
					>
						0
					</span>
				</div>
			</div>
			<div className="shrink-0 text-center text-xs leading-tight">
				<span ref={summary} data-duplicator-summary="" className="text-foreground font-medium">
					{initial.summary}
				</span>
				<p ref={caption} data-duplicator-caption="" className="text-muted-foreground mt-1">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
