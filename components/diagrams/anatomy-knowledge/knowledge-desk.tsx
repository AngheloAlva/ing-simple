"use client"

import { useEffect, useId, useRef } from "react"
import { useChallengeHover } from "@/components/challenge-card"
import { useReducedMotion } from "@/lib/motion"
import { duration, home, playbackAt, stateAt, type Point } from "./model"
import art from "./art.json"
import "./knowledge-desk.css"

const initial = stateAt(0)
function transform(p: Point) {
	const delta = [p.x - home.x, p.y - home.y, p.z - home.z]
	const axis = (i: number) => delta.reduce((sum, v, j) => sum + v * art.axes[j]![i]!, 0).toFixed(2)
	return `translate(${axis(0)} ${axis(1)})`
}

export function DiagramKnowledgeDesk() {
	const id = useId()
	const active = useChallengeHover()
	const reduced = useReducedMotion()
	const root = useRef<HTMLDivElement>(null)
	const person = useRef<SVGGElement>(null)
	const operator = useRef<HTMLSpanElement>(null)
	const caption = useRef<HTMLParagraphElement>(null)
	const summary = useRef<HTMLSpanElement>(null)
	const stamp = useRef<SVGGElement>(null)
	const papers = useRef<(SVGGElement | null)[]>([])
	const statuses = useRef<(HTMLSpanElement | null)[]>([])
	const clock = useRef(0)
	const started = useRef(false)

	useEffect(() => {
		const element = root.current
		if (!element) return
		const draw = () => {
			const state = stateAt(clock.current)
			person.current?.setAttribute("opacity", String(state.personOpacity))
			stamp.current?.setAttribute("opacity", String(state.resolved))
			state.papers.forEach((p, i) => {
				papers.current[i]?.setAttribute("transform", transform(p.position))
				papers.current[i]?.setAttribute("opacity", String(p.opacity))
				papers.current[i]?.setAttribute("data-status", p.status)
			})
			state.areas.forEach((area, i) => {
				const label = statuses.current[i]
				if (label) {
					label.textContent = area.status
					label.dataset.status = area.status
				}
			})
			if (operator.current)
				operator.current.textContent = state.available ? "Disponible" : "No disponible"
			if (caption.current) caption.current.textContent = state.caption
			if (summary.current) summary.current.textContent = state.summary
			element.dataset.stage =
				clock.current >= duration ? "complete" : started.current ? "running" : "ready"
			element.dataset.waiting = String(state.waiting)
			element.dataset.resolved = String(state.resolved)
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
			data-knowledge-desk=""
			data-stage="ready"
			data-waiting="0"
			data-resolved="0"
			className="knowledge-desk flex h-full w-full flex-col gap-1 px-3 py-2"
		>
			<div className="flex shrink-0 items-baseline justify-between gap-2 text-[9px] leading-tight">
				<span className="text-foreground font-medium">Quien sabe hacerlo</span>
				<span ref={operator} data-operator-status="" className="text-muted-foreground">
					Disponible
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
					Sin esa persona, tres solicitudes quedan pendientes y nadie puede retomarlas.
				</title>
				<desc id={`${id}-description`}>
					Una persona resuelve la primera solicitud. Cuando deja de estar disponible, su silla queda
					vacía y se acumulan solicitudes de Ventas, Depósito y Administración. El conocimiento no
					se ha compartido.
				</desc>
				<g dangerouslySetInnerHTML={{ __html: art.chair }} />
				<g
					ref={person}
					data-knowledge-person=""
					opacity="1"
					dangerouslySetInnerHTML={{ __html: art.person }}
				/>
				<g dangerouslySetInnerHTML={{ __html: art.desk }} />
				{initial.papers.map((paper, i) => (
					<g
						key={i}
						ref={(el) => {
							papers.current[i] = el
						}}
						data-knowledge-paper={i}
						data-status={paper.status}
						opacity={paper.opacity}
						transform={transform(paper.position)}
					>
						<g dangerouslySetInnerHTML={{ __html: art.paper }} />
						{i === 0 && (
							<g
								ref={stamp}
								data-knowledge-stamp=""
								opacity="0"
								dangerouslySetInnerHTML={{ __html: art.stamp }}
							/>
						)}
					</g>
				))}
			</svg>
			<div className="grid shrink-0 grid-cols-3 gap-1 text-center text-[9px] leading-tight">
				{initial.areas.map((area, i) => (
					<div key={area.name}>
						<span className="text-foreground">{area.name}</span>
						<span
							ref={(el) => {
								statuses.current[i] = el
							}}
							data-status={area.status}
							className="text-muted-foreground mt-0.5 block"
						>
							{area.status}
						</span>
					</div>
				))}
			</div>
			<div className="shrink-0 text-center text-[9px] leading-tight">
				<span ref={summary} data-knowledge-summary="" className="text-foreground font-medium">
					{initial.summary}
				</span>
				<p ref={caption} data-knowledge-caption="" className="text-muted-foreground mt-0.5">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
