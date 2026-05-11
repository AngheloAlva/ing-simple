"use client"

import { motion } from "motion/react"
import {
	ZapIcon,
	CodeIcon,
	GlobeIcon,
	PieChartIcon,
	DatabaseIcon,
	BookOpenIcon,
	BarChart3Icon,
	LineChartIcon,
	LayoutGridIcon,
	BrainCircuitIcon,
	GraduationCapIcon,
	ChevronRight as ChevronRightIcon,
} from "lucide-react"

import RotatingCards, { type Card } from "./rotating-cards"

import type { ComponentType, ReactNode } from "react"

const easeOut = [0.16, 1, 0.3, 1] as const

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
				<div
					className="absolute inset-0"
					style={{
						background: `radial-gradient(circle at ${card.position}, var(--foreground) 35%, var(--background) 55%, transparent 65%)`,
						opacity: 0.2,
					}}
				/>
				<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-50">
					<filter id={`transformation-noise-${index}`}>
						<feTurbulence
							type="fractalNoise"
							baseFrequency="0.65"
							numOctaves="3"
							stitchTiles="stitch"
						/>
					</filter>
					<rect width="100%" height="100%" filter={`url(#transformation-noise-${index})`} />
				</svg>
				<card.icon className="relative z-20 size-24 stroke-2 opacity-45" />
			</div>
			<div className="px-1 pt-3 text-center">
				<span className="text-sm font-medium">{card.label}</span>
			</div>
		</div>
	),
}))

export function Transformation(): ReactNode {
	return (
		<section className="relative flex flex-col items-center overflow-hidden px-6 py-24">
			<div
				className="relative -mx-6 h-100 w-screen overflow-hidden sm:h-125 md:h-137.5 lg:h-150 xl:h-175"
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
				className="relative z-10 flex flex-col items-center px-6 pt-12 text-center"
				initial={{ opacity: 0, y: 40 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.5 }}
				transition={{ duration: 0.8, ease: easeOut }}
			>
				<h2 className="max-w-3xl text-3xl font-medium tracking-tight text-pretty md:text-5xl lg:text-6xl">
					Sumate a la transformación digital y toma decisiones con claridad
				</h2>
				<motion.a
					href="#servicios"
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
