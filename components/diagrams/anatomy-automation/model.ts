export type Scenario = "complete" | "missing"
export const duration = 7

const smooth = (value: number): number => {
	const t = Math.max(0, Math.min(1, value))
	return t * t * (3 - 2 * t)
}

/** Illustrative positions and phases, not measurements of a customer's process. */
export function poseAt(seconds: number, scenario: Scenario) {
	const time = Math.max(0, Math.min(duration, seconds))
	const direction = scenario === "complete" ? -1 : 1
	const x = time < 2 ? -84 + 68 * smooth(time / 2) : -16 + 106 * smooth((time - 3.4) / 2)
	const y = time <= 5.4 ? 0 : direction * 30 * smooth((time - 5.4) / 1.2)
	const phase =
		time < 0.2
			? "Entrada"
			: time < 2
				? "Recibiendo solicitud"
				: time < 3.4
					? "Validando datos"
					: time < 6.6
						? "Derivando solicitud"
						: scenario === "complete"
							? "Solicitud registrada"
							: "Revisión manual"
	return { x, y, phase, completed: time >= 6.6 && scenario === "complete" }
}
