"use client"

import CountUp from "@/components/shared/count-up"
import { ChevronRight } from "lucide-react"
import { motion } from "motion/react"

const stats = [
	{
		label: "Puntuación PageSpeed",
		value: 100,
		highlight: true,
	},
	{
		label: "Tiempo de carga",
		value: "<2s",
		highlight: false,
	},
	{
		label: "Sitios entregados",
		value: "30+",
		highlight: false,
	},
	{
		label: "Disponibilidad garantizada",
		value: "99.9%",
		highlight: false,
	},
]

export default function WebStats() {
	return (
		<section className="bg-background w-full px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
					{/* Left Column - Content */}
					<div className="flex h-full flex-col items-start gap-10">
						{/* Title */}
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="text-foreground text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl"
						>
							Rendimiento comprobado
						</motion.h2>

						{/* Description and Button */}
						<div className="space-y-6 sm:space-y-8 lg:mt-0">
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.1 }}
								className="text-muted-foreground max-w-md text-base leading-relaxed sm:text-lg"
							>
								Cada sitio que entregamos cumple los estándares más altos de rendimiento,
								accesibilidad y optimización para buscadores.
							</motion.p>

							<motion.a
								href="/contacto"
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className="group inline-flex items-center justify-center gap-3 rounded-md bg-purple-600 py-3 pr-3 pl-5 font-medium text-white shadow-lg shadow-purple-600/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-purple-600/40"
							>
								<span>Cotiza tu proyecto</span>
								<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:scale-110">
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
								className="border-border bg-background relative flex min-h-45 flex-col justify-between overflow-hidden rounded-3xl border p-6 shadow-md sm:min-h-50"
							>
								{/* Dotted Background */}
								<div
									className="absolute inset-0 z-0"
									style={{
										backgroundImage:
											"radial-gradient(circle at 1px 1px, var(--color-border) 1px, transparent 0)",
										backgroundSize: "14px 14px",
									}}
								/>

								{/* Content */}
								<div className="relative z-10 flex h-full flex-col justify-between">
									<div className="flex items-center gap-2">
										<p
											className={`text-sm sm:text-base ${
												stat.highlight ? "font-medium text-purple-600" : "text-muted-foreground"
											}`}
										>
											{stat.label}
										</p>
										{stat.highlight && (
											<span className="relative flex h-2 w-2">
												<span className="bg-foreground absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
												<span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600"></span>
											</span>
										)}
									</div>
									<p
										className={`text-4xl font-medium tracking-tighter sm:text-5xl md:text-6xl ${
											stat.highlight ? "text-purple-600" : "text-foreground"
										}`}
									>
										{stat.highlight ? (
											<CountUp delay={0.2} duration={1.2} to={+stat.value} />
										) : (
											stat.value
										)}
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
