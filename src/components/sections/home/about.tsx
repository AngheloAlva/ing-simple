"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useState, useRef, useEffect } from "react"
import Image from "next/image"

interface TimelineEntry {
	id: number
	title: string
	date: string
	month: string
	year: string
	description: string
	image: string
}

interface AboutProps {
	displayNavigation?: boolean
}

const TIMELINE_DATA: TimelineEntry[] = [
	{
		id: 1,
		title: "Power BI",
		date: "2023",
		month: "",
		year: "2023",
		description:
			"Comenzamos transformando datos en decisiones. Nuestros primeros dashboards y reportes en Power BI ayudaron a empresas a visualizar su información de forma clara y accionable.",
		image: "/svg/placeholder.svg",
	},
	{
		id: 2,
		title: "Power Platform",
		date: "2024",
		month: "",
		year: "2024",
		description:
			"Escalamos hacia Power Apps, Power Automate y SharePoint. Empezamos a digitalizar formularios, automatizar flujos y reemplazar procesos manuales con soluciones rápidas y escalables.",
		image: "/svg/placeholder.svg",
	},
	{
		id: 3,
		title: "Capacitaciones",
		date: "2024",
		month: "",
		year: "2024",
		description:
			"Abrimos nuestra línea de formación. Cursos prácticos de Power BI, Power Apps y Excel avanzado adaptados al nivel de cada equipo, con ejercicios reales y acompañamiento continuo.",
		image: "/svg/placeholder.svg",
	},
	{
		id: 4,
		title: "Desarrollo Web",
		date: "2025",
		month: "",
		year: "2025",
		description:
			"Incorporamos el desarrollo de sitios web modernos y funcionales. Landing pages, sitios corporativos y portales enfocados en experiencia de usuario y resultados concretos.",
		image: "/svg/placeholder.svg",
	},
]

export default function About({ displayNavigation = true }: AboutProps = {}) {
	const [activeIndex, setActiveIndex] = useState(0)
	const [resetKey, setResetKey] = useState(0)
	const timelineRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		const interval = setInterval(() => {
			setActiveIndex((prev) => {
				const nextIndex = (prev + 1) % TIMELINE_DATA.length
				scrollToIndex(nextIndex)
				return nextIndex
			})
		}, 10000)

		return () => clearInterval(interval)
	}, [resetKey])

	const scrollToIndex = (index: number) => {
		if (timelineRef.current) {
			const container = timelineRef.current
			const itemWidth = container.scrollWidth / TIMELINE_DATA.length
			const scrollPosition = itemWidth * index
			container.scrollTo({
				left: scrollPosition,
				behavior: "smooth",
			})
		}
	}

	const handlePrevious = () => {
		const newIndex = Math.max(0, activeIndex - 1)
		setActiveIndex(newIndex)
		scrollToIndex(newIndex)
		setResetKey((prev) => prev + 1)
	}

	const handleNext = () => {
		const newIndex = Math.min(TIMELINE_DATA.length - 1, activeIndex + 1)
		setActiveIndex(newIndex)
		scrollToIndex(newIndex)
		setResetKey((prev) => prev + 1)
	}

	const handleIndexChange = (index: number) => {
		setActiveIndex(index)
		scrollToIndex(index)
		setResetKey((prev) => prev + 1)
	}

	const activeEntry = TIMELINE_DATA[activeIndex]

	return (
		<section className="w-full px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-6xl">
				{/* Header */}
				<Header />

				{/* Content Card */}
				<ContentCard entry={activeEntry} />

				{/* Timeline */}
				<div className="mt-12 sm:mt-16">
					<Timeline
						activeIndex={activeIndex}
						onIndexChange={handleIndexChange}
						displayNavigation={displayNavigation}
						onPrevious={handlePrevious}
						onNext={handleNext}
						timelineRef={timelineRef}
					/>
				</div>
			</div>
		</section>
	)
}

function Header() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="mb-8 sm:mb-12"
		>
			<h1 className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl md:text-6xl dark:text-white">
				Nuestra Historia
			</h1>
		</motion.div>
	)
}

