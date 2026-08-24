/* --------------------------------------------------------------------------
 * Data behind the Reportabilidad report. Shaped like the management reports
 * the studio actually builds — plan versus execution by month and by cost
 * centre — with figures invented for the demo.
 * ------------------------------------------------------------------------ */

export type Unit = "$" | "M$" | "MM$"

export type MonthPoint = {
	label: string
	/** Millions of pesos. */
	plan: number
	gestion: number
}

export type CostCentre = {
	code: string
	name: string
	service: string
	plan: number
	gestion: number
}

export type YearData = {
	year: string
	closing: string
	months: MonthPoint[]
	centres: CostCentre[]
}

export const UNITS: Unit[] = ["$", "M$", "MM$"]

export const ALL_SERVICES = "Todos"
export const SERVICES = [ALL_SERVICES, "Operación", "Soporte", "Administración"]

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun"]

function months(plan: number[], gestion: number[]): MonthPoint[] {
	return MONTHS.map((label, i) => ({
		label,
		plan: plan[i] ?? 0,
		gestion: gestion[i] ?? 0,
	}))
}

const CENTRES = [
	{ code: "05", name: "Planta Norte", service: "Operación" },
	{ code: "06", name: "Faena Sur", service: "Operación" },
	{ code: "14", name: "Logística", service: "Soporte" },
	{ code: "17", name: "Mantención", service: "Soporte" },
	{ code: "22", name: "Administración", service: "Administración" },
]

function centres(plan: number[], gestion: number[]): CostCentre[] {
	return CENTRES.map((centre, i) => ({
		...centre,
		plan: plan[i] ?? 0,
		gestion: gestion[i] ?? 0,
	}))
}

export const YEARS: YearData[] = [
	{
		year: "2024",
		closing: "Cierre junio 2024",
		months: months(
			[1490.2, 1512.8, 1538.1, 1560.4, 1575.9, 1590.3],
			[1531.6, 1498.2, 1566.4, 1571.8, 1549.1, 1612.7]
		),
		centres: centres(
			[735.3, 1222.2, 232.8, 1540.2, 1311.9],
			[783.0, 1417.0, 249.3, 1429.5, 1369.4]
		),
	},
	{
		year: "2025",
		closing: "Cierre junio 2025",
		months: months(
			[1614.4, 1578.0, 1753.3, 1739.5, 1747.2, 1740.6],
			[1693.4, 1605.9, 1683.5, 1600.7, 1603.3, 1691.5]
		),
		centres: centres(
			[799.2, 1328.5, 253.0, 1674.1, 1426.0],
			[851.1, 1540.1, 271.0, 1553.8, 1488.5]
		),
	},
	{
		year: "2026",
		closing: "Cierre junio 2026",
		months: months(
			[1802.5, 1815.1, 1830.9, 1840.2, 1852.7, 1860.4],
			[1788.3, 1834.6, 1809.2, 1861.9, 1872.4, 1849.0]
		),
		centres: centres(
			[847.2, 1408.2, 268.2, 1774.5, 1511.6],
			[882.4, 1596.7, 280.1, 1662.3, 1537.9]
		),
	},
]

/**
 * Narrows a year to one service: the table keeps only its cost centres and the
 * monthly series is scaled by that service's share of the total, so chart,
 * KPIs and table keep agreeing with each other.
 */
export function filterByService(data: YearData, service: string): YearData {
	if (service === ALL_SERVICES) return data
	const centres = data.centres.filter((c) => c.service === service)
	const sum = (rows: CostCentre[], key: "plan" | "gestion") => rows.reduce((t, r) => t + r[key], 0)
	const planShare = sum(centres, "plan") / sum(data.centres, "plan")
	const gestionShare = sum(centres, "gestion") / sum(data.centres, "gestion")
	return {
		...data,
		centres,
		months: data.months.map((m) => ({
			...m,
			plan: m.plan * planShare,
			gestion: m.gestion * gestionShare,
		})),
	}
}

/** Shared bar scale so switching years reads as the data moving, not the axis. */
export const CHART_MAX =
	Math.max(...YEARS.flatMap((y) => y.months.flatMap((m) => [m.plan, m.gestion]))) * 1.06

export function difference(plan: number, gestion: number): number {
	return gestion - plan
}

export function differencePct(plan: number, gestion: number): number {
	return plan === 0 ? 0 : ((gestion - plan) / plan) * 100
}

/** Formats a MM$ figure in the chosen unit with Chilean separators. */
export function formatAmount(value: number, unit: Unit): string {
	const scaled = unit === "MM$" ? value : unit === "M$" ? value * 1_000 : value * 1_000_000
	const decimals = unit === "MM$" ? 1 : 0
	return scaled.toLocaleString("es-CL", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	})
}

export function formatPct(value: number): string {
	return `${value.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
}
