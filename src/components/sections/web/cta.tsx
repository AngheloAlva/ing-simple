"use client"

import { Globe, Code2, Rocket, ChevronRight } from "lucide-react"
import { motion } from "motion/react"

export default function WebCTA() {
	return (
		<section className="bg-background relative flex min-h-screen w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mx-auto max-w-3xl text-center">
					{/* Icon Cards */}
					<div className="relative mb-4 flex items-center justify-center sm:h-48">
						{/* Background SVG Circles */}
						<div className="pointer-events-none absolute inset-0 -top-28 flex items-center justify-center">
							<div className="relative h-70 w-70 sm:h-82.5 sm:w-82.5">
								<svg
									width="586"
									height="586"
									viewBox="0 0 586 586"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									className="h-full w-full opacity-30"
								>
									<motion.circle
										cx="293"
										cy="293"
										r="290.5"
										className="stroke-foreground"
										strokeOpacity="0.5"
										strokeWidth="5"
										strokeDasharray="25 25"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{
											opacity: 1,
											scale: 1,
											rotate: 360,
										}}
										transition={{
											opacity: { duration: 0.6, delay: 0.1 },
											scale: { duration: 0.6, delay: 0.1 },
											rotate: {
												duration: 20,
												repeat: Infinity,
												ease: "linear",
											},
										}}
										style={{ originX: "50%", originY: "50%" }}
									/>
									<motion.circle
										cx="293"
										cy="293"
										r="236.5"
										className="stroke-foreground"
										strokeOpacity="0.8"
										strokeWidth="5"
										strokeDasharray="25 25"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{
											opacity: 1,
											scale: 1,
											rotate: -360,
										}}
										transition={{
											opacity: { duration: 0.6, delay: 0.2 },
											scale: { duration: 0.6, delay: 0.2 },
											rotate: {
												duration: 15,
												repeat: Infinity,
												ease: "linear",
											},
										}}
										style={{ originX: "50%", originY: "50%" }}
									/>
									<motion.circle
										cx="293"
										cy="293"
										r="182.5"
										className="stroke-foreground"
										strokeWidth="5"
										strokeDasharray="25 25"
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{
											opacity: 1,
											scale: 1,
											rotate: 360,
										}}
										transition={{
											opacity: { duration: 0.6, delay: 0.3 },
											scale: { duration: 0.6, delay: 0.3 },
											rotate: {
												duration: 25,
												repeat: Infinity,
												ease: "linear",
											},
										}}
										style={{ originX: "50%", originY: "50%" }}
									/>
								</svg>
								{/* Gradient overlay to fade bottom half */}
								<div className="via-background/50 to-background pointer-events-none absolute inset-0 bg-linear-to-b from-transparent from-30% via-60%" />
							</div>
						</div>

						{/* Left Card */}
						<motion.div
							className="relative top-4 -right-60 z-0 flex h-33 w-33 items-center justify-center overflow-hidden rounded-3xl sm:-right-70"
							style={{ backgroundColor: "#f0eeec" }}
							initial={{ opacity: 0, x: -20, scale: 0.9 }}
							animate={{ opacity: 1, x: 0, scale: 0.9 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<div
								className="absolute inset-0"
								style={{
									background:
										"radial-gradient(circle at 75% 85%, var(--color-purple-700) 0%, var(--color-rose-600) 35%, transparent 65%)",
									opacity: 0.2,
								}}
							/>
							<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-30">
								<filter id="cta-noise-0">
									<feTurbulence
										type="fractalNoise"
										baseFrequency="0.65"
										numOctaves="3"
										stitchTiles="stitch"
									/>
								</filter>
								<rect width="100%" height="100%" filter="url(#cta-noise-0)" />
							</svg>
							<Globe
								strokeWidth={1.25}
								className="relative z-20 h-14 w-14 opacity-25"
								style={{ color: "#1a1a1a" }}
							/>
						</motion.div>

						{/* Center Card */}
						<motion.div
							className="relative z-10 flex h-45 w-45 items-center justify-center overflow-hidden rounded-3xl"
							style={{ backgroundColor: "#f0eeec" }}
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
						>
							<div
								className="absolute inset-0"
								style={{
									background:
										"radial-gradient(circle at 30% 80%, var(--color-rose-900) 0%, var(--color-indigo-700) 35%, transparent 65%)",
									opacity: 0.2,
								}}
							/>
							<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-30">
								<filter id="cta-noise-1">
									<feTurbulence
										type="fractalNoise"
										baseFrequency="0.65"
										numOctaves="3"
										stitchTiles="stitch"
									/>
								</filter>
								<rect width="100%" height="100%" filter="url(#cta-noise-1)" />
							</svg>
							<Code2
								strokeWidth={1.25}
								className="relative z-20 h-18 w-18 opacity-25"
								style={{ color: "#1a1a1a" }}
							/>
						</motion.div>

						{/* Right Card */}
						<motion.div
							className="relative top-4 right-60 z-0 flex h-33 w-33 items-center justify-center overflow-hidden rounded-3xl sm:right-70"
							style={{ backgroundColor: "#f0eeec" }}
							initial={{ opacity: 0, x: 20, scale: 0.9 }}
							animate={{ opacity: 1, x: 0, scale: 0.9 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<div
								className="absolute inset-0"
								style={{
									background:
										"radial-gradient(circle at 25% 90%, var(--color-purple-600) 0%, var(--color-rose-500) 35%, transparent 65%)",
									opacity: 0.2,
								}}
							/>
							<svg className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-30">
								<filter id="cta-noise-2">
									<feTurbulence
										type="fractalNoise"
										baseFrequency="0.65"
										numOctaves="3"
										stitchTiles="stitch"
									/>
								</filter>
								<rect width="100%" height="100%" filter="url(#cta-noise-2)" />
							</svg>
							<Rocket
								strokeWidth={1.25}
								className="relative z-20 h-14 w-14 opacity-25"
								style={{ color: "#1a1a1a" }}
							/>
						</motion.div>
					</div>

					{/* Title */}
					<motion.h1
						className="text-foreground mb-6 text-3xl leading-[1.15] font-medium sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						Lleva tu negocio
						<br /> al mundo digital
					</motion.h1>

					{/* Description */}
					<motion.p
						className="text-muted-foreground mx-auto mb-8 max-w-lg text-base leading-relaxed sm:mb-10"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
					>
						Creamos sitios web que representan tu marca, atraen clientes y generan resultados. Desde
						el diseño hasta el lanzamiento, nos encargamos de todo.
					</motion.p>

					{/* CTA Button */}
					<motion.a
						href="/contacto"
						className="group inline-flex cursor-pointer items-center justify-center gap-3 rounded-md bg-purple-600 py-3 pr-3 pl-5 font-medium text-white shadow-lg shadow-purple-600/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-purple-600/40"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
					>
						<span>Agenda una reunión</span>
						<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition-all duration-300 group-hover:scale-110">
							<ChevronRight className="relative left-px h-4 w-4" />
						</span>
					</motion.a>
				</div>
			</div>
		</section>
	)
}
