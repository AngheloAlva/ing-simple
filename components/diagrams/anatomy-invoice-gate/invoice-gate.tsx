"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/motion"
import { decimal, duration, invoices, loopTime, playbackAt, stateAt, threshold } from "./model"
import art from "./art.json"
import "./invoice-gate.css"

const initial = stateAt(0)
const { x: ax, y: ay, z: az } = art.axes
const translate = ([x, y, z]: number[]) => {
	const dx = x! * ax[0]! + y! * ay[0]! + z! * az[0]!
	const dy = x! * ax[1]! + y! * ay[1]! + z! * az[1]!
	return `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`
}
// Tray centres relative to the reader position, and the base of each stack.
const LANE_X = { system: 23, review: -21 }
const TRAY_DY = 51
const BASE_Z = 9.5 - 10
/** World offset of the moving invoice from its rest pose under the reader. */
function sheetOffset(state: ReturnType<typeof stateAt>) {
	const { stage, progress, lane } = state.sheet
	if (stage === "feed") {
		const fromZ = BASE_Z + (invoices.length - 1 - state.current) * art.sheetZ
		return [-65 * (1 - progress), 0, fromZ * (1 - progress) + 4 * Math.sin(Math.PI * progress)]
	}
	if (stage === "exit") {
		const stacked = (lane === "system" ? state.system : state.review) * art.sheetZ
		return [
			LANE_X[lane] * progress,
			TRAY_DY * progress,
			(BASE_Z + stacked) * progress + 8 * Math.sin(Math.PI * progress),
		]
	}
	return [0, 0, 0]
}

// Dial: 0 to 1 over 240°, clockwise from the left, in the panel's face plane.
const R = 13
const angleOf = (value: number) => -120 + 240 * value
const pointAt = (value: number, radius: number) => {
	const a = (angleOf(value) * Math.PI) / 180
	// Rounded so server and client render the same attribute strings.
	const round = (n: number) => Math.round(n * 100) / 100
	return [round(radius * Math.sin(a)), round(-radius * Math.cos(a))] as const
}
const arc = (from: number, to: number, radius: number) => {
	const [x1, y1] = pointAt(from, radius)
	const [x2, y2] = pointAt(to, radius)
	const large = angleOf(to) - angleOf(from) > 180 ? 1 : 0
	return `M${x1.toFixed(2)} ${y1.toFixed(2)}A${radius} ${radius} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}`
}

