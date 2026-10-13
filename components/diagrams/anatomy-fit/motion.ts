import scene from "./scene.json"

export type Process = "square" | "cross" | "bar"
export type Point = { x: number; y: number; z: number }
type Stop = readonly [number, Point]
export const motionDuration = 8.2
export const processes = [
	{ id: "square", label: "Aprobaciones" },
	{ id: "cross", label: "Precios por cliente" },
	{ id: "bar", label: "Turnos" },
] as const

const smooth = (value: number): number => {
	const t = Math.max(0, Math.min(1, value))
	return t * t * (3 - 2 * t)
}
const above = { x: 0, y: 0, z: scene.flight }
const contact = { x: 0, y: 0, z: scene.opening.rim }
const reject = (home: Point): readonly Stop[] => [
	[0, home],
	[0.35, { ...home, z: scene.flight }],
	[0.85, above],
	[1.2, contact],
	[1.75, contact],
	[2.1, above],
	[2.6, { ...home, z: scene.flight }],
	[3, home],
]
const routes = {
	cross: reject(scene.homes.cross),
	bar: reject(scene.homes.bar),
	square: [
		[0, scene.homes.square],
		[0.35, { ...scene.homes.square, z: scene.flight }],
		[0.9, above],
		[1.6, { x: 0, y: 0, z: scene.opening.floor }],
	] as readonly Stop[],
}

function positionAt(stops: readonly Stop[], time: number): Point {
	if (time <= 0) return stops[0]![1]
	for (let i = 1; i < stops.length; i++) {
		const [toTime, to] = stops[i]!
		const [fromTime, from] = stops[i - 1]!
		if (time <= toTime) {
			const p = smooth((time - fromTime) / (toTime - fromTime))
			return {
				x: from.x + (to.x - from.x) * p,
				y: from.y + (to.y - from.y) * p,
				z: from.z + (to.z - from.z) * p,
			}
		}
	}
	return stops[stops.length - 1]![1]
}

/** One illustrative cycle. Rejections touch the rim, never enter the empty die. */
export function sequenceAt(seconds: number) {
	const t = Math.max(0, Math.min(motionDuration, seconds))
	const outcomes = {
		square: t < 6.4 ? "Por probar" : t < 8 ? "Probando" : "Dentro",
		cross: t === 0 ? "Por probar" : t < 1.2 ? "Probando" : "Manual",
		bar: t < 3.2 ? "Por probar" : t < 4.4 ? "Probando" : "Manual",
	}
	const active: Process | null =
		t === 0 || t >= 8 ? null : t < 3.2 ? "cross" : t < 6.4 ? "bar" : "square"
	const caption =
		t === 0
			? "Tres procesos, un formato"
			: t < 3.2
				? t < 1.2
					? "Probando precios por cliente"
					: "Precios por cliente: no encaja"
				: t < 6.4
					? t < 4.4
						? "Probando turnos"
						: "Turnos: no encaja"
					: t < 8
						? "Probando aprobaciones"
						: "1 proceso dentro · 2 manuales"
	return {
		positions: {
			square: positionAt(routes.square, t - 6.4),
			cross: positionAt(routes.cross, t),
			bar: positionAt(routes.bar, t - 3.2),
		},
		outcomes,
		active,
		caption,
		accepted: outcomes.square === "Dentro" ? 1 : 0,
		manual: Number(outcomes.cross === "Manual") + Number(outcomes.bar === "Manual"),
	}
}
