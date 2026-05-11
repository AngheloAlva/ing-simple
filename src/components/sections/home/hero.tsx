"use client"

import { motion, useAnimationFrame, useMotionValue, useTransform, type MotionValue } from "motion/react"
import { ChevronRight as ChevronRightIcon } from "lucide-react"
import { useRef, useState, type ReactNode } from "react"
import Link from "next/link"

import { CloudNetwork } from "./cloud-network"

const easeOut = [0.16, 1, 0.3, 1] as const
const headlineText = "Soluciones Simples para un Mundo Digital Complejo"

const charsCount = headlineText.length
const headlineDuration = charsCount * 0.03 + 0.4

const T = {
	descDelay: headlineDuration + 0.05,
	ctaDelay: headlineDuration + 0.25,
	logosDelay: headlineDuration + 0.5,
} as const

const trustedLogos = [
	{
		name: "OTC",
		url: "https://www.linkedin.com/company/oleoducto-trasandino-chile-s-a-?originalSubdomain=cl",
		img: "/img/logos/otc.svg",
	},
	{
		name: "TurismoChileTours",
		url: "https://turismochiletours.com/es",
		img: "/img/logos/turismochiletours.svg",
	},
	{ name: "Busanc", url: "https://busanc.cl/", img: "/img/logos/busanc.avif" },
	{ name: "BiMakers", url: "https://www.bimakers.net/", img: "/img/logos/bimakers.avif" },
	{
		name: "BZ Consulting",
		url: "https://bzconsulting.cl/",
		img: "/img/logos/bzconsulting.png",
	},
]

const MARQUEE_LOGOS = [...trustedLogos, ...trustedLogos]

function LogoTrack({ ariaHidden, x }: { ariaHidden?: boolean; x: MotionValue<string> }): ReactNode {
	return (
		<motion.div
			className="flex min-w-full shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
			style={{ x }}
			aria-hidden={ariaHidden}
		>
			{MARQUEE_LOGOS.map((logo, idx) => (
				<a
					key={idx}
					href={logo.url}
					target="_blank"
					rel="noopener noreferrer"
					className="flex shrink-0 items-center justify-center opacity-40 transition-opacity duration-300 hover:opacity-100"
				>
					<img
						src={logo.img}
						alt={logo.name}
						className="h-6 w-auto object-contain brightness-0 md:h-7 dark:invert"
					/>
				</a>
			))}
		</motion.div>
	)
}

function LogoMarquee(): ReactNode {
	const [isHovered, setIsHovered] = useState(false)
	const xPercent = useMotionValue(0)
	const x = useTransform(xPercent, (v) => `${v}%`)
	const containerRef = useRef<HTMLDivElement>(null)

	useAnimationFrame((_, delta) => {
		if (isHovered) return
		const moveBy = (7 * delta) / 1500
		const newX = xPercent.get() - moveBy
		xPercent.set(newX <= -50 ? 0 : newX)
	})

	return (
		<div
			className="group relative flex w-full overflow-hidden"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			ref={containerRef}
		>
			<LogoTrack x={x} />
			<LogoTrack x={x} ariaHidden />
		</div>
	)
}

export function Hero(): ReactNode {
	return (
		<section className="relative overflow-hidden px-4 pt-28 pb-12 sm:px-6 sm:pt-40 lg:pt-48">
			<div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-4">
				<div className="relative z-10 flex w-full min-w-0 flex-col">
					<h1 className="w-full max-w-xl text-3xl font-medium tracking-tighter sm:text-4xl md:text-5xl lg:text-5xl xl:text-7xl">
						{headlineText.split(" ").map((word, wordIndex, words) => {
							const charsBefore = words
								.slice(0, wordIndex)
								.reduce((acc, w) => acc + w.length + 1, 0)
							return (
								<span key={wordIndex} className="inline-block whitespace-nowrap">
									{word.split("").map((char, charIndex) => (
										<motion.span
											key={charIndex}
											initial={{ opacity: 0, filter: "blur(10px)" }}
											animate={{ opacity: 1, filter: "blur(0px)" }}
											transition={{
												duration: 0.4,
												delay: (charsBefore + charIndex) * 0.03,
												ease: "easeOut",
											}}
											className="inline-block"
										>
											{char}
										</motion.span>
									))}
									{wordIndex < words.length - 1 && " "}
								</span>
							)
						})}
					</h1>

					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: T.descDelay, ease: easeOut }}
						className="text-muted-foreground mt-6 max-w-xl text-lg leading-relaxed tracking-tight md:text-xl md:leading-loose"
					>
						Acompañamos a tu organización con{" "}
						<span className="bg-ring/80 inline-block rounded-md px-2 py-0.5 text-white">
							tecnología
						</span>{" "}
						,{" "}
						<span className="bg-accent/80 inline-block rounded-full px-3 py-0.5 text-white">
							análisis
						</span>{" "}
						y{" "}
						<span className="bg-ring/80 inline-block rounded-md px-2 py-0.5 text-white">
							capacitación
						</span>{" "}
						para optimizar procesos y tomar mejores decisiones
					</motion.p>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: T.ctaDelay, ease: easeOut }}
						className="mt-14 flex flex-col gap-3 sm:flex-row sm:items-center"
					>
						<a
							href="#servicios"
							className="bg-accent group shadow-accent/25 hover:shadow-accent/40 inline-flex h-14 items-center justify-center gap-3 rounded-md pr-1.5 pl-5 font-medium text-white shadow-lg transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl"
						>
							<span>Explorar servicios</span>
							<span className="text-accent flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4" />
							</span>
						</a>
						<Link
							href="/contacto"
							className="bg-ring group shadow-ring/25 hover:shadow-ring/40 inline-flex h-14 items-center justify-center gap-3 rounded-md pr-1.5 pl-5 font-medium text-white shadow-lg transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl"
						>
							<span>Contactanos</span>
							<span className="text-ring flex h-9 w-9 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4" />
							</span>
						</Link>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: T.logosDelay, ease: easeOut }}
						className="mt-14"
					>
						<p className="text-muted-foreground mb-5 text-xs font-medium tracking-widest uppercase">
							Confían en nosotros
						</p>
						<LogoMarquee />
					</motion.div>
				</div>

				<div className="relative flex items-center justify-center">
					<CloudNetwork />
				</div>
			</div>
		</section>
	)
}
