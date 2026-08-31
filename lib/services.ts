import type { Shape } from "@/components/ascii-icon"
import type { ProjectCategory } from "@/lib/portfolio-data"
import { BarChart3, Code, GraduationCap, Workflow, type LucideIcon } from "lucide-react"

/**
 * Single source of truth for IngSimple's four service lines.
 * Consumed by the navbar dropdown (`nav.tsx`), the home Features grid
 * (`features.tsx`), the footer and the `/servicios/[slug]` pages, so none
 * of them drift. Slugs are intentionally not hardcoded elsewhere —
 * reference `href`/`slug` from here.
 */

export type ServiceInclude = {
	title: string
	desc: string
	/** Optional id of an animated glyph (see `include-glyphs.tsx`); layouts fall back when absent. */
	glyph?: string
	/**
	 * Optional panel heading. The syllabus layout splits its rows into one
	 * panel per group, in first-seen order, so a service can separate what is
	 * taught from how it is delivered instead of numbering both as one list.
	 * Layouts that do not group simply ignore it.
	 */
	group?: string
}

export type ServiceStep = { title: string; desc: string }

export type ServiceFaqItem = { q: string; a: string }

/** Content for the dedicated `/servicios/[slug]` page of a service. */
export type ServicePage = {
	/** SEO title without the site suffix (the layout template appends it). */
	seoTitle: string
	/** Meta description, 140–160 chars, keyword + benefit. */
	seoDescription: string
	/** Serif part of the H1. */
	pageTitle: string
	/** Sans-semibold accent part of the H1. */
	pageTitleAccent: string
	pageSubtitle: string
	/** Pain the service solves, framed from the visitor's side. */
	problem: string
	/** Profiles that should recognize themselves in the page. */
	audience: string[]
	/** Extended "what's included" items — the bulk of indexable content. */
	includes: ServiceInclude[]
	/** How we work: 4–5 steps. */
	process: ServiceStep[]
	/** Closing CTA heading, specific to this service. */
	ctaTitle: string
	/** One-sentence closing CTA body. */
	ctaBody: string
	/** Portfolio category used to pull related case studies. */
	caseCategory: ProjectCategory
	/** Service-specific FAQ, also emitted as FAQPage JSON-LD. */
	faq: ServiceFaqItem[]
}

export type Service = {
	number: string
	/** Short label used as the card meta and in compact contexts. */
	shortName: string
	/** Full title shown in the navbar dropdown. */
	title: string
	/** One-line description for the navbar dropdown. */
	desc: string
	href: string
	/** Clean slug derived from `href`, used for params and the sitemap. */
	slug: string
	/** Lucide icon for the navbar dropdown. */
	icon: LucideIcon
	/** Square artwork shown in the navbar dropdown preview panel. */
	image: string
	/** Benefit-framed heading, reused as the Features card title. */
	featureTitle: string
	/** Benefit-framed body, reused as the Features card body. */
	featureDesc: string
	/** ASCII-icon shape for the Features card. */
	shape: Shape
	/** Short "what's included" points shown in the home services showcase. */
	bullets: string[]
	/** Full content of the dedicated service page. */
	page: ServicePage
}

