"use client"

import { motion } from "motion/react"
import { CodeIcon, BookOpenIcon, BarChart3Icon, LayoutGridIcon } from "lucide-react"

import type { ComponentType, ReactNode } from "react"
import Link from "next/link"

const easeOut = [0.16, 1, 0.3, 1] as const

interface Service {
	href: string
	title: string
	number: string
	description: string
	icon: ComponentType<{ className?: string }>
	gradient: { from: string; to: string; position: string }
}

const services: Service[] = [
	{
		number: "01",
		title: "Reportabilidad, Dashboards y Analítica",
		description:
			"Transformamos datos dispersos en información útil. Dashboards dinámicos, reportes automatizados y métricas claras para tomar decisiones informadas.",
		icon: BarChart3Icon,
		gradient: { from: "#f97316", to: "#3b82f6", position: "bottom-right" },
		href: "/servicios/reportabilidad",
	},
	{
		number: "02",
		title: "Cursos y Capacitaciones",
		description:
			"Formamos a equipos en Power BI, Power Apps, Excel avanzado y más. Capacitaciones prácticas adaptadas al nivel de cada organización.",
		icon: BookOpenIcon,
		gradient: { from: "#8b5cf6", to: "#ec4899", position: "bottom-left" },
		href: "/servicios/capacitaciones",
	},
	{
		number: "03",
		title: "Soluciones Web",
		description:
			"Desarrollamos sitios web modernos, rápidos y funcionales. Landing pages, sitios corporativos y portales enfocados en experiencia de usuario.",
		icon: CodeIcon,
		gradient: { from: "#06b6d4", to: "#6366f1", position: "bottom-right" },
		href: "/servicios/soluciones-web",
	},
	{
		number: "04",
		title: "Soluciones Power Platform",
		description:
			"Creamos aplicaciones internas, automatizaciones y flujos inteligentes con Power Apps, Power Automate y SharePoint para reemplazar procesos manuales.",
		icon: LayoutGridIcon,
		gradient: { from: "#10b981", to: "#3b82f6", position: "bottom-left" },
		href: "/servicios/power-platform",
	},
]

const gradientPositionMap: Record<string, string> = {
	"bottom-right": "80% 120%",
	"bottom-left": "20% 120%",
}

function ServiceIcon({ service }: { service: Service }): ReactNode {
	const Icon = service.icon
	const center = gradientPositionMap[service.gradient.position]

	return (
		<div className="bg-muted relative flex aspect-4/3 w-full items-center justify-center self-stretch overflow-hidden rounded-xl md:aspect-auto md:min-h-64">
			{/* Gradient blob */}
			<div
				className="absolute inset-0"
				style={{
					background: `radial-gradient(circle at ${center}, ${service.gradient.from} 0%, ${service.gradient.to} 40%, transparent 70%)`,
					opacity: 0.75,
				}}
			/>
			{/* Noise overlay */}
			<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-40">
				<filter id={`noise-${service.number}`}>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.65"
						numOctaves="3"
						stitchTiles="stitch"
					/>
				</filter>
				<rect width="100%" height="100%" filter={`url(#noise-${service.number})`} />
			</svg>
			{/* Icon */}
			<Icon className="relative z-20 size-24 opacity-40 md:size-32" />
		</div>
	)
}

function ServiceCard({ service, index }: { service: Service; index: number }): ReactNode {
	return (
		<Link href={service.href}>
			<motion.div
				className="bg-muted hover:bg-muted/80 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl p-2 transition-colors duration-300 md:grid-cols-2"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				whileHover={{ scale: 1.01 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{
					duration: 0.6,
					delay: index * 0.1,
					ease: easeOut,
				}}
			>
				<div className="px-4 py-4 md:py-28">
					<span className="text-muted-foreground bg-foreground/5 group-hover:bg-foreground/10 mb-4 block w-fit rounded-md px-2 py-1 text-sm font-medium transition-colors duration-300">
						{service.number}
					</span>
					<h3 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">{service.title}</h3>
					<p className="text-muted-foreground max-w-md text-sm leading-relaxed">
						{service.description}
					</p>
				</div>

				<ServiceIcon service={service} />
			</motion.div>
		</Link>
	)
}

export function Services(): ReactNode {
	return (
		<section className="bg-background px-6 py-16 md:py-32">
			<div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
				{/* Sticky left column */}
				<motion.div
					className="lg:sticky lg:top-60 lg:w-96 lg:shrink-0"
					initial={{ opacity: 0, x: -30 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: easeOut }}
				>
					<h2 className="mb-4 text-2xl font-medium tracking-tight md:mb-6 md:text-3xl lg:text-4xl">
						Nuestras Líneas de Servicio
					</h2>
					<p className="text-muted-foreground mb-6 max-w-sm text-base md:mb-8 md:text-lg">
						Cuatro áreas especializadas para acompañar tu transformación digital de forma integral.
					</p>
				</motion.div>

				{/* Scrolling right column */}
				<div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-32">
					{services.map((service, index) => (
						<ServiceCard key={service.number} service={service} index={index} />
					))}
				</div>
			</div>
		</section>
	)
}
