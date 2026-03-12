"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import {
	BarChart3Icon,
	BookOpenIcon,
	BrainCircuitIcon,
	ChevronRight as ChevronRightIcon,
	CodeIcon,
	DatabaseIcon,
	GlobeIcon,
	GraduationCapIcon,
	LayoutGridIcon,
	LineChartIcon,
	PieChartIcon,
	ZapIcon,
} from "lucide-react"
import { motion } from "motion/react"
import type { ComponentType } from "react"

import DitherCursor from "@/components/shared/dither-cursor"
import RotatingCards, { type Card } from "./rotating-cards"

const easeOut = [0.16, 1, 0.3, 1] as const
const headlineText = "Soluciones Simples para un Mundo Digital Complejo"

const cardData: { label: string; icon: ComponentType<{ className?: string }>; position: string }[] =
	[
		{ label: "Dashboards", icon: BarChart3Icon, position: "80% 85%" },
		{ label: "Analítica", icon: PieChartIcon, position: "20% 90%" },
		{ label: "Reportes", icon: LineChartIcon, position: "75% 80%" },
		{ label: "Capacitaciones", icon: BookOpenIcon, position: "25% 85%" },
		{ label: "Formación", icon: GraduationCapIcon, position: "80% 90%" },
		{ label: "Desarrollo Web", icon: CodeIcon, position: "20% 80%" },
		{ label: "Sitios Web", icon: GlobeIcon, position: "75% 90%" },
		{ label: "Power Apps", icon: LayoutGridIcon, position: "30% 85%" },
		{ label: "Automatización", icon: ZapIcon, position: "80% 80%" },
		{ label: "Datos", icon: DatabaseIcon, position: "20% 90%" },
		{ label: "Inteligencia", icon: BrainCircuitIcon, position: "70% 85%" },
	]

const carouselCards: Card[] = cardData.map((card, index) => ({
	id: index + 1,
	content: (
		<div className="flex h-full flex-col p-2">
			<div className="bg-muted relative flex flex-1 items-center justify-center overflow-hidden rounded-t-sm rounded-b-full">
				{/* Gradient blob */}
				<div
					className="absolute inset-0"
					style={{
						background: `radial-gradient(circle at ${card.position}, var(--foreground) 35%, var(--background) 55%, transparent 65%)`,
						opacity: 0.2,
					}}
				/>
				{/* Noise overlay */}
				<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-50">
					<filter id={`hero-noise-${index}`}>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.65"
							numOctaves="3"
							stitchTiles="stitch"
						/>
					</filter>
					<rect width="100%" height="100%" filter={`url(#hero-noise-${index})`} />
				</svg>
				{/* Icon */}
				<card.icon className="relative z-20 size-24 stroke-2 opacity-45" />
			</div>
			<div className="px-1 pt-3 text-center">
				<span className="text-sm font-medium">{card.label}</span>
			</div>
		</div>
	),
}))

