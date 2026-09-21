import type {
	CaseStudyFeature,
	CaseStudyMetric,
	CaseStudyTechItem,
	ProjectCategory,
	ProjectData,
} from "@/lib/portfolio-data"

type DraftCase = {
	id: string
	title: string
	category: ProjectCategory
	clientName: string
	clientIndustry: string
	description: string
	problem: string
	solution: string
	technologies: string[]
	features: CaseStudyFeature[]
	beforeAfter: Array<{ before: string; after: string }>
	metrics?: CaseStudyMetric[]
}

const reviewMetric: CaseStudyMetric = {
	value: "Por validar",
	label: "indicadores y resultados",
	caption: "Se incorporarán cifras confirmadas antes de publicar el caso final.",
}

function techStack(technologies: string[]): CaseStudyTechItem[] {
	return technologies.map((name) => ({
		name,
		reason:
			"Tecnología registrada en el levantamiento inicial; validar la decisión técnica y su alcance antes de publicar.",
	}))
}

function createDraftCase(draft: DraftCase): ProjectData {
	return {
		id: draft.id,
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: draft.title,
		shortDescription: draft.description,
		fullDescription: draft.solution,
		category: draft.category,
		technologies: draft.technologies,
		gradientColor: "#64748b",
		isFlagship: true,
		isProduction: false,
		caseStudy: {
			visualPrivacy: "confidential-ui",
			seoLabel: draft.title,
			pitch: draft.description,
			duration: "Duración por confirmar",
			inProductionSince: "Caso en revisión interna",
			clientName: draft.clientName,
			clientIndustry: draft.clientIndustry,
			problem: [draft.problem],
			solution: [draft.solution],
			architectureDescription:
				"Arquitectura y flujo técnico en revisión. Esta ficha se publica para validar el relato del caso antes de incorporar detalles de implementación confirmados.",
			techStackDetailed: techStack(draft.technologies),
			features: draft.features,
			metrics: draft.metrics ?? [reviewMetric],
			beforeAfter: draft.beforeAfter,
		},
	}
}

/**
 * Casos incorporados para revisión editorial. Se ven en /casos, pero conservan
 * "Caso en revisión interna" y no declaran resultados ni datos no confirmados.
 */
