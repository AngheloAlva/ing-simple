/* --------------------------------------------------------------------------
 * Data behind the Capacitaciones visual: one tailored programme per tool and
 * level, the team competencies each one moves, and what the team can do on
 * its own once it is through.
 * ------------------------------------------------------------------------ */

export const TOOLS = ["Power BI", "Excel", "Power Apps"] as const
export type Tool = (typeof TOOLS)[number]

export const LEVELS = ["Básico", "Intermedio", "Avanzado"] as const
export type Level = (typeof LEVELS)[number]

export type Session = {
	title: string
	topics: string
	hours: number
	/** Worked on the client's own data rather than a sample set. */
	ownData: boolean
}

export type Competency = {
	name: string
	/** Team level before the programme, 0–100. */
	start: number
	/** Team level once every session is done, 0–100. */
	end: number
}

export type Program = {
	sessions: Session[]
	competencies: Competency[]
	/** Reports the team produces per month by itself after the programme. */
	reports: number
}

export const PARTICIPANTS = 12

function session(title: string, topics: string, hours: number, ownData = false): Session {
	return { title, topics, hours, ownData }
}

const COMPETENCY_NAMES: Record<Tool, string[]> = {
	"Power BI": ["Modelado", "DAX", "Visualización", "Publicación"],
	"Excel": ["Fórmulas", "Power Query", "Tablas dinámicas", "Automatización"],
	"Power Apps": ["Pantallas", "Datos", "Lógica y flujos", "Publicación"],
}

const LEVEL_RANGE: Record<Level, { start: number[]; end: number[]; reports: number }> = {
	Básico: { start: [15, 10, 20, 8], end: [62, 55, 68, 58], reports: 6 },
	Intermedio: { start: [45, 35, 50, 30], end: [82, 78, 86, 78], reports: 14 },
	Avanzado: { start: [68, 60, 74, 62], end: [93, 91, 95, 92], reports: 22 },
}

const SESSIONS: Record<Tool, Record<Level, Session[]>> = {
	"Power BI": {
		Básico: [
			session("Conectar y limpiar", "Power Query con tus planillas", 3, true),
			session("Modelo de datos", "Tablas, relaciones y fechas", 3),
			session("Primeras medidas", "SUM, CALCULATE y filtros", 4, true),
			session("Tu primer dashboard", "Visuales y publicación", 3, true),
		],
		Intermedio: [
			session("Modelado en estrella", "Hechos, dimensiones, calendario", 3),
			session("DAX con contexto", "CALCULATE, time intelligence", 4, true),
			session("Visualización que decide", "Jerarquías y marcadores", 3, true),
			session("Publicar y gobernar", "Service, roles, actualización", 3),
		],
		Avanzado: [
			session("Rendimiento del modelo", "DAX Studio, agregaciones", 3),
			session("DAX avanzado", "Variables, iteradores, patrones", 4, true),
			session("Datasets compartidos", "Dataflows y certificación", 3),
			session("Automatizar la entrega", "Suscripciones, alertas, APIs", 3, true),
		],
	},
	"Excel": {
		Básico: [
			session("Orden en la planilla", "Tablas, formato, validación", 3, true),
			session("Fórmulas que resuelven", "SI, BUSCARX, SUMAR.SI", 3),
			session("Tablas dinámicas", "Resumir sin fórmulas", 3, true),
			session("Gráficos y reportes", "Del dato al informe", 2),
		],
		Intermedio: [
			session("Power Query en Excel", "Importar, limpiar, combinar", 3, true),
			session("Fórmulas avanzadas", "Matriciales, LET, LAMBDA", 4),
			session("Power Pivot", "Modelo de datos y medidas", 3, true),
			session("Reportes automáticos", "Dinámicas y segmentadores", 3),
		],
		Avanzado: [
			session("Power Pivot y DAX", "Medidas a gran escala", 4, true),
			session("Macros útiles", "VBA para lo repetitivo", 4),
			session("Automatizar tareas", "Power Automate + Excel", 3, true),
			session("Plantillas del equipo", "Estándares que se mantienen", 2),
		],
	},
	"Power Apps": {
		Básico: [
			session("Tu primera app", "Canvas, pantallas, controles", 3),
			session("Datos en SharePoint", "Listas y formularios", 3, true),
			session("Lógica con fórmulas", "Patch, filtros, variables", 4),
			session("Publicar al equipo", "Permisos y versiones", 2),
		],
		Intermedio: [
			session("Apps que se usan", "Componentes y navegación", 3),
			session("Dataverse", "Tablas, relaciones, seguridad", 4, true),
			session("Flujos con Power Automate", "Aprobaciones y avisos", 3, true),
			session("Ciclo de vida", "Entornos y soluciones", 2),
		],
		Avanzado: [
			session("Model-driven apps", "Formularios y vistas", 4),
			session("Integraciones", "Conectores custom y APIs", 4, true),
			session("Rendimiento y delegación", "Apps rápidas con más datos", 3),
			session("Gobierno y ALM", "Pipelines y estándares", 2),
		],
	},
}

export function program(tool: Tool, level: Level): Program {
	const range = LEVEL_RANGE[level]
	return {
		sessions: SESSIONS[tool][level],
		competencies: COMPETENCY_NAMES[tool].map((name, i) => ({
			name,
			start: range.start[i] ?? 0,
			end: range.end[i] ?? 0,
		})),
		reports: range.reports,
	}
}

/**
 * Where a competency sits after a set of sessions: each session mostly lifts
 * the competency of the same index and nudges the rest, so finishing all four
 * lands exactly on `end`.
 */
export function competencyNow(competency: Competency, index: number, done: Set<number>): number {
	let progress = 0
	for (const i of done) progress += i === index ? 0.55 : 0.15
	return competency.start + (competency.end - competency.start) * Math.min(1, progress)
}

export function dependency(doneCount: number, total: number): "Alta" | "Media" | "Baja" {
	if (doneCount >= total) return "Baja"
	if (doneCount >= total / 2) return "Media"
	return "Alta"
}
