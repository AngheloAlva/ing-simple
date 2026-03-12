"use client"

import { motion } from "motion/react"
import {
	BarChart3,
	Smartphone,
	Workflow,
	Globe,
	Blocks,
	ShieldCheck,
	ChevronRight,
} from "lucide-react"

export function PowerPlatformFeatures() {
	const features = [
		{
			icon: BarChart3,
			title: "Power BI",
			description:
				"Dashboards interactivos y reportes en tiempo real que transforman tus datos en decisiones estratégicas para toda la organización.",
		},
		{
			icon: Smartphone,
			title: "Power Apps",
			description:
				"Aplicaciones empresariales a medida sin escribir código. Digitalizá procesos y formularios en días, no meses.",
		},
		{
			icon: Workflow,
			title: "Power Automate",
			description:
				"Automatizá flujos de trabajo repetitivos entre sistemas. Desde aprobaciones hasta sincronización de datos, todo sin intervención manual.",
		},
		{
			icon: Globe,
			title: "Power Pages",
			description:
				"Portales web seguros para clientes, proveedores o empleados. Conectados a tus datos y listos para producción.",
		},
		{
			icon: Blocks,
			title: "Integración Microsoft 365",
			description:
				"Conectá Power Platform con Teams, SharePoint, Outlook y Excel. Un ecosistema unificado que potencia la productividad de tu equipo.",
		},
		{
			icon: ShieldCheck,
			title: "Gobernanza y Seguridad",
			description:
				"Políticas de datos, control de acceso y cumplimiento normativo integrados. Tu información protegida con estándares enterprise.",
		},
	]

	return (
		<section className="bg-background relative w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24">
			{/* Dashed Top Right Fade Grid */}
			<div
				className="absolute inset-0 z-0"
				style={{
					backgroundImage: `
            linear-gradient(to right, rgba(229, 229, 229, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(229, 229, 229, 0.15) 1px, transparent 1px)
          `,
					backgroundSize: "20px 20px",
					backgroundPosition: "0 0, 0 0",
					maskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 100% at 100% 0%, #000 20%, transparent 80%)
          `,
					WebkitMaskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 100% at 100% 0%, #000 20%, transparent 80%)
          `,
					maskComposite: "intersect",
					WebkitMaskComposite: "source-in",
				}}
			/>
			<div
				className="absolute inset-0 z-0 opacity-100"
				style={{
					backgroundImage: `
            linear-gradient(to right, rgba(64, 64, 64, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(64, 64, 64, 0.15) 1px, transparent 1px)
          `,
					backgroundSize: "20px 20px",
					backgroundPosition: "0 0, 0 0",
					maskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 100% at 100% 0%, #000 20%, transparent 80%)
          `,
					WebkitMaskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 100% at 100% 0%, #000 20%, transparent 80%)
          `,
					maskComposite: "intersect",
					WebkitMaskComposite: "source-in",
				}}
			/>
			<div id="features" className="relative z-10 mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-12 md:mb-16">
					<motion.h2
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className="text-foreground mb-6 max-w-3xl text-3xl font-normal tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
					>
						Todo el poder de Microsoft, simplificado para tu empresa
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="text-muted-foreground mb-8 text-base tracking-tight sm:text-lg"
					>
						Herramientas conectadas que automatizan, visualizan y transforman tu operación
					</motion.p>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.2 }}
						className="flex items-start gap-3 sm:flex-col sm:flex-row sm:gap-4"
					>
						<a
							href="/contacto"
							className="group inline-flex w-fit items-center justify-center gap-3 rounded-md bg-red-600 py-3 pr-3 pl-5 text-sm font-medium text-white transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg sm:w-auto sm:text-base"
						>
							<span>Consultar Ahora</span>
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 transition-all duration-300 group-hover:scale-110">
								<ChevronRight className="relative left-px h-4 w-4" />
							</span>
						</a>
						<a
							href="/contacto"
							className="group text-foreground border-muted bg-background inline-flex w-fit items-center justify-center gap-3 rounded-md border py-3 pr-3 pl-5 text-sm font-medium transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg sm:w-auto sm:text-base"
						>
							<span>Agendar Demo</span>
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition-all duration-300 group-hover:scale-110">
								<ChevronRight className="relative left-px h-4 w-4" />
							</span>
						</a>
					</motion.div>
				</div>

				{/* Features Grid - 3 columns, no gap, with borders */}
				<div className="border-foreground/40 grid grid-cols-1 overflow-hidden rounded-2xl border md:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => {
						const Icon = feature.icon
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className={`bg-background p-8 md:p-10 ${index !== 5 ? "border-foreground/40 border-b" : ""} ${index % 2 === 0 && index !== 4 ? "md:border-r" : ""} ${(index + 1) % 3 !== 0 ? "lg:border-r" : ""} ${index < 3 ? "lg:border-b" : ""} `}
							>
								{/* Icon - Centered */}
								<div className="mb-8 flex">
									<div className="flex h-20 w-20 items-center justify-center">
										<Icon className="h-full w-full text-red-600" strokeWidth={1} />
									</div>
								</div>

								{/* Title - Left Aligned */}
								<h3 className="text-foreground mb-3 text-lg font-semibold tracking-tight sm:text-xl">
									{feature.title}
								</h3>

								{/* Description - Left Aligned */}
								<p className="text-muted-foreground text-sm leading-normal tracking-tight sm:text-base">
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
