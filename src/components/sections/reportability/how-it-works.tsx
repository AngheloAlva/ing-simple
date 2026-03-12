"use client"

import {
	UserCog,
	BookSearch,
	ChevronLeft,
	ChevronRight,
	ChevronRightIcon,
	LayoutDashboard,
} from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { easeOut, motion } from "motion/react"
import Image from "next/image"

interface GradientIconProps {
	icon: React.ComponentType<{ className?: string }>
	gradient: { from: string; to: string; position: string }
	index: string
}

const gradientPositionMap: Record<string, string> = {
	"bottom-right": "80% 120%",
	"bottom-left": "20% 120%",
	"center": "50% 120%",
}

function GradientIcon({ icon: Icon, gradient, index }: GradientIconProps) {
	const center = gradientPositionMap[gradient.position]

	return (
		<div className="bg-muted relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl shadow-xl">
			{/* Gradient blob */}
			<div
				className="absolute inset-0"
				style={{
					background: `radial-gradient(circle at ${center}, ${gradient.from} 0%, ${gradient.to} 40%, transparent 70%)`,
					opacity: 0.75,
				}}
			/>
			{/* Noise overlay */}
			<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-40">
				<filter id={`noise-${index}`}>
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.65"
						numOctaves="3"
						stitchTiles="stitch"
					/>
				</filter>
				<rect width="100%" height="100%" filter={`url(#noise-${index})`} />
			</svg>
			{/* Icon */}
			<Icon className="relative z-20 size-16 opacity-40 sm:size-20 md:size-24" />
		</div>
	)
}

const items = [
	{
		index: 1,
		title: "Diagnóstico de datos",
		description:
			"Entendemos qué datos tienes, dónde están almacenados y qué información necesitas visualizar para tomar mejores decisiones.",
		image1: "/img/reportability/how-it-works-1.webp",
		image2:
			"https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
		icon: BookSearch,
	},
	{
		index: 2,
		title: "Diseño del modelo",
		description:
			"Definimos los KPIs clave, la estructura de datos y las visualizaciones que mejor representen el desempeño de tu negocio.",
		image1: "/img/reportability/how-it-works-2.webp",
		image2:
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
		icon: LayoutDashboard,
	},
	{
		index: 3,
		title: "Desarrollo y entrega",
		description:
			"Construimos el dashboard en Power BI, lo conectamos a tus fuentes de datos y te capacitamos para usarlo con autonomía.",
		image1: "/img/reportability/how-it-works-3.webp",
		image2:
			"https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop",
		icon: UserCog,
	},
]