export const casesUnderReview: ProjectData[] = [
	createDraftCase({
		id: "presupuesto-capex-opex",
		title: "Automatización de presupuesto Capex y Opex",
		category: "power-platform",
		clientName: "Empresa industrial confidencial",
		clientIndustry: "Transporte de hidrocarburos",
		description:
			"Plantilla de Excel con macros para estandarizar la preparación de presupuestos por rol.",
		problem:
			"Cada área actualizaba su presupuesto en Excel sin una plantilla común ni una validación automática de cuentas existentes.",
		solution:
			"La solución entrega perfiles Capex, Ingreso/Opex y Resumen, con guardado inteligente, autocompletado y protección de la estructura del archivo.",
		technologies: ["Excel", "VBA"],
		features: [
			{
				title: "Guardado inteligente",
				description: "Actualiza o crea el registro correspondiente según la cuenta.",
			},
			{
				title: "Autocompletado",
				description: "Carga datos ya registrados al seleccionar una cuenta.",
			},
			{
				title: "Perfiles por rol",
				description: "Muestra las hojas y módulos pertinentes a cada responsable.",
			},
		],
		beforeAfter: [
			{
				before: "Planillas separadas por responsable",
				after: "Plantilla común con flujo estandarizado",
			},
			{ before: "Validación manual de cuentas", after: "Búsqueda y guardado automatizados" },
		],
	}),
	createDraftCase({
		id: "calculo-crudo",
		title: "Automatización de cálculos de crudo",
		category: "power-platform",
		clientName: "Cliente por confirmar",
		clientIndustry: "Consultoría y operación de crudo",
		description:
			"Planilla automatizada para ejecutar transformaciones de cálculo de crudo a escala.",
		problem:
			"El proceso concentraba cálculos y transformaciones repetitivas en planillas que requerían ejecución y revisión manual.",
		solution:
			"La automatización procesa más de 1.000 medidas de transformación en un flujo repetible y preparado para revisión.",
		technologies: ["Excel", "VBA"],
		features: [
			{
				title: "Motor de transformación",
				description: "Ejecuta las reglas de cálculo definidas para la información de crudo.",
			},
			{
				title: "Catálogo de medidas",
				description: "Organiza las medidas de transformación incorporadas al proceso.",
			},
			{
				title: "Salida consolidada",
				description: "Deja el resultado disponible para revisión posterior.",
			},
		],
		metrics: [
			{
				value: "1.000+",
				label: "medidas de transformación",
				caption: "Dato entregado por el equipo; pendiente de validación editorial.",
			},
		],
		beforeAfter: [
			{ before: "Transformaciones repetitivas", after: "Proceso automatizado y repetible" },
			{ before: "Revisión manual de medidas", after: "Flujo consolidado para procesar cálculos" },
		],
	}),
	createDraftCase({
		id: "informes-inspectores-buques",
		title: "Informes de inspectores y buques",
		category: "power-platform",
		clientName: "Cliente por confirmar",
		clientIndustry: "Inspección y operación de combustible",
		description:
			"Aplicación para registrar informes de inspectores y datos de buques, con reportería automática.",
		problem:
			"Los registros y consultas estaban distribuidos en fuentes separadas, haciendo lenta la consolidación para seguimiento.",
		solution:
			"Power Apps centraliza el registro y Power BI transforma los datos disponibles en reportería para la gestión.",
		technologies: ["Power Apps", "Power BI"],
		features: [
			{
				title: "Registro de informes",
				description: "Captura información de desempeño de inspectores en un formato común.",
			},
			{
				title: "Registro de buques",
				description: "Organiza los antecedentes requeridos para el seguimiento operacional.",
			},
			{
				title: "Reportería",
				description: "Presenta los registros disponibles en vistas de gestión.",
			},
		],
		beforeAfter: [
			{ before: "Fuentes separadas", after: "Aplicación centralizada para registro y consulta" },
			{ before: "Consolidación manual", after: "Reportería automática" },
		],
	}),
	createDraftCase({
		id: "last-estimate",
		title: "Automatización Last Estimate",
		category: "power-platform",
		clientName: "Empresa confidencial",
		clientIndustry: "Gestión financiera multiunidad",
		description:
			"Automatización del ingreso y actualización de Last Estimate por unidad de negocio.",
		problem:
			"Los datos se ingresaban cuenta por cuenta y los subtotales se recalculaban por separado al cambiar de unidad o período.",
		solution:
			"Una hoja de ingreso carga los valores existentes, crea registros nuevos cuando corresponde y recalcula subtotales automáticamente.",
		technologies: ["Excel", "VBA"],
		features: [
			{
				title: "Carga por unidad y período",
				description: "Recupera valores guardados al elegir la unidad de negocio y el mes.",
			},
			{
				title: "Guardado seguro",
				description: "Actualiza el registro correcto sin sobrescribir otras filas.",
			},
			{
				title: "Recálculo de subtotales",
				description: "Actualiza los resultados con la información recién cargada.",
			},
		],
		beforeAfter: [
			{ before: "Ingreso manual por cuenta", after: "Carga y guardado automatizados" },
			{ before: "Subtotales recalculados aparte", after: "Recálculo automático" },
		],
	}),
	createDraftCase({
		id: "stock-estanques-crudo",
		title: "Stock de estanques y movimientos de crudo",
		category: "reportabilidad",
		clientName: "Cliente por confirmar",
		clientIndustry: "Operación industrial",
		description:
			"Reportería para revisar inventario de estanques y movimientos de crudo en planta.",
		problem:
			"El seguimiento requería reunir datos operacionales desde distintas fuentes, con baja visibilidad sobre existencias y variaciones.",
		solution:
			"La reportería reúne stock y movimientos para apoyar el monitoreo operacional; la plataforma técnica se confirmará con el equipo.",
		technologies: ["Power BI"],
		features: [
			{
				title: "Vista de stock",
				description: "Muestra la disponibilidad y estado de inventario por estanque.",
			},
			{
				title: "Movimientos de crudo",
				description: "Consolida movimientos operacionales para consulta.",
			},
			{
				title: "Filtros operacionales",
				description: "Permite revisar por período, estanque u otros criterios validados.",
			},
		],
		beforeAfter: [
			{
				before: "Datos operacionales dispersos",
				after: "Vista consolidada de stock y movimientos",
			},
			{ before: "Seguimiento manual", after: "Base de análisis operacional" },
		],
	}),
	createDraftCase({
		id: "reporteria-laboratorios",
		title: "Reportería de laboratorios",
		category: "reportabilidad",
		clientName: "Empresa de servicios de laboratorio",
		clientIndustry: "Laboratorios",
		description: "Reportería de gestión de laboratorios implementada sobre Power BI y Excel.",
		problem:
			"Los datos requerían consolidación y preparación antes de analizarlos, retrasando el acceso a reportes de gestión.",
		solution:
			"La solución combina Power BI y Excel para organizar datos, presentar tendencias y habilitar el detalle operativo.",
		technologies: ["Power BI", "Excel"],
		features: [
			{
				title: "Consolidación de datos",
				description: "Reúne la información necesaria para preparar la reportería.",
			},
			{
				title: "Dashboard de gestión",
				description: "Presenta indicadores y tendencias en una vista navegable.",
			},
			{
				title: "Salida en Excel",
				description: "Facilita el acceso a detalle operativo cuando se requiere.",
			},
		],
		beforeAfter: [
			{ before: "Preparación manual", after: "Reportes consolidados" },
			{ before: "Datos en múltiples planillas", after: "Vista de gestión" },
		],
	}),
	createDraftCase({
		id: "reporteria-contabilidad-cobranzas",
		title: "Reportería de contabilidad y cobranzas",
		category: "reportabilidad",
		clientName: "Cliente por confirmar",
		clientIndustry: "Servicios corporativos",
		description: "Reportería para consolidar información de contabilidad y cobranzas.",
		problem:
			"La información estaba distribuida entre fuentes operativas, dificultando el seguimiento periódico de saldos, estados y prioridades.",
		solution:
			"La reportería organiza la información relevante para apoyar el análisis y seguimiento, sin exponer datos financieros sensibles.",
		technologies: ["Power BI"],
		features: [
			{
				title: "Consolidación contable",
				description: "Reúne los antecedentes necesarios para la reportería.",
			},
			{
				title: "Seguimiento de cobranzas",
				description: "Organiza información para revisar estados y pendientes.",
			},
			{
				title: "Indicadores de gestión",
				description: "Presenta métricas acordadas para el análisis periódico.",
			},
		],
		beforeAfter: [
			{ before: "Información financiera distribuida", after: "Reportería consolidada" },
			{ before: "Priorización manual", after: "Información ordenada para seguimiento" },
		],
	}),
	createDraftCase({
		id: "sistema-gestion-integral",
		title: "Sistema de gestión integral",
		category: "desarrollo-web",
		clientName: "Empresa de turismo receptivo",
		clientIndustry: "Turismo",
		description: "Sistema web para centralizar el registro de ventas, operación y gastos.",
		problem:
			"Las áreas gestionaban ventas, operación y gastos en procesos separados, reduciendo la trazabilidad y la visión integrada.",
		solution:
			"La aplicación reúne los flujos clave de la organización en un sistema de gestión; el stack definitivo se validará antes de publicación.",
		technologies: ["Next.js", "TypeScript"],
		features: [
			{
				title: "Registro de ventas",
				description: "Centraliza la información comercial requerida por la organización.",
			},
			{
				title: "Gestión de operación",
				description: "Organiza los datos operativos necesarios para seguimiento.",
			},
			{
				title: "Registro de gastos",
				description: "Permite registrar y consultar gastos en el mismo sistema.",
			},
		],
		beforeAfter: [
			{ before: "Procesos separados", after: "Sistema integrado" },
			{ before: "Traspaso manual de datos", after: "Registro centralizado" },
		],
	}),
	createDraftCase({
		id: "relacionamiento-comunitario",
		title: "App de relacionamiento comunitario",
		category: "desarrollo-web",
		clientName: "Cadena de retail multinacional",
		clientIndustry: "Retail",
		description:
			"Aplicación interna para registrar y consultar actividades de relacionamiento comunitario.",
		problem:
			"El proceso requería una forma común de capturar, organizar y consultar información para múltiples usuarios, sin exponer datos sensibles.",
		solution:
			"La aplicación entrega un registro estructurado con trazabilidad y acceso para aproximadamente 200 usuarios; nombres y pantallas reales siguen restringidos.",
		technologies: ["Next.js", "TypeScript"],
		features: [
			{
				title: "Registro de actividades",
				description: "Ingresa antecedentes en un formato común.",
			},
			{
				title: "Consulta y trazabilidad",
				description: "Facilita revisar registros e historial según permisos.",
			},
			{
				title: "Gestión de usuarios",
				description: "Considera el uso de la aplicación por múltiples perfiles.",
			},
		],
		metrics: [
			{
				value: "200",
				label: "usuarios de la aplicación",
				caption: "Dato entregado por el equipo; no publicar datos sensibles.",
			},
		],
		beforeAfter: [
			{ before: "Canales no centralizados", after: "Aplicación común de registro y consulta" },
			{ before: "Seguimiento manual", after: "Información estructurada y trazable" },
		],
	}),
	createDraftCase({
		id: "cursos-power-platform",
		title: "Cursos de especialización en Power Platform",
		category: "capacitaciones",
		clientName: "Equipos de distintas empresas",
		clientIndustry: "Capacitación corporativa",
		description: "Cursos de especialización en Power Apps, Power Automate y Microsoft 365.",
		problem:
			"Los equipos buscaban fortalecer capacidades aplicadas para automatizar procesos y aprovechar el ecosistema Microsoft 365.",
		solution:
			"La formación organiza contenidos de Power Platform en módulos y ejercicios aplicables al trabajo diario; cada edición se validará con el equipo.",
		technologies: ["Power Apps", "Power Automate", "Microsoft 365"],
		features: [
			{ title: "Power Apps", description: "Introduce la creación de aplicaciones de negocio." },
			{
				title: "Power Automate",
				description: "Aborda la automatización de flujos y tareas repetitivas.",
			},
			{
				title: "Ejercicios aplicados",
				description: "Permite practicar contenidos en escenarios cercanos al trabajo diario.",
			},
		],
		beforeAfter: [
			{ before: "Brechas de conocimiento", after: "Ruta de aprendizaje aplicada" },
			{ before: "Aprendizaje aislado", after: "Módulos y ejercicios organizados" },
		],
	}),
]
