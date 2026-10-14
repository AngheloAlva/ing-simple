"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/motion"
import { drawers, duration, loopTime, playbackAt, stateAt } from "./model"
import art from "./art.json"
import "./tool-cart.css"

const initial = stateAt(0)
const translate = (open: number) =>
	`translate(${(art.slide[0]! * open).toFixed(2)} ${(art.slide[1]! * open).toFixed(2)})`

export function DiagramToolCart() {
	const id = useId()
	const reduced = useReducedMotion()
	const [active, setActive] = useState(false)
	const root = useRef<HTMLDivElement>(null)
	const groups = useRef<(SVGGElement | null)[]>([])
	const statuses = useRef<(HTMLSpanElement | null)[]>([])
	const caption = useRef<HTMLParagraphElement>(null)
	const summary = useRef<HTMLSpanElement>(null)
	const clock = useRef(0)
	const started = useRef(false)

	// No hover target on the service page: the story starts the first time
	// most of the figure is on screen, then loops with a pause on the final pose.
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
			state.drawers.forEach((drawer, i) => {
				groups.current[i]?.setAttribute("transform", translate(drawer.open))
				const label = statuses.current[i]
				if (label) label.textContent = drawer.status
			})
			if (caption.current) caption.current.textContent = state.caption
			if (summary.current) summary.current.textContent = state.summary
			element.dataset.stage = time >= duration ? "complete" : started.current ? "running" : "ready"
			element.dataset.phase = state.phase
			element.dataset.checked = String(state.checked)
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
			data-tool-cart=""
			data-stage="ready"
			data-phase="ready"
			data-checked="0"
			className="tool-cart flex h-full w-full flex-col gap-3 px-5 py-6 sm:px-8 lg:py-10"
		>
			<div className="flex shrink-0 items-baseline justify-between gap-3 text-xs leading-tight">
				<span className="text-foreground font-medium">Tres licencias, un carro</span>
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
					La empresa paga por tres herramientas y el equipo usa una fracción de cada una.
				</title>
				<desc id={`${id}-description`}>
					Un carro de herramientas tiene un cajón para Power Apps, otro para Power BI y otro para
					Excel. Se abren uno por uno: en Power Apps ninguna herramienta se ha usado, en Power BI y en
					Excel solo una de seis está gastada y las demás siguen con su etiqueta de tienda.
				</desc>
				<g dangerouslySetInnerHTML={{ __html: art.back }} />
				{art.drawers.map((drawer, i) => (
					<g
						key={drawer.id}
						ref={(el) => {
							groups.current[i] = el
						}}
						data-cart-drawer={drawer.id}
						transform={translate(0)}
					>
						<g dangerouslySetInnerHTML={{ __html: drawer.inner }} />
						<g dangerouslySetInnerHTML={{ __html: drawer.lip }} />
					</g>
				))}
				<g dangerouslySetInnerHTML={{ __html: art.casing }} />
			</svg>
			<div className="grid shrink-0 grid-cols-3 gap-2 text-center text-xs leading-tight">
				{drawers.map((drawer, i) => (
					<div key={drawer.id}>
						<span className="text-foreground block">{drawer.name}</span>
						<span
							ref={(el) => {
								statuses.current[i] = el
							}}
							data-drawer-status={i}
							className="text-muted-foreground mt-0.5 block"
						>
							{initial.drawers[i]!.status}
						</span>
					</div>
				))}
			</div>
			<div className="shrink-0 text-center text-xs leading-tight">
				<span ref={summary} data-cart-summary="" className="text-foreground font-medium">
					{initial.summary}
				</span>
				<p ref={caption} data-cart-caption="" className="text-muted-foreground mt-1">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
