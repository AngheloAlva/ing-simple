export type ProjectCategory =
	| "desarrollo-web"
	| "power-platform"
	| "capacitaciones"
	| "reportabilidad"

export interface CaseStudyMetric {
	value: string
	label: string
	caption?: string
}

export interface CaseStudyTechItem {
	name: string
	reason: string
}

export interface CaseStudyFeature {
	title: string
	description: string
}

export interface CaseStudyTestimonial {
	quote: string
	author: string
	role: string
	company: string
}

export type CaseStudyMilestoneIcon = "kickoff" | "build" | "beta" | "launch" | "current"

export interface CaseStudyMilestone {
	date: string
	title: string
	description: string
	icon: CaseStudyMilestoneIcon
	isCurrent?: boolean
}

export interface CaseStudy {
	pitch: string
	duration: string
	inProductionSince: string
	clientName: string
	clientIndustry: string
	problem: string[]
	solution: string[]
	architectureDescription: string
	techStackDetailed: CaseStudyTechItem[]
	features: CaseStudyFeature[]
	metrics: CaseStudyMetric[]
	timeline?: CaseStudyMilestone[]
	testimonial?: CaseStudyTestimonial
}

export interface ProjectData {
	id: string
	imageUrl: string
	title: string
	shortDescription: string
	fullDescription: string
	category: ProjectCategory
	technologies: string[]
	liveUrl?: string
	githubUrl?: string
	gradientColor?: string
	isFlagship?: boolean
	caseStudy?: CaseStudy
}

export const CATEGORY_LABELS: Record<"todos" | ProjectCategory, string> = {
	"todos": "Todos",
	"desarrollo-web": "Desarrollo Web",
	"power-platform": "Power Platform",
	"capacitaciones": "Capacitaciones",
	"reportabilidad": "Reportabilidad",
}

