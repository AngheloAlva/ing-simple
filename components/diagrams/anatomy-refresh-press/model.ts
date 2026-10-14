import scene from "./scene.json"

export const duration = scene.duration
export const loopPause = scene.loopPause
export const definition = scene.definition
export const areas = scene.areas
export const stroke = scene.stroke

/**
 * Starts on first view (no hover target inside a guide) and keeps running:
 * the story loops through `loopTime`. Reduced motion shows the final pose.
 */
export function playbackAt(elapsed: number, active: boolean, reduced: boolean, wasStarted = false) {
	const started = wasStarted || active
	return {
		time: reduced ? duration : started ? elapsed : 0,
		running: started && !reduced,
		started,
	}
}

/** Story time for a running clock: the story, then the final pose held for `loopPause`, again. */
export function loopTime(elapsed: number) {
	return Math.min(duration, elapsed % (duration + loopPause))
}

const smooth = (value: number) => {
	const t = Math.max(0, Math.min(1, value))
	return t * t * (3 - 2 * t)
}
const ramp = (t: number, [from, to]: number[]) => smooth((t - from!) / (to! - from!))
const pad = (n: number) => String(n).padStart(2, "0")

/** The value and the 06:00 schedule follow the guide's example; illustrative. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const { clock } = scene
	const progress = Math.max(0, Math.min(1, (t - clock.start) / (clock.end - clock.start)))
	const minutes = Math.round(clock.from + (clock.to - clock.from) * progress)
	const time = `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`
	const light = t >= clock.end
	const ram = ramp(t, scene.ram.down) * (1 - ramp(t, scene.ram.up))
	const stamped = t >= scene.ram.contact
	const complete = t >= scene.complete

	let caption = "Una sola definición, guardada en el modelo"
	if (complete) caption = "La misma fórmula, el mismo número para todos"
	else if (stamped) caption = `Ventas, Finanzas y Operaciones ven ${scene.value}`
	else if (light) caption = "06:00: el modelo se actualiza solo"
	else if (t >= clock.start) caption = "El refresco está programado para las 06:00"

	return {
		phase: t === 0 ? "ready" : complete ? "complete" : "running",
		minutes,
		clock: time,
		light,
		ram,
		stamped,
		areas: areas.map((area) => ({ id: area.id, value: stamped ? scene.value : null })),
		summary: complete
			? `${time} · 1 definición · ${areas.length} áreas, mismo número`
			: light
				? `${time} · refrescando`
				: `${time} · esperando el refresco`,
		caption,
	}
}
