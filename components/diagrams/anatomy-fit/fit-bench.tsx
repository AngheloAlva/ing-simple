"use client"

import { useEffect, useId, useRef } from "react"
import { useChallengeHover } from "@/components/challenge-card"
import { useReducedMotion } from "@/lib/motion"
import { motionDuration, processes, sequenceAt, type Point, type Process } from "./motion"
import scene from "./scene.json"
import art from "./art.json"
import "./fit-bench.css"

const initial = sequenceAt(0)
const axes = [art.xAxis, art.yAxis, art.zAxis] as [number, number][]
const textOf = (outcome: string) =>
	outcome === "Manual" ? "Trabajo manual" : outcome === "Dentro" ? "En el sistema" : outcome

function transform(process: Process, position: Point): string {
	const home = scene.homes[process]
	const delta = [position.x - home.x, position.y - home.y, position.z - home.z]
	const project = (axis: 0 | 1) =>
		delta.reduce((sum, value, i) => sum + value * axes[i]![axis], 0).toFixed(2)
	return `translate(${project(0)} ${project(1)})`
}

export function DiagramFitBench() {
	const id = useId()
	const active = useChallengeHover()
	const reduced = useReducedMotion()
	const root = useRef<HTMLDivElement>(null)
	const caption = useRef<HTMLSpanElement>(null)
	const pieces = useRef<Record<Process, SVGGElement | null>>({
		square: null,
		cross: null,
		bar: null,
	})
	const outcomes = useRef<Record<Process, HTMLSpanElement | null>>({
		square: null,
		cross: null,
		bar: null,
	})
	const clock = useRef(0)
	const started = useRef(false)

	useEffect(() => {
		const element = root.current
		if (!element) return
		const draw = () => {
			const state = sequenceAt(clock.current)
			for (const { id: process } of processes) {
				const piece = pieces.current[process]
				piece?.setAttribute("transform", transform(process, state.positions[process]))
				piece?.setAttribute("data-active", String(state.active === process))
				piece?.setAttribute("data-height", String(state.positions[process].z))
				const label = outcomes.current[process]
				if (label) {
					label.textContent = textOf(state.outcomes[process])
					label.dataset.outcome = state.outcomes[process]
				}
			}
			if (caption.current) caption.current.textContent = state.caption
			element.dataset.fitState =
				clock.current >= motionDuration ? "complete" : started.current ? "running" : "ready"
			element.dataset.accepted = String(state.accepted)
			element.dataset.manual = String(state.manual)
		}
		// A single story: activation starts it, leaving does not rewind or hide
		// a rejection. Offscreen/hidden time never advances the mechanism.
		if (active) started.current = true
		if (reduced) clock.current = motionDuration
		draw()
		if (reduced || !started.current || clock.current >= motionDuration) return
		let frame = 0,
			last = 0,
			visible = false
		const tick = (now: number) => {
			frame = 0
			clock.current = Math.min(
				motionDuration,
				clock.current + (last ? Math.min((now - last) / 1000, 1 / 30) : 0)
			)
			last = now
			draw()
			if (clock.current < motionDuration) frame = requestAnimationFrame(tick)
		}
		const stop = () => {
			cancelAnimationFrame(frame)
			frame = 0
			last = 0
		}
		const run = () => {
			if (
				visible &&
				document.visibilityState === "visible" &&
				!frame &&
				clock.current < motionDuration
			) {
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
			data-fit-bench=""
			data-fit-state="ready"
			data-accepted="0"
			data-manual="0"
			className="fit-bench flex h-full w-full flex-col gap-1 px-3 py-2"
		>
			<div className="flex shrink-0 flex-wrap items-baseline justify-between gap-x-2 text-[9px] leading-tight">
				<span className="text-foreground font-medium">Sistema genérico</span>
				<span ref={caption} data-fit-caption="" className="text-muted-foreground">
					{initial.caption}
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
					El sistema genérico admite aprobaciones; precios por cliente y turnos quedan fuera y
					requieren trabajo manual.
				</title>
				<desc id={`${id}-description`}>
					El sistema no cambia de forma. El proceso que se adapta es el tuyo. La cruz y la pieza
					alargada chocan contra el borde del molde vacío antes de que entre el cuadrado.
				</desc>
				<g dangerouslySetInnerHTML={{ __html: art.base }} />
				<g dangerouslySetInnerHTML={{ __html: art.rear }} />
				<g
					ref={(el) => {
						pieces.current.square = el
					}}
					data-process="square"
					transform="translate(0.00 0.00)"
					dangerouslySetInnerHTML={{ __html: art.fitting }}
				/>
				<g dangerouslySetInnerHTML={{ __html: art.front }} />
				{/* Rejected specimens stay above the rim during an attempt. */}
				<g
					ref={(el) => {
						pieces.current.cross = el
					}}
					data-process="cross"
					transform="translate(0.00 0.00)"
					dangerouslySetInnerHTML={{ __html: art.cross }}
				/>
				<g
					ref={(el) => {
						pieces.current.bar = el
					}}
					data-process="bar"
					transform="translate(0.00 0.00)"
					dangerouslySetInnerHTML={{ __html: art.bar }}
				/>
			</svg>
			<div className="grid shrink-0 grid-cols-3 gap-1 text-center text-[9px] leading-tight">
				{processes.map(({ id: process, label }) => (
					<div key={process} className="min-w-0">
						<span className="text-foreground inline-flex items-center justify-center gap-1">
							<svg
								viewBox="0 0 12 12"
								aria-hidden="true"
								className={`h-2.5 w-2.5 shrink-0 ${process === "square" ? "text-primary" : "text-muted-foreground"}`}
							>
								<path
									fill="currentColor"
									d={
										process === "square"
											? "M2 2h8v8H2z"
											: process === "cross"
												? "M4 0h4v4h4v4H8v4H4V8H0V4h4z"
												: "M0 3h12v6H0z"
									}
								/>
							</svg>
							{label}
						</span>
						<span
							ref={(el) => {
								outcomes.current[process] = el
							}}
							data-outcome="Por probar"
							className="fit-outcome text-muted-foreground mt-0.5 block"
						>
							{initial.outcomes[process]}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}
