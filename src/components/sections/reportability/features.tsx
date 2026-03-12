"use client"

import { motion } from "motion/react"
import { BarChart3, RefreshCw, Database, Target, Bell, ShieldCheck } from "lucide-react"

const features = [
	{
		title: "Dashboards interactivos",
		description:
			"Paneles con filtros dinámicos, drill-down y actualización automática de datos desde múltiples fuentes.",
		icon: BarChart3,
	},
	{
		title: "Reportes automatizados",
		description:
			"Informes que se generan y distribuyen solos. Diario, semanal o mensual, directo al mail de tu equipo.",
		icon: RefreshCw,
	},
	{
		title: "Conexión de fuentes",
		description:
			"Integramos bases de datos SQL, archivos Excel, APIs de ERPs y cualquier fuente que tu organización use.",
		icon: Database,
	},
	{
		title: "Indicadores personalizados",
		description:
			"KPIs diseñados para tu negocio: márgenes, rotación, cumplimiento, SLAs. Lo que necesites medir.",
		icon: Target,
	},
	{
		title: "Alertas y umbrales",
		description:
			"Notificaciones automáticas cuando un indicador sale del rango esperado. Actuá antes de que sea problema.",
		icon: Bell,
	},
	{
		title: "Gobierno de datos",
		description:
			"Definimos quién ve qué, con Row-Level Security y permisos por rol. Tus datos, protegidos.",
		icon: ShieldCheck,
	},
]

export function ReportabilityFeatures() {
	return (
		<section className="bg-background w-full px-4 py-8 sm:px-6 sm:py-8 md:py-12 lg:px-8 lg:py-16">
			<div className="mx-auto max-w-6xl">
				<div className="mb-8 md:mb-12">
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className="mb-4 text-sm text-blue-600 sm:text-base"
					>
						Capacidades
					</motion.p>

					<motion.h2
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="text-foreground mb-6 text-3xl font-normal sm:text-4xl md:text-5xl"
					>
						Todo lo que necesitas para entender tu negocio
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.2 }}
						className="text-muted-foreground max-w-xl text-base sm:text-lg"
					>
						Conectamos tus datos, diseñamos visualizaciones claras y automatizamos tus reportes.
					</motion.p>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => {
						const Icon = feature.icon

						return (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
								className="bg-muted rounded-2xl p-6 transition-shadow duration-200 hover:shadow-md"
							>
								<Icon className="text-foreground mb-8 h-10 w-10" strokeWidth={1} />

								<h3 className="text-foreground mb-2 text-lg font-medium lg:text-xl">
									{feature.title}
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{feature.description}
								</p>
							</motion.div>
						)
					})}
				</div>
			</div>
		</section>
	)
}