export const SERVICES: Service[] = [
	{
		number: "01",
		shortName: "Reportabilidad",
		title: "Reportabilidad, Dashboards y Analítica",
		desc: "Dashboards dinámicos y reportes automatizados para decidir con datos.",
		href: "/servicios/reportabilidad",
		slug: "reportabilidad",
		image: "/img/about/power-bi.png",
		icon: BarChart3,
		featureTitle: "Decisiones basadas en datos",
		featureDesc:
			"Centralizamos tus fuentes en dashboards claros y reportes automáticos que actualizan solos.",
		shape: "bars",
		bullets: [
			"Dashboards dinámicos e interactivos",
			"Reportes automatizados que se actualizan solos",
			"Métricas operativas y ejecutivas en un solo lugar",
		],
		page: {
			seoTitle: "Dashboards y Reportabilidad con Power BI",
			seoDescription:
				"Dashboards en Power BI y reportes automatizados para empresas en Chile. Centraliza tus datos y toma decisiones con información siempre al día.",
			pageTitle: "Reportabilidad y dashboards en Power BI",
			pageTitleAccent: "para decidir con datos, no con intuición",
			pageSubtitle:
				"Centralizamos tus fuentes de información en dashboards claros y reportes que se actualizan solos, para que el informe mensual deje de armarse a mano.",
			problem:
				"Los datos existen, pero viven repartidos en planillas, correos y sistemas que no conversan entre sí. Armar el informe del mes toma días, cada área maneja su propia versión de los números y, cuando por fin llega el reporte, la decisión ya se tomó por intuición. La reportabilidad no es un problema de falta de datos: es un problema de orden, automatización y visibilidad.",
			audience: [
				"Gerencias que necesitan visibilidad del negocio sin pedir informes a cada área",
				"Equipos de control de gestión que arman los mismos reportes a mano todos los meses",
				"Operaciones con datos repartidos en planillas y sistemas que no se integran",
				"Empresas que ya acumulan datos, pero todavía no los usan para decidir",
			],
			includes: [
				{
					glyph: "dashboard",
					title: "Dashboards interactivos en Power BI",
					desc: "Tableros dinámicos con filtros, drill-down y vistas por área, diseñados para responder las preguntas reales de tu negocio.",
				},
				{
					glyph: "sources",
					title: "Integración de fuentes de datos",
					desc: "Conectamos planillas, bases de datos, ERPs y APIs en un modelo único, para que todos miren los mismos números.",
				},
				{
					glyph: "report",
					title: "Reportes automatizados",
					desc: "Informes que se generan y distribuyen solos, con la frecuencia que definas: diaria, semanal o mensual.",
				},
				{
					glyph: "kpi",
					title: "Definición de KPIs y métricas",
					desc: "Trabajamos contigo la selección de indicadores: qué medir, cómo calcularlo y contra qué meta compararlo.",
				},
				{
					glyph: "refresh",
					title: "Actualización automática",
					desc: "Los datos se refrescan solos según la programación que necesites. Se acabó el copiar y pegar de cada lunes.",
				},
				{
					glyph: "handoff",
					title: "Entrega y transferencia",
					desc: "Documentamos el modelo y capacitamos a tu equipo para que el dashboard no dependa de nosotros.",
				},
			],
			process: [
				{
					title: "Diagnóstico",
					desc: "Levantamos tus fuentes de datos y las preguntas de negocio que el dashboard debe responder.",
				},
				{
					title: "Modelado de datos",
					desc: "Limpiamos, estructuramos y conectamos las fuentes en un modelo confiable y mantenible.",
				},
				{
					title: "Diseño del dashboard",
					desc: "Construimos los tableros iterando contigo: primero lo esencial, después el detalle.",
				},
				{
					title: "Automatización",
					desc: "Programamos la actualización de datos y la distribución de reportes.",
				},
				{
					title: "Entrega y acompañamiento",
					desc: "Capacitamos a tu equipo y quedamos disponibles para ajustes y evolución.",
				},
			],
			ctaTitle: "¿Listo para decidir con datos?",
			ctaBody:
				"En una conversación de 30 minutos vemos qué fuentes tienes y cómo se vería un dashboard para tu caso.",
			caseCategory: "reportabilidad",
			faq: [
				{
					q: "¿Cuánto tarda tener un dashboard funcionando?",
					a: "Un dashboard típico está listo en 1 a 2 semanas. Si el proyecto requiere integrar muchas fuentes o construir un modelo de datos desde cero, puede tomar más, y te lo decimos con un cronograma claro antes de partir.",
				},
				{
					q: "¿Qué fuentes de datos pueden conectar?",
					a: "Prácticamente cualquiera: planillas Excel y Google Sheets, bases de datos SQL, sistemas ERP, archivos planos y servicios con API. Parte del diagnóstico es justamente revisar qué tienes y cómo se conecta.",
				},
				{
					q: "¿Necesito licencias de Power BI?",
					a: "Depende de cómo tu equipo vaya a consumir los reportes. Te asesoramos en el esquema de licenciamiento que más te conviene antes de comprar nada, para que no pagues de más.",
				},
				{
					q: "¿Quién mantiene el dashboard después de la entrega?",
					a: "Tú decides. Entregamos el modelo documentado y capacitamos a tu equipo para que sea autónomo, y también ofrecemos acompañamiento continuo si prefieres que lo mantengamos nosotros.",
				},
				{
					q: "¿Qué pasa con la confidencialidad de mis datos?",
					a: "Trabajamos con acuerdos de confidencialidad y configuramos permisos por rol: cada persona ve solo lo que le corresponde. Tus datos siguen siendo tuyos y viven en tus cuentas.",
				},
			],
		},
	},
	{
		number: "02",
		shortName: "Capacitaciones",
		title: "Cursos y Capacitaciones",
		desc: "Formación en Power BI, Power Apps, Excel avanzado y más.",
		href: "/servicios/capacitaciones",
		slug: "capacitaciones",
		image: "/img/about/training.png",
		icon: GraduationCap,
		featureTitle: "Equipos más autónomos",
		featureDesc: "Capacitaciones prácticas y a medida para que tu equipo domine sus herramientas.",
		shape: "plus",
		bullets: [
			"Power BI, Power Apps y Excel avanzado",
			"Ejercicios y casos prácticos reales",
			"Acompañamiento continuo post-capacitación",
		],
		page: {
			seoTitle: "Capacitaciones en Power BI, Power Apps y Excel",
			seoDescription:
				"Capacitación práctica en Power BI, Power Apps y Excel avanzado para equipos en Chile, online o presencial. Programas a medida con datos reales.",
			pageTitle: "Capacitaciones en Power BI y Excel",
			pageTitleAccent: "que hacen a tu equipo autónomo",
			pageSubtitle:
				"Programas prácticos y a medida, con ejercicios sobre datos reales de tu operación, para que tu equipo deje de depender de terceros en cada reporte.",
			problem:
				"Tu empresa ya paga por herramientas potentes —Excel, Power BI, Power Apps— pero el equipo las usa a una fracción de su potencial. Los reportes dependen de una sola persona, cada análisis nuevo se externaliza y el conocimiento no queda en la organización. Un curso genérico no arregla eso: se olvida a la semana porque no se conecta con el trabajo real de cada uno.",
			audience: [
				"Equipos que usan Excel o Power BI muy por debajo de su potencial",
				"Áreas donde los reportes dependen de una sola persona",
				"Empresas que externalizan cada análisis por falta de capacidades internas",
				"Jefaturas que quieren subir el nivel de análisis de su equipo",
			],
			includes: [
				{
					group: "Temario",
					title: "Power BI de básico a avanzado",
					desc: "Desde conectar la primera fuente hasta modelado, DAX y publicación de dashboards para toda la organización.",
				},
				{
					group: "Temario",
					title: "Excel avanzado",
					desc: "Tablas dinámicas, Power Query, funciones avanzadas y automatización de tareas repetitivas dentro de la planilla.",
				},
				{
					group: "Temario",
					title: "Power Apps y Power Automate",
					desc: "Construcción de aplicaciones y flujos de trabajo sin código, para digitalizar procesos internos con lo que ya tienes.",
				},
				{
					group: "Cómo lo dictamos",
					title: "Programas a medida",
					desc: "Diseñamos el contenido según el nivel real del equipo y los problemas concretos de tu operación. Nada de temarios genéricos.",
				},
				{
					group: "Cómo lo dictamos",
					title: "Ejercicios con tus datos",
					desc: "Los casos prácticos se arman con información de tu propia operación, para que lo aprendido se aplique al día siguiente.",
				},
				{
					group: "Cómo lo dictamos",
					title: "Acompañamiento post-curso",
					desc: "Material de apoyo y un canal de consultas después de las sesiones, para resolver dudas cuando aparecen de verdad.",
				},
			],
			process: [
				{
					title: "Diagnóstico de nivel",
					desc: "Evaluamos el punto de partida del equipo y los casos de uso donde la capacitación genera más impacto.",
				},
				{
					title: "Diseño del programa",
					desc: "Armamos el temario, la modalidad y el calendario a la medida de tu equipo.",
				},
				{
					title: "Sesiones prácticas",
					desc: "Clases con ejercicios guiados sobre datos reales, en grupos acotados para que nadie se quede atrás.",
				},
				{
					title: "Aplicación real",
					desc: "Cerramos con un caso aplicado a tu operación: el equipo construye algo que queda funcionando.",
				},
				{
					title: "Acompañamiento",
					desc: "Seguimiento posterior para consolidar lo aprendido y resolver dudas del uso diario.",
				},
			],
			ctaTitle: "¿Listo para que tu equipo sea autónomo?",
			ctaBody:
				"En una conversación de 30 minutos revisamos el nivel de tu equipo y te proponemos un programa a su medida.",
			caseCategory: "capacitaciones",
			faq: [
				{
					q: "¿Las capacitaciones son presenciales u online?",
					a: "Ofrecemos ambas modalidades. Las sesiones online funcionan muy bien para equipos distribuidos, y las presenciales para grupos en una misma ubicación. Elegimos el formato contigo según tu equipo.",
				},
				{
					q: "¿Qué nivel previo necesita mi equipo?",
					a: "Ninguno en particular. El programa parte de un diagnóstico de nivel, así que adaptamos el ritmo y el contenido al punto de partida real de cada grupo.",
				},
				{
					q: "¿Cuántas personas pueden participar?",
					a: "Recomendamos grupos acotados para que la práctica sea efectiva y todos avancen. Si tu equipo es grande, lo dividimos en cohortes con el mismo programa.",
				},
				{
					q: "¿Los ejercicios usan datos de mi empresa?",
					a: "Sí, siempre que sea posible. Trabajar con tus propios datos es lo que hace que la capacitación se traduzca en resultados inmediatos, no en teoría.",
				},
				{
					q: "¿Qué pasa después del curso?",
					a: "El material y los ejercicios quedan para el equipo, y mantenemos un canal de consultas post-capacitación. La meta es que la autonomía se sostenga en el tiempo.",
				},
			],
		},
	},
	{
		number: "03",
		shortName: "Soluciones Web",
		title: "Soluciones Web",
		desc: "Sitios y sistemas web modernos, rápidos y a medida.",
		href: "/servicios/soluciones-web",
		slug: "soluciones-web",
		image: "/img/about/web.png",
		icon: Code,
		featureTitle: "Presencia digital a medida",
		featureDesc: "Sitios y sistemas web modernos, rápidos y pensados para tus procesos.",
		shape: "scan",
		bullets: [
			"Landing pages y sitios corporativos",
			"Portales y sistemas web a medida",
			"Enfoque en experiencia de usuario y performance",
		],
		page: {
			seoTitle: "Desarrollo web a medida y sitios corporativos",
			seoDescription:
				"Desarrollo web a medida en Chile: sitios corporativos, portales y sistemas de gestión modernos, rápidos y diseñados para tus procesos reales.",
			pageTitle: "Desarrollo web a medida",
			pageTitleAccent: "para tus procesos reales",
			pageSubtitle:
				"Sitios corporativos, portales y sistemas de gestión construidos desde cero para tu operación: rápidos, mantenibles y en producción, no en promesas.",
			problem:
				"La operación creció y las herramientas no acompañaron: planillas compartidas, aprobaciones por correo, información en WhatsApp y un software genérico que obliga a torcer el proceso para que calce. El resultado es tiempo perdido, errores difíciles de rastrear y una imagen digital que no refleja lo que la empresa realmente es. Un sistema a medida invierte esa ecuación: la herramienta se adapta a tu proceso, no al revés.",
			audience: [
				"Empresas que operan con planillas, correo y WhatsApp y ya tocaron techo",
				"Negocios donde el software genérico no calza con el proceso real",
				"Marcas con un sitio desactualizado que no genera confianza ni contactos",
				"Equipos que necesitan un portal interno con roles, permisos y trazabilidad",
			],
			includes: [
				{
					title: "Sitios corporativos y landing pages",
					desc: "Presencia digital rápida, cuidada y orientada a generar contactos, con SEO técnico desde el primer commit.",
				},
				{
					title: "Sistemas de gestión a medida",
					desc: "Plataformas que digitalizan tu proceso completo: órdenes de trabajo, inventarios, operaciones, lo que tu negocio necesite.",
				},
				{
					title: "Portales con roles y permisos",
					desc: "Cada usuario ve y hace solo lo que le corresponde, con trazabilidad de cada acción.",
				},
				{
					title: "Integraciones y APIs",
					desc: "Conectamos el sistema con tus herramientas actuales: ERP, facturación, correo, pasarelas y servicios externos.",
				},
				{
					title: "Performance y experiencia de usuario",
					desc: "Interfaces rápidas y claras que la gente entiende sin manual. La adopción es parte del diseño, no un accidente.",
				},
				{
					title: "Puesta en producción y soporte",
					desc: "Despliegue, monitoreo y evolución continua. Entregamos software funcionando, no un zip con código.",
				},
			],
			process: [
				{
					title: "Levantamiento",
					desc: "Entendemos tu proceso real, sus dolores y qué debe resolver el sistema primero.",
				},
				{
					title: "Propuesta y diseño",
					desc: "Definimos alcance, prioridades y prototipo de la solución antes de escribir código.",
				},
				{
					title: "Desarrollo iterativo",
					desc: "Construimos por etapas con entregas frecuentes: ves avance real desde las primeras semanas.",
				},
				{
					title: "Puesta en producción",
					desc: "Migramos datos, capacitamos a los usuarios y acompañamos la salida en vivo.",
				},
				{
					title: "Evolución continua",
					desc: "El sistema crece con tu operación: nuevas funciones, integraciones y mejoras.",
				},
			],
			ctaTitle: "¿Listo para una herramienta que calce con tu proceso?",
			ctaBody:
				"En una conversación de 30 minutos entendemos tu operación y te decimos por dónde empezar y con qué alcance.",
			caseCategory: "desarrollo-web",
			faq: [
				{
					q: "¿Cómo cotizan un proyecto web?",
					a: "Partimos con una conversación de diagnóstico gratuita para entender qué necesitas. Con eso preparamos una propuesta con alcance, etapas y cronograma claros, antes de comprometer nada.",
				},
				{
					q: "¿Cuánto tarda un proyecto?",
					a: "Un sitio corporativo o landing puede estar en producción en pocas semanas. Un sistema de gestión a medida se construye por etapas: la primera versión útil suele salir en uno a tres meses según el alcance.",
				},
				{
					q: "¿Se puede integrar con los sistemas que ya uso?",
					a: "Sí. Integramos con ERPs, sistemas de facturación, servicios de correo y cualquier plataforma que exponga una API. Revisamos las integraciones necesarias durante el levantamiento.",
				},
				{
					q: "¿Qué pasa después del lanzamiento?",
					a: "No desaparecemos. Ofrecemos soporte, monitoreo y evolución continua: la mayoría de nuestros sistemas en producción siguen creciendo con nuevas funciones a medida que la operación lo pide.",
				},
				{
					q: "¿Rediseñan sitios existentes?",
					a: "Sí. Auditamos lo que tienes, rescatamos lo que sirve y reconstruimos lo que frena: velocidad, SEO, diseño o arquitectura de contenido.",
				},
			],
		},
	},
	{
		number: "04",
		shortName: "Automatizaciones",
		title: "Automatizaciones de procesos",
		desc: "Automatizamos tareas y flujos repetitivos para ganar eficiencia.",
		href: "/servicios/automatizaciones",
		slug: "automatizaciones",
		image: "/img/about/power-platform.png",
		icon: Workflow,
		featureTitle: "Menos tareas manuales",
		featureDesc:
			"Automatizamos flujos repetitivos para reducir errores y liberar tiempo del equipo.",
		shape: "bolt",
		bullets: [
			"Automatización de tareas y flujos repetitivos",
			"Integración de datos entre tus sistemas",
			"Menos errores y más tiempo para tu equipo",
		],
		page: {
			seoTitle: "Automatización de procesos para empresas",
			seoDescription:
				"Automatizamos tareas repetitivas y conectamos tus sistemas: aprobaciones, reportes e integraciones sin errores manuales, para empresas en Chile.",
			pageTitle: "Automatización de procesos",
			pageTitleAccent: "que le devuelve horas a tu equipo",
			pageSubtitle:
				"Convertimos tareas repetitivas —copiar datos, pedir aprobaciones, armar documentos— en flujos automáticos que corren solos y sin errores.",
			problem:
				"Cada día tu equipo pierde horas en trabajo que una máquina haría mejor: copiar datos de un sistema a otro, perseguir aprobaciones por correo, armar el mismo documento una y otra vez. Además del tiempo, cada paso manual es una oportunidad de error que después cuesta encontrar y corregir. Ese trabajo repetitivo no escala contratando más gente: escala automatizando el proceso.",
			audience: [
				"Equipos que copian y pegan información entre sistemas todos los días",
				"Aprobaciones y solicitudes que viven en correos y planillas compartidas",
				"Procesos con errores de digitación que cuestan tiempo y dinero",
				"Empresas que quieren escalar sin contratar solo para tareas repetitivas",
			],
			includes: [
				{
					title: "Flujos de aprobación",
					glyph: "approval",
					desc: "Solicitudes, visados y aprobaciones con reglas claras, notificaciones automáticas y registro de cada paso.",
				},
				{
					title: "Integración entre sistemas",
					glyph: "integration",
					desc: "Conectamos tus plataformas para que los datos fluyan solos, sin doble digitación ni planillas puente.",
				},
				{
					title: "Documentos y reportes automáticos",
					glyph: "documents",
					desc: "Contratos, certificados e informes que se generan y envían solos a partir de tus datos.",
				},
				{
					title: "Formularios y apps internas",
					glyph: "forms",
					desc: "Capturamos la información en la fuente con formularios y aplicaciones simples, en vez de papel o planillas sueltas.",
				},
				{
					title: "Notificaciones y alertas",
					glyph: "alerts",
					desc: "Avisos automáticos cuando algo requiere atención: vencimientos, quiebres de stock, tareas pendientes.",
				},
				{
					title: "Monitoreo de flujos",
					glyph: "monitoring",
					desc: "Cada automatización queda con manejo de errores y visibilidad de su ejecución, para que sepas que está corriendo bien.",
				},
			],
			process: [
				{
					title: "Mapeo del proceso",
					desc: "Documentamos el proceso actual paso a paso y detectamos dónde se pierde el tiempo.",
				},
				{
					title: "Diseño del flujo",
					desc: "Definimos qué se automatiza, con qué herramienta y qué reglas de negocio aplican.",
				},
				{
					title: "Implementación",
					desc: "Construimos el flujo y lo conectamos con tus sistemas y datos reales.",
				},
				{
					title: "Pruebas con tu equipo",
					desc: "Validamos con los usuarios reales antes de encender nada en producción.",
				},
				{
					title: "Puesta en marcha",
					desc: "Activamos el flujo con monitoreo y acompañamiento durante las primeras semanas.",
				},
			],
			ctaTitle: "¿Listo para recuperar esas horas?",
			ctaBody:
				"En una conversación de 30 minutos identificamos el proceso que más tiempo te quita y cómo automatizarlo.",
			caseCategory: "power-platform",
			faq: [
				{
					q: "¿Qué procesos se pueden automatizar?",
					a: "Casi cualquier tarea repetitiva con reglas claras: aprobaciones, traspaso de datos entre sistemas, generación de documentos, notificaciones, consolidación de reportes. Si tu equipo lo hace igual todas las semanas, probablemente se puede automatizar.",
				},
				{
					q: "¿Se integra con mi ERP u otros sistemas?",
					a: "Sí. Trabajamos con conectores existentes y con APIs para integrar ERPs, sistemas de facturación, correo y bases de datos. En el mapeo inicial revisamos qué expone cada sistema.",
				},
				{
					q: "¿Solo trabajan con herramientas de Microsoft?",
					a: "No. Power Automate y Power Apps son un excelente punto de partida cuando ya tienes Microsoft 365, pero elegimos la herramienta según tu caso, no al revés.",
				},
				{
					q: "¿Cuánto tarda implementar una automatización?",
					a: "Un flujo acotado puede quedar operando en días. Procesos más complejos, con varias integraciones, toman semanas. Siempre partimos por el flujo que más tiempo libera.",
				},
				{
					q: "¿Qué pasa si un flujo falla?",
					a: "Todo flujo se entrega con manejo de errores, reintentos y alertas: si algo falla, el equipo se entera de inmediato y el proceso tiene un plan B definido, no un silencio.",
				},
			],
		},
	},
]

/** Find a service by its page slug, or undefined if it doesn't exist. */
export function getServiceBySlug(slug: string): Service | undefined {
	return SERVICES.find((service) => service.slug === slug)
}
