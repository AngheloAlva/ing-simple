"use client"

import { useEffect, useId, useRef, useState } from "react"
import { Pause, Play, RotateCcw } from "lucide-react"
import { CornerPlus } from "@/components/corner-plus"
import { useReducedMotion } from "@/lib/motion"
import { duration, poseAt, type Scenario } from "./model"
import art from "./art.json"
import "./station.css"

const xAxis = art.xAxis as [number, number]
const yAxis = art.yAxis as [number, number]

function position(x: number, y: number): string {
	return `translate(${(xAxis[0] * x + yAxis[0] * y).toFixed(2)} ${(xAxis[1] * x + yAxis[1] * y).toFixed(2)})`
}

const initialPose = poseAt(0, "complete")

/** Only trusted, build-generated SVG goes into these static layers. */
export function AutomationStation() {
	const id = useId()
	const reduced = useReducedMotion()
	const root = useRef<HTMLElement>(null)
	const card = useRef<SVGGElement>(null)
	const readout = useRef<HTMLSpanElement>(null)
	const time = useRef(0)
	const interacting = useRef({ pointer: false, focus: false })
	const kick = useRef<() => void>(() => {})
	const [scenario, setScenario] = useState<Scenario>("complete")
	const [paused, setPaused] = useState(false)
	const [replay, setReplay] = useState(0)

	useEffect(() => {
		const element = root.current
		if (!element) return
		let frame = 0,
			last = 0,
			visible = false
		const draw = () => {
			const pose = poseAt(time.current, scenario)
			card.current?.setAttribute("transform", position(pose.x, pose.y))
			if (readout.current) readout.current.textContent = pose.phase
			element.dataset.phase = pose.phase
			element.dataset.completed = String(pose.completed)
		}
		const tick = (now: number) => {
			frame = 0
			const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 0
			last = now
			time.current += dt
			const held = interacting.current.pointer || interacting.current.focus
			if (time.current >= duration + 2 && !held) time.current = 0
			draw()
			if (!(held && time.current >= duration)) frame = requestAnimationFrame(tick)
		}
		const stop = () => {
			cancelAnimationFrame(frame)
			frame = 0
			last = 0
		}
		const run = () => {
			if (visible && document.visibilityState === "visible" && !paused && !reduced && !frame) {
				last = 0
				frame = requestAnimationFrame(tick)
			}
		}
		kick.current = run
		if (reduced) time.current = duration
		draw()
		const observer = new IntersectionObserver(
			(entries) => {
				visible = entries[entries.length - 1]?.isIntersecting ?? false
				if (visible) run()
				else stop()
			},
			{ threshold: 0.15 }
		)
		observer.observe(element)
		const visibility = () => (document.visibilityState === "visible" ? run() : stop())
		document.addEventListener("visibilitychange", visibility)
		return () => {
			stop()
			observer.disconnect()
			document.removeEventListener("visibilitychange", visibility)
			kick.current = () => {}
		}
	}, [scenario, paused, reduced, replay])

	function select(next: Scenario) {
		time.current = 0
		setScenario(next)
		setReplay((value) => value + 1)
	}

	return (
		<figure
			ref={root}
			className="automation-station iso w-full min-w-0"
			aria-labelledby={`${id}-title`}
			onPointerEnter={() => {
				interacting.current.pointer = true
			}}
			onPointerLeave={() => {
				interacting.current.pointer = false
				kick.current()
			}}
			onFocusCapture={() => {
				interacting.current.focus = true
			}}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) {
					interacting.current.focus = false
					kick.current()
				}
			}}
		>
			<div className="iso-plate border-border bg-background relative rounded-sm border">
				<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
				<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />
				<header className="flex items-center justify-between gap-3 px-4 pt-4 font-mono text-[10px] sm:px-5">
					<span className="text-muted-foreground tracking-widest uppercase">
						Fig. 01 / Automatización
					</span>
					<span className="text-muted-foreground">Demo</span>
				</header>
				<h3 id={`${id}-title`} className="px-4 pt-2 text-sm font-medium sm:px-5">
					Cada solicitud encuentra su camino
				</h3>
				<svg
					className="iso-svg"
					viewBox={`0 0 ${art.width} ${art.height}`}
					role="img"
					aria-labelledby={`${id}-drawing`}
				>
					<title id={`${id}-drawing`}>
						Estación clasificadora: una ficha atraviesa el lector y pasa a registro o a revisión
						manual según sus datos.
					</title>
					<g dangerouslySetInnerHTML={{ __html: art.back }} />
					<g
						ref={card}
						data-request=""
						transform={position(initialPose.x, initialPose.y)}
						dangerouslySetInnerHTML={{ __html: art.card }}
					/>
					<g dangerouslySetInnerHTML={{ __html: art.front }} />
				</svg>
				<div className="flex min-h-10 flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 pb-3 font-mono text-[10px] sm:px-5 sm:text-[11px]">
					<span className="text-muted-foreground">Entrada → Validación → Destino</span>
					<span ref={readout} data-readout="" className="station-readout text-foreground">
						{initialPose.phase}
					</span>
				</div>
				<div className="border-border flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 sm:px-5">
					<div role="group" aria-label="Tipo de solicitud" className="flex flex-wrap gap-1.5">
						{(
							[
								["complete", "Datos completos"],
								["missing", "Faltan datos"],
							] as const
						).map(([value, label]) => (
							<button
								key={value}
								type="button"
								aria-pressed={scenario === value}
								onClick={() => select(value)}
								className="station-choice focus-ring min-h-9 rounded-sm border px-2.5 text-[11px] transition-colors"
							>
								{label}
							</button>
						))}
					</div>
					<div className="flex gap-1">
						{!reduced ? (
							<button
								type="button"
								aria-label={paused ? "Reanudar demostración" : "Pausar demostración"}
								onClick={() => setPaused((value) => !value)}
								className="focus-ring text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-sm"
							>
								{paused ? (
									<Play size={14} aria-hidden="true" />
								) : (
									<Pause size={14} aria-hidden="true" />
								)}
							</button>
						) : null}
						<button
							type="button"
							aria-label="Reiniciar demostración"
							onClick={() => select(scenario)}
							className="focus-ring text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center rounded-sm"
						>
							<RotateCcw size={14} aria-hidden="true" />
						</button>
					</div>
				</div>
			</div>
			<figcaption className="text-muted-foreground mt-3 text-xs leading-relaxed">
				<p aria-live="polite" aria-atomic="true">
					{scenario === "complete"
						? "Datos completos: la solicitud se valida y queda registrada."
						: "Faltan datos: la solicitud espera revisión manual; no se registra automáticamente."}
				</p>
				<p className="mt-1 text-[10px]">
					Simulación ilustrativa · Sin datos reales{reduced ? " · Movimiento reducido" : ""}
				</p>
			</figcaption>
		</figure>
	)
}
