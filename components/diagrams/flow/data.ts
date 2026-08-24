/* --------------------------------------------------------------------------
 * Data behind the Automatizaciones visual: three flows the studio builds,
 * each with its steps, its rules and a stream of sample requests to run.
 * ------------------------------------------------------------------------ */

export type Step = {
	name: string
	/** The rule this step applies, shown on hover. */
	rule: string
}

export type Sample = {
	label: string
	detail: string
	/** Falls outside the automatic rule and waits for a person at `manualStep`. */
	manual?: boolean
}

export type Flow = {
	name: string
	engine: string
	steps: Step[]
	/** Step index where a `manual` request waits for a person. */
	manualStep: number
	manualLabel: string
	samples: Sample[]
	/** Hours of manual work each request used to cost. */
	hoursPerItem: number
	/** Requests already processed today before the visitor arrived. */
	processedToday: number
	before: { perRequest: string; errors: string }
	after: { perRequest: string }
}

export const FLOWS: Flow[] = [
	{
		name: "Aprobación de compras",
		engine: "Power Automate · ERP · Correo",
		steps: [
			{ name: "Solicitud", rule: "Entra por formulario, con centro de costo y adjuntos" },
			{ name: "Validación", rule: "Presupuesto disponible y proveedor vigente" },
			{ name: "Aprobación", rule: "Automática hasta $500.000; sobre eso, jefatura" },
			{ name: "Orden en ERP", rule: "Crea la orden de compra sin redigitar" },
			{ name: "Aviso", rule: "Correo al solicitante con el número de orden" },
		],
		manualStep: 2,
		manualLabel: "Espera a jefatura",
		samples: [
			{ label: "Compra de EPP", detail: "$420.000 · Faena Sur" },
			{ label: "Repuestos bomba", detail: "$1.250.000 · Mantención", manual: true },
			{ label: "Insumos de oficina", detail: "$86.000 · Administración" },
			{ label: "Servicio de grúa", detail: "$780.000 · Planta Norte", manual: true },
			{ label: "Combustible", detail: "$310.000 · Logística" },
			{ label: "Uniformes", detail: "$195.000 · Operaciones" },
		],
		hoursPerItem: 0.4,
		processedToday: 38,
		before: { perRequest: "2 días", errors: "3 por semana" },
		after: { perRequest: "6 min" },
	},
	{
		name: "Ingreso de solicitudes",
		engine: "Power Automate · SharePoint · Teams",
		steps: [
			{ name: "Formulario", rule: "Una sola entrada, sin correos sueltos" },
			{ name: "Clasificación", rule: "Tipo y prioridad según reglas del área" },
			{ name: "Asignación", rule: "Al responsable de turno; urgentes a jefatura" },
			{ name: "Registro", rule: "Queda en la lista con estado y fecha" },
			{ name: "Respuesta", rule: "Aviso por Teams y correo al solicitante" },
		],
		manualStep: 2,
		manualLabel: "Espera a jefatura",
		samples: [
			{ label: "Vacaciones", detail: "M. Pérez · 5 días" },
			{ label: "Acceso a sistema", detail: "R. Soto · ERP" },
			{ label: "Cambio de turno", detail: "A. Rojas · urgente", manual: true },
			{ label: "Reembolso", detail: "C. Díaz · $45.000" },
			{ label: "Equipo nuevo", detail: "L. Vera · notebook", manual: true },
			{ label: "Certificado laboral", detail: "P. Muñoz" },
		],
		hoursPerItem: 0.25,
		processedToday: 64,
		before: { perRequest: "1 día", errors: "5 por semana" },
		after: { perRequest: "3 min" },
	},
	{
		name: "Certificados automáticos",
		engine: "Power Automate · Word · Firma digital",
		steps: [
			{ name: "Datos", rule: "Toma asistencia y notas desde la planilla" },
			{ name: "Validación", rule: "Asistencia mínima 75 % y nota aprobada" },
			{ name: "Documento", rule: "Genera el PDF desde la plantilla oficial" },
			{ name: "Firma", rule: "Firma digital del relator; casos especiales, manual" },
			{ name: "Envío", rule: "Correo a cada participante con copia a RR. HH." },
		],
		manualStep: 3,
		manualLabel: "Firma manual",
		samples: [
			{ label: "Curso Power BI", detail: "12 participantes" },
			{ label: "Inducción seguridad", detail: "8 participantes" },
			{ label: "Excel avanzado", detail: "15 participantes", manual: true },
			{ label: "Taller de liderazgo", detail: "6 participantes" },
			{ label: "Power Apps básico", detail: "10 participantes" },
			{ label: "Primeros auxilios", detail: "20 participantes", manual: true },
		],
		hoursPerItem: 0.6,
		processedToday: 12,
		before: { perRequest: "3 días", errors: "2 por semana" },
		after: { perRequest: "1 min" },
	},
]

export function formatHours(value: number): string {
	return `${value.toLocaleString("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} h`
}