function ContentCard({ entry }: { entry: TimelineEntry | undefined }) {
	return (
		<div className="relative overflow-hidden rounded-3xl bg-neutral-50 p-6 dark:bg-neutral-900">
			<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
				{/* Left Content */}
				<div className="flex h-full flex-col justify-between">
					<AnimatePresence mode="wait">
						<motion.div
							key={`year-${entry?.id}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
						>
							{/* Year */}
							<div className="text-sm font-medium text-purple-500 sm:text-base">{entry?.year}</div>
						</motion.div>
					</AnimatePresence>

					<AnimatePresence mode="wait">
						<motion.div
							key={`content-${entry?.id}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.3 }}
							className="space-y-2"
						>
							{/* Title */}
							<h2 className="text-3xl font-medium tracking-tight text-neutral-900 dark:text-white">
								{entry?.title}
							</h2>

							{/* Description */}
							<p className="max-w-xl text-base leading-relaxed tracking-tight text-neutral-600 dark:text-neutral-400">
								{entry?.description}
							</p>
						</motion.div>
					</AnimatePresence>
				</div>

				{/* Right Image */}
				<div className="flex items-center justify-center lg:justify-end">
					<AnimatePresence mode="wait">
						<motion.div
							key={entry?.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.3 }}
							className="relative mx-auto aspect-square max-h-75 w-full lg:mx-0 lg:ml-auto lg:max-w-xs"
						>
							<div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-800">
								<Image
									width={300}
									height={300}
									src={entry?.image || ""}
									alt={entry?.title || ""}
									className="h-3/4 w-3/4 object-contain"
								/>
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	)
}

