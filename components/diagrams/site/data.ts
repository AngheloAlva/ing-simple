/* --------------------------------------------------------------------------
 * Data behind the Desarrollo Web visual: a corporate site with a quote flow
 * built into it, the audit it ships with, and what changed for the business.
 * ------------------------------------------------------------------------ */

export const DEVICES = ["Escritorio", "Móvil"] as const
export type Device = (typeof DEVICES)[number]

export const PAGES = ["Inicio", "Tours", "Cotizar"] as const
export type Page = (typeof PAGES)[number]

export const SITE = {
	brand: "Andes Travel",
	domain: "andestravel.cl",
	hero: {
		title: "Tu próxima aventura en la cordillera",
		text: "Excursiones guiadas con reserva inmediata y cotización en minutos.",
		cta: "Cotizar",
	},
	tours: [
		{ name: "Trekking al glaciar", meta: "Día completo · 8 cupos", price: "$45.000" },
		{ name: "Cabalgata al atardecer", meta: "3 horas · 6 cupos", price: "$32.000" },
		{ name: "Ruta del vino", meta: "Medio día · 12 cupos", price: "$28.000" },
	],
	quote: {
		fields: ["Nombre", "Correo", "Fecha", "Personas"],
		submit: "Enviar cotización",
		success: "Cotización recibida",
		successText:
			"Queda registrada, asignada a un vendedor y con respuesta comprometida en 2 horas.",
	},
}

export type Score = { name: string; value: number }
export type Vital = { name: string; value: string; ok: boolean }

export const AUDIT: Record<Device, { scores: Score[]; vitals: Vital[] }> = {
	Escritorio: {
		scores: [
			{ name: "Rendimiento", value: 98 },
			{ name: "Accesibilidad", value: 100 },
			{ name: "Prácticas", value: 100 },
			{ name: "SEO", value: 100 },
		],
		vitals: [
			{ name: "LCP", value: "1,1 s", ok: true },
			{ name: "CLS", value: "0,01", ok: true },
			{ name: "INP", value: "80 ms", ok: true },
		],
	},
	Móvil: {
		scores: [
			{ name: "Rendimiento", value: 94 },
			{ name: "Accesibilidad", value: 100 },
			{ name: "Prácticas", value: 100 },
			{ name: "SEO", value: 100 },
		],
		vitals: [
			{ name: "LCP", value: "1,8 s", ok: true },
			{ name: "CLS", value: "0,02", ok: true },
			{ name: "INP", value: "120 ms", ok: true },
		],
	},
}

export type Outcome = {
	label: string
	before: string
	after: number
	format: (v: number) => string
}

export const OUTCOMES: Outcome[] = [
	{
		label: "Tiempo de carga",
		before: "6,4 s",
		after: 1.1,
		format: (v) =>
			`${v.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} s`,
	},
	{ label: "Cotizaciones al mes", before: "4", after: 38, format: (v) => `${Math.round(v)}` },
	{
		label: "Respuesta al cliente",
		before: "2 días",
		after: 2,
		format: (v) => `${Math.round(v)} h`,
	},
]
