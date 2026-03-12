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
	// ── Desarrollo Web (20 proyectos) ──
	{
		id: "web-01",
		imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
		title: "Portal Corporativo Andina",
		shortDescription: "Sitio institucional con CMS headless",
		fullDescription:
			"Desarrollo de portal corporativo con Next.js y Sanity CMS. Sistema de gestión de contenidos para equipo no técnico, optimizado para SEO y rendimiento.",
		category: "desarrollo-web",
		technologies: ["Next.js", "React", "Sanity", "Tailwind CSS", "Vercel"],
		liveUrl: "https://example.com",
		githubUrl: "https://github.com/example/andina",
		gradientColor: "#6366f1",
	},
	{
		id: "web-02",
		imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
		title: "E-commerce TechStore",
		shortDescription: "Tienda online con pasarela de pagos",
		fullDescription:
			"Plataforma e-commerce completa con carrito de compras, integración Stripe, gestión de inventario y panel de administración.",
		category: "desarrollo-web",
		technologies: ["Next.js", "Stripe", "PostgreSQL", "Prisma", "Tailwind CSS"],
		liveUrl: "https://example.com",
		githubUrl: "https://github.com/example/techstore",
		gradientColor: "#14b8a6",
	},
	{
		id: "web-03",
		imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
		title: "Dashboard Logístico",
		shortDescription: "Panel de control en tiempo real",
		fullDescription:
			"Dashboard interactivo para monitoreo de flota y entregas en tiempo real. Integración con APIs de geolocalización y notificaciones push.",
		category: "desarrollo-web",
		technologies: ["React", "TypeScript", "Socket.IO", "Mapbox", "Node.js"],
		liveUrl: "https://example.com",
		gradientColor: "#f59e0b",
	},
	{
		id: "web-04",
		imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=600&fit=crop",
		title: "Plataforma Educativa Online",
		shortDescription: "LMS con videoconferencia integrada",
		fullDescription:
			"Sistema de gestión de aprendizaje con cursos on-demand, evaluaciones automatizadas, certificados digitales y salas de videoconferencia.",
		category: "desarrollo-web",
		technologies: ["Next.js", "Supabase", "WebRTC", "Tailwind CSS", "Vercel"],
		liveUrl: "https://example.com",
		githubUrl: "https://github.com/example/eduplat",
		gradientColor: "#8b5cf6",
	},
	{
		id: "web-05",
		imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
		title: "App de Gestión Inmobiliaria",
		shortDescription: "CRM para corredores de propiedades",
		fullDescription:
			"Aplicación web para gestión de propiedades, clientes y visitas. Incluye mapa interactivo, filtros avanzados y generación automática de fichas.",
		category: "desarrollo-web",
		technologies: ["React", "Node.js", "MongoDB", "Google Maps API", "AWS S3"],
		liveUrl: "https://example.com",
		gradientColor: "#ec4899",
	},
	{
		id: "web-06",
		imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop",
		title: "API REST Microservicios",
		shortDescription: "Arquitectura de microservicios escalable",
		fullDescription:
			"Diseño e implementación de arquitectura de microservicios con API Gateway, autenticación JWT, rate limiting y documentación OpenAPI.",
		category: "desarrollo-web",
		technologies: ["Node.js", "Express", "Docker", "Redis", "PostgreSQL"],
		githubUrl: "https://github.com/example/microservices",
		gradientColor: "#06b6d4",
	},
	{
		id: "web-07",
		imageUrl: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
		title: "App Móvil Salud Digital",
		shortDescription: "PWA para seguimiento de pacientes",
		fullDescription:
			"Progressive Web App para seguimiento de tratamientos médicos. Recordatorios, historial clínico digital y comunicación paciente-doctor.",
		category: "desarrollo-web",
		technologies: ["React", "PWA", "Firebase", "Tailwind CSS", "Node.js"],
		liveUrl: "https://example.com",
		gradientColor: "#10b981",
	},
	{
		id: "web-08",
		imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
		title: "Intranet Corporativa",
		shortDescription: "Red interna con gestión documental",
		fullDescription:
			"Intranet con directorio de empleados, gestión documental, noticias internas, reserva de salas y solicitudes de vacaciones.",
		category: "desarrollo-web",
		technologies: ["Next.js", "NextAuth", "PostgreSQL", "Prisma", "Azure"],
		liveUrl: "https://example.com",
		gradientColor: "#6366f1",
	},
	{
		id: "web-09",
		imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f2?w=800&h=600&fit=crop",
		title: "Landing Page Festival",
		shortDescription: "Sitio promocional con animaciones",
		fullDescription:
			"Landing page de alto impacto visual para festival de música. Animaciones scroll-driven, venta de entradas y cuenta regresiva.",
		category: "desarrollo-web",
		technologies: ["Next.js", "Framer Motion", "GSAP", "Tailwind CSS"],
		liveUrl: "https://example.com",
		githubUrl: "https://github.com/example/festival",
		gradientColor: "#f43f5e",
	},
	{
		id: "web-10",
		imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop",
		title: "Blog Técnico Dev",
		shortDescription: "Blog con MDX y syntax highlighting",
		fullDescription:
			"Blog técnico con soporte MDX, syntax highlighting, búsqueda full-text, sistema de tags, RSS feed y modo oscuro.",
		category: "desarrollo-web",
		technologies: ["Next.js", "MDX", "Tailwind CSS", "Vercel", "Algolia"],
		liveUrl: "https://example.com",
		githubUrl: "https://github.com/example/devblog",
		gradientColor: "#14b8a6",
	},
	{
		id: "web-11",
		imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
		title: "Sistema de Facturación",
		shortDescription: "Facturación electrónica SII Chile",
		fullDescription:
			"Sistema de facturación electrónica integrado con el SII. Generación de DTEs, folios, libros de compra/venta y reportes tributarios.",
		category: "desarrollo-web",
		technologies: ["React", "Node.js", "PostgreSQL", "XML", "Docker"],
		liveUrl: "https://example.com",
		gradientColor: "#f59e0b",
	},
	{
		id: "web-12",
		imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
		title: "Plataforma de Reclutamiento",
		shortDescription: "ATS con matching inteligente",
		fullDescription:
			"Applicant Tracking System con parsing de CVs, matching inteligente candidato-vacante, pipeline visual y reportes de reclutamiento.",
		category: "desarrollo-web",
		technologies: ["Next.js", "OpenAI API", "Supabase", "Tailwind CSS"],
		liveUrl: "https://example.com",
		githubUrl: "https://github.com/example/recruit",
		gradientColor: "#8b5cf6",
	},
	{
		id: "web-13",
		imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop",
		title: "Monitor de Infraestructura",
		shortDescription: "Monitoreo de servidores y servicios",
		fullDescription:
			"Panel de monitoreo de infraestructura cloud con alertas configurables, métricas históricas, uptime tracking y status page público.",
		category: "desarrollo-web",
		technologies: ["React", "Grafana", "InfluxDB", "WebSocket", "Docker"],
		githubUrl: "https://github.com/example/monitor",
		gradientColor: "#06b6d4",
	},
	{
		id: "web-14",
		imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop",
		title: "Marketplace Servicios",
		shortDescription: "Plataforma de servicios freelance",
		fullDescription:
			"Marketplace para conectar profesionales con clientes. Sistema de cotizaciones, pagos escrow, evaluaciones y chat en tiempo real.",
		category: "desarrollo-web",
		technologies: ["Next.js", "Stripe Connect", "Supabase", "Tailwind CSS"],
		liveUrl: "https://example.com",
		gradientColor: "#ec4899",
	},
	{
		id: "web-15",
		imageUrl: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&h=600&fit=crop",
		title: "Gestor de Proyectos",
		shortDescription: "Kanban con sprints y reportes",
		fullDescription:
			"Herramienta de gestión de proyectos ágiles con tableros Kanban, sprints, burndown charts, time tracking y reportes de productividad.",
		category: "desarrollo-web",
		technologies: ["React", "TypeScript", "DnD Kit", "PostgreSQL", "Redis"],
		liveUrl: "https://example.com",
		githubUrl: "https://github.com/example/projmgr",
		gradientColor: "#10b981",
	},
	{
		id: "web-16",
		imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
		title: "Portal de Noticias",
		shortDescription: "Medio digital con suscripciones",
		fullDescription:
			"Portal de noticias con sistema de suscripciones, paywall inteligente, newsletter automatizado y panel editorial colaborativo.",
		category: "desarrollo-web",
		technologies: ["Next.js", "Stripe", "Sanity", "Tailwind CSS", "Vercel"],
		liveUrl: "https://example.com",
		gradientColor: "#6366f1",
	},
	{
		id: "web-17",
		imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop",
		title: "Sistema de Reservas",
		shortDescription: "Booking online para restaurantes",
		fullDescription:
			"Sistema de reservas online con gestión de mesas, confirmaciones automáticas por email/SMS, waitlist y analytics de ocupación.",
		category: "desarrollo-web",
		technologies: ["React", "Node.js", "PostgreSQL", "Twilio", "SendGrid"],
		liveUrl: "https://example.com",
		gradientColor: "#f43f5e",
	},
	{
		id: "web-18",
		imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
		title: "Plataforma de Encuestas",
		shortDescription: "Creador de formularios avanzados",
		fullDescription:
			"Plataforma para crear encuestas con lógica condicional, branching, múltiples tipos de pregunta y dashboards de resultados en tiempo real.",
		category: "desarrollo-web",
		technologies: ["Next.js", "React Hook Form", "Zod", "Supabase", "D3.js"],
		liveUrl: "https://example.com",
		githubUrl: "https://github.com/example/surveys",
		gradientColor: "#14b8a6",
	},
	{
		id: "web-19",
		imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop",
		title: "App de Delivery",
		shortDescription: "Plataforma de delivery con tracking",
		fullDescription:
			"Aplicación de delivery con tracking en tiempo real, estimación de tiempos, notificaciones push y sistema de propinas.",
		category: "desarrollo-web",
		technologies: ["React Native Web", "Node.js", "MongoDB", "Socket.IO", "Google Maps"],
		liveUrl: "https://example.com",
		gradientColor: "#f59e0b",
	},
	{
		id: "web-20",
		imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
		title: "SaaS Analytics",
		shortDescription: "Plataforma de analytics para startups",
		fullDescription:
			"SaaS de analytics orientado a startups. Tracking de eventos, funnels, cohortes, dashboards personalizables y exportación de datos.",
		category: "desarrollo-web",
		technologies: ["Next.js", "ClickHouse", "Redis", "Tailwind CSS", "AWS"],
		liveUrl: "https://example.com",
		githubUrl: "https://github.com/example/analytics",
		gradientColor: "#8b5cf6",
	},

	// ── Power Platform (4 proyectos) ──
	{
		id: "pp-01",
		imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
		title: "App Gestión de Activos",
		shortDescription: "Power Apps para inventario de activos",
		fullDescription:
			"Aplicación en Power Apps para gestión de activos fijos. Registro, seguimiento de ubicación, mantenimiento preventivo y reportes de depreciación.",
		category: "power-platform",
		technologies: ["Power Apps", "Power Automate", "SharePoint", "Dataverse"],
		gradientColor: "#7c3aed",
	},
	{
		id: "pp-02",
		imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
		title: "Flujo de Aprobaciones",
		shortDescription: "Automatización de procesos de aprobación",
		fullDescription:
			"Sistema automatizado de aprobaciones multinivel con Power Automate. Solicitudes de compra, vacaciones y gastos con notificaciones y escalamiento.",
		category: "power-platform",
		technologies: ["Power Automate", "SharePoint", "Outlook", "Teams"],
		gradientColor: "#2563eb",
	},
	{
		id: "pp-03",
		imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop",
		title: "Portal de Autoservicio",
		shortDescription: "Power Pages para clientes externos",
		fullDescription:
			"Portal web de autoservicio construido con Power Pages. Seguimiento de tickets, base de conocimiento, formularios de contacto y FAQ dinámica.",
		category: "power-platform",
		technologies: ["Power Pages", "Dataverse", "Power Automate", "Azure AD"],
		gradientColor: "#059669",
	},
	{
		id: "pp-04",
		imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
		title: "Bot de Atención al Cliente",
		shortDescription: "Chatbot con IA en Teams",
		fullDescription:
			"Chatbot inteligente integrado en Microsoft Teams usando Power Virtual Agents. Responde consultas frecuentes, escala a agentes humanos y registra métricas.",
		category: "power-platform",
		technologies: ["Power Virtual Agents", "Teams", "Dataverse", "AI Builder"],
		gradientColor: "#7c3aed",
	},

	// ── Capacitaciones (4 proyectos) ──
	{
		id: "cap-01",
		imageUrl: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=600&fit=crop",
		title: "Programa Power BI Avanzado",
		shortDescription: "Capacitación corporativa de 40 horas",
		fullDescription:
			"Programa de capacitación intensivo en Power BI para equipo de analítica. DAX avanzado, modelado de datos, Row-Level Security y gateway configuration.",
		category: "capacitaciones",
		technologies: ["Power BI", "DAX", "Power Query", "SQL Server"],
		gradientColor: "#eab308",
	},
	{
		id: "cap-02",
		imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
		title: "Workshop Excel para Finanzas",
		shortDescription: "Taller especializado para área financiera",
		fullDescription:
			"Workshop de Excel avanzado orientado a finanzas. Tablas dinámicas, Power Query, dashboards financieros, macros y automatización de reportes mensuales.",
		category: "capacitaciones",
		technologies: ["Excel", "Power Query", "VBA", "Power Pivot"],
		gradientColor: "#16a34a",
	},
	{
		id: "cap-03",
		imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
		title: "Bootcamp Power Apps",
		shortDescription: "Formación acelerada en low-code",
		fullDescription:
			"Bootcamp de 2 semanas en Power Apps. Desde conceptos básicos hasta aplicaciones canvas y model-driven con integración a datos empresariales.",
		category: "capacitaciones",
		technologies: ["Power Apps", "Dataverse", "Power Automate", "SharePoint"],
		gradientColor: "#7c3aed",
	},
	{
		id: "cap-04",
		imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop",
		title: "Certificación Data Analytics",
		shortDescription: "Programa integral de analítica de datos",
		fullDescription:
			"Programa de certificación interna en analítica de datos. SQL, Python para análisis, visualización con Power BI y storytelling con datos.",
		category: "capacitaciones",
		technologies: ["SQL", "Python", "Power BI", "Pandas", "Jupyter"],
		gradientColor: "#0891b2",
	},

	// ── Reportabilidad (4 proyectos) ──
	{
		id: "rep-01",
		imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
		title: "Dashboard Ejecutivo",
		shortDescription: "KPIs gerenciales en tiempo real",
		fullDescription:
			"Dashboard ejecutivo con KPIs financieros, operacionales y de RRHH. Actualización automática, alertas por umbrales y drill-down por área de negocio.",
		category: "reportabilidad",
		technologies: ["Power BI", "SQL Server", "DAX", "Power Query"],
		gradientColor: "#dc2626",
	},
	{
		id: "rep-02",
		imageUrl: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=600&fit=crop",
		title: "Reportes de Ventas Automatizados",
		shortDescription: "Pipeline de datos para reportería comercial",
		fullDescription:
			"Sistema automatizado de reportería de ventas. ETL desde múltiples fuentes, data warehouse, reportes programados y distribución automática por email.",
		category: "reportabilidad",
		technologies: ["Power BI", "Azure Data Factory", "SQL Server", "Power Automate"],
		gradientColor: "#2563eb",
	},
	{
		id: "rep-03",
		imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
		title: "Análisis de Inventario",
		shortDescription: "Control de stock con predicción de demanda",
		fullDescription:
			"Sistema de análisis de inventario con predicción de demanda, alertas de quiebre de stock, análisis ABC y optimización de puntos de reorden.",
		category: "reportabilidad",
		technologies: ["Power BI", "Python", "SQL Server", "Azure ML"],
		gradientColor: "#059669",
	},
	{
		id: "rep-04",
		imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
		title: "Cuadro de Mando Integral",
		shortDescription: "BSC con métricas estratégicas",
		fullDescription:
			"Balanced Scorecard digital con las cuatro perspectivas estratégicas. Semáforos de cumplimiento, metas vs reales y análisis de tendencias trimestral.",
		category: "reportabilidad",
		technologies: ["Power BI", "DAX", "Power Query", "SharePoint"],
		gradientColor: "#7c3aed",
	},
]
