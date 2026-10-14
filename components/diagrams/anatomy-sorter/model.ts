import scene from "./scene.json"

export const duration = scene.duration
export const destinations = scene.destinations
export const patches = destinations.filter((destination) => destination.patch)
export const capacity = destinations.find((destination) => destination.id === "cubby")!.count

type DestinationId = (typeof destinations)[number]["id"]

/** Orders in arrival order: each fills its destination before the next one opens. */
export const orders = destinations.flatMap((destination, d) =>
	Array.from({ length: destination.count }, (_, slot) => {
		const index = destinations.slice(0, d).reduce((sum, previous) => sum + previous.count, 0) + slot
		return {
			destination: destination.id as DestinationId,
			slot,
			arrival: Number((scene.arrivalStart + index * scene.arrivalStep).toFixed(3)),
		}
	})
)

/** Starts on first view (no card hover exists on the service page). */
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

/** Order counts and weeks are illustrative, not measured growth. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const items = orders.map((order) => ({
		...order,
		visible: t >= order.arrival,
		/** 1 when the order has just arrived, 0 once it has settled in place. */
		drop: t >= order.arrival ? 1 - smooth((t - order.arrival) / scene.drop) : 1,
	}))
	const arrived = items.filter((item) => item.visible)
	const counts = Object.fromEntries(
		destinations.map((destination) => [
			destination.id,
			arrived.filter((item) => item.destination === destination.id).length,
		])
	) as Record<DestinationId, number>
	const complete = t >= scene.complete
	const week = 1 + Math.floor(t / scene.weekLength)
	const latest = arrived.at(-1)
	return {
		phase: t === 0 ? "ready" : complete ? "complete" : "running",
		week,
		received: arrived.length,
		items,
		counts,
		patches: patches.map((patch) => ({ id: patch.id, shown: (counts[patch.id] ?? 0) > 0 })),
		summary: complete
			? `Capacidad ${capacity} · ${orders.length} pedidos · ${patches.length} parches`
			: `Semana ${week} · ${arrived.length} pedidos · capacidad ${capacity}`,
		caption: complete
			? "La operación creció; las herramientas no acompañaron"
			: latest
				? destinations.find((destination) => destination.id === latest.destination)!.caption
				: "El casillero se armó para la operación de antes",
	}
}
