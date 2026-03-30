export type ProjectCategory =
	| "desarrollo-web"
	| "power-platform"
	| "capacitaciones"
	| "reportabilidad"

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
		gradientColor: "#6366f1",
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
