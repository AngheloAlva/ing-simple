"use client"

import { easeOut, motion } from "motion/react"
import {
	ArrowRight,
	ChevronRightIcon,
	CodeIcon,
	GlobeIcon,
	MonitorSmartphoneIcon,
} from "lucide-react"
import type { ComponentType } from "react"

const cards: {
	icon: ComponentType<{ className?: string; strokeWidth?: number }>
	rotate: number
	translateY: number
	gradientPosition: string
	gradientColors?: string[]
}[] = [
	{
		icon: CodeIcon,
		rotate: -15,
		translateY: 20,
		gradientPosition: "85% 15%",
		gradientColors: ["var(--color-rose-700)", "var(--color-purple-500)"],
	},
	{
		icon: GlobeIcon,
		rotate: 0,
		translateY: -25,
		gradientPosition: "35% 10%",
		gradientColors: ["var(--color-rose-900)", "var(--color-indigo-700)"],
	},
	{
		icon: MonitorSmartphoneIcon,
		rotate: 15,
		translateY: 20,
		gradientPosition: "50% 0%",
		gradientColors: ["var(--color-purple-700)", "var(--color-rose-700)"],
	},
]

export function WebHero() {
	return (
		<section className="bg-background relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
			<div className="relative z-10 mx-auto w-full max-w-350">
				<div className="mb-12 flex flex-col items-start text-left sm:mb-20 sm:items-center sm:text-center lg:mb-16">
					<motion.h1
						className="text-foreground max-w-2xl text-3xl font-medium tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						Tu presencia digital, hecha a tu medida.
					</motion.h1>

					<motion.p
						className="text-muted-foreground mt-4 max-w-xl text-base sm:mt-6 sm:text-xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados que representan a
						tu empresa y generan resultados reales.
					</motion.p>

					<motion.a
						href="#"
						className="group mt-8 inline-flex w-fit items-center justify-center gap-3 rounded-md bg-purple-600 py-3 pr-3 pl-5 font-medium text-white shadow-lg shadow-purple-600/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-purple-600/40 sm:w-auto"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, amount: 0.5 }}
						transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
					>
						<span>Cotiza tu proyecto</span>
						<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:scale-110">
							<ChevronRightIcon className="relative left-px h-4 w-4" />
						</span>
					</motion.a>
				</div>

				<div className="relative">
					<div className="bg-background pointer-events-none absolute top-[50%] left-1/2 z-10 aspect-square w-[250%] -translate-x-1/2 rounded-full shadow-2xl shadow-purple-600/80 sm:top-[60%] sm:w-[250%]" />

					<div className="relative -bottom-10 flex flex-row items-end justify-center -space-x-6 sm:-space-x-12 lg:-space-x-16">
						{cards.map((card, index) => (
							<motion.div
								key={index}
								className="bg-background relative flex h-40 w-32 origin-bottom items-center justify-center overflow-hidden rounded-xl sm:h-72 sm:w-72 sm:rounded-3xl lg:h-80 lg:w-80"
								initial={{ opacity: 0, y: 80, rotate: 0 }}
								animate={{
									opacity: 1,
									y: card.translateY,
									rotate: card.rotate,
								}}
								whileHover={{
									y: card.translateY - 35,
									transition: { type: "spring", stiffness: 400, damping: 25 },
								}}
								transition={{
									duration: 0.7,
									delay: 0.4 + index * 0.12,
									ease: [0.25, 0.46, 0.45, 0.94],
								}}
							>
								{/* Gradient blob */}
								<div
									className="absolute inset-0"
									style={{
										background: `radial-gradient(circle at ${card.gradientPosition}, ${card.gradientColors?.[0]} 0%, ${card.gradientColors?.[1]} 35%, transparent 65%)`,
										opacity: 0.2,
									}}
								/>
								{/* Noise overlay */}
								<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-20">
									<filter id={`web-hero-noise-${index}`}>
										<feTurbulence
											type="fractalNoise"
											baseFrequency="0.65"
											numOctaves="3"
											stitchTiles="stitch"
										/>
									</filter>
									<rect width="100%" height="100%" filter={`url(#web-hero-noise-${index})`} />
								</svg>
								{/* Icon */}
								<card.icon
									className="text-foreground relative z-20 size-14 opacity-25 sm:size-24 lg:size-28"
									strokeWidth={1.5}
								/>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