function Timeline({
	activeIndex,
	onIndexChange,
	displayNavigation,
	onPrevious,
	onNext,
	timelineRef,
}: {
	activeIndex: number
	onIndexChange: (index: number) => void
	displayNavigation: boolean
	onPrevious: () => void
	onNext: () => void
	timelineRef: React.RefObject<HTMLDivElement | null>
}) {
	return (
		<div className="space-y-8">
			{/* Scrollable Timeline Container - Mobile */}
			<div
				ref={timelineRef}
				className="scrollbar-hide -mx-4 overflow-x-auto px-4 md:hidden"
				style={{
					scrollbarWidth: "none",
					msOverflowStyle: "none",
				}}
			>
				<div className="min-w-150 space-y-8">
					{/* Timeline Labels */}
					<div className="grid grid-cols-4 gap-8">
						{TIMELINE_DATA.map((entry, index) => (
							<button
								key={entry.id}
								onClick={() => onIndexChange(index)}
								className="text-left whitespace-nowrap"
							>
								<div
									className={`text-xs font-medium transition-colors duration-200 sm:text-sm ${
										index === activeIndex
											? "text-neutral-900 dark:text-white"
											: "text-neutral-400 dark:text-neutral-600"
									}`}
								>
									{entry.title}
								</div>
							</button>
						))}
					</div>

					{/* Timeline Bar */}
					<div className="relative">
						{/* Background Line */}
						<div className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-neutral-200 dark:bg-neutral-800" />

						{/* Progress Line */}
						<motion.div
							className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-neutral-900 dark:bg-white"
							initial={false}
							animate={{
								width:
									activeIndex === 0
										? 0
										: `calc(((100% - (3 * 2rem)) / 4) * ${activeIndex} + (2rem * ${activeIndex}))`,
							}}
							transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
						/>

						{/* Timeline Dots */}
						<div className="relative grid grid-cols-4 gap-8">
							{TIMELINE_DATA.map((entry, index) => {
								const isActive = index === activeIndex
								const isPassed = index <= activeIndex

								return (
									<button
										key={entry.id}
										onClick={() => onIndexChange(index)}
										className="flex flex-col items-start"
									>
										<div className="relative flex w-full justify-start">
											<motion.div
												className={`h-3 w-3 rounded-full border-2 transition-colors duration-200 ${
													isPassed
														? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white"
														: "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
												}`}
												animate={{
													scale: isActive ? 1.4 : 1,
												}}
												transition={{ duration: 0.2 }}
											/>
										</div>
									</button>
								)
							})}
						</div>
					</div>

					{/* Timeline Dates */}
					<div className="grid grid-cols-4 gap-8">
						{TIMELINE_DATA.map((entry, index) => (
							<button
								key={entry.id}
								onClick={() => onIndexChange(index)}
								className="text-left whitespace-nowrap"
							>
								<div
									className={`text-xs transition-colors duration-200 sm:text-sm ${
										index === activeIndex
											? "font-medium text-neutral-900 dark:text-white"
											: "text-neutral-400 dark:text-neutral-600"
									}`}
								>
									{entry.date}
								</div>
							</button>
						))}
					</div>
				</div>
			</div>

			{/* Navigation Arrows - Mobile Centered */}
			{displayNavigation && (
				<div className="flex justify-center gap-2 md:hidden">
					<button
						onClick={onPrevious}
						disabled={activeIndex === 0}
						className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 transition-colors duration-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:hover:bg-neutral-900"
						aria-label="Previous"
					>
						<ChevronLeft className="h-5 w-5 text-neutral-900 dark:text-white" />
					</button>
					<button
						onClick={onNext}
						disabled={activeIndex === TIMELINE_DATA.length - 1}
						className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 transition-colors duration-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:hover:bg-neutral-900"
						aria-label="Next"
					>
						<ChevronRight className="h-5 w-5 text-neutral-900 dark:text-white" />
					</button>
				</div>
			)}

			{/* Desktop Timeline */}
			<div className="hidden space-y-8 md:block">
				{/* Timeline Labels */}
				<div className="grid grid-cols-4 gap-2 sm:gap-4">
					{TIMELINE_DATA.map((entry, index) => (
						<button key={entry.id} onClick={() => onIndexChange(index)} className="text-left">
							<div
								className={`text-xs font-medium transition-colors duration-200 sm:text-sm ${
									index === activeIndex
										? "text-neutral-900 dark:text-white"
										: "text-neutral-400 dark:text-neutral-600"
								}`}
							>
								{entry.title}
							</div>
						</button>
					))}
				</div>

				{/* Timeline Bar */}
				<div className="relative">
					{/* Background Line */}
					<div className="absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 bg-neutral-200 dark:bg-neutral-800" />

					{/* Progress Line */}
					<motion.div
						className="absolute top-1/2 left-0 h-0.5 -translate-y-1/2 bg-neutral-900 sm:hidden dark:bg-white"
						initial={false}
						animate={{
							width:
								activeIndex === 0
									? 0
									: `calc(((100% - (3 * 0.5rem)) / 4) * ${activeIndex} + (0.5rem * ${activeIndex}))`,
						}}
						transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
					/>

					{/* Progress Line - Tablet/Desktop */}
					<motion.div
						className="absolute top-1/2 left-0 hidden h-0.5 -translate-y-1/2 bg-neutral-900 sm:block dark:bg-white"
						initial={false}
						animate={{
							width:
								activeIndex === 0
									? 0
									: `calc(((100% - (3 * 1rem)) / 4) * ${activeIndex} + (1rem * ${activeIndex}))`,
						}}
						transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
					/>

					{/* Timeline Dots */}
					<div className="relative grid grid-cols-4 gap-2 sm:gap-4">
						{TIMELINE_DATA.map((entry, index) => {
							const isActive = index === activeIndex
							const isPassed = index <= activeIndex

							return (
								<button
									key={entry.id}
									onClick={() => onIndexChange(index)}
									className="flex flex-col items-start"
								>
									{/* Dot */}
									<div className="relative flex w-full justify-start">
										<motion.div
											className={`h-3 w-3 rounded-full border-2 transition-colors duration-200 ${
												isPassed
													? "border-neutral-900 bg-neutral-900 dark:border-white dark:bg-white"
													: "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
											}`}
											animate={{
												scale: isActive ? 1.4 : 1,
											}}
											transition={{ duration: 0.2 }}
										/>
									</div>
								</button>
							)
						})}
					</div>
				</div>

				{/* Timeline Dates */}
				<div className="grid grid-cols-4 gap-2 sm:gap-4">
					{TIMELINE_DATA.map((entry, index) => (
						<button key={entry.id} onClick={() => onIndexChange(index)} className="text-left">
							<div
								className={`w-fit rounded-full border px-2 py-1 text-xs transition-colors duration-200 ${
									index === activeIndex
										? "border-neutral-500/20 bg-neutral-900 text-white"
										: "border-transparent text-neutral-400 dark:text-neutral-600"
								}`}
							>
								{entry.date}
							</div>
						</button>
					))}
				</div>

				{/* Navigation Arrows - Desktop Only */}
				{displayNavigation && (
					<div className="hidden justify-end gap-2 md:flex">
						<button
							onClick={onPrevious}
							disabled={activeIndex === 0}
							className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 transition-colors duration-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:hover:bg-neutral-900"
							aria-label="Previous"
						>
							<ChevronLeft className="h-4 w-4 text-neutral-900 dark:text-white" />
						</button>
						<button
							onClick={onNext}
							disabled={activeIndex === TIMELINE_DATA.length - 1}
							className="flex h-8 w-8 items-center justify-center rounded-md border border-neutral-300 transition-colors duration-200 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-30 dark:border-neutral-700 dark:hover:bg-neutral-900"
							aria-label="Next"
						>
							<ChevronRight className="h-4 w-4 text-neutral-900 dark:text-white" />
						</button>
					</div>
				)}
			</div>
		</div>
	)
}
