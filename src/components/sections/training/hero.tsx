"use client"

import { ChevronRight } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"

export function TrainingHero() {
	return (
		<section className="bg-background flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6 sm:py-28 md:py-32 lg:px-8 lg:py-24">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12 xl:gap-16">
					{/* Left Column - Content */}
					<div className="flex flex-col gap-y-6">
						{/* Main Headline */}
						<motion.h1
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="text-foreground text-3xl leading-[1.15] font-medium tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
						>
							Domina las herramientas que transforman tu trabajo
						</motion.h1>

						{/* Sub-headline */}
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="text-muted-foreground max-w-lg text-base leading-relaxed tracking-tight sm:text-lg"
						>
							Formación práctica en Power BI, Power Apps, Excel avanzado y Power Automate. Aprende a
							usar las herramientas que realmente necesitas para ser más productivo.
						</motion.p>

						{/* CTA Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
						>
							<a
								href="/contacto"
								className="group flex w-fit cursor-pointer items-center justify-center gap-3 rounded-md bg-orange-500 py-3 pr-3 pl-5 text-sm font-medium text-white shadow-lg shadow-orange-500/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-orange-500/40 sm:w-auto sm:text-base"
							>
								<span>Solicitar capacitación</span>
								<span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:scale-110">
									<ChevronRight className="relative left-px h-4 w-4" />
								</span>
							</a>
						</motion.div>

						{/* Social Proof */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className="flex items-center gap-3 pt-2 select-none sm:gap-4"
						>
							{/* User Avatars */}
							<div className="flex -space-x-2">
								<div className="border-background flex h-10 w-10 items-center justify-center rounded-full border-4 bg-orange-500 text-xs font-semibold text-white sm:h-12 sm:w-12 sm:text-sm">
									MR
								</div>
								<div className="border-background flex h-10 w-10 items-center justify-center rounded-full border-4 bg-orange-500 text-xs font-semibold text-white sm:h-12 sm:w-12 sm:text-sm">
									CL
								</div>
								<div className="border-background flex h-10 w-10 items-center justify-center rounded-full border-4 bg-orange-500 text-xs font-semibold text-white sm:h-12 sm:w-12 sm:text-sm">
									JP
								</div>
							</div>

							{/* Social Proof Text */}
							<div className="flex flex-col">
								<span className="text-foreground text-base font-semibold sm:text-lg">500+</span>
								<span className="text-muted-foreground text-xs sm:text-sm">
									Profesionales capacitados.
								</span>
							</div>
						</motion.div>
					</div>

					{/* Right Column - Visual Content */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="relative h-auto w-full"
					>
						<div className="bg-background relative h-full min-h-62.5 w-full overflow-hidden rounded-4xl transition-colors sm:min-h-124">
							<Image
								width={544}
								height={544}
								alt="Capacitación profesional en aula"
								className="absolute inset-0 h-full w-full object-cover"
								src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1740&auto=format&fit=crop"
							/>

							{/* Decorative Circle */}
							<div className="absolute right-0 bottom-0 flex flex-col items-end">
								<svg
									width="40"
									height="40"
									viewBox="0 0 200 200"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z"
										className="fill-background"
									/>
								</svg>

								<div className="relative">
									<div className="bg-background h-24 w-24 rounded-tl-4xl pt-4 pl-4">
										<button className="flex h-full w-full cursor-pointer items-center justify-center rounded-[1.2em] border border-none bg-orange-500 transition-opacity hover:opacity-90">
											<ChevronRight className="h-6 w-6 -rotate-45 text-white" />
										</button>
									</div>

									{/* Bottom Left SVG */}
									<svg
										width="40"
										height="40"
										viewBox="0 0 200 200"
										xmlns="http://www.w3.org/2000/svg"
										className="absolute bottom-0 -left-10"
									>
										<path
											d="M0 200C155.996 199.961 200.029 156.308 200 0V200H0Z"
											className="fill-background"
										/>
									</svg>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
