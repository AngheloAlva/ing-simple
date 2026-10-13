import scene from "./scene.json"

export type Point = { x: number; y: number; z: number }
export const duration = 8.2
export const home = scene.load
export const penHome = scene.penRest
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
type Stop = readonly [number, Point]
function travel(time: number, stops: readonly Stop[]): Point {
	if (time <= stops[0]![0]) return stops[0]![1]
	for (let i = 1; i < stops.length; i++) {
		const [end, to] = stops[i]!,
			[start, from] = stops[i - 1]!
		if (time <= end) {
			const p = smooth((time - start) / (end - start))
			return {
				x: from.x + (to.x - from.x) * p,
				y: from.y + (to.y - from.y) * p,
				z: from.z + (to.z - from.z) * p,
			}
		}
	}
	return stops[stops.length - 1]![1]
}
const lifted = (p: Point): Point => ({ ...p, z: 18 })
const route: readonly Stop[] = [
	[0, home],
	[1.5, home],
	[1.65, lifted(home)],
	[2.1, lifted(scene.review)],
	[2.3, scene.review],
	[3.5, scene.review],
	[3.65, lifted(scene.review)],
	[4.1, lifted(home)],
	[4.3, home],
	[5.3, home],
	[5.45, lifted(home)],
	[5.9, lifted(scene.review)],
	[6.1, scene.review],
	[6.3, scene.review],
	[6.45, lifted(scene.review)],
	[6.9, lifted(scene.send)],
	[7.1, scene.send],
]
const writing: readonly Stop[] = [
	[0, penHome],
	[0.3, { x: -86, y: 14, z: 7.5 }],
	[0.55, { x: -74, y: 20, z: 7.5 }],
	[0.8, { x: -84, y: 18, z: 7.5 }],
	[1.05, { x: -72, y: 24, z: 7.5 }],
	[1.45, penHome],
]

/** Illustrative orders, not measured processing times or savings. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const copiedQuantity = t < 1.2 ? null : t < 4.9 ? scene.mistypedQuantity : scene.sourceQuantity
	const corrections = Number(t >= 4.9)
	const sent = Number(t >= 7.1)
	const pending = Number(t >= 7.7)
	const error = t >= 2.8 && copiedQuantity !== scene.sourceQuantity
	const stage =
		t === 0
			? "ready"
			: t < 1.5
				? "copying"
				: t < 2.8
					? "reviewing"
					: t < 3.5
						? "error"
						: t < 5.3
							? "correcting"
							: t < 6.3
								? "rechecking"
								: t < 7.1
									? "sending"
									: t < 7.7
										? "next"
										: "complete"
	const caption =
		t === 0
			? "Copiar, revisar y enviar a mano"
			: t < 1.2
				? "Cargando los datos del pedido a mano"
				: t < 2.8
					? `Pedido: ${scene.sourceQuantity} uds. · Copia: ${copiedQuantity} uds.`
					: t < 3.5
						? `No coincide: se copió ${scene.mistypedQuantity} en lugar de ${scene.sourceQuantity}`
						: t < 4.9
							? "Volver a cargar y corregir el dato"
							: t < 6.3
								? `Dato corregido: ${scene.sourceQuantity} · revisar otra vez`
								: t < 7.7
									? "Enviar el pedido corregido"
									: "Otro pedido: repetir carga, revisión y envío"
	return {
		stage,
		sourceQuantity: scene.sourceQuantity,
		copiedQuantity,
		error,
		corrections,
		sent,
		pending,
		paperPosition: travel(t, route),
		penPosition:
			t < 1.5
				? travel(t, writing)
				: t >= 4.3 && t < 5.3
					? travel((t - 4.3) * 1.45, writing)
					: penHome,
		nextOpacity: smooth((t - 7.2) / 0.5),
		steps: [
			{
				name: "Cargar",
				status: pending
					? "Otro pedido"
					: t === 0
						? "Por empezar"
						: t < 1.2
							? "Copiando"
							: t < 2.8
								? `${copiedQuantity} uds.`
								: t < 4.3
									? "Rehacer"
									: t < 4.9
										? "Corrigiendo"
										: `${copiedQuantity} uds.`,
			},
			{
				name: "Revisar",
				status:
					t < 2.3
						? "Pendiente"
						: t < 2.8
							? "Comparando"
							: t < 4.9
								? `${scene.mistypedQuantity} ≠ ${scene.sourceQuantity}`
								: t < 6.1
									? "Por revisar"
									: t < 6.3
										? "Revisando"
										: "Corregido",
			},
			{ name: "Enviar", status: t < 6.3 ? "En espera" : t < 7.1 ? "Enviando" : "Enviado" },
		],
		caption,
		summary: `${sent} ${sent === 1 ? "enviado" : "enviados"} · ${corrections} ${corrections === 1 ? "corrección" : "correcciones"}${pending ? " · 1 pendiente" : ""}`,
	}
}
