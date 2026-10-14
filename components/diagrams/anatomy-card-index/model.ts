import scene from "./scene.json"

export const duration = scene.duration
export const cards = scene.cards
export const lift = scene.lift
export const toTray = scene.toTray
export const trayDrop = scene.trayDrop

// Per card, from its start: rise, clip the tab, hold, settle back. A card
// without a basis rises, waits for an answer that never comes, then moves
// sideways into the tray.
const RISE = 0.4
const TAB = 0.5
const SETTLE = [0.9, 1.3]
const MOVE = [0.8, 1.6]

/** Starts on first view (no hover target inside a guide). */
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

/** Illustrative activities and bases; the guide's legal note applies. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const state = cards.map((card) => {
		const local = t - card.start
		const up = smooth(local / RISE)
		if (card.basis === null) {
			const moved = smooth((local - MOVE[0]!) / (MOVE[1]! - MOVE[0]!))
			return {
				id: card.id,
				lift: up,
				tabbed: false,
				moved,
				/** Out of the drawer: paint in front of its walls instead of in its slot. */
				front: moved > 0,
				done: local >= MOVE[1]!,
				status: local >= MOVE[1]! ? "Justificar o eliminar" : local > 0 ? "Revisando" : "Por revisar",
			}
		}
		const down = smooth((local - SETTLE[0]!) / (SETTLE[1]! - SETTLE[0]!))
		const tabbed = local >= TAB
		return {
			id: card.id,
			lift: up * (1 - down),
			tabbed,
			moved: 0,
			front: false,
			done: local >= SETTLE[1]!,
			status: tabbed ? card.basis : local > 0 ? "Revisando" : "Por revisar",
		}
	})
	const checked = state.filter((card) => card.done).length
	const withBasis = cards.filter((card) => card.basis !== null).length
	const complete = t >= scene.complete
	const current = cards.findLastIndex((card) => t >= card.start)

	let caption = "Cada tratamiento necesita una razón para existir"
	if (complete) caption = "Una ficha sin base de licitud no puede quedarse en el fichero"
	else if (current >= 0) {
		const card = cards[current]!
		const local = t - card.start
		if (card.basis === null)
			caption =
				local < MOVE[1]!
					? `${card.purpose}: ¿con qué base? Ninguna`
					: "Sin base: hay que justificarlo o eliminarlo"
		else caption = `${card.purpose}: ${local < TAB ? "¿con qué base?" : card.basis}`
	}

	return {
		phase: t === 0 ? "ready" : complete ? "complete" : "running",
		cards: state,
		checked,
		summary: complete
			? `${cards.length} tratamientos · ${withBasis} con base · ${cards.length - withBasis} por justificar`
			: `${checked} de ${cards.length} tratamientos revisados`,
		caption,
	}
}
