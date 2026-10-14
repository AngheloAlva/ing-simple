import scene from "./scene.json"

export const duration = scene.duration
export const loopPause = scene.loopPause
export const threshold = scene.threshold
export const invoices = scene.invoices.map((invoice) => ({
	...invoice,
	lane: (invoice.confidence >= scene.threshold ? "system" : "review") as "system" | "review",
}))

// Per invoice, from its start: slide from the hopper to the reader, read
// (the needle rises to the confidence), set the diverter, slide into a tray.
const FEED = 0.4
const READ = 0.8
const DIVERT = 0.95
const LAND = 1.3

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
export const decimal = (value: number) => value.toFixed(2).replace(".", ",")
const side = (lane: "system" | "review") => (lane === "system" ? 1 : -1)

/** Illustrative invoices and confidences; the first one is the guide's JSON example. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const local = invoices.map((_, i) => t - (scene.start + i * scene.step))
	const current = local.findLastIndex((l) => l >= 0)
	const landed = invoices.filter((_, i) => local[i]! >= LAND)
	const system = landed.filter((invoice) => invoice.lane === "system").length
	const review = landed.length - system
	const complete = t >= scene.complete

	let needle = 0
	let diverter = 1
	let sheet = { visible: false, stage: "none", progress: 0, lane: "system" as "system" | "review" }
	let caption = "Cada factura pasa por el lector y sale con su confianza"
	if (current >= 0) {
		const invoice = invoices[current]!
		const l = local[current]!
		const previous = invoices[current - 1]
		// The needle falls back from the previous reading while the next invoice feeds in.
		if (l < FEED) needle = previous ? previous.confidence * (1 - smooth(l / FEED)) : 0
		else needle = invoice.confidence * smooth((l - FEED) / (READ - FEED))
		const from = previous ? side(previous.lane) : 1
		diverter = from + (side(invoice.lane) - from) * smooth((l - READ) / (DIVERT - READ))
		if (l < LAND)
			sheet = {
				visible: true,
				stage: l < FEED ? "feed" : l < DIVERT ? "read" : "exit",
				progress: l < FEED ? smooth(l / FEED) : smooth((l - DIVERT) / (LAND - DIVERT)),
				lane: invoice.lane,
			}
		const n = current + 1
		if (l < FEED) caption = `Factura ${n}: leyendo…`
		else if (l < DIVERT) caption = `Factura ${n}: confianza ${decimal(invoice.confidence)}`
		else
			caption =
				invoice.lane === "system"
					? `${decimal(invoice.confidence)} sobre el umbral: directo al sistema`
					: `${decimal(invoice.confidence)} bajo el umbral: la revisa una persona`
	}
	if (complete) caption = "El umbral decide qué sigue solo y qué revisa alguien"

	return {
		phase: t === 0 ? "ready" : complete ? "complete" : "running",
		current,
		needle,
		diverter,
		hopper: invoices.length - local.filter((l) => l > 0).length,
		system,
		review,
		sheet,
		summary: complete
			? `${invoices.length} facturas · ${system} al sistema · ${review} a revisión`
			: `${landed.length} de ${invoices.length} facturas · ${system} al sistema · ${review} a revisión`,
		caption,
	}
}
