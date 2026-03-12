"use client"

import { useEffect, useRef } from "react"
import { motion } from "motion/react"
import Image from "next/image"

import CountUp from "@/components/shared/count-up"

const stats = [
	{
		prefix: "",
		value: 95,
		label: "Satisfacción de participantes",
	},
	{
		prefix: "+",
		value: 60,
		label: "Mejora en productividad",
	},
]

export default function TrainingStats() {
	const marquee1Ref = useRef<HTMLDivElement>(null)
	const marquee2Ref = useRef<HTMLDivElement>(null)

	const squares = Array.from({ length: 30 }, (_, i) => i)

	useEffect(() => {
		const marquee1 = marquee1Ref.current
		const marquee2 = marquee2Ref.current

		if (!marquee1 || !marquee2) return

		let animation: number
		let scrollPos1 = 0
		let scrollPos2 = -(marquee2.scrollHeight / 2)

		const animate = () => {
			scrollPos1 += 0.8
			if (scrollPos1 >= marquee1.scrollHeight / 2) {
				scrollPos1 = 0
			}
			marquee1.style.transform = `translateY(-${scrollPos1}px)`

			scrollPos2 += 0.8
			if (scrollPos2 >= 0) {
				scrollPos2 = -(marquee2.scrollHeight / 2)
			}
			marquee2.style.transform = `translateY(${scrollPos2}px)`

			animation = requestAnimationFrame(animate)
		}

		animation = requestAnimationFrame(animate)

		return () => {
			cancelAnimationFrame(animation)
		}
	}, [])

	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-36">
			<div className="mx-auto w-full max-w-6xl">
				{/* Top Section - Title and Description */}
				<div className="mb-8 flex flex-col items-center text-center">
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-foreground mb-4 max-w-xl text-2xl leading-tight font-medium tracking-tight sm:text-3xl md:text-4xl"
					>
						Resultados que hablan por sí solos
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="text-muted-foreground max-w-xl text-base leading-relaxed tracking-tight"
					>
						Nuestras capacitaciones generan impacto real y medible en el desempeño de los equipos de
						trabajo.
					</motion.p>
				</div>

				{/* Vertical Line */}
				<motion.div
					initial={{ scaleY: 0 }}
					whileInView={{ scaleY: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="bg-muted-foreground mx-auto h-12 w-px origin-top sm:h-16"
				/>

				{/* Stats Card */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="overflow-hidden rounded-2xl bg-orange-500 sm:rounded-3xl"
				>
					<div className="grid grid-cols-1 lg:grid-cols-2">
						{/* Left Column - Content */}
						<div className="flex flex-col justify-center p-8 sm:p-10 md:p-12 lg:p-16">
							<motion.h2
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.4 }}
								className="mb-6 text-3xl leading-tight font-medium text-white sm:mb-8 sm:text-4xl md:text-4xl"
							>
								Transformando la forma de trabajar con datos
							</motion.h2>

							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: 0.5 }}
								className="text-muted mb-8 text-base leading-relaxed tracking-tight sm:mb-12 sm:text-lg"
							>
								Equipos que dominan sus herramientas toman mejores decisiones y logran resultados
								más rápido.
							</motion.p>

							{/* Stats Grid */}
							<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-12">
								{stats.map((stat, index) => (
									<motion.div
										key={index}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
										className="flex flex-col gap-2"
									>
										<span className="text-4xl font-medium tracking-tight text-white sm:text-5xl md:text-6xl">
											{stat.prefix}
											<CountUp to={stat.value} from={0} /> %
										</span>
										<span className="text-muted text-base whitespace-nowrap">{stat.label}</span>
									</motion.div>
								))}
							</div>
						</div>

						{/* Right Column - Masked Image with Marquee */}
						<div className="relative h-100 overflow-hidden bg-orange-500 sm:h-125 lg:h-auto">
							{/* Gradient overlay */}
							<div className="pointer-events-none absolute inset-0 z-20 bg-linear-to-b from-orange-500 via-orange-500/60 via-30% to-transparent lg:bg-linear-to-r" />

							{/* Isolation wrapper for blend modes */}
							<div className="absolute inset-0" style={{ isolation: "isolate" }}>
								{/* White background */}
								<div className="absolute inset-0 bg-white" />

								{/* Image layer */}
								<div className="absolute inset-0">
									<Image
										width={1200}
										height={1200}
										alt="Equipo en capacitación"
										className="h-full w-full object-cover"
										src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=1200&fit=crop&q=80"
									/>
								</div>

								{/* Overlay with white squares */}
								<div
									className="absolute inset-0 bg-orange-500"
									style={{ mixBlendMode: "multiply" }}
								>
									{/* Rotated Marquee Container */}
									<div
										className="absolute inset-0"
										style={{
											transform: "rotate(45deg) scale(2.2)",
											transformOrigin: "center center",
										}}
									>
										<div className="flex h-full items-center justify-center gap-2 sm:gap-3 md:gap-4">
											{/* Marquee 1 */}
											<div className="relative overflow-hidden">
												<div ref={marquee1Ref} className="flex flex-col gap-3 sm:gap-4">
													{[...squares, ...squares].map((_, index) => (
														<div
															key={`marquee1-${index}`}
															className="h-16 w-16 shrink-0 rounded-md bg-white sm:h-20 sm:w-20 sm:rounded-lg md:h-24 md:w-24"
														/>
													))}
												</div>
											</div>

											{/* Marquee 2 */}
											<div className="relative overflow-hidden">
												<div ref={marquee2Ref} className="flex flex-col gap-3 sm:gap-4">
													{[...squares, ...squares].map((_, index) => (
														<div
															key={`marquee2-${index}`}
															className="h-16 w-16 shrink-0 rounded-md bg-white sm:h-20 sm:w-20 sm:rounded-lg md:h-24 md:w-24"
														/>
													))}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
