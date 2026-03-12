"use client"

import { Smartphone, Search, Zap, Headphones } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect, useRef } from "react"

interface Features4Props {
	autoPlay?: boolean
	autoPlayDelay?: number
}

export function WebFeatures({ autoPlay = true, autoPlayDelay = 5000 }: Features4Props) {
	const [activeTab, setActiveTab] = useState(0)
	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const tabs = [
		{
			icon: Smartphone,
			title: "Diseño Responsivo",
			description:
				"Tu sitio se ve perfecto en cualquier dispositivo: celulares, tablets y computadores.",
			features: [
				"Enfoque mobile-first desde el diseño",
				"Layouts adaptables a cada pantalla",
				"Imágenes optimizadas por resolución",
				"Testeo en múltiples dispositivos",
			],
		},
		{
			icon: Search,
			title: "SEO Optimizado",
			description:
				"Posicionamos tu sitio en Google desde el día uno con las mejores prácticas de SEO.",
			features: [
				"Meta tags y structured data",
				"URLs amigables y semánticas",
				"Velocidad de carga como prioridad",
				"Sitemap y robots.txt configurados",
			],
		},
		{
			icon: Zap,
			title: "Rendimiento Superior",
			description:
				"Sitios ultrarrápidos con carga optimizada, code splitting y renderizado eficiente.",
			features: [
				"Puntuación 90+ en PageSpeed",
				"Carga de imágenes lazy loading",
				"Server-side rendering con Next.js",
				"Bundles mínimos y optimizados",
			],
		},
		{
			icon: Headphones,
			title: "Soporte Continuo",
			description: "Acompañamiento post-lanzamiento con mantenimiento, mejoras y soporte técnico.",
			features: [
				"Corrección de bugs prioritaria",
				"Actualizaciones de seguridad",
				"Capacitación para gestionar contenido",
				"Canal directo de comunicación",
			],
		},
	]

	useEffect(() => {
		if (!autoPlay) return

		const startAutoPlay = () => {
			intervalRef.current = setInterval(() => {
				setActiveTab((prev) => (prev + 1) % tabs.length)
			}, autoPlayDelay)
		}

		startAutoPlay()

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current)
			}
		}
	}, [autoPlay, autoPlayDelay, tabs.length])

	const handleTabClick = (index: number) => {
		setActiveTab(index)

		if (autoPlay && intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = setInterval(() => {
				setActiveTab((prev) => (prev + 1) % tabs.length)
			}, autoPlayDelay)
		}
	}

	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-32">
			<div className="mx-auto max-w-6xl">
				{/* Header */}
				<div className="mb-12 text-center md:mb-16">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-foreground mb-4 text-3xl font-normal sm:text-4xl md:text-5xl lg:text-6xl"
					>
						Lo que incluye cada proyecto
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="text-muted-foreground mx-auto max-w-2xl text-lg sm:text-xl"
					>
						Todo lo que necesitas para una presencia web profesional
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="mt-4 flex flex-wrap justify-center gap-2"
					>
						{["Next.js", "React", "TypeScript", "Tailwind CSS", "Astro", "Nest.js"].map((tech) => (
							<span
								key={tech}
								className="border-border text-muted-foreground rounded-full border px-3 py-1 text-sm"
							>
								{tech}
							</span>
						))}
					</motion.div>
				</div>

				{/* Tabbed Content */}
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
					{/* Tab Navigation */}
					<div className="flex flex-col justify-between gap-4 lg:col-span-4">
						{tabs.map((tab, index) => {
							const Icon = tab.icon
							const isActive = activeTab === index

							return (
								<motion.button
									key={index}
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: index * 0.05 }}
									onClick={() => handleTabClick(index)}
									className={`hover:ring-muted-foreground flex w-full flex-1 cursor-pointer items-start rounded-2xl p-4 text-left transition-[border-color,background-color] duration-200 md:p-6 ${
										isActive ? "bg-foreground" : "bg-muted"
									}`}
								>
									<div className="flex items-start gap-4">
										<div
											className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
												isActive ? "bg-background text-foreground" : "bg-muted text-foreground"
											}`}
										>
											<Icon className="h-5 w-5" />
										</div>

										<div className="min-w-0 flex-1">
											<h3
												className={`mb-1 text-base font-semibold md:text-lg ${
													isActive ? "text-background" : "text-muted-foreground"
												}`}
											>
												{tab.title}
											</h3>
											<p className="text-muted-foreground line-clamp-2 text-sm">
												{tab.description}
											</p>
										</div>
									</div>
								</motion.button>
							)
						})}
					</div>

					{/* Tab Content */}
					<div className="flex lg:col-span-8">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeTab}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.3 }}
								className="border-border bg-background flex-1 rounded-3xl border p-6 md:p-8 lg:p-10"
							>
								{/* Content Header */}
								<div className="mb-8">
									<div className="bg-muted mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl">
										{(() => {
											const Icon = tabs[activeTab]?.icon
											if (!Icon) return null
											return <Icon className="text-foreground h-10 w-10" strokeWidth={1} />
										})()}
									</div>

									<h3 className="text-foreground mb-3 text-2xl font-bold md:text-3xl">
										{tabs[activeTab]?.title}
									</h3>

									<p className="text-muted-foreground text-base leading-relaxed md:text-lg">
										{tabs[activeTab]?.description}
									</p>
								</div>

								{/* Feature List */}
								<div className="space-y-4">
									{tabs[activeTab]?.features.map((feature, index) => (
										<motion.div
											key={index}
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: index * 0.1 }}
											className="bg-muted/50 flex items-start gap-3 rounded-xl p-4"
										>
											<div className="bg-foreground mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
												<svg
													className="text-background h-4 w-4"
													fill="none"
													viewBox="0 0 24 24"
													stroke="currentColor"
													strokeWidth={3}
												>
													<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
												</svg>
											</div>
											<span className="text-muted-foreground text-sm font-medium md:text-base">
												{feature}
											</span>
										</motion.div>
									))}
								</div>
							</motion.div>
						</AnimatePresence>
					</div>
				</div>
			</div>
		</section>
	)
}
