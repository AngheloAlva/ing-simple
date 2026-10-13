import scene from "./scene.json"

export const duration = 6.4
export const sources = scene.sources
export const drawerTravel = scene.drawerTravel

export function playbackAt(elapsed: number, active: boolean, reduced: boolean, wasStarted = false) {
	const started = wasStarted || active
	return {
		time: reduced ? duration : started ? elapsed : 0,
		running: started && !reduced && elapsed < duration,
		started,
	}
}
const smooth = (value: number) => {
	const t = Math.max(0, Math.min(1, value))
	return t * t * (3 - 2 * t)
}

/** Illustrative facts belong to one order, not measured business results. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const drawers = sources.map((source) => {
		const open = smooth((t - source.start) / (source.reveal - source.start))
		const revealed = t >= source.reveal
		return {
			id: source.id,
			open,
			revealed,
			status: revealed ? source.fact : t > source.start ? "Consultando" : "Por consultar",
		}
	})
	const consulted = drawers.filter((drawer) => drawer.revealed).length
	const active = sources.findLastIndex((source) => t > source.start)
	const complete = t >= 5.6
	return {
		phase: t === 0 ? "ready" : complete ? "complete" : sources[Math.max(0, active)]!.id,
		drawers,
		consulted,
		sharedFields: 0,
		report: "Sin vista conjunta",
		summary: complete
			? `${sources.length} fuentes separadas · sin vista conjunta`
			: `${consulted} de ${sources.length} fuentes consultadas`,
		caption: complete
			? "Para decidir, hay que cruzarlas a mano"
			: active < 0
				? "Un mismo pedido, información en tres lugares"
				: sources[active]!.caption,
	}
}
