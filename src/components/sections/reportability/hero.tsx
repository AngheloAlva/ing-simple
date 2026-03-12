"use client"

import { motion, AnimatePresence, easeOut } from "motion/react"
import { useEffect, useState, useRef } from "react"
import { ChevronRightIcon } from "lucide-react"

export function ReportabilityHero() {
	const [currentSlide, setCurrentSlide] = useState(0)
	const [overallProgress, setOverallProgress] = useState(0)
	const isFirstRender = useRef(true)

	useEffect(() => {
		isFirstRender.current = false
	}, [])

	const slides = [
		{
			title: "Tus datos,",
			subtitle: "convertidos en decisiones.",
			description:
				"Dashboards dinámicos e indicadores claros para ver el desempeño real de tu negocio.",
			image: "/img/reportability/reportabilidad-1.jpeg",
			color: "bg-blue-500",
		},
		{
			title: "Reportes que",
			subtitle: "se generan solos.",
			description: "Automatiza la reportabilidad y dedica tu tiempo a lo que realmente importa.",
			image: "/img/reportability/reportabilidad-3.png",
			color: "bg-yellow-500",
		},
		{
			title: "Métricas claras.",
			subtitle: "Acciones concretas.",
			description: "Desde indicadores operativos hasta análisis ejecutivos, todo en un solo lugar.",
			image: "/img/reportability/reportabilidad-4.png",
			color: "bg-green-500",
		},
	]

	const slideDuration = 5000

	useEffect(() => {
		const progressInterval = setInterval(() => {
			setOverallProgress((prev) => {
				if (prev >= 100) return 0
				return prev + 100 / ((slideDuration * slides.length) / 50)
			})
		}, 50)

		return () => clearInterval(progressInterval)
	}, [slides.length])

	useEffect(() => {
		const slideIndex = Math.floor((overallProgress / 100) * slides.length)
		setCurrentSlide(Math.min(slideIndex, slides.length - 1))
	}, [overallProgress, slides.length])

	const handleSlideClick = (index: number) => {
		setOverallProgress((index / slides.length) * 100)
		setCurrentSlide(index)
	}

	return (
		<section className="bg-background flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:items-center lg:px-8 lg:py-24">
			<div className="relative z-10 mx-auto w-full max-w-7xl">
				<div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto_1.5fr] lg:gap-16">
					<div className="flex flex-col justify-center space-y-8 lg:space-y-12">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentSlide}
								initial="hidden"
								animate="visible"
								exit="exit"
								variants={{
									hidden: { opacity: 0 },
									visible: {
										opacity: 1,
										transition: { staggerChildren: 0.2 },
									},
									exit: {
										opacity: 0,
										transition: { duration: 0.2 },
									},
								}}
								className="space-y-6"
							>
								<h1 className="text-4xl font-medium sm:text-5xl md:text-6xl lg:text-7xl">
									<motion.span
										variants={{
											hidden: { y: 30, opacity: 0 },
											visible: {
												y: 0,
												opacity: 1,
												transition: {
													duration: 0.8,
													ease: [0.2, 0.65, 0.3, 0.9],
												},
											},
										}}
										className="block"
									>
										{slides[currentSlide]?.title}
									</motion.span>
									<motion.span
										variants={{
											hidden: { y: 30, opacity: 0 },
											visible: {
												y: 0,
												opacity: 1,
												transition: {
													duration: 0.8,
													ease: [0.2, 0.65, 0.3, 0.9],
												},
											},
										}}
										className="text-muted-foreground"
									>
										{slides[currentSlide]?.subtitle}
									</motion.span>
								</h1>

								<motion.p
									variants={{
										hidden: { y: 30, opacity: 0 },
										visible: {
											y: 0,
											opacity: 1,
											transition: {
												duration: 0.8,
												ease: [0.2, 0.65, 0.3, 0.9],
											},
										},
									}}
									className="text-muted-foreground max-w-md text-base leading-relaxed sm:text-lg"
								>
									{slides[currentSlide]?.description}
								</motion.p>
							</motion.div>
						</AnimatePresence>

						<motion.a
							href="#"
							className="group mt-4 inline-flex w-fit items-center justify-center gap-3 rounded-md bg-blue-600 py-3 pr-3 pl-5 font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-blue-600/40 sm:w-fit"
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.6, ease: easeOut, delay: 0.2 }}
						>
							<span>Agenda tu Diagnóstico de Datos</span>
							<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4" />
							</span>
						</motion.a>
					</div>

					<div className="hidden h-125 flex-col items-center justify-center gap-4 lg:flex">
						{slides.map((_, index) => (
							<div
								key={index}
								className="group bg-muted-foreground/40 relative w-0.5 flex-1 cursor-pointer overflow-hidden rounded-full"
								onClick={() => handleSlideClick(index)}
							>
								<div className="bg-muted-foreground absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								{index === currentSlide && (
									<motion.div
										className="bg-foreground absolute top-0 left-0 w-full origin-top"
										initial={{ height: "0%" }}
										animate={{
											height: `${
												((overallProgress - (index * 100) / slides.length) /
													(100 / slides.length)) *
												100
											}%`,
										}}
										transition={{ duration: 0.05, ease: "linear" }}
									/>
								)}
								{index < currentSlide && <div className="bg-foreground absolute inset-0" />}
							</div>
						))}
					</div>

					<div className="relative flex items-center justify-center">
						<AnimatePresence mode="wait">
							<motion.div
								key={currentSlide}
								transition={{ duration: 0.8 }}
								exit={{ opacity: 0, scale: 0.8 }}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 0.5, scale: 1 }}
								className={`absolute inset-0 blur-[100px] ${slides[currentSlide]?.color} rounded-full opacity-20 dark:opacity-10`}
							/>
						</AnimatePresence>

						<div className="relative h-70 w-full overflow-hidden rounded-2xl bg-neutral-100 shadow-2xl sm:h-87.5 lg:h-120 dark:bg-neutral-900">
							<AnimatePresence mode="popLayout">
								<motion.img
									key={currentSlide}
									src={slides[currentSlide]?.image}
									initial={
										// eslint-disable-next-line react-hooks/refs
										isFirstRender.current
											? { opacity: 0, scale: 1.1, y: 0 }
											: { opacity: 1, scale: 1, y: "100%" }
									}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.9, y: "-100%" }}
									transition={{
										duration: 0.8,
										ease: [0.2, 0.65, 0.3, 0.9],
									}}
									className="absolute inset-0 h-full w-full object-cover"
								/>
							</AnimatePresence>
						</div>
					</div>
				</div>

				<div className="mt-8 flex justify-center gap-2 lg:hidden">
					{slides.map((_, index) => (
						<div
							key={index}
							className="relative h-0.5 w-16 cursor-pointer overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
							onClick={() => handleSlideClick(index)}
						>
							{index === currentSlide && (
								<motion.div
									className="absolute inset-0 origin-left bg-neutral-900 dark:bg-white"
									style={{
										scaleX:
											(overallProgress - (index * 100) / slides.length) / (100 / slides.length),
									}}
									transition={{ duration: 0.05, ease: "linear" }}
								/>
							)}
							{index < currentSlide && (
								<div className="absolute inset-0 bg-neutral-900 dark:bg-white" />
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	)
}
