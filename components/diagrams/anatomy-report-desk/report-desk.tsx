"use client"

import { useEffect, useId, useRef, useState } from "react"
import { useReducedMotion } from "@/lib/motion"
import { duration, metric, loopTime, playbackAt, stateAt, trays } from "./model"
import art from "./art.json"
import "./report-desk.css"

const initial = stateAt(0)
const move = ([x, y, z]: readonly number[]) => {
	const { axes } = art
	const dx = x! * axes.x[0]! + y! * axes.y[0]! + z! * axes.z[0]!
	const dy = x! * axes.x[1]! + y! * axes.y[1]! + z! * axes.z[1]!
	return `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`
}

/** Carried sheet with its total; rendered in a tier slot and again in front of the rack. */
function Sheet({ index }: { index: number }) {
	return (
		<>
			<g dangerouslySetInnerHTML={{ __html: art.carried[index]! }} />
			<text
				className="desk-number"
				transform={art.sheetTransforms[index]}
				fontSize="9"
				textAnchor="end"
			>
				{trays[index]!.value}
			</text>
		</>
	)
}

export function DiagramReportDesk() {
	const id = useId()
	const reduced = useReducedMotion()
	const [active, setActive] = useState(false)
	const root = useRef<HTMLDivElement>(null)
	const inside = useRef<(SVGGElement | null)[]>([])
	const outside = useRef<(SVGGElement | null)[]>([])
	const statuses = useRef<(HTMLSpanElement | null)[]>([])
	const day = useRef<SVGTextElement>(null)
	const stamp = useRef<SVGGElement>(null)
	const imprint = useRef<SVGGElement>(null)
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
			state.sheets.forEach((sheet, i) => {
				const transform = move(sheet.offset)
				for (const [slot, shown] of [
					[inside.current[i], !sheet.front],
					[outside.current[i], sheet.front],
				] as const) {
					slot?.setAttribute("transform", transform)
					slot?.setAttribute("visibility", shown ? "visible" : "hidden")
				}
				const label = statuses.current[i]
				if (label) label.textContent = sheet.status
			})
			if (day.current) day.current.textContent = String(state.day)
			stamp.current?.setAttribute("transform", move([0, 0, state.stamp]))
			imprint.current?.setAttribute("opacity", state.decided ? "1" : "0")
			if (caption.current) caption.current.textContent = state.caption
			if (summary.current) summary.current.textContent = state.summary
			element.dataset.stage = time >= duration ? "complete" : started.current ? "running" : "ready"
			element.dataset.phase = state.phase
			element.dataset.day = String(state.day)
			element.dataset.gathered = String(state.gathered)
			element.dataset.decided = String(state.decided)
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

	const tierOf = (tier: number) => trays.findIndex((tray) => tray.tier === tier)

	return (
		<div
			ref={root}
			data-report-desk=""
			data-stage="ready"
			data-phase="ready"
			data-day="1"
			data-gathered="0"
			data-decided="false"
			className="report-desk flex h-full w-full flex-col gap-3 px-5 py-6 sm:px-8 lg:py-10"
		>
			<div className="flex shrink-0 items-baseline justify-between gap-3 text-xs leading-tight">
				<span className="text-foreground font-medium">Un informe, tres versiones</span>
				<span className="text-muted-foreground">Ejemplo · cifras ilustrativas</span>
			</div>
			<svg
				className="iso-svg min-h-0 flex-1"
				viewBox={`0 0 ${art.width} ${art.height}`}
				role="img"
				aria-labelledby={`${id}-title`}
				aria-describedby={`${id}-description`}
			>
				<title id={`${id}-title`}>
					El informe del mes se arma a mano y llega después de la decisión.
				</title>
				<desc id={`${id}-description`}>
					Tres bandejas guardan la versión de cada área del mismo total: Ventas 124, Finanzas 118 y
					Operaciones 131. Las hojas pasan una por una a la carpeta del informe mientras el
					calendario avanza del día 1 al 6. El día 2 un timbre marca «Decidido» sobre un memo: la
					decisión se tomó antes de que el informe estuviera listo.
				</desc>
				<g dangerouslySetInnerHTML={{ __html: art.under }} />
				<g dangerouslySetInnerHTML={{ __html: art.rackBack }} />
				{art.tiers.map((tier, t) => {
					const index = tierOf(t)
					return (
						<g key={t} data-tier={t}>
							<g dangerouslySetInnerHTML={{ __html: tier.below }} />
							<g
								ref={(el) => {
									inside.current[index] = el
								}}
								data-carried={trays[index]!.id}
								data-slot="tier"
								transform={move([0, 0, 0])}
							>
								<Sheet index={index} />
							</g>
							<g dangerouslySetInnerHTML={{ __html: tier.lip }} />
						</g>
					)
				})}
				<g dangerouslySetInnerHTML={{ __html: art.rackFront }} />
				<g data-calendar="">
					<g dangerouslySetInnerHTML={{ __html: art.calendar }} />
					<text className="desk-face" transform={art.monthMatrix} fontSize="4.2" textAnchor="middle">
						DÍA
					</text>
					<text
						ref={day}
						data-calendar-day=""
						className="desk-number"
						transform={art.calendarMatrix}
						fontSize="20"
						textAnchor="middle"
					>
						{initial.day}
					</text>
				</g>
				<g dangerouslySetInnerHTML={{ __html: art.binder }} />
				<g dangerouslySetInnerHTML={{ __html: art.memo }} />
				<g ref={imprint} data-imprint="" className="desk-imprint" opacity="0">
					<path d={art.imprintOutline} />
					<text transform={art.imprintMatrix} fontSize="5.4" textAnchor="middle">
						DECIDIDO
					</text>
					<text transform={art.dayMatrix} fontSize="2.5" textAnchor="middle">
						DÍA 2 · SIN INFORME
					</text>
				</g>
				{trays.map((tray, i) => (
					<g
						key={tray.id}
						ref={(el) => {
							outside.current[i] = el
						}}
						data-carried={tray.id}
						data-slot="front"
						visibility="hidden"
						transform={move([0, 0, 0])}
					>
						<Sheet index={i} />
					</g>
				))}
				<g ref={stamp} data-stamp="" transform={move([0, 0, 16])}>
					<path className="iso-halo" d={art.stampHalo} />
					<g dangerouslySetInnerHTML={{ __html: art.stamp }} />
				</g>
			</svg>
			<div className="grid shrink-0 grid-cols-3 gap-2 text-center text-xs leading-tight">
				{trays.map((tray, i) => (
					<div key={tray.id}>
						<span className="text-foreground block">{tray.name}</span>
						<span className="text-foreground block font-semibold tabular-nums">{tray.value}</span>
						<span
							ref={(el) => {
								statuses.current[i] = el
							}}
							data-tray-status={i}
							className="text-muted-foreground mt-0.5 block"
						>
							{initial.sheets[i]!.status}
						</span>
					</div>
				))}
			</div>
			<div className="shrink-0 text-center text-xs leading-tight">
				<span className="text-muted-foreground">{metric} · </span>
				<span ref={summary} data-report-summary="" className="text-foreground font-medium">
					{initial.summary}
				</span>
				<p ref={caption} data-report-caption="" className="text-muted-foreground mt-1">
					{initial.caption}
				</p>
			</div>
		</div>
	)
}
