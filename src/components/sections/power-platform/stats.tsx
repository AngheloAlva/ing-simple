"use client"

import { ChevronRight } from "lucide-react"
import { motion } from "motion/react"

const stats = [
	{
		label: "Horas/mes ahorradas",
		value: "120+",
		highlight: false,
	},
	{
		label: "Apps desplegadas",
		value: "50+",
		highlight: false,
	},
	{
		label: "Procesos automatizados",
		value: "200+",
		highlight: false,
	},
	{
		label: "Tiempo de implementación",
		value: "<4 sem",
		highlight: true,
	},
]

export function PowerPlatformStats() {
	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-36">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
					{/* Left Column - Content */}
					<div className="flex flex-col gap-6 lg:min-h-100">
						{/* Title */}
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="text-foreground text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl"
						>
							Resultados que hablan por sí solos
						</motion.h2>

						{/* Description and Button */}
						<div className="space-y-6 sm:space-y-8">
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.1 }}
								className="text-muted-foreground max-w-md text-base leading-relaxed sm:text-lg"
							>
								Nuestras implementaciones con Power Platform generan impacto medible desde el primer
								mes. Automatización, visibilidad y eficiencia para tu operación.
							</motion.p>

							<motion.a
								href="/contacto"
								viewport={{ once: true }}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="group mt-4 inline-flex w-fit items-center gap-3 rounded-md bg-red-500 py-3 pr-3 pl-5 text-sm font-medium text-white transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg sm:text-base"
							>
								<span>Ver Casos de Éxito</span>
								<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-500 transition-all duration-300 group-hover:scale-110">
									<ChevronRight className="relative left-px h-4 w-4" />
								</span>
							</motion.a>
						</div>
					</div>

					{/* Right Column - Stats Grid */}
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
						{stats.map((stat, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
								className="bg-foreground relative flex min-h-45 flex-col justify-between overflow-hidden rounded-3xl p-6 shadow-md sm:min-h-50"
							>
								{/* Dotted Background */}
								<div
									className="absolute inset-0 z-0"
									style={{
										backgroundImage:
											"radial-gradient(circle at 1px 1px, var(--color-muted-foreground) 1px, transparent 0)",
										backgroundSize: "18px 18px",
									}}
								/>

								{/* Content */}
								<div className="relative z-10 flex h-full flex-col justify-between">
									<div className="flex items-center gap-2">
										<p
											className={`text-sm sm:text-base ${
												stat.highlight ? "font-medium text-red-600" : "text-background"
											}`}
										>
											{stat.label}
										</p>
										{stat.highlight && (
											<span className="relative flex h-2 w-2">
												<span className="bg-background absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
												<span className="relative inline-flex h-2 w-2 rounded-full bg-red-600"></span>
											</span>
										)}
									</div>
									<p
										className={`text-4xl font-medium tracking-tighter sm:text-5xl md:text-6xl ${
											stat.highlight ? "text-red-600" : "text-background"
										}`}
									>
										{stat.value}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