export function Hero(): ReactNode {
	const sectionRef = useRef<HTMLElement>(null)
	const headlineRef = useRef<HTMLDivElement>(null)
	const [isVisible, setIsVisible] = useState(false)
	const [shouldRender, setShouldRender] = useState(false)
	const [opacity, setOpacity] = useState(0)
	const [isMobile, setIsMobile] = useState(true)
	const opacityRef = useRef(0)
	const animationRef = useRef<number | null>(null)

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768)
		checkMobile()
		window.addEventListener("resize", checkMobile)
		return () => window.removeEventListener("resize", checkMobile)
	}, [])

	useEffect(() => {
		const headline = headlineRef.current
		if (!headline) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry) return
				setIsVisible(entry.isIntersecting)
				if (entry.isIntersecting) setShouldRender(true)
			},
			{ threshold: 0, rootMargin: "-10% 0px -10% 0px" }
		)

		observer.observe(headline)
		return () => observer.disconnect()
	}, [])

	useEffect(() => {
		const targetOpacity = isVisible ? 1 : 0

		const animate = () => {
			const diff = targetOpacity - opacityRef.current
			const step = diff * 0.02

			if (Math.abs(diff) > 0.001) {
				opacityRef.current += step
				setOpacity(opacityRef.current)
				animationRef.current = requestAnimationFrame(animate)
			} else {
				opacityRef.current = targetOpacity
				setOpacity(targetOpacity)
				if (targetOpacity === 0) setShouldRender(false)
			}
		}

		if (animationRef.current) cancelAnimationFrame(animationRef.current)
		animationRef.current = requestAnimationFrame(animate)

		return () => {
			if (animationRef.current) cancelAnimationFrame(animationRef.current)
		}
	}, [isVisible])

	return (
		<section
			ref={sectionRef}
			className="relative flex min-h-dvh flex-col items-center justify-start overflow-hidden px-6 pt-40 sm:pt-82"
		>
			{!isMobile && shouldRender && <DitherCursor color="#00b864" opacity={opacity} />}

			<div ref={headlineRef} className="relative z-10 mx-auto md:text-center">
				<h1 className="mb-8 max-w-325 text-5xl font-medium tracking-tighter md:text-8xl lg:text-8xl">
					{headlineText.split("").map((char, index) => (
						<motion.span
							key={index}
							initial={{ opacity: 0, filter: "blur(10px)" }}
							animate={{ opacity: 1, filter: "blur(0px)" }}
							transition={{
								duration: 0.4,
								delay: index * 0.03,
								ease: "easeOut",
							}}
							className="inline-block"
							style={{ whiteSpace: char === " " ? "pre" : "normal" }}
						>
							{char}
						</motion.span>
					))}
				</h1>
				<motion.p
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{
						duration: 0.8,
						delay: 0.8,
						ease: "easeOut",
					}}
					className="text-muted-foreground mx-auto mt-6 max-w-2xl text-2xl leading-12 tracking-tight md:text-3xl"
				>
					Acompañamos a tu organización con{" "}
					<span className="bg-ring/80 inline-block rounded-md px-2 py-0.5 leading-10 text-white">
						tecnología
					</span>{" "}
					,{" "}
					<span className="bg-ring/80 inline-block rounded-full px-4 py-0.5 leading-10 text-white">
						análisis
					</span>{" "}
					y{" "}
					<span className="bg-ring/80 inline-block rounded-md px-2 py-0.5 leading-10 text-white">
						capacitación
					</span>{" "}
					para optimizar procesos y tomar mejores decisiones
				</motion.p>
			</div>

			{/* Carousel */}
			<div
				className="relative -mx-6 mt-2 h-100 w-screen overflow-hidden sm:h-125 md:h-137.5 lg:h-150 xl:h-175"
				style={{
					maskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
					WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
				}}
			>
				<div className="absolute top-25 left-1/2 -translate-x-1/2 sm:top-30 lg:top-35 xl:top-40">
					<div className="origin-top scale-[0.6] lg:scale-[0.7] xl:scale-100">
						<RotatingCards
							cards={carouselCards}
							radius={1000}
							cardClassName="rounded-md"
							cardWidth={350}
							cardHeight={275}
							duration={100}
							pauseOnHover={true}
							autoPlay={true}
							initialRotation={-90}
							showTrackLine={true}
							trackLineOffset={25}
						/>
					</div>
				</div>
			</div>

			<motion.div
				className="relative z-10 flex flex-col items-center px-6 pb-24 text-center"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ duration: 0.8, ease: easeOut }}
			>
				<h2 className="max-w-3xl text-3xl font-medium tracking-tight md:text-5xl lg:text-6xl">
					Transforma tu Negocio <br />
					con Soluciones Digitales a tu Medida
				</h2>
				<motion.a
					href="#"
					className="bg-accent group shadow-accent/25 hover:shadow-accent/40 mt-8 inline-flex w-full items-center justify-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium text-white shadow-lg transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl sm:w-auto"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.5 }}
					transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
				>
					<span>Conoce nuestros Servicios</span>
					<span className="text-accent flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:scale-110">
						<ChevronRightIcon className="relative left-px h-4 w-4" />
					</span>
				</motion.a>
			</motion.div>
		</section>
	)
}
