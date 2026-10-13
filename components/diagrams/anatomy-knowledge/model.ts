export type Point = { x: number; y: number; z: number }
export const duration = 6.8

/** The first interaction starts one story; leaving does not cancel it. */
export function playbackAt(elapsed: number, active: boolean, reduced: boolean, wasStarted = false) {
	const started = wasStarted || active
	return {
		time: reduced ? duration : started ? elapsed : 0,
		running: started && !reduced && elapsed < duration,
		started,
	}
}
export const areas = ["Ventas", "Depósito", "Administración"] as const
export const home: Point = { x: -85, y: 8, z: 6 }
const done: Point = { x: 85, y: 8, z: 6 }
const desk: Point = { x: 0, y: 8, z: 5 }
const smooth = (t: number) => {
	const p = Math.max(0, Math.min(1, t))
	return p * p * (3 - 2 * p)
}
type Stop = readonly [number, Point]
function travel(time: number, stops: readonly Stop[]): Point {
	if (time <= 0) return stops[0]![1]
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
const first: readonly Stop[] = [
	[0, home],
	[0.2, { ...home, z: 18 }],
	[0.8, { ...desk, z: 18 }],
	[1, desk],
	[1.6, desk],
	[1.8, { ...desk, z: 18 }],
	[2.4, { ...done, z: 18 }],
	[2.6, done],
]
const waitingRoutes = areas.map((_, i) => {
	const end = { x: -12 + i * 12, y: 8 + i * 7, z: 5 + i * 2.5 }
	return [
		[0, home],
		[0.15, { ...home, z: 18 }],
		[0.7, { ...end, z: 18 }],
		[0.9, end],
	] as readonly Stop[]
})

/** Four illustrative requests: one resolved before absence, then three stranded. */
export function stateAt(seconds: number) {
	const t = Math.max(0, Math.min(duration, seconds))
	const personOpacity = 1 - smooth((t - 2.9) / 0.5)
	const available = t < 3.4
	const papers = [
		{ position: travel(t, first), opacity: 1, status: t >= 2.6 ? "resolved" : "processing" },
		...waitingRoutes.map((route, i) => {
			const age = t - (3.6 + i)
			return {
				position: travel(age, route),
				opacity: smooth(age / 0.15),
				status: t >= 4.5 + i ? "waiting" : age > 0 ? "arriving" : "future",
			}
		}),
	]
	const resolved = papers.filter((p) => p.status === "resolved").length
	const waiting = papers.filter((p) => p.status === "waiting").length
	return {
		papers,
		personOpacity,
		available,
		resolved,
		waiting,
		areas: areas.map((name, i) => ({
			name,
			status:
				papers[i + 1]!.status === "waiting"
					? "En espera"
					: papers[i + 1]!.status === "arriving"
						? "Llegando"
						: i === 0
							? resolved
								? "1 resuelta"
								: "En curso"
							: "Sin solicitud",
		})),
		summary: `${resolved} ${resolved === 1 ? "resuelta" : "resueltas"} · ${waiting} en espera`,
		caption:
			waiting === 3
				? "Trabajo pendiente · Sin alguien que pueda retomarlo"
				: !available
					? "Llegan solicitudes, pero nadie puede retomarlas"
					: t >= 2.9
						? "Quien sabe hacerlo deja de estar disponible"
						: resolved
							? "Con esa persona, la solicitud se resuelve"
							: "Todo depende de quien sabe cómo hacerlo",
	}
}
