import scene from "./scene.json"

export const duration = scene.duration
export const loopPause = scene.loopPause
export const copies = scene.copies
export const errors = scene.errors

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

const hoursText = (hours: number) => String(hours).replace(".", ",")

/** Copies, minutes and errors are illustrative, not a measured workload. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const turns = Math.max(0, Math.min(copies, (t - scene.turnStart) / scene.turnLength))
	const made = Math.floor(turns)
	const index = Math.min(made, copies - 1)
	const within = turns - made
	const ejecting = turns < copies && within >= scene.ejectFrom
	const rejected = errors.filter((error) => error < made).length
	const hours = (made * scene.minutesPerCopy) / 60
	const complete = t >= scene.complete
	const sheet = {
		visible: ejecting,
		error: errors.includes(index),
		/** 0 as the sheet leaves the drum, 1 as it lands. */
		progress: ejecting ? (within - scene.ejectFrom) / (1 - scene.ejectFrom) : 0,
	}

	let caption = "El mismo documento, a mano, una y otra vez"
	if (complete) caption = "Una máquina que todavía depende de una mano"
	else if (sheet.visible && sheet.error) caption = "Una copia sale mal: hay que rehacerla"
	else if (turns > 0) caption = "Cada vuelta, una copia y quince minutos"

	return {
		phase: t === 0 ? "ready" : complete ? "complete" : "running",
		angle: turns * Math.PI * 2,
		made,
		good: made - rejected,
		rejected,
		feed: copies - Math.ceil(turns),
		hours,
		sheet,
		summary: complete
			? `${made} copias · ${hoursText(hours)} h de manivela · ${rejected} con error`
			: `${made} copias · ${hoursText(hours)} h de manivela`,
		caption,
	}
}