export const portfolioProjects: ProjectData[] = [
	// ── Desarrollo Web ──
	{
		id: "otc-360",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "OTC 360",
		shortDescription: "Sistema de gestión de órdenes de trabajo y seguridad laboral",
		fullDescription:
			"Plataforma integral de control operacional para gestión de órdenes de trabajo, permisos de trabajo, bitácoras de obra y charlas de seguridad. Incluye generación de PDFs, almacenamiento en Azure, autenticación robusta y dashboards con métricas en tiempo real.",
		category: "desarrollo-web",
		technologies: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Prisma",
			"PostgreSQL",
			"Better Auth",
			"TanStack Query",
			"Recharts",
			"Azure Storage",
			"Zustand",
			"React PDF",
			"Zod",
		],
		liveUrl: "https://otc360.cl",
		gradientColor: "#0f766e",
		isFlagship: true,
		caseStudy: {
			pitch:
				"Plataforma de control operacional que reemplazó papel, correos y Excel por un único sistema para gestionar órdenes de trabajo, permisos, planes de mantenimiento y carpetas de contratistas, con indicadores en vivo.",
			duration: "≈3 meses de desarrollo, con visitas en planta en Concepción",
			inProductionSince: "Abril 2025",
			clientName: "OTC — Oleoducto Trasandino Chile",
			clientIndustry: "Recepción, almacenamiento y transporte de petróleo",
			problem: [
				"OTC opera la recepción, almacenamiento y transporte de petróleo a través de un oleoducto transandino entre Chile y Argentina, atendiendo a clientes como ENAP. En planta conviven el equipo interno y múltiples empresas contratistas trabajando cada día.",
				"Antes de OTC 360, el control operacional vivía repartido en tres lugares: papel para libros de obra y permisos de trabajo, correo para coordinar requerimientos, y Excel para el resto. Las carpetas de arranque con documentación de contratistas no tenían un repositorio único; los equipos y las OTs se gestionaban en MP10; los indicadores se armaban a mano cada vez que alguien los pedía.",
				"El resultado: trazabilidad débil de quién trabajó, qué se hizo, con qué permiso y en qué fecha, y prácticamente nula visibilidad consolidada para gerencia.",
			],
			solution: [
				"OTC 360 unifica el ciclo completo de trabajo en una sola plataforma web, accesible tanto para el equipo interno como para las empresas contratistas externas. Cada solicitud, orden, permiso y plan de mantenimiento vive en el mismo sistema, con la documentación de respaldo asociada y los actores correctamente identificados.",
				"La plataforma integra cerca de 20 módulos que cubren toda la operación end-to-end: gestión de equipos y ubicaciones con jerarquía, órdenes de trabajo, permisos, planes de mantenimiento preventivo, programación visual tipo Gantt, control de contratistas, indicadores y reportería, auditoría y trazabilidad, entre otros. Todo conectado nativamente — sin integraciones frágiles, sin planillas paralelas, sin exportar datos para analizarlos afuera.",
				"Hoy la plataforma la usan en promedio decenas de personas al día, con peaks de ~80 usuarios en una jornada alta, mezclando staff de OTC y contratistas externos en el mismo flujo.",
			],
			architectureDescription:
				"Frontend en Next.js con TypeScript estricto, autenticación por sesión con Better Auth, persistencia en PostgreSQL vía Prisma, almacenamiento de documentos en Azure Blob Storage —aprovechando el tenant Microsoft que el cliente ya tenía— y generación de PDFs server-side para reportes y permisos. El módulo de indicadores se construye con Recharts a partir de queries SQL que cruzan OTs, planes y solicitudes en vivo.",
			techStackDetailed: [
				{
					name: "Next.js + TypeScript",
					reason:
						"App Router para mezclar páginas server-rendered (listados grandes, dashboards) con interacciones cliente, y tipos estrictos en cada capa para reducir bugs en una operación crítica.",
				},
				{
					name: "Prisma + PostgreSQL",
					reason:
						"Modelo relacional limpio para entidades fuertemente vinculadas (OTs ↔ permisos ↔ planes ↔ usuarios) y migraciones versionadas para iterar sin romper datos en producción.",
				},
				{
					name: "Better Auth",
					reason:
						"Sesiones server-side con control completo del flujo de invitaciones a contratistas externos, sin lock-in a un proveedor SaaS de identidad.",
				},
				{
					name: "Azure Blob Storage",
					reason:
						"OTC ya operaba sobre tenant Microsoft, así que la documentación de carpetas de arranque queda dentro del mismo dominio de seguridad y respaldo del cliente.",
				},
				{
					name: "TanStack Query",
					reason:
						"Cache, revalidación e invalidaciones quirúrgicas para tablas grandes de OTs y permisos que se editan concurrentemente entre internos y contratistas.",
				},
				{
					name: "Recharts",
					reason:
						"Gráficos componibles para el módulo de indicadores, que se arma dinámicamente cruzando OTs, planes de mantenimiento y solicitudes.",
				},
				{
					name: "React PDF + Zod",
					reason:
						"Permisos y reportes oficiales generados server-side a partir de datos validados extremo a extremo, listos para imprimir o adjuntar.",
				},
				{
					name: "Zustand",
					reason:
						"Estado UI ligero (filtros activos, vistas, drawers) sin acoplar a la capa de datos remota.",
				},
			],
			features: [
				{
					title: "Órdenes de Trabajo",
					description:
						"Ciclo completo de creación, asignación, ejecución y cierre, con la documentación y permisos asociados en el mismo registro.",
				},
				{
					title: "Carpetas de Arranque",
					description:
						"Repositorio único de documentación de contratistas, trabajadores y equipos, accesible para auditoría antes de habilitar trabajos en planta.",
				},
				{
					title: "Permisos de Trabajo",
					description:
						"Reemplazo digital del libro de obras en papel, con generación de PDF firmable y vinculación directa a la OT que lo origina.",
				},
				{
					title: "Planes de Mantenimiento",
					description:
						"Programación recurrente de mantenciones preventivas, con derivación automática a OTs cuando corresponde ejecutar.",
				},
				{
					title: "Solicitudes de Trabajo",
					description:
						"Canal único para que internos y contratistas levanten requerimientos, con seguimiento de estado y conversión a OT.",
				},
				{
					title: "Indicadores",
					description:
						"Dashboard tipo Power BI alimentado en tiempo real por OTs, planes de mantenimiento y solicitudes, sin extracciones manuales.",
				},
			],
			metrics: [
				{
					value: "~80",
					label: "usuarios en día pico",
					caption: "Equipo interno + contratistas externos",
				},
				{
					value: "100+",
					label: "OTs por mes",
					caption: "Promedio reciente (enero–abril 2026)",
				},
				{
					value: "20",
					label: "módulos integrados",
					caption: "OTs, carpetas, permisos, planes, solicitudes, indicadores",
				},
				{
					value: "13+ meses",
					label: "en producción continua",
					caption: "Operación desde abril 2025",
				},
			],
			timeline: [
				{
					date: "Enero 2025",
					title: "Kickoff & discovery",
					description:
						"Primeras reuniones con OTC en Concepción para mapear procesos, dolores actuales y entender la operación en planta.",
					icon: "kickoff",
				},
				{
					date: "Feb – Mar 2025",
					title: "Desarrollo y visitas en planta",
					description:
						"Construcción de los módulos centrales con iteraciones quincenales y visitas presenciales al sitio.",
					icon: "build",
				},
				{
					date: "Marzo 2025",
					title: "Beta interna",
					description:
						"Validación del flujo completo de OTs, permisos y planes con usuarios piloto del equipo OTC.",
					icon: "beta",
				},
				{
					date: "Abril 2025",
					title: "Lanzamiento a producción",
					description:
						"Despliegue público, onboarding de contratistas externos y activación del módulo de indicadores.",
					icon: "launch",
				},
				{
					date: "Hoy",
					title: "13+ meses en operación",
					description:
						"Soporte continuo, iteración de funcionalidades y crecimiento gradual de usuarios y módulos en uso.",
					icon: "current",
					isCurrent: true,
				},
			],
		},
	},
	{
		id: "busanc",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Busanc — Plataforma de Gestión Comercial e Industrial",
		shortDescription:
			"ERP a medida para gestionar el flujo comercial, ingeniería y producción de una empresa de productos antidesgaste para minería.",
		fullDescription:
			"Plataforma full-stack que reemplaza un flujo basado en Excel, correos e intranet legada por un sistema único que cubre desde la Solicitud Comercial hasta el despacho. Implementa un modelo componente-céntrico con trabajo en paralelo entre Ingeniería, Hispana y Evaluación & Costos, trazabilidad completa de cada acción y planificación productiva por etapas.",
		category: "desarrollo-web",
		technologies: [
			"Next.js 16",
			"React 19",
			"NestJS 11",
			"TypeScript",
			"PostgreSQL",
			"Drizzle ORM",
			"Tailwind CSS 4",
			"shadcn/ui",
			"TanStack Query",
			"TanStack Form",
			"Zod",
			"Turborepo",
			"Azure Blob Storage",
			"JWT + RBAC",
		],
		gradientColor: "#1447e6",
		isFlagship: true,
		caseStudy: {
			pitch:
				"Busanc es una plataforma a medida que digitaliza y orquesta el flujo end-to-end de una empresa industrial: desde que Comercial recibe el requerimiento del cliente hasta que Despacho genera la guía. Reemplaza un ecosistema fragmentado de Excel, correos y una intranet legada por un único sistema con trazabilidad, paralelismo entre áreas y visibilidad operativa real.",
			duration:
				"≈8 meses de desarrollo activo (kickoff octubre 2025 → marcha blanca abril 2026), con levantamiento en terreno en las instalaciones de Busanc en Chile durante toda la fase de descubrimiento.",
			inProductionSince:
				"En marcha blanca desde abril 2026 (segundo mes) con un usuario activo por área validando flujos. Salida a producción real estimada: junio 2026.",
			clientName: "Busanc",
			clientIndustry:
				"Industria minera — fabricación de productos antidesgaste para procesos de extracción y obtención de minerales. Opera en Chile.",
			problem: [
				"Antes de Busanc, el flujo comercial e industrial vivía repartido entre Excel, correos electrónicos y una intranet legada construida a medida que solo servía para crear la Solicitud Comercial inicial. Una vez generada la SC, todo el seguimiento —aprobaciones, asignaciones de ingenieros, cotizaciones, órdenes de compra, planificación productiva— se coordinaba por correo, sin un sistema único que reflejara el estado real del proyecto.",
				'El dolor más nombrado por el equipo fue lo que ellos mismos llamaron "comentarios de pasillo": información crítica del proyecto (decisiones técnicas, cambios de alcance, observaciones de Ingeniería) que nunca quedaba escrita. Si la persona que tomó la decisión no estaba, esa información se perdía. Sumado a esto, los formularios de SC tenían campos opcionales que en la práctica nunca se completaban, obligando al Jefe de Ingeniería a inferir o preguntar verbalmente lo que faltaba, con el costo de tiempo y errores que eso implica.',
				"Comercial no tenía visibilidad del avance una vez que la SC pasaba a Ingeniería: no sabía si estaba en revisión, en costos, esperando a Hispana, ni cuándo esperar respuesta. No había forma de estimar tiempos de entrega al cliente porque no había forma de saber la carga real de cada área. Las cotizaciones llegaban como planillas Excel que Comercial debía rearmar manualmente antes de enviarlas al cliente, con riesgo de error y reproceso. Las cotizaciones tienen vigencia legal de 30 días, así que cualquier demora se traducía en negocios perdidos.",
				"A nivel productivo, la Orden de Compra del cliente llegaba a Comercial y se distribuía por correo a Planificación y a Evaluación & Costos, generando duplicaciones, intermediarios innecesarios y cero trazabilidad de quién recibió qué y cuándo. Los proyectos repetitivos —que técnicamente no requieren pasar por Ingeniería— igual seguían el flujo completo por inercia. Todo esto en un contexto de crecimiento sostenido, donde el equipo sentía que el método actual ya no escalaba.",
			],
			solution: [
				"Busanc unifica el flujo completo en una única plataforma con un modelo componente-céntrico: cada componente comprado de un proyecto avanza independientemente por sus etapas productivas, con su propia Orden de Trabajo, plantilla de proceso y métricas de tiempo. Esto reemplaza el flujo lineal antiguo que obligaba a esperar a que todo el proyecto pasara de un área a otra.",
				'El cambio estructural más importante es el trabajo en paralelo entre Ingeniería, Hispana (proveedor metálico interno) y Evaluación & Costos: a medida que Ingeniería va guardando componentes, las áreas siguientes pueden ir trabajando sobre ellos sin esperar el cierre completo de la etapa anterior. Cada área tiene acciones explícitas de "Guardar" (avance parcial) y "Cerrar" (etapa terminada), con reglas de dependencia que impiden cierres prematuros. Esto reduce dramáticamente los tiempos de cotización y permite a Comercial dar fechas estimadas reales al cliente.',
				'El sistema cubre 24+ módulos de negocio: SC y Solicitudes de Levantamiento, proyectos jerárquicos con códigos correlativos y versionamiento (R1, R2, …), catálogo de materiales y productos comerciales reutilizables, cotizaciones con descuentos y multimoneda (CLP/UF/USD), revisión de Orden de Compra en dos pasos, planificación con plantillas de proceso configurables, dashboard de capacidad por área, módulos productivos dedicados (Metálico, Goma, Pintura, Calidad, Bodega), guías de despacho con soporte parcial/consolidado e historial de proyectos para recotización. Una capa transversal de Activity Log inmutable registra cada acción del sistema — la regla operativa del proyecto es "lo que no está en el sistema, no existe".',
				"Está dimensionado para escalar de los ~6 usuarios actuales en marcha blanca a ~32 usuarios concurrentes una vez en producción plena, con potencial de crecimiento conforme se integren más áreas operativas y dashboards gerenciales.",
			],
			architectureDescription:
				"Monorepo Turborepo con dos aplicaciones principales: frontend Next.js 16 (App Router, React 19) y backend NestJS 11 con arquitectura modular por dominio (cada módulo posee su propio schema.ts de Drizzle, service.ts, controller.ts y DTOs). Base de datos PostgreSQL en Azure, almacenamiento de planos y documentos en Azure Blob Storage (con planos en modo solo-visualización para prevenir fugas), autenticación JWT con Passport y triple guarda global a nivel backend: JwtAuthGuard + RolesGuard + PermissionsGuard para RBAC granular. Todas las fechas se persisten y muestran en horario de Chile (GMT-3). El frontend usa TanStack Query para estado servidor, TanStack Form + Zod para validación, TanStack Table para grids complejos, Jotai/Zustand para estado local atómico y @react-pdf/renderer para generar cotizaciones, guías y reportes en el navegador.",
			techStackDetailed: [
				{
					name: "Next.js 16 (App Router)",
					reason:
						"Necesitábamos un framework que escalara a 24+ módulos manteniendo navegación rápida y server components donde tuviera sentido. App Router nos dio layouts anidados naturales para una app con sidebar persistente y muchos sub-flujos.",
				},
				{
					name: "NestJS 11",
					reason:
						"La aplicación es claramente dominio-por-dominio (Comercial, Ingeniería, Hispana, Producción…). NestJS forzó una estructura modular limpia desde el día uno, con DTOs validados, guards globales y módulos auto-contenidos — muy difícil de degradar con el tiempo.",
				},
				{
					name: "Drizzle ORM + PostgreSQL",
					reason:
						"Drizzle nos dio tipado de extremo a extremo sin la pesadez de Prisma ni perder cercanía al SQL real. Cada módulo del backend define su propio schema.ts y Drizzle los glob-colecta — coherente con la arquitectura por dominio.",
				},
				{
					name: "TanStack Query v5",
					reason:
						"El flujo entre áreas implica que el mismo dato cambia desde muchas pantallas (Comercial guarda, Ingeniería invalida, Hispana refetcha). El cache invalidation declarativo nos ahorró mucha gimnasia.",
				},
				{
					name: "TanStack Form + Zod",
					reason:
						"Los formularios son largos (proyectos con componentes, materiales, costos, documentos…). Necesitábamos validación tipada compartida entre front y back y soporte real para arrays anidados sin reventar la performance.",
				},
				{
					name: "Turborepo",
					reason:
						"Compartir tipos entre frontend y backend sin duplicar contratos. Los paquetes shared-types, eslint-config y typescript-config mantienen consistencia entre apps y aceleran CI con caché incremental.",
				},
				{
					name: "Azure (Postgres + Blob Storage)",
					reason:
						"Recomendación nuestra para consolidar toda la app en un solo cloud y simplificar facturación, seguridad y soporte. Blob Storage encaja perfecto para planos pesados con control de acceso por URL firmada. El despliegue definitivo aún se está evaluando — podría quedar 100% en Azure o partir el frontend en Vercel.",
				},
				{
					name: "shadcn/ui + Tailwind CSS 4",
					reason:
						"Necesitábamos un sistema de componentes accesible (Radix) que pudiéramos modificar sin pelear con una librería opinada. shadcn nos dio velocidad de partida y control total del diseño industrial sobrio que pide el rubro.",
				},
			],
			features: [
				{
					title: "Flujo Comercial Unificado",
					description:
						"Solicitudes Comerciales con múltiples proyectos por SC, Solicitudes de Levantamiento independientes con calendario de visitas, vinculación SL→SC y PDF de respaldo. Reemplaza la intranet vieja y los correos.",
				},
				{
					title: "Trabajo en Paralelo entre Áreas",
					description:
						'Ingeniería, Hispana y Evaluación & Costos trabajan simultáneamente sobre los componentes a medida que se crean, con acciones de "Guardar" y "Cerrar" y reglas de dependencia que impiden cierres prematuros.',
				},
				{
					title: "Modelo Componente-Céntrico de Producción",
					description:
						"Cada componente comprado tiene su propia OT con plantilla de proceso configurable (Metálico → Goma → Pintura → Calidad → Despacho, con áreas repetibles), avanzando independientemente del resto del proyecto.",
				},
				{
					title: "Activity Log y Trazabilidad End-to-End",
					description:
						"Cada acción genera un registro inmutable (entityType, action, previousValue, newValue, userId, metadata). Timeline por proyecto, vista de admin global y dashboards de tiempos por etapa.",
				},
				{
					title: "Dashboard de Capacidad por Área",
					description:
						"Visualiza la carga planificada vs capacidad configurada (trabajadores × horas/día) por área productiva, con detección de sobrecarga, heatmap calendario y tarjetas de utilización.",
				},
				{
					title: "Guía de Despacho Enriquecida",
					description:
						"Genera guías con info del proyecto, accesorios con cantidad restante validada, BOM de referencia, planos del componente y etiqueta Zebra. Soporta despacho parcial, total y consolidación multi-proyecto.",
				},
			],
			metrics: [
				{
					value: "~32",
					label: "usuarios concurrentes proyectados",
					caption: "Producción plena (~6 activos hoy en marcha blanca). Estimado del cliente.",
				},
				{
					value: "24+",
					label: "módulos de negocio integrados",
					caption: "Cubren desde SC hasta despacho y almacenamiento.",
				},
				{
					value: "10",
					label: "roles con RBAC granular",
					caption: "Permisos por rol + por usuario, con guards globales en backend.",
				},
				{
					value: "100%",
					label: "trazabilidad de acciones",
					caption: "Activity Log inmutable cubre cada cambio de estado, edición y transición.",
				},
			],
			timeline: [
				{
					date: "Octubre 2025",
					title: "Kickoff y levantamiento",
					description:
						"Reuniones de descubrimiento con Comercial, Ingeniería y Evaluación & Costos. Visitas en sitio a las instalaciones de Busanc en Chile para mapear el flujo end-to-end.",
					icon: "kickoff",
				},
				{
					date: "Noviembre 2025",
					title: "Arranque del build",
					description:
						"Setup del monorepo Turborepo, autenticación, RBAC, esquema de base de datos y primeros módulos (SC, proyectos, materiales).",
					icon: "build",
				},
				{
					date: "Dic 2025 – Mar 2026",
					title: "Desarrollo del núcleo",
					description:
						"Trabajo en paralelo entre áreas, modelo componente-céntrico, cotizaciones con multimoneda, revisión de OC, módulos productivos, Activity Log y dashboards.",
					icon: "build",
				},
				{
					date: "Abril 2026",
					title: "Marcha blanca",
					description:
						"Plataforma en uso por un usuario activo de cada área (~6 personas), validando flujos reales contra operación cotidiana. Iteración basada en feedback.",
					icon: "beta",
					isCurrent: true,
				},
				{
					date: "Junio 2026",
					title: "Salida a producción",
					description:
						"Onboarding de los ~32 usuarios productivos y operación plena del sistema como reemplazo del flujo de Excel + correos. Estimado.",
					icon: "launch",
				},
			],
		},
	},
	{
		id: "turismochiletours",
		imageUrl: "/img/portfolio/turismochiletours/portrait.png",
		title: "TurismoChileTours",
		shortDescription:
			"Sitio corporativo multilingüe para tour operador en San Pedro de Atacama, con catálogo de programas y solicitud de tours privados.",
		fullDescription:
			"Sitio institucional para TurismoChileTours, operador turístico especializado en San Pedro de Atacama. Construido con Next.js 14 y traducido a cuatro idiomas, presenta el catálogo de programas y excursiones, fichas de destinos y contenido institucional, canalizando solicitudes de tours privados y postulaciones laborales mediante formularios validados con notificación por correo.",
		category: "desarrollo-web",
		technologies: [
			"Next.js 14",
			"React 18",
			"TypeScript",
			"Tailwind CSS",
			"Radix UI",
			"next-intl",
			"React Hook Form",
			"Zod",
			"Resend",
			"GSAP",
			"Vercel",
		],
		liveUrl: "https://turismochiletours.com/es",
		gradientColor: "#D97706",
		isFlagship: true,
		caseStudy: {
			pitch:
				"Sitio institucional multilingüe para TurismoChileTours, tour operador en San Pedro de Atacama. Presenta el catálogo de programas y destinos y canaliza solicitudes de tours privados y postulaciones laborales, sumando un canal corporativo en español, inglés, francés y portugués brasilero.",
			duration: "≈3 meses de desarrollo (agosto–noviembre 2024). Coordinación 100% remota.",
			inProductionSince:
				"Noviembre 2024 — en producción desde el lanzamiento, sin soporte continuo posterior.",
			clientName: "TurismoChileTours",
			clientIndustry: "Turismo · Tour operador en San Pedro de Atacama",
			problem: [
				"TurismoChileTours opera como tour operador consolidado en San Pedro de Atacama, con una base de clientes que reservaba mayoritariamente por WhatsApp y referidos. El proyecto no nació de un dolor operativo, sino de la decisión estratégica de proyectar una presencia digital sólida y profesional para captar nuevos segmentos.",
				"Su público objetivo es mayoritariamente turista internacional, lo que exigía un sitio multilingüe desde el día uno (español, inglés, francés y portugués brasilero) y una narrativa institucional consistente: historia, equipo, políticas y sustentabilidad.",
				"La pieza específica que faltaba era un canal serio para tours privados y grupos corporativos, donde la propuesta requiere interacción uno-a-uno y un formulario calificado antes de cotizar.",
			],
			solution: [
				"El sitio funciona como vitrina institucional y como filtro de leads calificados. Presenta los programas (3 días, 4 días, 5 días, luna de miel), las excursiones individuales y las fichas de destinos (San Pedro, Uyuni, Patagonia y festividades regionales), junto con el contenido de marca: historia, equipo, políticas y certificaciones de sustentabilidad.",
				'Los formularios de tours privados y de "Trabaja con nosotros" capturan los datos necesarios, se validan en cliente y servidor con un mismo schema Zod, y disparan un correo formateado al equipo comercial vía Resend, manteniendo el branding del sitio en cada notificación.',
			],
			architectureDescription:
				"Aplicación Next.js 14 con App Router, pre-renderizada donde es posible y desplegada en Vercel. Internacionalización con next-intl en cuatro locales y URLs traducidas. Componentes accesibles construidos sobre Radix UI siguiendo la convención de shadcn/ui; animaciones con GSAP y carruseles con Embla. Sin base de datos: el contenido vive en el repositorio (más rápido de iterar para un sitio institucional) y los formularios se procesan en Server Actions / API routes que delegan en Resend para el correo transaccional. Validación end-to-end con Zod compartida entre cliente (react-hook-form) y servidor.",
			techStackDetailed: [
				{
					name: "Next.js 14 + App Router",
					reason:
						"Renderizado híbrido (estático para páginas institucionales, Server Actions para formularios), SEO sólido y deploy de un clic en Vercel; ideal para un sitio cuyo contenido cambia poco y rinde mejor pre-renderizado.",
				},
				{
					name: "next-intl",
					reason:
						"El cliente atiende cuatro mercados idiomáticos. Maneja routing localizado, mensajes y formatos en una sola fuente de verdad, evitando duplicar páginas por idioma.",
				},
				{
					name: "Radix UI + Tailwind (patrón shadcn/ui)",
					reason:
						"Componentes accesibles por defecto (foco, ARIA, teclado) sin atarse a una librería de UI completa; estilo 100% propio con Tailwind y reuso directo en el ecommerce hermano.",
				},
				{
					name: "React Hook Form + Zod",
					reason:
						"Un único schema valida cliente y servidor, eliminando la duplicación típica entre validación frontend y backend.",
				},
				{
					name: "Resend + React Email",
					reason:
						"Correos transaccionales bien renderizados sin montar SMTP propio. Las plantillas se escriben como componentes React, así que los emails comparten estilo con el sitio.",
				},
				{
					name: "GSAP + Embla Carousel",
					reason:
						"Animaciones de scroll y carruseles performantes en móvil, controlados finamente desde React con @gsap/react.",
				},
				{
					name: "Vercel",
					reason:
						"Despliegue inmediato, edge cache para audiencia internacional repartida y previews por PR; barato y suficiente para una web institucional sin backend pesado.",
				},
			],
			features: [
				{
					title: "Catálogo de programas y excursiones",
					description:
						"Páginas dedicadas para programas multi-día (3/4/5 días y luna de miel) y excursiones individuales, con fichas para cada destino.",
				},
				{
					title: "Fichas de destinos",
					description:
						"Páginas individuales para San Pedro, Uyuni, Patagonia y festividades/eventos regionales, con guías de cómo llegar y qué esperar.",
				},
				{
					title: "Sitio multilingüe (4 idiomas)",
					description:
						"Español, inglés, francés y portugués brasilero con routing localizado vía next-intl y URLs traducidas por locale.",
				},
				{
					title: "Solicitud de tours privados",
					description:
						"Formulario calificado con validación Zod end-to-end que dispara correo branded al equipo comercial mediante Resend.",
				},
				{
					title: "Postulaciones laborales",
					description:
						'Sección "Trabaja con nosotros" con formulario propio y plantilla de email dedicada para captar talento.',
				},
				{
					title: "Páginas institucionales completas",
					description:
						"Historia, equipo, políticas, FAQ y sustentabilidad, gestionadas desde el repo para iteración rápida sin CMS.",
				},
			],
			metrics: [
				{
					value: "4",
					label: "idiomas soportados",
					caption: "Español, inglés, francés y portugués brasilero.",
				},
				{
					value: "4",
					label: "programas multi-día publicados",
					caption: "3 días, 4 días, 5 días y luna de miel.",
				},
				{
					value: "2",
					label: "formularios calificados",
					caption: "Tours privados y postulación laboral, con notificación por correo.",
				},
				{
					value: "100%",
					label: "páginas pre-renderizadas",
					caption: "Sin base de datos. Tiempos de carga óptimos en edge.",
				},
			],
			timeline: [
				{
					date: "Agosto 2024",
					title: "Kickoff",
					description:
						"Primer contacto con TurismoChileTours, definición de scope, idiomas objetivo y arquitectura.",
					icon: "kickoff",
				},
				{
					date: "Ago – Nov 2024",
					title: "Desarrollo",
					description:
						"Diseño UI, páginas institucionales, catálogo de programas y destinos, formularios e internacionalización.",
					icon: "build",
				},
				{
					date: "Noviembre 2024",
					title: "Lanzamiento",
					description:
						"Despliegue a producción en Vercel y publicación en turismochiletours.com en los cuatro idiomas.",
					icon: "launch",
				},
				{
					date: "Hoy",
					title: "En producción",
					description:
						"Sitio operativo desde el lanzamiento; canal vigente de captación corporativa y de tours privados.",
					icon: "current",
					isCurrent: true,
				},
			],
		},
	},
	{
		id: "caemp",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "CAEMP",
		shortDescription: "Plataforma de capacitación y seguridad laboral",
		fullDescription:
			"Aplicación web para CAEMP, especialistas en capacitación y seguridad laboral. Construida con TanStack Start y React, incluye formularios dinámicos, sistema de emails transaccionales con React Email y una interfaz moderna con animaciones.",
		category: "desarrollo-web",
		technologies: [
			"TanStack Start",
			"React",
			"TypeScript",
			"Tailwind CSS",
			"Vite",
			"Radix UI",
			"React Email",
			"Resend",
			"Motion",
			"Zod",
		],
		liveUrl: "https://grupocaemp.cl",
		gradientColor: "#f59e0b",
	},
	{
		id: "finance",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Finance",
		shortDescription: "Aplicación de gestión financiera personal",
		fullDescription:
			"Aplicación web de finanzas personales con soporte multiidioma (next-intl), autenticación segura, gráficos interactivos de gastos e ingresos, y persistencia en PostgreSQL con Prisma. Interfaz moderna con componentes shadcn/ui.",
		category: "desarrollo-web",
		technologies: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Prisma",
			"PostgreSQL",
			"Better Auth",
			"next-intl",
			"Recharts",
			"shadcn/ui",
			"Zod",
		],
		liveUrl: "https://finance-olive-tau.vercel.app",
		gradientColor: "#8b5cf6",
	},
	{
		id: "habit-tracker",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Forma - Habit Tracker",
		shortDescription: "PWA de seguimiento de hábitos diarios",
		fullDescription:
			"Aplicación progresiva (PWA) para el seguimiento de hábitos diarios con soporte offline gracias a Service Workers (Serwist). Permite crear, ordenar y monitorear hábitos con drag & drop, gráficos de progreso y tema claro/oscuro. Base de datos con Drizzle ORM y libSQL.",
		category: "desarrollo-web",
		technologies: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Drizzle ORM",
			"libSQL",
			"Better Auth",
			"Serwist (PWA)",
			"DnD Kit",
			"Recharts",
			"Zustand",
		],
		liveUrl: "https://habit-tracker-rouge-one.vercel.app",
		gradientColor: "#10b981",
	},
	{
		id: "gis-test",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Sistema GIS",
		shortDescription: "Sistema de información geográfica con capas interactivas",
		fullDescription:
			"Sistema de información geográfica interactivo con capas dinámicas, mapas Mapbox GL y React Map GL. Permite visualizar datos geoespaciales con filtros avanzados, formularios con validación y gráficos complementarios.",
		category: "desarrollo-web",
		technologies: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Mapbox GL",
			"React Map GL",
			"Recharts",
			"React Hook Form",
			"Zod",
			"SWR",
		],
		liveUrl: "https://ing-simple-gis.vercel.app/",
		gradientColor: "#06b6d4",
	},
	{
		id: "pdf-viewer",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "PDF Viewer",
		shortDescription: "Visor de PDFs interactivo con efecto de libro",
		fullDescription:
			"Visor de documentos PDF con efecto de flip de páginas tipo libro (React Pageflip). Construido con TanStack Start para SSR/SSG, permite la visualización fluida de documentos con controles de navegación intuitivos.",
		category: "desarrollo-web",
		technologies: [
			"TanStack Start",
			"React",
			"TypeScript",
			"Tailwind CSS",
			"React Pageflip",
			"Vite",
		],
		liveUrl: "https://pdf-viewer-five-puce.vercel.app",
		gradientColor: "#f43f5e",
	},
	{
		id: "dbj-dashboard",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "IS Dashboard",
		shortDescription: "Sistema de gestión documental y asistencia",
		fullDescription:
			"Dashboard para gestión de archivos y sistemas de asistencia con autenticación. Incluye tablas interactivas con TanStack Table, drag & drop con DnD Kit y una interfaz limpia con componentes shadcn/ui.",
		category: "desarrollo-web",
		technologies: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"TanStack Table",
			"DnD Kit",
			"shadcn/ui",
			"date-fns",
		],
		liveUrl: "https://documents-dashboard.vercel.app",
		gradientColor: "#059669",
	},
	{
		id: "correos-chile-mockup",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "CorreosChile - Seguimiento de Auditorías",
		shortDescription: "Maqueta de sistema de seguimiento de auditorías para CorreosChile",
		fullDescription:
			"Prototipo funcional de un sistema de seguimiento de auditorías para Correos de Chile. Incluye dashboards con gráficos Recharts, formularios con validación, componentes Radix UI y analíticas de Vercel. Maqueta interactiva para validación de requerimientos.",
		category: "desarrollo-web",
		technologies: [
			"Next.js",
			"TypeScript",
			"Tailwind CSS",
			"Recharts",
			"Radix UI",
			"React Hook Form",
			"Zod",
			"Vercel Analytics",
		],
		liveUrl: "https://correos-de-chile-mockup.vercel.app",
		gradientColor: "#dc2626",
	},
	{
		id: "dbj-prototipo",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "DBJ - Landing Page",
		shortDescription: "Landing page para DBJ",
		fullDescription:
			"Versión prototipo del Desafío PEI AIEP. Quiz interactivo con registro de usuarios, 5 preguntas sobre el Plan Estratégico Institucional, sorteo de premios y componentes Lucide Icons. Iteración previa a la versión de producción.",
		category: "desarrollo-web",
		technologies: ["Vite", "React", "TypeScript", "Tailwind CSS", "Lucide Icons"],
		liveUrl: "https://dbj-prototipe.vercel.app",
		gradientColor: "#06b6d4",
	},
	{
		id: "websil-test",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Websil - Test",
		shortDescription: "Versión de prueba del sitio Websil con Astro",
		fullDescription:
			"Versión de testing del sitio web de Websil construida con Astro. Utilizada para validar el diseño y funcionalidad antes del despliegue final.",
		category: "desarrollo-web",
		technologies: ["Astro", "React", "TypeScript", "Tailwind CSS"],
		liveUrl: "https://websil-test.vercel.app",
		gradientColor: "#2563eb",
	},
	{
		id: "inmobiliaria",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Inmobiliaria Ulloa Accardi",
		shortDescription: "Prototipo de sitio web para proyecto inmobiliario andino",
		fullDescription:
			"Sitio web prototipo para la inmobiliaria Ulloa Accardi, presentando un proyecto de loteo de terrenos en la cordillera de los Andes con enfoque en biodiversidad. Diseño elegante con tipografías Montserrat e Inter.",
		category: "desarrollo-web",
		technologies: ["Vite", "React", "TypeScript", "Google Fonts"],
		liveUrl: "https://prototipo-inmobiliaria.vercel.app",
		gradientColor: "#ec4899",
	},
	{
		id: "asm",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "ASM - Sistema de Monitoreo Ambiental",
		shortDescription: "Sistema de monitoreo ambiental con soporte multiidioma",
		fullDescription:
			"Plataforma de monitoreo ambiental construida con Astro y soporte de internacionalización (i18n). Permite visualizar y analizar datos ambientales en múltiples idiomas.",
		category: "desarrollo-web",
		technologies: ["Astro", "TypeScript", "i18n", "Tailwind CSS"],
		liveUrl: "https://asm-six.vercel.app/es/",
		gradientColor: "#059669",
	},
	{
		id: "raspberry-pi-mockup",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Monitoreo Ambiental - Raspberry Pi 5",
		shortDescription: "Dashboard de monitoreo ambiental IoT con Raspberry Pi 5",
		fullDescription:
			"Prototipo de dashboard para monitoreo ambiental en tiempo real con integración de Raspberry Pi 5. Visualización de datos de sensores ambientales con interfaz React moderna.",
		category: "desarrollo-web",
		technologies: ["Vite", "React", "TypeScript", "Raspberry Pi 5"],
		liveUrl: "https://raspberry-pi-5-mockup.vercel.app",
		gradientColor: "#dc2626",
	},
	{
		id: "emprende-tu-vida",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Emprende tu Vida",
		shortDescription: "Plataforma educativa de emprendimiento",
		fullDescription:
			"Plataforma educativa orientada a emprendedores y formación empresarial. Sitio web institucional con información sobre programas de capacitación y recursos para nuevos emprendedores.",
		category: "desarrollo-web",
		technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
		liveUrl: "https://maqueta-emprende-tu-vida.vercel.app",
		gradientColor: "#8b5cf6",
	},
	{
		id: "report-dashboard",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Report Dashboard",
		shortDescription: "Dashboard de reportes con visualización geoespacial",
		fullDescription:
			"Panel de control para gestión y visualización de reportes con integración de mapas MapLibre GL, gráficos Recharts y componentes shadcn/ui. Permite analizar datos de manera geoespacial y generar insights visuales.",
		category: "reportabilidad",
		technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MapLibre GL", "Recharts", "shadcn/ui"],
		liveUrl: "https://report-dashboard-eta.vercel.app",
		gradientColor: "#dc2626",
	},
]
