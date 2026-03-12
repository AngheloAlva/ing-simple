"use client"

import { Check, ChevronRight } from "lucide-react"
import { motion } from "motion/react"

export function PowerPlatformComparison() {
	const features = [
		{
			name: "Sin necesidad de programar",
			brand1: true,
			brand2: false,
		},
		{
			name: "Implementación en semanas",
			brand1: true,
			brand2: false,
		},
		{
			name: "Integración nativa con Microsoft 365",
			brand1: true,
			brand2: false,
		},
		{
			name: "Escalabilidad enterprise",
			brand1: true,
			brand2: true,
		},
		{
			name: "Actualizaciones automáticas",
			brand1: true,
			brand2: false,
		},
		{
			name: "Gobernanza y seguridad integrada",
			brand1: true,
			brand2: false,
		},
		{
			name: "Personalización avanzada",
			brand1: true,
			brand2: true,
		},
	]

	return (
		<section className="bg-background relative w-full px-8 py-16 sm:py-20 md:py-28 lg:py-36">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid gap-6 lg:grid-cols-2 lg:items-start">
					{/* Left Column - Info */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="flex flex-col"
					>
						<h2 className="text-foreground mb-6 text-4xl font-medium tracking-tight">
							Power Platform vs. Desarrollo Tradicional
						</h2>
						<p className="text-md text-muted-foreground mb-8 max-w-md leading-relaxed">
							Power Platform permite construir soluciones empresariales en una fracción del tiempo y
							costo del desarrollo tradicional, con integración nativa al ecosistema Microsoft.
						</p>
						<div>
							<a
								href="/contacto"
								className="group inline-flex w-fit items-center justify-center gap-3 rounded-md bg-red-600 py-3 pr-3 pl-5 text-base font-medium text-white transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg md:w-auto"
							>
								<span>Empezar con Power Platform</span>
								<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-red-600 transition-all duration-300 group-hover:scale-110">
									<ChevronRight className="relative left-px h-4 w-4" />
								</span>
							</a>
						</div>
					</motion.div>

					{/* Right Column - Comparison Table */}
					<div className="w-full">
						{/* Brand Headers */}
						<div className="mb-4 grid grid-cols-2 gap-4 md:gap-6">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.1 }}
								className="flex items-center"
							>
								<span className="text-foreground text-2xl font-medium md:text-3xl">
									Power Platform
								</span>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="flex items-center"
							>
								<span className="text-foreground text-2xl font-medium tracking-wider md:text-3xl">
									Tradicional
								</span>
							</motion.div>
						</div>

						{/* Features List */}
						<div className="space-y-3">
							{features.map((feature, index) => (
								<motion.div
									key={feature.name}
									initial={{ opacity: 0, x: 20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: 0.1 * index }}
									className="grid grid-cols-2 gap-4 md:gap-6"
								>
									{/* Brand 1 Feature */}
									<div className="flex items-center gap-3 py-4">
										<div
											className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
												feature.brand1
													? "bg-red-600 text-white"
													: "border-muted-foreground border-2"
											}`}
										>
											{feature.brand1 && <Check className="h-4 w-4" strokeWidth={3} />}
										</div>
										<span className="d text-foreground text-sm md:text-base">{feature.name}</span>
									</div>

									{/* Brand 2 Feature */}
									<div className="flex items-center gap-3 py-4">
										<div
											className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
												feature.brand2
													? "bg-red-600 text-white"
													: "border-muted-foreground border-2"
											}`}
										>
											{feature.brand2 && <Check className="h-4 w-4" strokeWidth={3} />}
										</div>
										<span
											className={`text-sm md:text-base ${
												feature.brand2 ? "text-foreground" : "text-muted-foreground"
											}`}
										>
											{feature.name}
										</span>
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
