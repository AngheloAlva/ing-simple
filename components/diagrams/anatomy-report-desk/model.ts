import scene from "./scene.json"

export const duration = scene.duration
export const trays = scene.trays
export const metric = scene.metric
export const stampLift = scene.stamp.lift

/** Starts on first view (no card hover exists on the service page). */
export function playbackAt(elapsed: number, active: boolean, reduced: boolean, wasStarted = false) {
	const started = wasStarted || active
	return {
		time: reduced ? duration : started ? elapsed : 0,
		running: started && !reduced && elapsed < duration,
		started,
	}
}

const clamp = (value: number) => Math.max(0, Math.min(1, value))
const smooth = (value: number) => {
	const t = clamp(value)
	return t * t * (3 - 2 * t)
}

function stampAt(t: number) {
	const { lift, down, contact, release, up } = scene.stamp
	if (t < contact) return lift * (1 - smooth((t - down) / (contact - down)))
	if (t < release) return 0
	return lift * smooth((t - release) / (up - release))
}

/** Illustrative totals for one month, not business data or measured delays. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const { binder } = scene
	const sheets = trays.map((tray, i) => {
		const progress = clamp((t - tray.start) / (tray.land - tray.start))
		// First slide straight out of the tier, then arc over to the binder.
		const out = smooth(progress / scene.slideShare)
		const over = smooth((progress - scene.slideShare) / (1 - scene.slideShare))
		const landed = t >= tray.land
		const offset: [number, number, number] = [
			(binder.x - scene.rack.x) * over,
			scene.slideOut * out + (binder.y - scene.rack.y - scene.slideOut) * over,
			(binder.z + i * binder.sheet - tray.z) * over + scene.lift * Math.sin(Math.PI * over),
		]
		return {
			id: tray.id,
			offset,
			landed,
			/** Out of its tier: paint in front of the rack instead of inside it. */
			front: progress >= scene.slideShare,
			status: landed ? "En el informe" : t > tray.start ? "Copiando" : "Pendiente",
		}
	})
	const gathered = sheets.filter((sheet) => sheet.landed).length
	const day = Math.min(scene.days, 1 + Math.floor(t / scene.dayLength))
	const decided = t >= scene.stamp.contact
	const complete = t >= scene.complete
	const copying = trays.findIndex((tray) => t > tray.start && t < tray.land)
	const deciding = decided && t < scene.stamp.contact + 0.8

	let caption = "El informe sigue incompleto"
	if (complete)
		caption = `El informe llegó el día ${scene.days}; la decisión se tomó el día ${scene.decisionDay}`
	else if (deciding) caption = `Día ${scene.decisionDay}: se decide sin el informe`
	else if (copying >= 0) caption = `Copiando ${trays[copying]!.name}: ${trays[copying]!.value}`
	else if (t < trays[0]!.start) caption = "Cada área entrega su propia versión del total"

	return {
		phase: t === 0 ? "ready" : complete ? "complete" : "running",
		day,
		sheets,
		gathered,
		decided,
		stamp: stampAt(t),
		summary: complete
			? `Día ${scene.days} · ${trays.length} versiones · decisión del día ${scene.decisionDay}`
			: `Día ${day} · ${gathered} de ${trays.length} áreas en el informe`,
		caption,
	}
}
