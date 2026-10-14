"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/motion"
import { cards, duration, lift, loopTime, playbackAt, stateAt, toTray, trayDrop } from "./model"
import art from "./art.json"
import "./card-index.css"

const initial = stateAt(0)
const smooth = (value: number) => {
	const t = Math.max(0, Math.min(1, value))
	return t * t * (3 - 2 * t)
}
const translate = (x: number, z: number) => {
	const dx = x * art.axes.x[0]! + z * art.axes.z[0]!
	const dy = x * art.axes.x[1]! + z * art.axes.z[1]!
	return `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`
}
/** Sideways over the right wall first, then down into the stand's slot. */
const parkedPose = (rise: number, moved: number) =>
	translate(toTray * smooth(moved / 0.6), lift * rise - trayDrop * smooth((moved - 0.5) / 0.5))
const index = Object.fromEntries(cards.map((card, i) => [card.id, i]))

export function DiagramCardIndex() {
	const id = useId()
	const reduced = useReducedMotion()
	const [active, setActive] = useState(false)
	const root = useRef<HTMLDivElement>(null)
	const inSlot = useRef<(SVGGElement | null)[]>([])
	const tabs = useRef<(SVGGElement | null)[]>([])
	const parked = useRef<SVGGElement>(null)
	const statuses = useRef<(HTMLSpanElement | null)[]>([])
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
			state.cards.forEach((card, i) => {
				const slot = inSlot.current[i]
				if (card.id === art.parked.id) {
					const pose = parkedPose(card.lift, card.moved)
					slot?.setAttribute("transform", pose)
					slot?.setAttribute("visibility", card.front ? "hidden" : "visible")
					parked.current?.setAttribute("transform", pose)
					parked.current?.setAttribute("visibility", card.front ? "visible" : "hidden")
					element.dataset.parked = String(card.moved === 1)
				} else slot?.setAttribute("transform", translate(0, lift * card.lift))
				tabs.current[i]?.setAttribute("visibility", card.tabbed ? "visible" : "hidden")
				const label = statuses.current[i]
				if (label) label.textContent = card.status
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
			data-card-index=""
			data-stage="ready"
			data-phase="ready"
			data-checked="0"
			data-parked="false"
			className="card-index border-border flex w-full flex-col gap-3 rounded-sm border px-4 py-5 sm:px-6"
		>
			<div className="flex items-baseline justify-between gap-3 text-xs leading-tight">
				<span className="text-foreground font-medium">Una ficha por tratamiento</span>
				<span className="text-muted-foreground">Ejemplo ilustrativo</span>
			</div>
			<svg
				className="iso-svg aspect-[560/400] w-full"
				viewBox={`0 0 ${art.width} ${art.height}`}
				role="img"
				aria-labelledby={`${id}-title`}
				aria-describedby={`${id}-description`}
			>
				<title id={`${id}-title`}>
					Cada tratamiento de datos necesita una base de licitud; el que no la tiene sale del fichero.
				</title>
				<desc id={`${id}-description`}>
					Un fichero guarda una ficha por tratamiento. Una a una se levantan y reciben una pestaña con
					su base: responder cotizaciones, interés legítimo; facturar y despachar, contrato; pagar
					sueldos, obligación legal; enviar el newsletter, consentimiento. La ficha de los contactos
					guardados en el WhatsApp del vendedor no tiene base y pasa a un soporte para justificarla o
					eliminarla.
				</desc>
				<g dangerouslySetInnerHTML={{ __html: art.under }} />
				{art.slots.map((slot) => {
					const i = index[slot.id]!
					return (
						<g key={slot.id}>
							<g dangerouslySetInnerHTML={{ __html: slot.rod }} />
							<g
								ref={(el) => {
									inSlot.current[i] = el
								}}
								data-card={slot.id}
							>
								<g dangerouslySetInnerHTML={{ __html: slot.card }} />
								<g
									ref={(el) => {
										tabs.current[i] = el
									}}
									data-tab={slot.id}
									visibility="hidden"
									dangerouslySetInnerHTML={{ __html: slot.tab }}
								/>
							</g>
						</g>
					)
				})}
				<g dangerouslySetInnerHTML={{ __html: art.rodLast }} />
				<g dangerouslySetInnerHTML={{ __html: art.front }} />
				<g dangerouslySetInnerHTML={{ __html: art.standBack }} />
				<g
					ref={parked}
					data-card={art.parked.id}
					data-slot="stand"
					className="card-index-parked"
					visibility="hidden"
					dangerouslySetInnerHTML={{ __html: art.parked.card }}
				/>
				<g dangerouslySetInnerHTML={{ __html: art.standFront }} />
			</svg>
			<ul className="grid gap-x-6 gap-y-1.5 text-xs leading-tight sm:grid-cols-2">
				{cards.map((card, i) => (
					<li key={card.id} className="flex items-baseline justify-between gap-3">
						<span className="text-foreground">{card.purpose}</span>
						<span
							ref={(el) => {
								statuses.current[i] = el
							}}
							data-card-status={card.id}
							className={card.basis ? "text-muted-foreground shrink-0" : "text-primary shrink-0"}
						>
							{initial.cards[i]!.status}
						</span>
					</li>
				))}
			</ul>
			<div className="text-center text-xs leading-tight">
				<span ref={summary} data-card-summary="" className="text-foreground font-medium">
					{initial.summary}
				</span>
				<p ref={caption} data-card-caption="" className="text-muted-foreground mt-1">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