export function DiagramInvoiceGate() {
	const id = useId()
	const reduced = useReducedMotion()
	const [active, setActive] = useState(false)
	const root = useRef<HTMLDivElement>(null)
	const hopper = useRef<(SVGGElement | null)[]>([])
	const stacks = useRef<{ system: (SVGGElement | null)[]; review: (SVGGElement | null)[] }>({
		system: [],
		review: [],
	})
	const sheet = useRef<SVGGElement>(null)
	const diverter = useRef<SVGGElement>(null)
	const needle = useRef<SVGLineElement>(null)
	const system = useRef<HTMLSpanElement>(null)
	const review = useRef<HTMLSpanElement>(null)
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
			hopper.current.forEach((el, i) =>
				el?.setAttribute("visibility", i < state.hopper ? "visible" : "hidden")
			)
			for (const lane of ["system", "review"] as const)
				stacks.current[lane].forEach((el, i) =>
					el?.setAttribute("visibility", i < state[lane] ? "visible" : "hidden")
				)
			const moving = sheet.current
			if (moving) {
				moving.setAttribute("visibility", state.sheet.visible ? "visible" : "hidden")
				moving.setAttribute("transform", translate(sheetOffset(state)))
				moving.dataset.blurry = String(
					state.current >= 0 && invoices[state.current]!.confidence < threshold
				)
			}
			diverter.current?.setAttribute("transform", translate([22 * state.diverter, 0, 0]))
			needle.current?.setAttribute("transform", `rotate(${angleOf(state.needle).toFixed(1)})`)
			if (system.current) system.current.textContent = String(state.system)
			if (review.current) review.current.textContent = String(state.review)
			if (caption.current) caption.current.textContent = state.caption
			if (summary.current) summary.current.textContent = state.summary
			element.dataset.stage = time >= duration ? "complete" : started.current ? "running" : "ready"
			element.dataset.phase = state.phase
			element.dataset.lane = state.sheet.visible ? state.sheet.lane : ""
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

	const ticks = Array.from({ length: 11 }, (_, i) => i / 10)

	return (
		<div
			ref={root}
			data-invoice-gate=""
			data-stage="ready"
			data-phase="ready"
			data-lane=""
			className="invoice-gate border-border flex w-full flex-col gap-3 rounded-sm border px-4 py-5 sm:px-6"
		>
			<div className="flex items-baseline justify-between gap-3 text-xs leading-tight">
				<span className="text-foreground font-medium">Confianza contra un umbral</span>
				<span className="text-muted-foreground">
					Ejemplo · umbral {decimal(threshold)}
				</span>
			</div>
			<svg
				className="iso-svg aspect-[560/380] w-full"
				viewBox={`0 0 ${art.width} ${art.height}`}
				role="img"
				aria-labelledby={`${id}-title`}
				aria-describedby={`${id}-description`}
			>
				<title id={`${id}-title`}>
					Las facturas leídas con confianza sobre el umbral siguen solas al sistema; las demás las
					revisa una persona.
				</title>
				<desc id={`${id}-description`}>
					Seis facturas pasan una por una bajo un lector. Un indicador muestra la confianza de cada
					lectura frente a un umbral de 0,85. Cinco quedan sobre el umbral y una compuerta las envía
					a la bandeja del sistema. Una factura escaneada borrosa marca 0,62, la compuerta cambia de
					lado y va a la bandeja de revisión, donde la revisa una persona.
				</desc>
				<g dangerouslySetInnerHTML={{ __html: art.back }} />
				{art.hopper.map((svg, i) => (
					<g
						key={i}
						ref={(el) => {
							hopper.current[i] = el
						}}
						data-hopper={i}
						dangerouslySetInnerHTML={{ __html: svg }}
					/>
				))}
				<g dangerouslySetInnerHTML={{ __html: art.rails }} />
				<g dangerouslySetInnerHTML={{ __html: art.gantryBack }} />
				<g dangerouslySetInnerHTML={{ __html: art.panel }} />
				<g transform={art.dialMatrix} className="invoice-dial" data-dial="">
					<circle r={R + 2.5} />
					<path className="invoice-dial-scale" d={arc(0, 1, R)} />
					<path className="invoice-dial-threshold" d={arc(threshold, 1, R)} />
					{ticks.map((value) => {
						const [x1, y1] = pointAt(value, R)
						const [x2, y2] = pointAt(
							value,
							value === 0.5 || value === 0 || value === 1 ? R - 2.6 : R - 1.6
						)
						return <line key={value} x1={x1} y1={y1} x2={x2} y2={y2} />
					})}
					{(() => {
						const [x1, y1] = pointAt(threshold, R + 1.2)
						const [x2, y2] = pointAt(threshold, R - 3)
						return <line className="invoice-dial-mark" x1={x1} y1={y1} x2={x2} y2={y2} />
					})()}
					{[
						[0, "0"],
						[threshold, decimal(threshold)],
					].map(([value, label]) => {
						const [x, y] = pointAt(value as number, R - 5.4)
						return (
							<text key={label} x={x} y={y + 1} fontSize="2.6" textAnchor="middle">
								{label}
							</text>
						)
					})}
					<line
						ref={needle}
						className="invoice-dial-needle"
						y2={-(R - 1.5)}
						transform="rotate(-120)"
					/>
					<circle className="invoice-dial-pin" r="1" />
				</g>
				{(["system", "review"] as const).map((lane) => (
					<g key={lane} dangerouslySetInnerHTML={{ __html: art.trayBack[lane] }} />
				))}
				{(["system", "review"] as const).flatMap((lane) =>
					art.stacks[lane].map((svg, i) => (
						<g
							key={`${lane}-${i}`}
							ref={(el) => {
								stacks.current[lane][i] = el
							}}
							data-stack={lane}
							visibility="hidden"
							dangerouslySetInnerHTML={{ __html: svg }}
						/>
					))
				)}
				<g dangerouslySetInnerHTML={{ __html: art.diverterTrack }} />
				<g ref={diverter} data-diverter="" transform={translate([22, 0, 0])}>
					<g dangerouslySetInnerHTML={{ __html: art.diverterBlock }} />
				</g>
				<g ref={sheet} data-moving-invoice="" data-blurry="false" visibility="hidden">
					<g dangerouslySetInnerHTML={{ __html: art.sheet }} />
					<g className="invoice-blur-layer" dangerouslySetInnerHTML={{ __html: art.blur }} />
				</g>
				{(["system", "review"] as const).map((lane) => (
					<g key={lane} dangerouslySetInnerHTML={{ __html: art.trayFront[lane] }} />
				))}
				<g dangerouslySetInnerHTML={{ __html: art.loupe }} />
				<g dangerouslySetInnerHTML={{ __html: art.head }} />
			</svg>
			<div className="grid grid-cols-2 gap-2 text-center text-xs leading-tight">
				<div>
					<span className="text-muted-foreground block">Al sistema</span>
					<span
						ref={system}
						data-system-count=""
						className="text-foreground mt-0.5 block font-semibold tabular-nums"
					>
						0
					</span>
				</div>
				<div>
					<span className="text-muted-foreground block">A revisión</span>
					<span
						ref={review}
						data-review-count=""
						className="text-primary mt-0.5 block font-semibold tabular-nums"
					>
						0
					</span>
				</div>
			</div>
			<div className="text-center text-xs leading-tight">
				<span ref={summary} data-gate-summary="" className="text-foreground font-medium">
					{initial.summary}
				</span>
				<p ref={caption} data-gate-caption="" className="text-muted-foreground mt-1">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
