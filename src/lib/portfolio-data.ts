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
	role: string
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
			role: "Diseño, frontend, backend, infraestructura y soporte continuo",
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
		title: "Busanc",
		shortDescription: "Plataforma de gestión empresarial y administración de edificios",
		fullDescription:
			"Sistema completo de gestión empresarial con frontend en Next.js y backend en NestJS. Portal de acceso para empleados con sistema de autenticación, gestión de operaciones de edificios y módulos administrativos.",
		category: "desarrollo-web",
		technologies: ["Next.js", "NestJS", "TypeScript", "Tailwind CSS", "Node.js"],
		liveUrl: "https://busanc-frontend.vercel.app",
		gradientColor: "#14b8a6",
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
