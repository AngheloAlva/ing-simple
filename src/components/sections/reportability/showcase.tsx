"use client"

import { motion, AnimatePresence } from "motion/react"
import Image from "next/image"
import { useState } from "react"

interface ShowcaseItem {
	id: number
	title: string
	year?: string
	image: string
	status?: string
	subtitle: string
}

export function ReportabilityShowcase() {
	const [activeId, setActiveId] = useState(1)

	const items: ShowcaseItem[] = [
		{
			id: 1,
			title: "Dashboard de Ventas",
			subtitle: "KPIs comerciales, tendencias y metas,",
			year: "2024",
			image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=800&fit=crop",
		},
		{
			id: 2,
			title: "Control Operativo",
			subtitle: "Métricas de producción y eficiencia,",
			year: "2024",
			image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=800&fit=crop",
		},
		{
			id: 3,
			title: "Reportes de RRHH",
			subtitle: "Dotación, rotación y clima laboral,",
			year: "2024",
			image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=800&fit=crop",
		},
		{
			id: 4,
			title: "Análisis Financiero",
			subtitle: "",
			status: "Próximamente",
			image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=800&fit=crop",
		},
	]

	const activeItem = items.find((item) => item.id === activeId)

	return (
		<section className="bg-background flex min-h-screen w-full items-start px-4 py-12 sm:px-6 lg:items-center lg:px-8">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mb-8 md:mb-12">
					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className="mb-4 text-sm text-blue-600 sm:text-base"
					>
						Casos de Uso
					</motion.p>

					<motion.h2
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="text-foreground mb-6 text-3xl font-normal sm:text-4xl md:text-5xl"
					>
						Soluciones que ya funcionan
					</motion.h2>

					<motion.p
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.2 }}
						className="text-muted-foreground max-w-xl text-base sm:text-lg"
					>
						Cada dashboard y reporte está diseñado a medida para resolver necesidades reales de
						nuestros clientes.
					</motion.p>
				</div>

				<div className="grid grid-cols-1 gap-2 lg:grid-cols-[1fr_600px] lg:gap-16 xl:gap-20">
					{/* Left Column - Items List */}
					<div className="relative flex flex-col">
						{items.map((item, index) => (
							<motion.button
								key={item.id}
								onClick={() => setActiveId(item.id)}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: index * 0.1 }}
								className="relative w-full py-6 text-left sm:py-8"
							>
								{activeId === item.id && (
									<motion.div
										layoutId="active-background"
										className="bg-foreground absolute inset-0 rounded-lg"
										transition={{
											type: "spring",
											stiffness: 300,
											damping: 30,
										}}
									/>
								)}
								<div
									className={`relative flex items-center justify-between gap-4 px-4 sm:px-6 ${
										activeId === item.id ? "" : "transition-opacity duration-300 hover:opacity-60"
									}`}
								>
									<div className="min-w-0 flex-1">
										<h2
											className={`mb-2 truncate text-xl font-medium tracking-tight sm:text-2xl md:text-3xl lg:text-4xl ${
												activeId === item.id ? "text-background" : "text-muted-foreground"
											}`}
										>
											{item.title}
										</h2>
										{item.subtitle && (
											<p
												className={`text-sm ${
													activeId === item.id ? "text-background/80" : "text-muted-foreground"
												}`}
											>
												{item.subtitle} {item.year}
											</p>
										)}
										{item.status && (
											<p
												className={`text-sm ${
													activeId === item.id ? "text-background" : "text-muted-foreground"
												}`}
											>
												{item.status}
											</p>
										)}
									</div>
									{activeId === item.id && (
										<motion.div
											layoutId="active-indicator"
											className="bg-background absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 rounded-full sm:right-6"
											transition={{
												type: "spring",
												stiffness: 200,
												damping: 25,
											}}
										/>
									)}
								</div>
							</motion.button>
						))}
					</div>

					{/* Right Column - Image */}
					<div className="bg-muted relative order-first h-75 w-full overflow-hidden rounded-2xl sm:h-100 lg:order-0 lg:mb-0 lg:h-full">
						<AnimatePresence initial={false}>
							{activeItem && (
								<motion.div
									key={activeItem.id}
									initial={{ y: "60%" }}
									animate={{ y: 0 }}
									transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
									className="absolute inset-0 h-full w-full object-cover"
								>
									<Image src={activeItem.image} alt={activeItem.title} width={1000} height={1000} />
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</section>
	)
}
