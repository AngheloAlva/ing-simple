import scene from "./scene.json"

export const duration = scene.duration
export const loopPause = scene.loopPause
export const drawers = scene.drawers
export const drawerTravel = scene.drawerTravel

/**
 * Starts on first view (no card hover exists on the service page) and keeps
 * running: the story loops through `loopTime`. Reduced motion shows the final pose.
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

/** Tool counts are illustrative: a stand-in for features, not a usage measurement. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const state = drawers.map((drawer) => {
		const open = ramp(t, drawer.open) * (drawer.close ? 1 - ramp(t, drawer.close) : 1)
		const checked = t >= drawer.open[1]!
		return {
			id: drawer.id,
			open,
			checked,
			status: checked ? `${drawer.used.length} de ${drawer.tools} en uso` : "Por revisar",
		}
	})
	const checked = state.filter((drawer) => drawer.checked).length
	const used = drawers.reduce((sum, drawer) => sum + drawer.used.length, 0)
	const total = drawers.reduce((sum, drawer) => sum + drawer.tools, 0)
	const complete = t >= scene.complete
	const current = drawers.findLastIndex((drawer) => t > drawer.open[0]!)
	return {
		phase: t === 0 ? "ready" : complete ? "complete" : "running",
		drawers: state,
		checked,
		used,
		total,
		summary: complete
			? `${scene.licenses} licencias pagadas · ${used} de ${total} herramientas en uso`
			: `${checked} de ${drawers.length} cajones revisados`,
		caption: complete
			? "Se paga el carro completo y se usa una fracción"
			: current < 0
				? "Tres herramientas pagadas, listas en el carro"
				: drawers[current]!.caption,
	}
}
