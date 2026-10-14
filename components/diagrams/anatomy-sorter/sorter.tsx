"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/motion"
import { capacity, duration, orders, patches, playbackAt, stateAt } from "./model"
import art from "./art.json"
import "./sorter.css"

const initial = stateAt(0)
/** Cubby folders are pushed in from the front; everything else drops from above. */
const offset = (index: number, drop: number) => {
	const [dx, dy] = index < capacity ? art.axes.y : art.axes.z
	const distance = index < capacity ? 10 : 9
	return `translate(${(dx! * distance * drop).toFixed(2)} ${(dy! * distance * drop).toFixed(2)})`
}
const firstOrder = Object.fromEntries(
	patches.map((patch) => [patch.id, orders.findIndex((order) => order.destination === patch.id)])
)

export function DiagramSorter() {
	const id = useId()
	const reduced = useReducedMotion()
	const [active, setActive] = useState(false)
	const root = useRef<HTMLDivElement>(null)
	const items = useRef<(SVGGElement | null)[]>([])
	const patchParts = useRef<(SVGGElement | null)[]>([])
	const counts = useRef<(HTMLSpanElement | null)[]>([])
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
			state.items.forEach((item, i) => {
				const el = items.current[i]
				if (!el) return
				el.setAttribute("visibility", item.visible ? "visible" : "hidden")
				el.setAttribute("transform", offset(i, item.drop))
			})
			art.sequence.forEach((entry, i) => {
				const el = patchParts.current[i]
				if (entry.kind !== "patch" || !el) return
				const patchId = entry.id!
				const shown = state.patches.find((patch) => patch.id === patchId)!.shown
				el.setAttribute("visibility", shown ? "visible" : "hidden")
				el.setAttribute("transform", offset(capacity, state.items[firstOrder[patchId]!]!.drop))
			})
			patches.forEach((patch, i) => {
				const label = counts.current[i]
				const count = state.counts[patch.id as keyof typeof state.counts]
				if (label) label.textContent = count ? `${count} pedidos` : "Sin usar"
			})
			if (caption.current) caption.current.textContent = state.caption
			if (summary.current) summary.current.textContent = state.summary
			element.dataset.stage =
				clock.current >= duration ? "complete" : started.current ? "running" : "ready"
			element.dataset.phase = state.phase
			element.dataset.received = String(state.received)
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
			data-sorter=""
			data-stage="ready"
			data-phase="ready"
			data-received="0"
			className="sorter flex h-full w-full flex-col gap-3 px-5 py-6 sm:px-8 lg:py-10"
		>
			<div className="flex shrink-0 items-baseline justify-between gap-3 text-xs leading-tight">
				<span className="text-foreground font-medium">Doce casillas, treinta pedidos</span>
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
					La operación creció y el casillero pensado para ella quedó chico.
				</title>
				<desc id={`${id}-description`}>
					Un casillero de doce casillas recibe pedidos semana a semana. Cuando se llena, los pedidos
					pasan a parches improvisados sobre la mesa: una planilla compartida, una bandeja de correo y
					un teléfono con WhatsApp. Los últimos se apilan encima del casillero: treinta pedidos para
					una capacidad de doce.
				</desc>
				{art.sequence.map((entry, i) => {
					if (entry.kind === "item")
						return (
							<g
								key={i}
								ref={(el) => {
									items.current[entry.index!] = el
								}}
								data-order={entry.index}
								visibility="hidden"
								dangerouslySetInnerHTML={{ __html: entry.svg }}
							/>
						)
					if (entry.kind === "patch")
						return (
							<g
								key={i}
								ref={(el) => {
									patchParts.current[i] = el
								}}
								data-patch={entry.id}
								visibility="hidden"
								dangerouslySetInnerHTML={{ __html: entry.svg }}
							/>
						)
					return <g key={i} dangerouslySetInnerHTML={{ __html: entry.svg }} />
				})}
			</svg>
			<div className="grid shrink-0 grid-cols-3 gap-2 text-center text-xs leading-tight">
				{patches.map((patch, i) => (
					<div key={patch.id}>
						<span className="text-foreground block">{patch.name}</span>
						<span
							ref={(el) => {
								counts.current[i] = el
							}}
							data-patch-count={patch.id}
							className="text-muted-foreground mt-0.5 block"
						>
							Sin usar
						</span>
					</div>
				))}
			</div>
			<div className="shrink-0 text-center text-xs leading-tight">
				<span ref={summary} data-sorter-summary="" className="text-foreground font-medium">
					{initial.summary}
				</span>
				<p ref={caption} data-sorter-caption="" className="text-muted-foreground mt-1">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
