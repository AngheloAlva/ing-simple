"use client"

import { Check, ChevronRight } from "lucide-react"
import { motion } from "motion/react"

export default function WebComparison() {
	const features = [
		{
			name: "Diseño 100% personalizado",
			brand1: true,
			brand2: false,
		},
		{
			name: "SEO optimizado desde el inicio",
			brand1: true,
			brand2: false,
		},
		{
			name: "Rendimiento +90 en PageSpeed",
			brand1: true,
			brand2: false,
		},
		{
			name: "Diseño responsivo",
			brand1: true,
			brand2: true,
		},
		{
			name: "Certificado SSL incluido",
			brand1: true,
			brand2: true,
		},
		{
			name: "Soporte post-lanzamiento",
			brand1: true,
			brand2: false,
		},
		{
			name: "Panel de administración",
			brand1: true,
			brand2: false,
		},
	]

	return (
		<section className="bg-background relative w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-32">
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
						<h2 className="text-foreground mb-4 text-4xl font-medium tracking-tight">
							IngSimple vs. Sitio Genérico
						</h2>
						<p className="text-md text-muted-foreground mb-12 max-w-md leading-relaxed">
							Ambos son sitios web, pero un sitio de IngSimple incluye diseño personalizado, SEO
							optimizado, rendimiento superior y soporte continuo en todos los proyectos.
						</p>
						<div>
							<a
								href="/contacto"
								className="group inline-flex items-center justify-center gap-3 rounded-md bg-purple-600 py-3 pr-3 pl-5 font-medium text-white shadow-lg shadow-purple-600/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-purple-600/40"
							>
								<span>Cotiza tu sitio</span>
								<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:scale-110">
									<ChevronRight className="relative left-px h-4 w-4" />
								</span>
							</a>
						</div>
					</motion.div>

					{/* Right Column - Comparison Table */}
					<div className="w-full">
						{/* Brand Headers */}
						<div className="mb-8 grid grid-cols-2 gap-4 md:gap-6">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.1 }}
								className="flex items-center"
							>
								<span className="text-foreground text-2xl md:text-3xl">IngSimple</span>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6, delay: 0.2 }}
								className="flex items-center"
							>
								<span className="text-foreground text-2xl tracking-wider md:text-3xl">
									Genérico
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
												feature.brand1 ? "bg-foreground" : "border-border border-2"
											}`}
										>
											{feature.brand1 && (
												<Check className="text-background h-4 w-4" strokeWidth={3} />
											)}
										</div>
										<span className="text-foreground text-sm md:text-base">{feature.name}</span>
									</div>

									{/* Brand 2 Feature */}
									<div className="flex items-center gap-3 py-4">
										<div
											className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
												feature.brand2 ? "bg-foreground" : "border-border border-2"
											}`}
										>
											{feature.brand2 && (
												<Check className="text-background h-4 w-4" strokeWidth={3} />
											)}
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
