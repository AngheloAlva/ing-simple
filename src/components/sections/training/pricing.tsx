"use client"

import { ChevronRight } from "lucide-react"
import { motion } from "motion/react"

const plans = [
	{
		name: "Individual",
		description:
			"Capacitación personalizada one-on-one. Ideal para profesionales que quieren profundizar en una herramienta específica.",
		price: "Consultar",
		priceDetail: "por sesión",
		highlighted: false,
		features: [
			"Sesiones individuales",
			"Horarios flexibles",
			"Material personalizado",
			"Soporte post-capacitación",
		],
	},
	{
		name: "Grupal",
		description:
			"Formación para equipos de trabajo. Aprende junto a tus compañeros con ejercicios prácticos y casos reales.",
		price: "Consultar",
		priceDetail: "por grupo",
		highlighted: true,
		features: [
			"Hasta 15 participantes",
			"Ejercicios grupales",
			"Casos de tu industria",
			"Certificado de participación",
		],
	},
	{
		name: "Corporativo",
		description:
			"Programa a medida para tu empresa. Diseñamos un plan de capacitación alineado a tus objetivos estratégicos.",
		price: "A medida",
		priceDetail: "personalizado",
		highlighted: false,
		features: [
			"Programa personalizado",
			"Diagnóstico previo",
			"Seguimiento post-programa",
			"Métricas de impacto",
		],
	},
]

export default function TrainingPricing() {
	return (
		<section
			id="planes"
			className="bg-background relative w-full px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-24"
		>
			<div className="mx-auto w-full max-w-6xl">
				{/* Header */}
				<div className="mb-12 flex flex-col items-start justify-between gap-6 sm:mb-16 sm:flex-row sm:items-center">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-foreground text-4xl leading-tight font-medium sm:text-5xl md:text-6xl"
					>
						Planes de Capacitación
					</motion.h1>
					<motion.a
						href="/contacto"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="group flex cursor-pointer items-center gap-3 rounded-md border border-orange-500 bg-orange-500 px-6 py-3 font-medium text-white transition-all duration-500 ease-out hover:rounded-[50px]"
					>
						<span>Consultar disponibilidad</span>
						<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:scale-110">
							<ChevronRight className="relative left-px h-4 w-4" />
						</span>
					</motion.a>
				</div>

				{/* Pricing Cards */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
					{plans.map((plan, index) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
							className={`flex flex-col rounded-3xl p-8 shadow-lg sm:p-10 ${
								plan.highlighted ? "bg-background border sm:scale-103" : "bg-foreground"
							}`}
						>
							<div className="mb-4 flex items-center gap-3">
								<h2
									className={`text-3xl font-medium tracking-tight sm:text-4xl ${
										plan.highlighted ? "text-foreground" : "text-background"
									}`}
								>
									{plan.name}
								</h2>
								{plan.highlighted && (
									<span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-medium text-white">
										Más popular
									</span>
								)}
							</div>
							<p className="text-muted-foreground mb-8 text-base leading-relaxed">
								{plan.description}
							</p>

							<div className="border-muted-foreground/50 mb-4 border-t" />

							<div className="mb-8">
								<div className="mb-2 flex items-baseline gap-1">
									<span
										className={`text-${plan.highlighted ? "foreground" : "background"} text-5xl font-medium tracking-tight sm:text-6xl`}
									>
										{plan.price}
									</span>
								</div>
								<p className="text-muted-foreground text-sm">{plan.priceDetail}</p>
							</div>

							{/* Features list */}
							<ul className="mb-8 flex flex-col gap-3">
								{plan.features.map((feature) => (
									<li
										key={feature}
										className="text-muted-foreground flex items-center gap-2 text-sm"
									>
										<ChevronRight className="h-4 w-4 text-orange-500" />
										{feature}
									</li>
								))}
							</ul>

							<div className="flex-1" />

							<a
								href="/contacto"
								className={`group flex w-fit cursor-pointer items-center gap-3 rounded-md py-3 pr-3 pl-5 text-sm font-medium transition-all duration-500 ease-out hover:rounded-[50px] ${
									plan.highlighted
										? "bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/40"
										: "text-background hover:bg-background border-background hover:text-foreground border"
								}`}
							>
								<span>Consultar</span>
								<span
									className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${
										plan.highlighted
											? "bg-white text-black"
											: "bg-white text-black group-hover:bg-black group-hover:text-white"
									}`}
								>
									<ChevronRight className="relative left-px h-4 w-4" />
								</span>
							</a>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