export function ReportabilityHowItWorks() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const containerRef = useRef<HTMLDivElement>(null)
	const [itemWidth, setItemWidth] = useState(400)
	const [gap, setGap] = useState(124)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const updateWidth = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.offsetWidth
				if (containerWidth < 640) {
					setItemWidth(containerWidth - 32)
					setGap(24)
					setIsMobile(true)
				} else if (containerWidth < 1024) {
					setItemWidth(Math.min(380, containerWidth * 0.45))
					setGap(124)
					setIsMobile(false)
				} else {
					setItemWidth(Math.min(420, containerWidth * 0.32))
					setGap(124)
					setIsMobile(false)
				}
			}
		}

		const resizeObserver = new ResizeObserver(updateWidth)
		if (containerRef.current) {
			resizeObserver.observe(containerRef.current)
		}
		updateWidth()

		return () => resizeObserver.disconnect()
	}, [])

	const canGoPrev = currentIndex > 0
	const canGoNext = currentIndex < items.length - 1

	const handlePrev = () => {
		if (canGoPrev) setCurrentIndex((prev) => prev - 1)
	}

	const handleNext = () => {
		if (canGoNext) setCurrentIndex((prev) => prev + 1)
	}

	const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault()
			setCurrentIndex(idx)
		}
	}

	return (
		<section className="bg-background w-full py-12 lg:py-20 xl:py-28" aria-label="How it works">
			<div className="mx-auto w-full max-w-6xl px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="mb-10 flex flex-col gap-3 sm:mb-12 sm:gap-4 lg:mb-16"
				>
					<span className="text-xs font-medium text-yellow-600 uppercase">Nuestro Proceso</span>
					<div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
						<h2 className="text-foreground max-w-xl text-2xl leading-[1.15] font-medium tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
							De datos dispersos a decisiones claras en tres pasos
						</h2>

						<motion.a
							href="#"
							className="group inline-flex w-full items-center justify-center gap-3 rounded-md bg-yellow-600 py-2 pr-3 pl-5 font-medium text-white shadow-lg shadow-yellow-600/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-yellow-600/40 sm:w-fit"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
						>
							<span>Comenzar ahora</span>
							<span className="bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4" />
							</span>
						</motion.a>
					</div>
				</motion.div>
			</div>

			<div
				ref={containerRef}
				className="overflow-hidden pl-4 sm:pl-6 lg:pl-8"
				role="region"
				aria-label="Steps carousel"
			>
				<div className="mx-auto max-w-6xl">
					<motion.div
						className="flex"
						animate={{ x: -(currentIndex * (itemWidth + gap)) }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						style={{ gap }}
					>
						{items.map((item, idx) => (
							<motion.article
								key={item.index}
								className="shrink-0"
								style={{ width: itemWidth }}
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: idx * 0.1 }}
								aria-label={`Step ${item.index}: ${item.title}`}
							>
								<div className="flex flex-col gap-2">
									<span className="text-muted-foreground text-xs font-medium sm:text-sm">
										{item.index}
									</span>

									<h3 className="text-foreground line-clamp-2 text-base leading-tight font-medium tracking-tight sm:text-lg md:text-xl">
										{item.title}
									</h3>

									<p className="text-muted-foreground h-[4.5em] text-sm leading-relaxed sm:text-base">
										{item.description}
									</p>

									<div
										className="relative mt-4"
										style={{ height: itemWidth * (isMobile ? 1.1 : 1.15) }}
									>
										<motion.div
											className="absolute top-0 left-0 overflow-hidden rounded-2xl shadow-lg"
											style={{
												height: itemWidth * 0.75,
												width: isMobile ? itemWidth : itemWidth + 100,
											}}
											whileHover={{ scale: 1.02 }}
											transition={{ duration: 0.3 }}
										>
											<Image
												alt=""
												width={1000}
												height={1000}
												loading="lazy"
												src={item.image1}
												className="h-full w-full object-cover grayscale-50"
											/>
											<svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-20">
												<filter id={`noise-${item.index}`}>
													<feTurbulence
														type="fractalNoise"
														baseFrequency="0.65"
														numOctaves="3"
														stitchTiles="stitch"
													/>
												</filter>
												<rect width="100%" height="100%" filter={`url(#noise-${item.index})`} />
											</svg>
										</motion.div>

										<motion.div
											className="absolute overflow-hidden rounded-2xl"
											style={{
												width: itemWidth * 0.65,
												height: itemWidth * 0.65,
												top: itemWidth * 0.375,
												left: itemWidth * 0.3,
											}}
											whileHover={{ scale: 1.02 }}
											transition={{ duration: 0.3 }}
										>
											<GradientIcon
												icon={item.icon}
												gradient={
													item.index === 1
														? { from: "#3b82f6", to: "#facc15", position: "bottom-right" }
														: item.index === 2
															? { from: "#facc15", to: "#3b82f6", position: "bottom-left" }
															: { from: "#3b82f6", to: "#facc15", position: "center" }
												}
												index={item.index.toString()}
											/>
										</motion.div>
									</div>
								</div>
							</motion.article>
						))}
					</motion.div>
				</div>
			</div>

			<div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
				<motion.nav
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="mt-2 flex items-center justify-center gap-2"
					aria-label="Navegación del carrusel"
				>
					<motion.button
						whileHover={canGoPrev ? { scale: 1.05 } : {}}
						whileTap={canGoPrev ? { scale: 0.95 } : {}}
						onClick={handlePrev}
						disabled={!canGoPrev}
						className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
							canGoPrev
								? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
								: "text-muted-foreground cursor-not-allowed bg-transparent"
						}`}
						aria-label="Diapositiva anterior"
					>
						<ChevronLeft className="h-5 w-5" />
					</motion.button>

					<div
						className="bg-foreground flex h-9 items-center justify-center gap-1.5 rounded-full px-4"
						role="tablist"
						aria-label="Slide indicators"
					>
						{items.map((_, idx) => (
							<div
								key={idx}
								onClick={() => setCurrentIndex(idx)}
								onKeyDown={(e) => handleKeyDown(e, idx)}
								className={`cursor-pointer rounded-full transition-all duration-300 ${
									idx === currentIndex
										? "bg-background h-2 w-2"
										: "bg-muted-foreground hover:bg-muted h-1.5 w-1.5"
								}`}
								role="tab"
								tabIndex={0}
								aria-selected={idx === currentIndex}
								aria-label={`Go to slide ${idx + 1}`}
							/>
						))}
					</div>

					<motion.button
						whileHover={canGoNext ? { scale: 1.05 } : {}}
						whileTap={canGoNext ? { scale: 0.95 } : {}}
						onClick={handleNext}
						disabled={!canGoNext}
						className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-200 ${
							canGoNext
								? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
								: "text-muted-foreground cursor-not-allowed bg-transparent"
						}`}
						aria-label="Next slide"
					>
						<ChevronRight className="h-5 w-5" />
					</motion.button>
				</motion.nav>
			</div>
		</section>
	)
}
