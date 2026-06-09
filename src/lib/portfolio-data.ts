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

export interface CaseStudyTechItemDetail {
	constraint: string
	decision: string
	outcome: string
}

export interface CaseStudyTechItem {
	name: string
	reason: string
	tag?: string
	detail?: CaseStudyTechItemDetail
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

export type ParagraphBlock = string | { headline: string; body: string }

export type CaseStudyVisualPrivacy = "public" | "confidential-ui"

export interface CaseStudy {
	pitch: string
	duration: string
	inProductionSince: string
	clientName: string
	clientIndustry: string
	visualPrivacy: CaseStudyVisualPrivacy
	team?: string
	userBreakdown?: string
	problem: ParagraphBlock[]
	solution: ParagraphBlock[]
	architectureDescription: string
	techStackDetailed: CaseStudyTechItem[]
	techStackIntro?: string
	features: CaseStudyFeature[]
	metrics: CaseStudyMetric[]
	timeline?: CaseStudyMilestone[]
	testimonial?: CaseStudyTestimonial
	beforeAfter?: Array<{ before: string; after: string }>
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
	isProduction?: boolean
	clientLogo?: string
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
		isProduction: true,
		clientLogo: "/img/logos/otc.svg",
		caseStudy: {
			visualPrivacy: "confidential-ui",
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
		id: "bimakers",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Bimakers",
		shortDescription:
			"Sistema multi-rol para coordinar cuadrillas, tareas y trazabilidad operacional en planta, reemplazando Teams y WhatsApp.",
		fullDescription:
			"Plataforma interna de gestión operacional que centraliza la coordinación de cuadrillas, asignación de tareas, seguimiento de avance y trazabilidad completa de cambios. Reemplaza la coordinación informal por Teams/WhatsApp y planillas sueltas con un sistema multi-rol, con carga masiva vía Excel, calendario operativo y auditoría de cada acción.",
		category: "desarrollo-web",
		technologies: [
			"Next.js",
			"React",
			"TypeScript",
			"Prisma",
			"PostgreSQL",
			"Better Auth",
			"Zod",
			"TanStack Table",
			"Tailwind CSS",
			"shadcn/ui",
			"Ably",
			"Vercel Blob",
			"ExcelJS",
		],
		gradientColor: "#0f766e",
		isFlagship: true,
		isProduction: true,
		clientLogo: "/img/logos/bimakers.avif",
		caseStudy: {
			visualPrivacy: "confidential-ui",
			pitch:
				'Plataforma multi-rol que reemplaza la coordinación por Teams y WhatsApp con un único sistema para asignar cuadrillas, gestionar tareas en planta y auditar cada cambio. Sin chats perdidos, sin planillas paralelas, sin "¿quién dijo qué?".',
			duration: "~4 meses, desde relevamiento hasta producción",
			inProductionSince: "En producción desde Mayo 2026",
			clientName: "Operación industrial en planta",
			clientIndustry: "Mantenimiento industrial · Gestión de cuadrillas",
			team: "Desarrollo end-to-end + relevamiento en planta",
			userBreakdown: "Multi-rol: Administradores · Ingenieros · Operarios",
			problem: [
				{
					headline: "La operación vivía en chats.",
					body: "La coordinación de cuadrillas y tareas en planta se manejaba entre Teams, WhatsApp y planillas sueltas. Cada conversación importante terminaba enterrada bajo cientos de mensajes nuevos al día siguiente.",
				},
				{
					headline: "Nadie era dueño formal de nada.",
					body: "Las asignaciones se daban verbalmente o por mensaje: sin estado, sin prioridad explícita, sin responsable formal. Cuando algo fallaba, reconstruir qué pasó dependía de scrollear chats o de la memoria de quien estuvo ahí.",
				},
				{
					headline: "Supervisión y gerencia volaban a ciegas.",
					body: "No existía una foto operativa única: para saber el estado real de la planta había que preguntar, llamar, esperar. La información existía, pero estaba fragmentada en 10 lugares distintos.",
				},
			],
			solution: [
				{
					headline: "Un sistema, un origen de verdad.",
					body: "Bimakers centraliza el ciclo completo de operación en una única plataforma multi-rol. Cada cuadrilla, tarea y cambio queda registrado con responsable, estado y prioridad explícitos — accesibles según el rol de cada usuario.",
				},
				{
					headline: "Trazabilidad sin esfuerzo.",
					body: "Cada acción relevante deja rastro automático. La auditoría permite reconstruir qué se hizo, quién lo hizo y cuándo, sin depender de chats ni de la memoria de las personas. Ideal para inspecciones, reportes y revisiones post-incidente.",
				},
				{
					headline: "Visibilidad operativa en tiempo real.",
					body: "Supervisión y gerencia acceden a una foto consolidada de la planta, con vistas adaptadas a cada rol y un calendario operativo que reemplaza la coordinación informal. Lo que antes requería tres llamadas y dos mensajes, ahora es una pantalla.",
				},
				{
					headline: "Una base que escala con la operación.",
					body: "La carga masiva vía Excel y el calendario son la columna vertebral sobre la que el sistema sigue incorporando capacidades — sin reescribir lo existente, sin romper lo que ya funciona.",
				},
			],
			architectureDescription:
				"Stack pensado para coordinación industrial crítica. Frontend en Next.js (App Router) con React Server Components para listados y vistas operativas pesadas. Autenticación propia con Better Auth (sesiones server-side, sin lock-in a SaaS de identidad). Persistencia en PostgreSQL vía Prisma con driver adapter de pg, y validación extremo a extremo con Zod: el mismo esquema valida en cliente, server y carga masiva. La numeración concurrente de tareas usa advisory locks de PostgreSQL para evitar colisiones cuando múltiples capataces operan en simultáneo. El tiempo real (estados y notificaciones) corre sobre Ably — sin sostener infraestructura propia de WebSockets. Los adjuntos (fotos de campo, planos, evidencia) viven en Vercel Blob, desacoplados del runtime. La carga masiva se procesa con un wizard sobre ExcelJS que valida fila por fila y confirma de forma transaccional: o entra todo, o no entra nada.",
			techStackDetailed: [
				{
					name: "Prisma + PostgreSQL",
					tag: "Integridad",
					reason:
						"Modelo relacional para entidades fuertemente vinculadas (cuadrillas ↔ tareas ↔ usuarios ↔ roles), con advisory locks de PostgreSQL para numeración concurrente de tareas sin colisiones.",
					detail: {
						constraint:
							"Las entidades del dominio (cuadrillas, tareas, usuarios, roles) están fuertemente vinculadas y se modifican en simultáneo desde múltiples roles.",
						decision:
							"Postgres por su modelo relacional probado y sus garantías ACID. Prisma como capa de tipos sobre el schema, para que el modelo de datos y el código TypeScript nunca se desincronicen. Advisory locks de Postgres resuelven la numeración concurrente de tareas: aunque dos capataces creen una tarea en el mismo milisegundo, no hay colisiones ni números duplicados.",
						outcome: "Integridad de datos garantizada por la base, no por la aplicación.",
					},
				},
				{
					name: "Next.js + React + TypeScript",
					tag: "Performance",
					reason:
						"App Router con React Server Components para listados y vistas operativas pesadas, y tipos estrictos en cada capa para reducir bugs en un sistema crítico de coordinación.",
					detail: {
						constraint:
							"Vistas operativas con cientos de tareas tenían que cargar rápido y sin bugs de tipos en flujos críticos.",
						decision:
							"App Router con React Server Components mueve el render pesado al servidor — el navegador del operario en planta no sufre. TypeScript estricto en cada capa atrapa errores de coordinación (un status mal escrito, un roleId cruzado) antes de llegar a producción.",
						outcome:
							"Listados que escalan a miles de filas sin trabarse y un sistema donde el compilador es la primera línea de defensa.",
					},
				},
				{
					name: "Better Auth",
					tag: "Soberanía de datos",
					reason:
						"Sesiones server-side con control completo del esquema multi-rol, sin lock-in a un proveedor SaaS de identidad externo.",
					detail: {
						constraint:
							"Sistema multi-rol crítico que no podía depender de un proveedor externo de identidad.",
						decision:
							"Better Auth corre server-side con control total del esquema de roles y permisos. Sin redirecciones a dominios de terceros, sin lock-in a un SaaS que pueda cambiar precios o políticas, sin enviar datos de usuarios industriales fuera de la infraestructura del proyecto.",
						outcome:
							"Autenticación con sesiones propias, esquema de roles a medida, y soberanía completa sobre los datos de identidad.",
					},
				},
				{
					name: "Zod",
					tag: "Validación",
					reason:
						"Validación de datos extremo a extremo: el mismo esquema valida en el cliente, en el server y en la carga masiva por Excel.",
					detail: {
						constraint:
							"La carga masiva por Excel podía romper la base con un solo registro inválido en una de 500 filas.",
						decision:
							"Zod define el esquema UNA vez y lo reusa en tres lugares: formularios del cliente, endpoints del servidor y el pipeline de importación de Excel. Lo que pasa la validación es estructuralmente correcto antes de tocar la base de datos.",
						outcome:
							"Errores detectados fila por fila antes del commit, sin estados inconsistentes ni rollbacks parciales.",
					},
				},
				{
					name: "Ably",
					tag: "Real-time",
					reason:
						"Sincronización en tiempo real de estados de tareas y notificaciones entre roles, sin sostener infraestructura de WebSockets propia.",
					detail: {
						constraint:
							"Estados de tareas y notificaciones tenían que propagarse entre roles en tiempo real, sin sostener un servidor de WebSockets propio.",
						decision:
							'Ably maneja la capa de pub/sub con reconexión automática, ordering garantizado y entrega "at-least-once". El backend solo publica eventos — la infraestructura de tiempo real es responsabilidad del proveedor, no del equipo.',
						outcome:
							"Cuando un operario marca una tarea como terminada, el supervisor lo ve al instante. Sin polling, sin recargar, sin infraestructura adicional que mantener.",
					},
				},
				{
					name: "TanStack Table + ExcelJS + Vercel Blob",
					tag: "Escalabilidad",
					reason:
						"Tablas operativas grandes con orden y filtros, carga masiva transaccional desde Excel, y almacenamiento de adjuntos sin acoplar al filesystem del runtime.",
					detail: {
						constraint:
							"Tres restricciones distintas del mismo dominio: visualizar miles de tareas, importarlas masivamente, y guardar adjuntos pesados (fotos de campo, planos).",
						decision:
							"TanStack Table para tablas operativas con ordering, filtros y selección que escalan sin perder fluidez. ExcelJS para procesar planillas reales del cliente (con merges, formatos, hojas múltiples) en un wizard transaccional. Vercel Blob para adjuntos, separados del filesystem del runtime — los archivos no compiten por espacio con el código.",
						outcome:
							"El cliente sigue trabajando con sus Excels de siempre, pero la información termina estructurada, auditable y consultable.",
					},
				},
			],
			techStackIntro:
				"Cada elección técnica respondió a una restricción real del proyecto. No usamos nada por moda — esto es el por qué de cada herramienta.",
			features: [
				{
					title: "Asignación de Cuadrillas y Tareas",
					description:
						"Asignación formal con responsable, estado y prioridad explícitos, reemplazando la coordinación verbal por Teams y WhatsApp.",
				},
				{
					title: "Numeración Concurrente de Tareas",
					description:
						"Numeración correlativa garantizada bajo carga simultánea mediante advisory locks de PostgreSQL, sin colisiones ni huecos.",
				},
				{
					title: "Carga Masiva por Excel",
					description:
						"Wizard de importación sobre ExcelJS que valida y confirma de forma transaccional, evitando estados parciales.",
				},
				{
					title: "Calendario Operativo",
					description:
						"Vista de calendario para planificar y visualizar tareas y cuadrillas, reemplazando la planificación informal previa.",
				},
				{
					title: "Vistas por Rol",
					description:
						"Cada perfil ve y opera solo lo que le corresponde, con un esquema multi-rol configurable.",
				},
				{
					title: "Auditoría y Trazabilidad",
					description:
						"Registro completo de cambios: quién hizo qué y cuándo, reconstruible sin depender de chats ni memoria.",
				},
				{
					title: "Tiempo Real",
					description: "Estados y notificaciones sincronizados en vivo entre roles mediante Ably.",
				},
			],
			metrics: [
				{
					value: "~60",
					label: "usuarios activos",
					caption: "Equipo operativo y supervisión en planta",
				},
				{
					value: "30",
					label: "proyectos gestionados",
					caption: "Trabajos coordinados en la plataforma",
				},
				{
					value: "4+",
					label: "roles configurables",
					caption: "Esquema multi-rol según perfil operativo",
				},
				{
					value: "100%",
					label: "trazabilidad de cambios",
					caption: "Cada acción relevante queda auditada",
				},
			],
			timeline: [
				{
					date: "Febrero 2026",
					title: "Kickoff & relevamiento",
					description:
						"Relevamiento en planta para mapear la coordinación actual por Teams/WhatsApp y los dolores operativos.",
					icon: "kickoff",
				},
				{
					date: "Feb – Abr 2026",
					title: "Desarrollo",
					description:
						"Construcción del esquema multi-rol, asignación de tareas, carga masiva por Excel y trazabilidad.",
					icon: "build",
				},
				{
					date: "Mayo 2026",
					title: "Lanzamiento a producción",
					description:
						"Despliegue interno, onboarding de roles operativos y reemplazo de la coordinación informal previa.",
					icon: "launch",
				},
				{
					date: "Hoy",
					title: "En operación y crecimiento",
					description:
						"Soporte continuo e incorporación incremental de nuevas capacidades operativas sobre la base de calendario y carga masiva.",
					icon: "current",
					isCurrent: true,
				},
			],
			beforeAfter: [
				{
					before: "Coordinación en Teams + WhatsApp + planillas",
					after: "Un sistema único, con responsable y estado por tarea",
				},
				{
					before: '"¿Quién hacía esa tarea?" → scrollear chats',
					after: "Historial completo en 2 clicks",
				},
				{
					before: "Reportes manuales armados desde mensajes",
					after: "Reportes automáticos desde datos estructurados",
				},
				{
					before: "Sin foto operativa consolidada",
					after: "Dashboard en tiempo real por rol",
				},
				{
					before: "Errores de coordinación detectados tarde",
					after: "Visibilidad inmediata + auditoría completa",
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
		isProduction: true,
		clientLogo: "/img/logos/busanc.avif",
		caseStudy: {
			visualPrivacy: "confidential-ui",
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
		isProduction: true,
		clientLogo: "/img/logos/turismochiletours.svg",
		caseStudy: {
			visualPrivacy: "public",
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
		id: "toursanpedroatacama",
		imageUrl: "/img/portfolio/toursanpedroatacama/portrait.png",
		title: "San Pedro de Atacama",
		shortDescription:
			"Ecommerce multilingüe para reservar excursiones en San Pedro de Atacama, con tres pasarelas de pago, conversión CLP/USD y panel administrativo completo.",
		fullDescription:
			"Plataforma de ecommerce para venta directa de excursiones y programas turísticos en San Pedro de Atacama. Permite a turistas internacionales reservar y pagar online en CLP o USD con conversión automática, vía Webpay, PayPal o Flow. Incluye un panel administrativo completo para gestionar el catálogo, traducciones, reservas y blog.",
		category: "desarrollo-web",
		technologies: [
			"Next.js 15",
			"React 19",
			"TypeScript",
			"Tailwind v4",
			"Drizzle ORM",
			"Turso (libSQL)",
			"TanStack Query",
			"TanStack Table",
			"next-intl",
			"Transbank/Webpay",
			"PayPal",
			"Flow",
			"Cloudinary",
			"React PDF",
			"Recharts",
			"Zustand",
			"Resend",
			"Vercel",
		],
		liveUrl: "https://toursanpedroatacama.com/",
		gradientColor: "#D97706",
		isFlagship: true,
		isProduction: true,
		clientLogo: "/img/logos/turismochiletours.svg",
		caseStudy: {
			visualPrivacy: "public",
			pitch:
				"Ecommerce multilingüe para que TurismoChileTours venda directamente excursiones y programas en San Pedro de Atacama, con tres pasarelas de pago, conversión automática CLP↔USD y un panel administrativo completo para gestionar catálogo, reservas y traducciones a cuatro idiomas.",
			duration: "≈2 meses de desarrollo (octubre–diciembre 2024). Coordinación 100% remota.",
			inProductionSince:
				"Diciembre 2024 — en producción desde el lanzamiento, sin soporte continuo posterior.",
			clientName: "TurismoChileTours",
			clientIndustry: "Turismo · Tour operador en San Pedro de Atacama",
			problem: [
				"Tras consolidar el sitio corporativo, TurismoChileTours quería sumar un canal de venta online directo. La operación seguía (y sigue) ocurriendo mayoritariamente por WhatsApp, lo que funciona con clientes habituales pero deja afuera al turista internacional que prefiere reservar y pagar antes de aterrizar, con su tarjeta y en su moneda.",
				"El catálogo combinaba excursiones individuales y programas multi-día, agrupados por zonas y subzonas, con fotos pesadas y descripciones extensas en cuatro idiomas. Manejar ese contenido a mano o desde el código ya no era viable.",
				"El cliente necesitaba operar la plataforma sin tocar código: dar de alta excursiones, gestionar reservas, escribir entradas de blog y ver estadísticas básicas. Eso obligaba a construir un panel administrativo completo, no solo una vitrina pública.",
			],
			solution: [
				"Una tienda online donde el turista navega excursiones por zona y subzona, las agrega al carrito, completa el checkout y paga en CLP o USD —con conversión automática vía OpenExchangeRates— usando una de tres pasarelas: Webpay/Transbank, PayPal o Flow, según prefiera. Tras el pago se emite un voucher PDF y se notifica por correo, manteniendo el branding del sitio.",
				"Un panel administrativo separado gestiona todo el catálogo (zonas, subzonas, excursiones, programas), el blog, las reservas y las monedas, con tablas filtrables, dashboards y autenticación propia. Cada entidad tiene su tabla de traducciones, así el cliente edita el contenido en los cuatro idiomas desde el mismo lugar.",
				"La stack completa se eligió pensando en costo operacional bajo: Vercel para hosting, Turso (libSQL) para la base de datos y Cloudinary para imágenes, manteniendo costos fijos cercanos a cero hasta tener tracción.",
			],
			architectureDescription:
				"Aplicación Next.js 15 (App Router, Turbopack) con React 19, desplegada en Vercel. Persistencia en Turso (libSQL distribuido) accedida con Drizzle ORM; el esquema separa cada entidad de sus traducciones para soportar i18n a nivel de contenido (zona/subzona/excursión/programa/blog × 4 idiomas). Tres integraciones de pago — Transbank/Webpay, PayPal y Flow — abstraídas en Server Actions, cada una con su flujo de create/confirm y manejo idempotente del estado de la reserva. Imágenes en Cloudinary, vouchers generados con @react-pdf/renderer, correos transaccionales con Resend, y conversión de divisas vía OpenExchangeRates. Panel admin protegido con auth custom basado en JWT (jose), UI sobre TanStack Query + TanStack Table y dashboards en Recharts. Estado del carrito en Zustand.",
			techStackDetailed: [
				{
					name: "Next.js 15 + React 19",
					reason:
						"App Router con Server Actions cubre todo el flujo transaccional (crear reserva, iniciar pago, confirmar) sin levantar un backend aparte. Turbopack acorta los ciclos de iteración en local.",
				},
				{
					name: "Drizzle ORM + Turso (libSQL)",
					reason:
						"Decisión costo-primero: Turso ofrece SQLite distribuido con free tier muy generoso, suficiente para la carga esperada. Drizzle tipa el schema en TypeScript y genera queries de bajo overhead. También fue una apuesta por probar la combinación en producción.",
				},
				{
					name: "Transbank/Webpay + PayPal + Flow",
					reason:
						"Tres pasarelas elegidas por el cliente: Webpay cubre tarjetas chilenas, PayPal capta al turista internacional y Flow agrega métodos locales adicionales. Reducir la fricción del pago era prioridad.",
				},
				{
					name: "next-intl + traducciones a nivel DB",
					reason:
						"Los textos de UI viven en next-intl, pero el contenido del catálogo (nombres, descripciones, itinerarios) vive en tablas dedicadas por idioma. Así el admin edita las cuatro versiones sin tocar archivos de mensajes.",
				},
				{
					name: "TanStack Query + Table",
					reason:
						"El panel admin tiene mucho CRUD con filtros, paginación y mutaciones. Query maneja caché y estado de servidor sin boilerplate; Table cubre las grillas grandes (excursiones, reservas, blog).",
				},
				{
					name: "Cloudinary",
					reason:
						"Las excursiones tienen galerías pesadas. Cloudinary entrega transformaciones (formato, tamaño, calidad) on-the-fly sin procesar imágenes en el deploy.",
				},
				{
					name: "@react-pdf/renderer",
					reason:
						"Los vouchers se generan como PDF desde el mismo runtime, sin servicios externos, manteniendo el branding del sitio en el comprobante.",
				},
				{
					name: "Jose (JWT) + middleware",
					reason:
						"Auth admin propio y simple — sin terceros, sin costos extra, suficiente para un panel de un solo equipo.",
				},
			],
			features: [
				{
					title: "Catálogo navegable por días recomendados",
					description:
						"Excursiones agrupadas por días sugeridos de estadía, con filtros y páginas dedicadas para cada item.",
				},
				{
					title: "Panel administrativo completo",
					description:
						"CRUD de zonas, subzonas, excursiones, programas, blog, monedas y reservas, con tablas, filtros, dashboards y autenticación propia.",
				},
				{
					title: "Checkout en CLP o USD",
					description:
						"Conversión automática de divisas vía OpenExchangeRates; el turista elige moneda y método de pago.",
				},
				{
					title: "Tres pasarelas de pago",
					description:
						"Transbank/Webpay (tarjetas chilenas), PayPal (internacional) y Flow (métodos locales adicionales), con manejo idempotente del estado de la reserva.",
				},
				{
					title: "Contenido multilingüe a nivel DB",
					description:
						"Cada entidad del catálogo tiene su tabla de traducciones (ES/EN/FR/PT-BR) editable desde el panel.",
				},
				{
					title: "Vouchers PDF y notificaciones",
					description:
						"Generación de comprobantes PDF con branding propio y emails transaccionales vía Resend.",
				},
			],
			metrics: [
				{
					value: "3",
					label: "pasarelas de pago integradas",
					caption: "Webpay, PayPal y Flow.",
				},
				{
					value: "4",
					label: "idiomas con traducción a nivel DB",
					caption: "Español, inglés, francés y portugués brasilero.",
				},
				{
					value: "17",
					label: "excursiones publicadas",
					caption: "Cifra de catálogo actual.",
				},
				{
					value: "2",
					label: "monedas con conversión automática",
					caption: "CLP y USD vía OpenExchangeRates.",
				},
			],
			timeline: [
				{
					date: "Octubre 2024",
					title: "Kickoff",
					description:
						"Definición de scope: catálogo jerárquico, pagos múltiples, panel admin y soporte multilingüe a nivel de datos.",
					icon: "kickoff",
				},
				{
					date: "Oct – Dic 2024",
					title: "Desarrollo",
					description:
						"Modelado del schema con traducciones, panel admin, integración de las tres pasarelas, checkout, vouchers PDF y conversión de divisas.",
					icon: "build",
				},
				{
					date: "Diciembre 2024",
					title: "Lanzamiento",
					description:
						"Salida a producción en toursanpedroatacama.com, desplegado en Vercel + Turso.",
					icon: "launch",
				},
				{
					date: "Hoy",
					title: "En producción",
					description: "Plataforma operativa con catálogo en crecimiento; venta directa activa.",
					icon: "current",
					isCurrent: true,
				},
			],
		},
		w,
	},
	{
		id: "aula-girasoles",
		imageUrl: "/img/portfolio/aula-girasoles.png",
		title: "Aula — Jardín Girasoles",
		shortDescription: "Plataforma de gestión para jardines infantiles, 100% en el navegador",
		fullDescription:
			"Demo navegable de una plataforma de gestión y comunicación para jardines infantiles. Corre íntegramente en el browser: Postgres vive en WASM vía PGlite con persistencia en IndexedDB, sin servidor. Incluye 9 pantallas con SQL real (joins, agregaciones), soporte multi-jardín, switcher de roles (directora, educadora, apoderado), notificaciones en vivo con pg_notify (LISTEN/NOTIFY) y generación de reportes PDF desde los datos del centro activo.",
		category: "desarrollo-web",
		technologies: [
			"Next.js 16",
			"React 19",
			"TypeScript",
			"Tailwind CSS 4",
			"shadcn/ui",
			"PGlite",
			"react-pdf",
			"Recharts",
		],
		liveUrl: "https://daily-agenda-mockup.vercel.app/login",
		gradientColor: "#f59e0b",
	},
	{
		id: "dashboard-turismo",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Dashboard TurismoChileTours",
		shortDescription:
			"Dashboard interno multi-rol para gestionar ventas, eventos, pasajeros, caja y proveedores de una operadora turística en San Pedro de Atacama.",
		fullDescription:
			"Plataforma web interna que reemplaza una aplicación Power Apps heredada y centraliza toda la operación de TurismoChileTours: ventas multicanal, calendario de eventos, asignación de proveedores, control de caja diaria, facturación mayorista y comisiones. Está pensada para el equipo de ventas, operaciones, administración y dirección, con permisos granulares por módulo. Es la tercera pieza del ecosistema digital del cliente, complementando el sitio corporativo y el ecommerce de tours en San Pedro.",
		category: "desarrollo-web",
		technologies: [
			"Next.js 16",
			"React 19",
			"TypeScript 5.9",
			"Tailwind CSS 4",
			"shadcn/ui",
			"Radix UI",
			"Prisma 7",
			"PostgreSQL (Neon)",
			"Better Auth 1.4",
			"TanStack Query",
			"TanStack Table",
			"TanStack Form",
			"TanStack Virtual",
			"Zod 4",
			"Zustand 5",
			"@react-pdf/renderer",
			"ExcelJS",
			"DnD Kit",
			"MapLibre GL",
			"Recharts",
			"Motion 12",
			"Resend",
			"React Email",
			"Vercel Blob",
			"Vercel",
		],
		gradientColor: "#e75219",
		isFlagship: true,
		isProduction: true,
		clientLogo: "/img/logos/turismochiletours.svg",
		caseStudy: {
			visualPrivacy: "confidential-ui",
			pitch:
				"Una sola herramienta para correr toda la operación diaria de una agencia de turismo en pleno desierto de Atacama. Migra los flujos atrapados en Power Apps a una web moderna, suma módulos que antes vivían en Excel y WhatsApp, y le da al equipo una fuente de verdad común. Diseñado para que ventas, operaciones, guías y administración trabajen sobre los mismos datos — con permisos, auditoría y exportes pensados para el día a día real, no para una demo.",
			duration:
				"≈7 meses, octubre 2025 – mayo 2026, con scope creciente: surgieron mejoras durante el camino que extendieron el cronograma original.",
			inProductionSince:
				"Junio 2026 (previsto) — actualmente en UAT con el jefe y operadoras como usuarios reales.",
			clientName: "TurismoChileTours",
			clientIndustry: "Turismo · Tour operador en San Pedro de Atacama, Chile",
			problem: [
				"La empresa operaba sobre una Power Apps heredada usada por el jefe y las operadoras: cubría lo básico (ventas, cotizaciones, traspasos, pasajeros y tours), pero con controles nativos pensados para uso casual, no para un equipo que pasa horas adentro. La UX y la búsqueda eran tediosas, las validaciones débiles, sin auditoría real y con poca garantía de integridad referencial.",
				"Encima, faltaban módulos clave que la operación ya necesitaba pero no tenía dónde vivir: calendario operativo visual, recepciones de pasajeros en hoteles, validaciones estrictas con auditoría, búsqueda y edición rápida con filtros server-side, permisos granulares por módulo y exportes operativos (hoja de ruta diaria, planillas administrativas).",
				"La Power Apps además era 11 años de operación (2015–2026) viviendo sobre Microsoft Lists, con esquema inconsistente, columnas agregadas y renombradas a lo largo del tiempo, y referencias entre listas mantenidas a mano. Migrar al dominio normalizado de Postgres no era un volcado directo: requería un proceso explícito de extracción, limpieza y normalización por períodos.",
			],
			solution: [
				"La nueva web cubre todos los flujos que estaban atrapados (ventas, pasajeros, traspasos, tours, asignación de operadores) con UX moderna, tablas virtualizadas, filtros server-side y formularios reactivos con validación Zod compartida cliente/servidor.",
				"Suma flujos nuevos que la Power Apps no soportaba: calendario de eventos con drag-and-drop y validación de conflictos en servidor, módulo de recepciones, facturación mayorista, comisiones, flujo de caja con múltiples divisas (CLP/USD), analytics y alertas, aprobaciones y exportes PDF/Excel por día / rango / selección.",
				"El dashboard es un sistema independiente del sitio corporativo y del ecommerce de San Pedro: repos y bases de datos completamente separados. Es la tercera pieza del ecosistema digital del cliente, pero no comparte modelo de datos con las otras dos — cada plataforma tiene su propia responsabilidad y su propio ciclo de vida.",
				"Sistema de roles con permisos por módulo (RoleModulePermission). Perfiles típicos: administración (jefe), operadoras (ventas, cotizaciones, recepciones, traspasos, asignación de operadores). Cada rol ve solo los módulos que necesita.",
				"Migración de 11 años de data en tres pasos: extracción de las Microsoft Lists conectadas a la Power Apps a un Excel maestro, limpieza y normalización en un segundo Excel derivado (tipos, referencias reconciliadas, mapeo a Prisma) e importación por períodos con un script Node que validó cada lote contra el schema Zod compartido.",
			],
			architectureDescription:
				'Aplicación Next.js 16 con App Router, Server Actions como capa de mutación (sin API routes salvo casos puntuales) y React Server Components por defecto. La organización sigue clean architecture por feature ("screaming architecture"): cada dominio vive en src/project/{domain}/ con su actions/, components/, schemas/, types/ y columns/. 22 módulos de dominio (ventas, eventos, calendario, caja, comisiones, proveedores, etc.) y 40+ modelos Prisma con 49+ migraciones. Persistencia en PostgreSQL (Neon) vía Prisma 7. Auth con Better Auth 1.4 (email + password) y permisos granulares por módulo modelados en DB. Tablas y filtros server-side con TanStack Table + paginación cursor-based; formularios con TanStack Form + Zod; estado de servidor con TanStack Query. Archivos (vouchers, PDFs, imágenes) en Vercel Blob; emails transaccionales con Resend + React Email. Exportes generados client-side con @react-pdf/renderer y ExcelJS, importados dinámicamente para no inflar el bundle. Deploy en Vercel con Turbopack y React Compiler. Workflow de desarrollo con SDD (Spec-Driven Development).',
			techStackDetailed: [
				{
					name: "Next.js 16 (App Router + Server Actions)",
					reason:
						"Necesitábamos formularios pesados con validación server-side y mutaciones transaccionales (venta + pasajeros + eventos en un solo flujo). Server Actions evitan armar una API REST paralela y mantienen todo type-safe end-to-end.",
				},
				{
					name: "React 19 + React Compiler",
					reason:
						"El dashboard tiene tablas grandes y filtros reactivos; el compiler memoiza automáticamente sin tener que ensuciar el código con useMemo/useCallback en cada handler.",
				},
				{
					name: "Prisma 7 + PostgreSQL (Neon)",
					reason:
						"El modelo de dominio tiene relaciones densas (venta → pasajeros → evento → proveedor → comisión) que no perdonan tipos vagos. Prisma da migraciones versionadas y type-safety end-to-end; Neon suma branching de DB para previews de Vercel.",
				},
				{
					name: "Better Auth 1.4",
					reason:
						"Necesitaba permisos por módulo, no solo roles. Better Auth es lo bastante flexible para modelar RoleModulePermission sin pelearse con un provider rígido tipo NextAuth.",
				},
				{
					name: "TanStack Table + Virtual",
					reason:
						"Listados de ventas/pasajeros con cientos de filas y filtros combinados. Virtualización + columnas tipadas + paginación server-side fueron requisito desde el día uno.",
				},
				{
					name: "TanStack Form + Zod 4",
					reason:
						"Formularios largos (venta multicanal, evento con N pasajeros) con validación compartida cliente/servidor. Un solo schema Zod corre en ambos lados.",
				},
				{
					name: "shadcn/ui + Tailwind 4 + Radix",
					reason:
						"Control total sobre los componentes (los copiamos al repo), accesibilidad de Radix y Tailwind 4 con theming vía CSS vars para soporte oscuro/claro sin librería de themes.",
				},
				{
					name: "DnD Kit",
					reason:
						"Calendario de eventos con drag-and-drop accesible por teclado y un único DndContext compartido entre las vistas mes / semana / día.",
				},
				{
					name: "@react-pdf/renderer + ExcelJS",
					reason:
						"Exportes operativos (hojas de ruta del día, planillas para administración) generados client-side y descargables al toque. Dynamic import para no cargar las libs hasta que el usuario abre el menú de exportar.",
				},
				{
					name: "MapLibre GL",
					reason:
						"Visualización geográfica de rutas/tours sin lock-in con Mapbox ni costos por load.",
				},
				{
					name: "Resend + React Email",
					reason:
						"Emails transaccionales (vouchers, confirmaciones) con templates en JSX, deliverability decente y SDK Node simple.",
				},
				{
					name: "Vercel Blob + Vercel hosting",
					reason:
						"Vouchers PDF y fotos de tours sin infra extra; deploys por PR con preview URLs e integración nativa con Neon branching.",
				},
			],
			features: [
				{
					title: "Calendario operativo con drag-and-drop",
					description:
						"Tres vistas (mes / semana / día) sobre un único DndContext de DnD Kit. Cada drop dispara un Server Action que valida en transacción conflictos de disponibilidad de proveedores y pasajeros, y exige motivo obligatorio del cambio para auditoría. Si hay conflicto, el evento vuelve a su lugar con un toast explicando qué chocó.",
				},
				{
					title: "Análisis y reportes con filtros",
					description:
						"Analytics con Recharts (ventas, ocupación, voucher promedio, países atendidos) sobre filtros server-side, sumado a exportes operativos: PDF (hoja de ruta diaria, voucher de pasajero, detalle de venta) y Excel (planillas operativas y administrativas) en alcances día / rango / selección, con branding consistente.",
				},
				{
					title: "Facturación mayorista con exportes",
					description:
						"El módulo de Facturación permite seleccionar ventas de un mayorista (Ekatours, Despegar, etc.) dentro de un rango de fechas, marcar varias con multiselect, y generar un PDF de cobro consolidado con el detalle de cada venta (voucher, pasajero, fechas, monto) listo para mandarle al mayorista. El mismo flujo soporta exporte a Excel para conciliación administrativa. Antes era una operación manual mensual repartida entre la Power Apps, planillas Excel y correo; ahora una operadora arma el cobro en menos de un minuto con totales calculados y registro en sistema.",
				},
				{
					title: "Permisos granulares por módulo",
					description:
						"Autorización en el modelo RoleModulePermission: cada rol tiene permisos por módulo (ver / crear / editar / eliminar / aprobar) configurables desde la UI sin tocar código. La sidebar, las acciones de las tablas y los Server Actions chequean el permiso del lado del servidor — la UI nunca es la fuente de verdad de seguridad.",
				},
				{
					title: "Recepciones y traspasos entre agencias",
					description:
						"San Pedro funciona como un ecosistema chico de agencias que se pasan pasajeros entre sí. Dos módulos hermanos resuelven el flujo: Recepciones registra pasajeros recibidos de otras agencias y los inserta en el calendario operativo como cualquier venta (voucher, evento, hoja de ruta); Traspasos manda pasajeros propios a otra agencia con voucher de traspaso, dejando rastro de qué venta original derivó qué pasajero a qué destino. Antes vivía en WhatsApp y Excel — ahora es un canal B2B operable con auditoría.",
				},
				{
					title: "Migración de 11 años de data",
					description:
						"Extracción de Microsoft Lists (2015–2026) a Excel maestro, normalización y reconciliación de referencias en un Excel derivado, y carga por períodos con un script Node que valida cada lote contra el schema Zod compartido con la app antes de tocar producción.",
				},
			],
			metrics: [
				{
					value: "22",
					label: "módulos de dominio",
					caption: "Carpetas en src/project/ (ventas, eventos, caja, comisiones, …).",
				},
				{
					value: "11 años",
					label: "de data histórica migrada",
					caption: "2015–2026 desde Microsoft Lists a Postgres por períodos.",
				},
				{
					value: "~3 min → ~45 s",
					label: "registrar una venta multicanal",
					caption: "Estimación UAT vs Power Apps — menos pantallazos, validación inline.",
				},
				{
					value: "3 → 1",
					label: "fuentes de verdad",
					caption: "Power Apps + Excel + WhatsApp → un solo Postgres con auditoría.",
				},
			],
			timeline: [
				{
					date: "Octubre 2025",
					title: "Kickoff",
					description:
						"Primer contacto con TurismoChileTours, definición de scope y decisión de migrar la Power Apps a una web propia. Primeras carpetas de dominio (auth, agency).",
					icon: "kickoff",
				},
				{
					date: "Oct 2025 – May 2026",
					title: "Desarrollo iterativo",
					description:
						"≈7 meses con scope creciente. Hitos internos: receptions/transfers/providers (nov 2025), billing/departures/analytics (ene 2026), roles + permisos / alerts / commissions / approvals (feb 2026), calendar (mar 2026), drag-and-drop + exportes PDF/Excel (abr 2026), multiselect facturación + hover cards + sale detail accordions (may 2026).",
					icon: "build",
				},
				{
					date: "Mayo 2026",
					title: "UAT con usuarios reales",
					description:
						"En curso con el jefe y operadoras. Migración de data histórica 2015–2026 desde Microsoft Lists corriendo en paralelo.",
					icon: "current",
					isCurrent: true,
				},
				{
					date: "Junio 2026",
					title: "Lanzamiento previsto",
					description: "Salida a producción tras cierre de UAT y carga final de data histórica.",
					icon: "launch",
				},
			],
		},
	},
	{
		id: "bz-consulting",
		imageUrl: "/img/portfolio/bzconsulting/hero.png",
		title: "BZ Consulting",
		shortDescription:
			"Sitio institucional multilingüe con publicación de noticias semanales para empresa de inspección y calibración de tanques de almacenamiento.",
		fullDescription:
			"Sitio corporativo bilingüe (ES/EN) para BZ Consulting, organismo de inspección certificado ISO 17020 especializado en calibración de estanques de almacenamiento y medición de graneles líquidos para el sector petróleo y gas. Construido con Astro como sitio estático puro, con un flujo de publicación de noticias semanales gestionado vía content collections MDX, sin CMS de por medio. Primer proyecto web entregado por IngSimple, en producción y mantenimiento continuo desde 2024.",
		category: "desarrollo-web",
		technologies: [
			"Astro 4",
			"React 18",
			"TypeScript",
			"Tailwind CSS",
			"Radix UI",
			"MDX",
			"@astrolicious/i18n",
			"Embla Carousel",
			"Cloudflare Pages",
			"Cloudflare Workers",
			"Resend",
		],
		liveUrl: "https://bzconsulting.cl",
		gradientColor: "#ea580c",
		isFlagship: true,
		isProduction: true,
		clientLogo: "/img/logos/bzconsulting.png",
		caseStudy: {
			visualPrivacy: "public",
			pitch:
				"Primer proyecto web entregado por IngSimple, hoy con más de dos años en producción. Un sitio institucional bilingüe ultra-liviano sobre Astro, con un flujo de publicación de noticias semanales que el equipo de BZ usa para sostener su presencia digital sin depender de un CMS ni de un developer cada vez que sale una novedad.",
			duration:
				"≈4 semanas de desarrollo inicial (abril–mayo 2024). Mantenimiento continuo desde el lanzamiento.",
			inProductionSince:
				"Mayo 2024 — en producción y mantenimiento activo, con publicación de noticias semanal sostenida hace más de 2 años.",
			clientName: "BZ Consulting",
			clientIndustry:
				"Inspección, calibración y medición de tanques de almacenamiento · Petróleo & Gas (ISO 17020) · Chile y Uruguay",
			problem: [
				"BZ Consulting es un organismo de inspección certificado ISO 17020 con clientes pesados del sector petróleo y gas (ENAP, ENEX, SONACOL, ANCAP, operadores portuarios) y presencia en Chile —Quintero, Talcahuano, San Vicente— y Uruguay. A pesar del peso técnico de la operación, no tenían un canal digital institucional que reflejara ni la trayectoria del equipo ni el nivel de los proyectos que ejecutan.",
				"El requerimiento se planteó simple en superficie pero exigente en práctica: un sitio bilingüe (español e inglés), rápido, sobrio, que comunicara servicios, certificaciones y centro de operaciones, con un canal de contacto operativo para clientes corporativos. Y, sobre todo, una sección de noticias que el equipo de BZ pudiera alimentar con frecuencia para mantener al sitio vivo — sin necesidad de aprender un CMS ni pagar uno.",
				"Era además el PRIMER proyecto web de IngSimple, así que las decisiones técnicas tenían que envejecer bien: stack mantenible por una sola persona, costos operativos cercanos a cero y un flujo de publicación que sobreviviera dos años sin reescribir nada.",
			],
			solution: [
				"Sitio construido en Astro como SSG puro: cada página se precompila a HTML estático, React solo se hidrata en las islas que lo necesitan (formulario de contacto, selector de idioma, carrusel). El resultado es un sitio que rinde como un sitio del 2010 y se ve como uno del 2026.",
				"La sección de noticias se modela como content collection de Astro con esquema Zod (título, cover, lang, fecha): cada noticia es un archivo MDX dentro del repo. Para publicar, basta con sumar un par de archivos (uno en ES, uno en EN), commitear, y Cloudflare Pages dispara el deploy automático. Sin CMS, sin login, sin costos extra — y con todo el historial editorial versionado en git.",
				"El formulario de contacto va a un Cloudflare Worker que reenvía vía Resend, manteniendo el modelo 100% serverless y permitiendo hostear todo el sitio en el tier gratuito de Cloudflare Pages. El multilenguaje (ES/EN) se resuelve con @astrolicious/i18n, con URLs traducidas por idioma (/empresa ↔ /company, /noticias ↔ /news, etc.) para SEO limpio en ambos mercados.",
				"Dos años después, el flujo sigue intacto: BZ pide la noticia, IngSimple agrega los dos MDX, push a main, y Cloudflare Pages publica. Más de 190 artículos publicados de esta forma — sin tocar una línea de código.",
			],
			architectureDescription:
				"Astro 4 en modo Static Site Generation puro, sin adapter SSR. React 18 solo en las islas interactivas (formulario de contacto, selector de idioma, carruseles con Embla). Tailwind CSS + Radix UI siguiendo el patrón shadcn (componentes accesibles, estilo propio). Multilenguaje con @astrolicious/i18n y URLs traducidas por locale. Las noticias viven como content collections MDX con validación Zod en el frontmatter — el bilingüismo se modela como dos archivos por noticia (uno con lang: es, otro con lang: en). Sitemap generado con @astrojs/sitemap, robots.txt dinámico, ViewTransitions nativas de Astro para navegación sin recargar. Hosting en Cloudflare Pages con auto-deploy desde main; el formulario de contacto delega en un Cloudflare Worker que reenvía a Resend, manteniendo el costo operativo cercano a cero. Imágenes servidas en AVIF + WebP con fallback.",
			techStackDetailed: [
				{
					name: "Astro 4 (SSG)",
					reason:
						"Para un sitio institucional con noticias, Astro es la decisión obvia: HTML estático prerenderizado, JavaScript opcional, y un modelo mental simple. Cero runtime overhead, deploys que caben en el tier gratuito de cualquier hosting estático, y un Lighthouse alto sin tener que pelearlo. Para el primer proyecto de IngSimple, era la apuesta más conservadora y a la vez la más correcta.",
				},
				{
					name: "Content Collections + MDX",
					reason:
						"Cada noticia es un archivo MDX con frontmatter validado por Zod. El cliente no necesita un CMS: para publicar, se commitea un par de archivos y Cloudflare Pages despliega solo. Dos años después, el historial editorial completo vive en git, sin migraciones de base de datos ni dependencia de un proveedor de CMS.",
				},
				{
					name: "@astrolicious/i18n",
					reason:
						"Multilenguaje con URLs traducidas por locale (/empresa ↔ /company, /noticias ↔ /news), routing transparente y soporte para contenido bilingüe a nivel collection. SEO limpio en ambos idiomas sin duplicar páginas a mano.",
				},
				{
					name: "React 18 (solo en islas)",
					reason:
						"Astro permite hidratar React solo donde hace falta. En este sitio, React se carga únicamente para el formulario de contacto, el selector de idioma y el carrusel — el resto es HTML puro. Menos JS shipped, mejor performance.",
				},
				{
					name: "Tailwind CSS + Radix UI",
					reason:
						"Patrón shadcn-like: Radix aporta accesibilidad por defecto (foco, ARIA, teclado) y Tailwind da control total del estilo. Sistema reutilizable que después aplicamos en proyectos posteriores de IngSimple.",
				},
				{
					name: "Cloudflare Pages",
					reason:
						"Hosting estático con CDN global, auto-deploy desde main y tier gratuito generoso. Cada commit dispara una build y un nuevo deploy con preview URL. Para un sitio con publicación semanal, el flujo git → deploy automático es la mitad del producto.",
				},
				{
					name: "Cloudflare Worker + Resend",
					reason:
						"El formulario de contacto reenvía a un Worker que hace el POST a Resend. Sin servidor propio, sin SMTP, sin costos fijos. Resend maneja deliverability y el Worker queda como capa fina de validación y CORS.",
				},
				{
					name: "Embla Carousel",
					reason:
						"Carrusel headless, accesible por teclado y muy liviano. Control completo del markup y los estilos, sin la carga de una librería opinada.",
				},
				{
					name: "Imágenes AVIF + WebP",
					reason:
						"Refactor de imágenes a formatos modernos con fallback. Esto explica buena parte del LCP en P75 de 872ms — el LCP suele ser una imagen, y entregarla en AVIF la achica a una fracción del peso.",
				},
			],
			features: [
				{
					title: "Sitio bilingüe (ES/EN) con URLs traducidas",
					description:
						"Cada ruta tiene su versión traducida por locale (/empresa ↔ /company, /noticias ↔ /news, /contacto ↔ /contact). Resuelto con @astrolicious/i18n a nivel de routing, sin duplicar páginas.",
				},
				{
					title: "Publicación semanal de noticias sin CMS",
					description:
						"Cada noticia es un par de archivos MDX (uno ES, uno EN) en el repo. Commit + push a main = deploy automático en Cloudflare Pages. Más de 190 artículos publicados con este flujo en 2 años.",
				},
				{
					title: "Formulario de contacto serverless",
					description:
						"Validación en cliente con React, envío a un Cloudflare Worker que reenvía vía Resend al equipo comercial de BZ. Sin backend propio, sin SMTP, dentro del tier gratuito.",
				},
				{
					title: "Performance medida y validada",
					description:
						"100% de las URLs en zona verde de Core Web Vitals según Cloudflare Web Analytics. LCP en P75 = 872ms, tiempo de carga promedio = 1025ms. SSG + AVIF + CDN de Cloudflare hacen el trabajo.",
				},
				{
					title: "SEO técnico cuidado",
					description:
						"Sitemap automático, robots.txt, OG tags, favicon webp, ViewTransitions para navegación SPA-like, y URLs traducidas por idioma. Base limpia para cualquier estrategia de posicionamiento futura.",
				},
			],
			metrics: [
				{
					value: "190+",
					label: "noticias publicadas",
					caption: "95 ES + 95 EN — pareadas, publicadas semanalmente durante 2 años.",
				},
				{
					value: "100%",
					label: "Core Web Vitals en verde",
					caption: "LCP P75 = 872ms según Cloudflare Web Analytics (últimos 30 días).",
				},
				{
					value: "2+ años",
					label: "en producción",
					caption: "Desde mayo 2024, con mantenimiento y publicación semanal sostenida.",
				},
				{
					value: "2",
					label: "idiomas con URLs traducidas",
					caption: "Español e inglés vía @astrolicious/i18n, SEO limpio en ambos.",
				},
			],
			timeline: [
				{
					date: "Abril 2024",
					title: "Kickoff",
					description:
						"Primer proyecto web de IngSimple. Definición de scope, arquitectura sobre Astro y configuración multilenguaje en los primeros días.",
					icon: "kickoff",
				},
				{
					date: "Abr – May 2024",
					title: "Desarrollo",
					description:
						"≈4 semanas de build: páginas institucionales, sección de noticias con content collections, formulario de contacto vía Cloudflare Worker, multilenguaje y optimización de imágenes.",
					icon: "build",
				},
				{
					date: "Mayo 2024",
					title: "Lanzamiento a producción",
					description:
						"Deploy en Cloudflare Pages, publicación en bzconsulting.cl y arranque del flujo de publicación semanal de noticias.",
					icon: "launch",
				},
				{
					date: "Hoy",
					title: "2+ años de mantenimiento activo",
					description:
						"Más de 190 noticias publicadas, performance Core Web Vitals 100% en verde, sin un solo cambio de stack desde el lanzamiento original.",
					icon: "current",
					isCurrent: true,
				},
			],
		},
	},
	{
		id: "caemp",
		imageUrl: "/img/portfolio/caemp/portrait.png",
		title: "Grupo CAEMP",
		shortDescription:
			"Tres marcas con identidad y dominio propios, servidas desde una única base de código y un solo despliegue mediante arquitectura multi-dominio.",
		fullDescription:
			"Sitio web corporativo de Grupo CAEMP, holding chileno de seguridad y capacitación laboral que opera tres líneas de negocio. Cada línea (OTEC, PLUS y Crecimiento) tiene su propio dominio, color y logotipo, pero todas se sirven desde un mismo proyecto: el dominio de acceso determina, en cada request, qué marca y qué conjunto de rutas se renderiza. Construido con TanStack Start sobre React 19 y TypeScript estricto, resuelve el ruteo por dominio con un rewrite bidireccional a nivel de router, evitando mantener tres sitios separados.",
		category: "desarrollo-web",
		technologies: [
			"TanStack Start",
			"TanStack Router",
			"React 19",
			"TypeScript",
			"Tailwind CSS v4",
			"Nitro v2",
			"Vite",
			"Vercel",
			"Resend",
			"Zod",
		],
		liveUrl: "https://grupocaemp.cl",
		gradientColor: "#0066b3",
		isFlagship: true,
		isProduction: true,
		clientLogo: "/img/logos/caemp.png",
		caseStudy: {
			pitch:
				"Una sola base de código que se comporta como tres sitios distintos: cada marca de Grupo CAEMP vive en su propio dominio, con su color y su logo, pero comparte un único proyecto y un único despliegue.",
			duration: "≈4 meses de desarrollo (noviembre 2025 – marzo 2026).",
			inProductionSince: "Marzo 2026 — en producción en los cuatro dominios desde el lanzamiento.",
			clientName: "Grupo CAEMP",
			clientIndustry: "Seguridad laboral, capacitación y EPP",
			visualPrivacy: "public",
			team: "Desarrollo full-stack end-to-end",
			problem: [
				"Grupo CAEMP agrupa tres líneas de negocio claramente diferenciadas: CAEMP OTEC (capacitación certificada SENCE para minería, energía y telecomunicaciones), CAEMP PLUS (comercialización de equipos de protección personal) y Crecimiento (habilidades blandas, liderazgo y talleres vivenciales). Cada una se dirige a un público distinto y necesitaba presentarse con identidad propia —su color, su logotipo y su dominio— para no diluir su propuesta dentro de una marca paraguas genérica.",
				"La salida intuitiva era levantar un sitio por marca. Esa decisión multiplica el costo: tres bases de código que mantener, tres pipelines de despliegue, tres veces el trabajo para corregir un bug transversal o publicar un componente compartido, y una deriva visual inevitable a medida que cada sitio evoluciona por su cuenta.",
				"El desafío de negocio era sostener tres marcas con identidad fuerte y dominios independientes sin pagar el precio de mantener tres proyectos separados, y sin sacrificar el SEO propio de cada dominio.",
			],
			solution: [
				"La solución es una arquitectura multi-dominio: un único proyecto TanStack Start que sirve cuatro dominios (grupocaemp.cl más los tres de marca) desde un solo despliegue. En cada request, el sistema lee el host y resuelve a qué línea de negocio pertenece mediante un match exacto de dominio —deliberadamente exacto para evitar falsos positivos como que grupocaemp.cl coincida con caemp.cl.",
				"El corazón del mecanismo es un rewrite bidireccional a nivel de router. En la entrada, una visita a caempplus.cl/productos se reescribe internamente a la ruta /plus/productos; en la salida, los links que el router genera hacia /plus/productos se devuelven al usuario como /productos, de modo que la URL del dominio de marca permanece limpia y sin el prefijo interno.",
				"Sobre esa resolución de tenant, cada marca compone su propia experiencia: su set de rutas, su configuración de header y footer, sus colores de Tailwind y sus datos de contenido. Los componentes de UI, el layout y la lógica de formularios y envío de correo se comparten; lo específico de cada negocio vive en módulos separados. El resultado son tres sitios con personalidad propia y un solo lugar donde corregir, mejorar y desplegar.",
			],
			architectureDescription:
				"Frontend en TanStack Start con React 19 y TypeScript estricto, renderizado en servidor sobre Nitro v2 y empaquetado con Vite. El ruteo es file-based con TanStack Router, y la condición multi-dominio se resuelve en tres capas: un mapa de host→tenant (getTenantFromHost con match exacto), un rewrite bidireccional input/output en el router que traduce entre la URL pública por marca y el prefijo de ruta interno (/crecimiento, /plus, /otec), y un middleware de tenant que inyecta marca y prefijo en el contexto de cada request. El theming por marca se aplica con clases de Tailwind v4 condicionadas al prefijo activo; los componentes de UI usan Radix y shadcn con class-variance-authority. Los formularios se validan con TanStack Form y Zod, y las solicitudes de contacto y cotización se canalizan a través de API routes alojadas en el dominio del grupo (grupocaemp.cl) que envían correo transaccional con Resend y React Email. Todo se entrega como un único despliegue en Vercel, con los cuatro dominios apuntando al mismo build y una whitelist de CORS por origen.",
			techStackIntro:
				"Cada elección respondió a una restricción concreta del proyecto, no a una moda.",
			techStackDetailed: [
				{
					name: "TanStack Start + TanStack Router",
					reason:
						"Framework full-stack con SSR sobre Nitro y ruteo file-based que expone un hook de rewrite a nivel de router.",
					tag: "Multi-tenant",
					detail: {
						constraint:
							"Servir tres marcas con dominios independientes desde un mismo proyecto, manteniendo URLs limpias por marca y SEO propio de cada dominio.",
						decision:
							"Resolver el tenant por host y aplicar un rewrite bidireccional en el router: la entrada agrega el prefijo de marca (/plus, /otec, /crecimiento) y la salida lo elimina de los links generados.",
						outcome:
							"Un solo despliegue atiende cuatro dominios; el dominio de acceso determina la marca renderizada sin duplicar bases de código ni romper la navegación interna.",
					},
				},
				{
					name: "Resolución de dominio por host (capa de tenant)",
					reason:
						"Mapa explícito host→marca con match exacto y middleware que inyecta marca y prefijo en el contexto de cada request.",
					tag: "Multi-tenant",
					detail: {
						constraint:
							"Distinguir dominios cuyos nombres son subcadenas unos de otros (grupocaemp.cl contiene caemp.cl), donde un includes ingenuo enrutaría al tenant equivocado.",
						decision:
							"Comparación exacta de hostname (con soporte de prefijo www y descarte de puerto) y un fallback explícito al dominio del grupo para cualquier host no reconocido.",
						outcome:
							"Enrutamiento por marca determinista y sin ambigüedad, con un único punto de verdad para agregar o cambiar dominios.",
					},
				},
				{
					name: "Tailwind CSS v4 + theming por marca",
					reason:
						"Tokens de color por línea de negocio (azul OTEC, verde PLUS, púrpura Crecimiento) aplicados según el prefijo activo.",
					tag: "Branding",
					detail: {
						constraint:
							"Cada marca debe verse distinta —color, logo, header y footer propios— sin fragmentar el sistema de componentes.",
						decision:
							"Componentes de UI compartidos (Radix + shadcn + class-variance-authority) y diferenciación visual mediante clases de Tailwind condicionadas al tenant resuelto.",
						outcome:
							"Identidad visual diferenciada por marca reutilizando un único design system, sin estilos duplicados por sitio.",
					},
				},
				{
					name: "Nitro v2 + Vercel",
					reason:
						"Servidor SSR universal que despliega los cuatro dominios como un único build en Vercel.",
					tag: "Performance",
				},
				{
					name: "TanStack Form + Zod",
					reason:
						"Formularios de contacto y cotización por marca con validación de esquema tipada de extremo a extremo.",
				},
				{
					name: "Resend + React Email",
					reason:
						"Correo transaccional con plantillas en React, canalizado por API routes alojadas en el dominio del grupo.",
				},
				{
					name: "TypeScript estricto",
					reason:
						"strict, noUnusedLocals y noUncheckedSideEffectImports activos para sostener la lógica de tenant sin regresiones.",
				},
			],
			features: [
				{
					title: "Arquitectura multi-dominio de marca",
					description:
						"Un solo proyecto sirve cuatro dominios. El host de cada request resuelve la línea de negocio y un rewrite bidireccional traduce entre la URL pública de la marca y el prefijo de ruta interno, manteniendo URLs limpias por dominio.",
				},
				{
					title: "Tres líneas de negocio diferenciadas",
					description:
						"CAEMP OTEC (capacitación certificada SENCE), CAEMP PLUS (equipos de protección personal) y Crecimiento (habilidades blandas y talleres), cada una con su catálogo, sus secciones y su contenido propios.",
				},
				{
					title: "SEO independiente por dominio",
					description:
						"Cada dominio se presenta como un sitio propio con su metadata y locale es_CL, preservando la autoridad y el posicionamiento individual de cada marca.",
				},
				{
					title: "Catálogos y detalle por negocio",
					description:
						"Cursos para OTEC y Crecimiento, productos EPP para PLUS, y talleres, programas y teatro aplicado para Crecimiento, con páginas de listado filtrable y de detalle.",
				},
				{
					title: "Contenido compartido vs. específico",
					description:
						"UI, layout, navegación cross-tenant y lógica de formularios son comunes; las secciones, los datos y la identidad de cada marca viven en módulos separados.",
				},
				{
					title: "Contacto y cotización con correo transaccional",
					description:
						"Formularios validados por marca cuyas solicitudes se centralizan en API routes del dominio del grupo y se envían por correo con plantillas en React Email.",
				},
			],
			metrics: [
				{
					value: "4",
					label: "dominios servidos",
					caption: "grupocaemp.cl más las tres marcas, desde un mismo proyecto",
				},
				{
					value: "1",
					label: "base de código",
					caption: "sin sitios separados que mantener en paralelo",
				},
				{
					value: "3",
					label: "marcas con identidad propia",
					caption: "color, logo y dominio diferenciados por línea de negocio",
				},
				{
					value: "1",
					label: "despliegue único",
					caption: "un solo build en Vercel atiende los cuatro dominios",
				},
			],
			timeline: [
				{
					date: "Noviembre 2025",
					title: "Kickoff",
					description:
						"Arranque del proyecto y definición de la arquitectura multi-dominio para las tres líneas de negocio del grupo.",
					icon: "kickoff",
				},
				{
					date: "Nov 2025 – Mar 2026",
					title: "Desarrollo",
					description:
						"Implementación de la resolución de tenant por host, el rewrite bidireccional de rutas, el theming por marca sobre un design system compartido y la carga de contenido de cada línea de negocio.",
					icon: "build",
				},
				{
					date: "Marzo 2026",
					title: "Lanzamiento en producción",
					description:
						"Publicación de los cuatro dominios apuntando a un único despliegue en Vercel.",
					icon: "launch",
				},
				{
					date: "Hoy",
					title: "En producción",
					description:
						"Los cuatro dominios operan sobre una única base de código, con mejora continua de contenido y secciones de cada marca.",
					icon: "current",
					isCurrent: true,
				},
			],
		},
	},
	{
		id: "gis-test",
		imageUrl: "/img/portfolio/gis.png",
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
		id: "auditoria-mockup",
		imageUrl: "/img/portfolio/auditoria-mockup.png",
		title: "Dashboard - Seguimiento de Auditorías",
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
		id: "inmobiliaria",
		imageUrl: "/img/portfolio/inmobiliaria.png",
		title: "Prototipo Inmobiliaria",
		shortDescription: "Prototipo de sitio web para proyecto inmobiliario",
		fullDescription:
			"Sitio web prototipo para una inmobiliaria, presentando un proyecto de loteo de terrenos con enfoque en biodiversidad. Diseño elegante con tipografías Montserrat e Inter.",
		category: "desarrollo-web",
		technologies: ["Vite", "React", "TypeScript", "Google Fonts"],
		liveUrl: "https://prototipo-inmobiliaria.vercel.app",
		gradientColor: "#ec4899",
	},
	{
		id: "raspberry-pi-mockup",
		imageUrl: "/img/portfolio/monitoreo-ambiental.png",
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
		imageUrl: "/img/portfolio/emprende-tu-vida.png",
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
		imageUrl: "/img/portfolio/dashboard-reportes.png",
		title: "Report Dashboard",
		shortDescription: "Dashboard de reportes con visualización geoespacial",
		fullDescription:
			"Panel de control para gestión y visualización de reportes con integración de mapas MapLibre GL, gráficos Recharts y componentes shadcn/ui. Permite analizar datos de manera geoespacial y generar insights visuales.",
		category: "desarrollo-web",
		technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MapLibre GL", "Recharts", "shadcn/ui"],
		liveUrl: "https://report-dashboard-eta.vercel.app",
		gradientColor: "#dc2626",
	},
	{
		id: "aiep-pei",
		imageUrl: "/img/portfolio/placeholder.jpg",
		title: "Desafío PEI — AIEP",
		shortDescription:
			"Juego de preguntas tipo Kahoot en tiempo real para evaluar el nuevo Plan Educativo Institucional de AIEP en un evento en vivo a nivel nacional.",
		fullDescription:
			"Plataforma de quiz interactivo desarrollada para AIEP (institución de educación superior chilena con 26 sedes) para evaluar el entendimiento de su nuevo Plan Educativo Institucional 2025-2029. Diseñada para un evento corporativo en vivo con hasta 1.000 participantes simultáneos distribuidos en todo Chile, con admin que controla el flujo de preguntas y dashboard de estadísticas por sede en tiempo real. Stack Next.js 15 + Postgres + polling, deliberadamente sin WebSockets para mantener simplicidad operativa.",
		category: "desarrollo-web",
		technologies: [
			"Next.js 15",
			"React 19",
			"TypeScript",
			"Tailwind CSS 4",
			"shadcn/ui",
			"Prisma 7",
			"PostgreSQL",
			"Better Auth",
			"TanStack Form",
			"Zod 4",
			"Motion",
			"Recharts",
			"React Confetti",
			"Sonner",
			"k6 (load testing)",
			"Vercel",
		],
		gradientColor: "#b40000",
		isFlagship: true,
		isProduction: true,
		clientLogo: "/img/logos/aiep.svg",
		caseStudy: {
			visualPrivacy: "confidential-ui",
			pitch:
				'"Desafío PEI" es un juego tipo Kahoot construido a medida para que AIEP evaluara —en vivo, simultáneamente y en todo Chile— el entendimiento de su nuevo Plan Educativo Institucional. Soportó 600-700 trabajadores conectados desde 26 sedes en un único evento, sin caídas, sin WebSockets, y con un admin que orquestaba el flujo desde una pantalla.',
			duration:
				"≈2 meses entre kickoff y evento oficial (octubre–diciembre 2025), con teaser previo de validación en noviembre. Proyecto cerrado tras el evento.",
			inProductionSince:
				"17 de diciembre 2025 — fecha del evento oficial nacional, con dos sesiones (mañana y tarde) y sets de preguntas distintos para cada una.",
			clientName: "AIEP — Instituto Profesional",
			clientIndustry:
				"Educación superior técnico-profesional · 26 sedes en Chile · ~6.000 trabajadores y miles de estudiantes",
			team: "Desarrollo end-to-end + acompañamiento durante el evento en vivo",
			userBreakdown:
				"Multi-rol: Participantes (trabajadores AIEP) + Administrador del evento (control central)",
			problem: [
				{
					headline: "Comunicar un PEI a 6.000 personas no es lo mismo que enviar un PDF.",
					body: "AIEP estaba lanzando su nuevo Plan Educativo Institucional 2025-2029 y necesitaba que todos sus trabajadores —repartidos en 26 sedes a lo largo de Chile— lo conocieran y, sobre todo, lo entendieran. Mandar un correo con un adjunto y rezar no era opción: necesitaban un mecanismo que generara atención real y permitiera medir el entendimiento.",
				},
				{
					headline: "Un evento corporativo nacional pide una sola toma sin segunda oportunidad.",
					body: "La activación se planeó como un evento en vivo único, transmitido a todas las sedes en paralelo, en dos sesiones (mañana y tarde). Sin retries: si el sistema fallaba durante el evento, no había ventana para arreglarlo. La capacidad esperada era de 600 a 700 personas concurrentes, pero el techo había que dejarlo más alto.",
				},
				{
					headline: "Kahoot resolvía el formato, pero no el control.",
					body: "Los productos genéricos de quiz en vivo (Kahoot, Mentimeter) cubrían el formato base, pero no permitían el grado de control narrativo, branding, segmentación por sede ni el flujo específico que AIEP necesitaba: pausas de revisión, ranking por sede, sets distintos por sesión, sorteo con criterios propios y exportes para RRHH posteriores.",
				},
				{
					headline: "Y el tiempo era el tiempo.",
					body: "Desde la decisión hasta el evento había ≈2 meses. Suficiente para construir bien, pero no para experimentar con infraestructura cara o riesgosa. La decisión técnica tenía que privilegiar lo que más probabilidades tenía de funcionar el día D.",
				},
			],
			solution: [
				{
					headline: "Un Kahoot a medida, con la operación que el cliente realmente necesitaba.",
					body: "Construimos una plataforma propia con dos roles: Participante (vista de juego) y Administrador (control central). El admin orquesta el evento en vivo desde un dashboard: activa cada pregunta cuando corresponde, ve la distribución de respuestas en tiempo real, muestra el ranking por sede en las pausas y dispara el sorteo final entre quienes obtuvieron 10/10.",
				},
				{
					headline: "Polling cada 2-4 segundos en lugar de WebSockets — y funcionó.",
					body: "La decisión técnica más importante del proyecto fue NO usar WebSockets ni Ably. Para una trivia con preguntas de 60 segundos, una latencia de sincronización de 2-4 segundos es invisible para el usuario, y reduce drásticamente la complejidad operativa: cero infraestructura adicional, menos puntos de falla, costo cercano a cero, debugging trivial. Lo validamos con un load test de k6 simulando 1.000 usuarios concurrentes antes del evento.",
				},
				{
					headline: "UX pensada para evento corporativo real, no para una demo.",
					body: "Tres decisiones de UX deliberadas: (1) Sin feedback inmediato — el participante no sabe si acertó hasta el final, evitando el abandono temprano que mata el engagement; (2) Entrada tardía permitida — quienes se conectan en la pregunta 5 pueden responder de la 1 a la 5 y sincronizarse, sin penalizar atrasos típicos de eventos corporativos; (3) Pregunta bonus para los que no llegaron a 10/10, manteniendo el juego activo hasta el final para todos.",
				},
				{
					headline: "Dos sets de preguntas, dos sesiones, mismo sistema.",
					body: "El evento se hizo en dos turnos (mañana y tarde) con sets de preguntas distintos para evitar contaminación entre sesiones. El sistema soporta múltiples GameSession activas en paralelo, cada una con su questionSet (AM/PM) y su propio flujo de control, sin lógica especial.",
				},
				{
					headline: "El día del evento: cero incidentes técnicos.",
					body: "El 17 de diciembre 2025 corrieron las dos sesiones con 600-700 conectados cada una. El sistema operó sin caídas, sin glitches de sincronización, sin tener que tocar el código en vivo. El admin manejó todo el evento desde un único panel.",
				},
			],
			architectureDescription:
				"Aplicación Next.js 15 (App Router, Turbopack) con React 19 y TypeScript estricto, desplegada en Vercel. Persistencia en PostgreSQL vía Prisma 7 con el driver adapter de pg. Autenticación con Better Auth (validación de correos @aiep.cl). La sincronización de estado de juego se hace por polling: cada cliente consulta `getActiveGameSession()` cada 2-4 segundos vía Server Actions, recuperando la pregunta activa, el tiempo restante y el estado de la sesión. El admin tiene acciones server-side dedicadas (`activateQuestion`, `moveToNextQuestion`, `resumeFromReview`, `moveToRaffle`) que actualizan la GameSession y disparan la actualización implícita en todos los clientes via su próximo poll. Validación end-to-end con Zod compartida entre cliente y server. Stats por sede calculadas server-side con queries Prisma agregadas y renderizadas con Recharts. Carga validada con k6 antes del evento: 1.000 VUs, p(95) bajo 500ms.",
			techStackDetailed: [
				{
					name: "Next.js 15 + Server Actions",
					tag: "Backend liviano",
					reason:
						"Sin API REST separada: cada acción del admin (activar pregunta, mover al siguiente, sortear) y del participante (responder, refetchar estado) corre como Server Action tipada end-to-end. Para un evento puntual es lo más simple posible — sin servicio aparte, sin contratos duplicados.",
					detail: {
						constraint:
							"Necesitábamos lógica server-side robusta pero sin la sobrecarga de mantener una API REST aparte para un evento puntual.",
						decision:
							"Server Actions de Next.js para todo lo transaccional: control del juego, registro de respuestas, cálculo de stats. La validación corre con Zod en el mismo schema que usa el formulario del cliente.",
						outcome:
							"Una sola base de código, tipos compartidos sin esfuerzo, deploy atómico de cliente + server en cada push.",
					},
				},
				{
					name: "Polling 2-4s en lugar de WebSockets",
					tag: "Pragmatismo",
					reason:
						"La decisión técnica más importante del proyecto. Para un quiz con preguntas de 60s, una latencia de 2-4s es invisible. WebSockets habría sumado infraestructura, costo y puntos de falla sin beneficio perceptible.",
					detail: {
						constraint:
							"Sincronizar el estado del juego entre admin y 600-1.000 participantes en un evento de una sola toma, sin margen para fallas.",
						decision:
							"Polling con `setInterval` cada 2-4 segundos contra Server Actions. Cero servidores de WebSockets, cero servicio de tiempo real externo, cero estado en memoria que pueda perderse.",
						outcome:
							"Sistema operó sin caídas durante las dos sesiones del evento. Costo operacional cercano a cero. Validado bajo carga con k6 antes del evento.",
					},
				},
				{
					name: "Prisma 7 + PostgreSQL",
					tag: "Integridad",
					reason:
						"Las respuestas no podían duplicarse ni perderse. Constraints únicos en (sessionId, userId, questionId) garantizan en base que una persona no responde dos veces la misma pregunta — la app no tiene que adivinar.",
					detail: {
						constraint:
							"Bajo carga concurrente, dos clics rápidos del mismo usuario, doble submit por reconexión, o respuestas tardías post-cierre podían contaminar las stats.",
						decision:
							"Modelo relacional en Postgres con UNIQUE constraint en (sessionId, userId, questionId) para OfficialAnswer y en (sessionId, questionId) para QuestionActivation. La integridad la garantiza la DB, no el código de aplicación.",
						outcome:
							"Stats limpias en tiempo real durante el evento, sin necesidad de deduplicar a posteriori.",
					},
				},
				{
					name: "Better Auth",
					tag: "Identidad propia",
					reason:
						"Validación de correos institucionales @aiep.cl + esquema de roles propio sin lock-in a un SaaS de identidad. Para un cliente educativo grande, los datos de usuarios no se mandan a terceros.",
				},
				{
					name: "k6 load testing",
					tag: "Validación previa",
					reason:
						"Antes del evento corrimos un load test simulando 1.000 VUs durante 10 minutos contra los endpoints críticos. Validó que el polling escalaba sin sobrecargar Postgres y que el p(95) quedaba bajo 500ms. Sin ese test, el polling era una apuesta — con ese test, fue una decisión informada.",
				},
				{
					name: "TanStack Form + Zod 4",
					tag: "Validación compartida",
					reason:
						"Mismo schema Zod en el formulario de registro del participante y en la Server Action que lo procesa. Nada llega a la DB sin validar dos veces con la misma fuente de verdad.",
				},
				{
					name: "shadcn/ui + Tailwind 4 + Motion",
					tag: "UI",
					reason:
						"Componentes accesibles con control total del estilo. Motion para transiciones entre estados (pregunta → pausa → resultados), React Confetti para el momento del ganador. UX cuidada en cada transición — esto se proyectaba en vivo a 26 sedes.",
				},
				{
					name: "Recharts",
					tag: "Stats en vivo",
					reason:
						"Gráficos de barras con la distribución de respuestas por opción y el ranking de sedes, actualizados en el dashboard del admin durante las pausas de revisión.",
				},
				{
					name: "Vercel",
					tag: "Deploy",
					reason:
						"Auto-deploy desde main, preview por PR, integración nativa con Vercel Analytics. Para un evento con fecha fija, la tranquilidad de saber que cada push está deployado en segundos vale oro.",
				},
			],
			techStackIntro:
				"Cada elección técnica respondió al constraint dominante: el evento era una sola toma, sin segunda oportunidad. Privilegiamos lo conocido y validado sobre lo novedoso.",
			features: [
				{
					title: "Polling vs WebSockets — y por qué ganó",
					description:
						"Sincronización del estado del juego mediante polling cada 2-4 segundos a Server Actions de Next.js. Sin infraestructura de WebSockets, sin servicio externo, sin estado en memoria. Validado con k6 hasta 1.000 usuarios concurrentes con p(95) bajo 500ms.",
				},
				{
					title: "Admin con control narrativo del evento",
					description:
						"Dashboard que orquesta el evento en vivo: activa cada pregunta manualmente, ve la distribución de respuestas en tiempo real, controla las pausas de revisión (después de P4 y P8), muestra ranking por sede y dispara el sorteo final. Una sola persona maneja todo el evento desde una pantalla.",
				},
				{
					title: "Sin feedback inmediato (anti-abandono)",
					description:
						"El participante no sabe si acertó hasta el final del juego. Decisión deliberada para evitar que las personas que fallan temprano se desconecten — todos llegan al final con la sensación de poder ganar. Aumenta el engagement de punta a punta.",
				},
				{
					title: "Entrada tardía inteligente",
					description:
						"Quienes se conectan después del inicio pueden responder desde la pregunta 1 hasta la que está activa. El sistema los sincroniza automáticamente. En eventos corporativos las llegadas tarde son inevitables — penalizarlas era penalizar la participación.",
				},
				{
					title: "Ranking por sede en pausas",
					description:
						"Después de las preguntas 4 y 8 el evento pausa para mostrar el ranking de las 26 sedes según % de respuestas correctas. Genera competencia interna entre campus y mantiene la atención cuando podría caer.",
				},
				{
					title: "Sorteo final + pregunta bonus",
					description:
						"Quienes obtienen 10/10 entran al sorteo aleatorio del premio principal. Quienes no llegaron a 10/10 acceden a una pregunta bonus de consolación, evitando que el juego termine como derrota para la mayoría.",
				},
			],
			metrics: [
				{
					value: "600-700",
					label: "participantes en vivo",
					caption: "Conectados simultáneamente en cada sesión, desde 26 sedes en todo Chile.",
				},
				{
					value: "1.000 VUs",
					label: "validados con load test",
					caption: "k6 simuló 1.000 usuarios concurrentes con p(95) < 500ms antes del evento.",
				},
				{
					value: "0",
					label: "incidentes durante el evento",
					caption: "Las dos sesiones del 17/dic/2025 corrieron sin caídas ni glitches.",
				},
				{
					value: "2 + 2",
					label: "sesiones / sets de preguntas",
					caption: "Mañana y tarde con preguntas distintas, mismo sistema, sin lógica especial.",
				},
			],
			timeline: [
				{
					date: "Octubre 2025",
					title: "Kickoff",
					description:
						"Definición de scope, arquitectura sobre Next.js + Postgres y decisión clave de polling vs WebSockets. Primeras vistas y modelo de datos.",
					icon: "kickoff",
				},
				{
					date: "Noviembre 2025",
					title: "Teaser de validación",
					description:
						"Lanzamiento de un teaser previo con 3 preguntas y reintentos para validar UX, copy y comportamiento bajo concurrencia real antes del evento oficial.",
					icon: "build",
				},
				{
					date: "Diciembre 2025",
					title: "Sprint final + load testing",
					description:
						"Admin dashboard completo, ranking por sede, sistema de sorteo, dos sets de preguntas. Load test con k6 simulando 1.000 usuarios concurrentes.",
					icon: "build",
				},
				{
					date: "17 Dic 2025",
					title: "Evento oficial — dos sesiones",
					description:
						"Sesiones 11:00 y 16:00 con 600-700 trabajadores conectados desde 26 sedes. Sistema operó sin caídas durante el evento en vivo.",
					icon: "launch",
					isCurrent: true,
				},
			],
		},
	},
]
