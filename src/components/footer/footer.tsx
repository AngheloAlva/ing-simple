"use client"

import { ChevronRightIcon } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

import type { ReactNode } from "react"

const easeOut = [0.16, 1, 0.3, 1] as const

const fadeInUp = {
	initial: { opacity: 0, y: 30 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, amount: 0.5 },
	transition: { duration: 0.8, ease: easeOut },
}

const servicioLinks = [
	{ label: "Reportabilidad & Analítica", href: "/servicios/reportabilidad" },
	{ label: "Capacitaciones", href: "/servicios/capacitaciones" },
	{ label: "Soluciones Web", href: "/servicios/soluciones-web" },
	{ label: "Power Platform", href: "/servicios/power-platform" },
]

const empresaLinks = [
	{ label: "Sobre Nosotros", href: "/sobre-nosotros" },
	{ label: "Portafolio", href: "/portafolio" },
	{ label: "Casos", href: "/casos" },
	{ label: "Contacto", href: "/contacto" },
]

const socialLinks = [
	{
		label: "LinkedIn",
		icon: LinkedInIcon,
		href: "https://www.linkedin.com/company/ingenieria-simple/",
	},
]

function LinkedInIcon({ className }: { className?: string }): ReactNode {
	return (
		<svg className={className} viewBox="0 0 24 24" fill="currentColor">
			<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
		</svg>
	)
}

export function Footer(): ReactNode {
	return (
		<footer className="bg-accent rounded-tl-4xl rounded-tr-4xl px-6 py-16 text-black md:px-12 lg:px-20">
			<div className="mx-auto max-w-6xl">
				{/* Top: Description + Links */}
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
					<motion.div className="max-w-md" {...fadeInUp}>
						<p className="text-lg leading-relaxed text-black/80">
							Acompañamos a organizaciones en su transformación digital con soluciones simples y
							efectivas. Tecnología, análisis, desarrollo y capacitación al servicio de tu negocio.
						</p>
						<Link
							href="/contacto"
							className="group mt-8 inline-flex items-center gap-3 rounded-md bg-white py-3 pr-3 pl-4 font-medium shadow-lg shadow-black/10 transition-all duration-500 ease-out hover:rounded-[50px] hover:bg-white/90 hover:shadow-xl hover:shadow-black/20"
						>
							<span>Conversemos</span>
							<span className="bg-accent flex h-10 w-10 items-center justify-center rounded-full text-black transition-all duration-300 group-hover:scale-110">
								<ChevronRightIcon className="relative left-px h-4 w-4" />
							</span>
						</Link>
					</motion.div>

					<div className="grid grid-cols-2 gap-8 lg:justify-items-end">
						<motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.1 }}>
							<h4 className="mb-4 text-sm font-semibold tracking-wider text-black/50 uppercase">
								Servicios
							</h4>
							<ul className="space-y-3">
								{servicioLinks.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="inline-block text-black/80 transition-all duration-300 hover:translate-x-1 hover:text-black"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>
						<motion.div {...fadeInUp} transition={{ ...fadeInUp.transition, delay: 0.2 }}>
							<h4 className="mb-4 text-sm font-semibold tracking-wider text-black/50 uppercase">
								Empresa
							</h4>
							<ul className="space-y-3">
								{empresaLinks.map((link) => (
									<li key={link.label}>
										<Link
											href={link.href}
											className="inline-block text-black/80 transition-all duration-300 hover:translate-x-1 hover:text-black"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</motion.div>
					</div>
				</div>

				<div className="my-16 h-px bg-black/10" />

				{/* Bottom: Brand + Contact + Social */}
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
					<motion.div {...fadeInUp}>
						<h2 className="text-6xl leading-none font-medium tracking-tight md:text-7xl lg:text-8xl">
							Ing
							<br />
							Simple
						</h2>
						<p className="mt-8 text-sm text-black/50">
							© {new Date().getFullYear()} Ingeniería Simple SpA. Todos los derechos reservados.
						</p>
						<Link
							href="/privacidad"
							className="mt-2 inline-block text-sm text-black/60 underline underline-offset-4 hover:text-black"
						>
							Política de privacidad
						</Link>
					</motion.div>

					<div className="flex flex-col justify-between gap-8 lg:items-end lg:text-right">
						<motion.div
							className="space-y-6"
							{...fadeInUp}
							transition={{ ...fadeInUp.transition, delay: 0.1 }}
						>
							<div>
								<h4 className="mb-1 font-semibold">Santiago, Chile</h4>
								<p className="text-black/70">Lun-Vie 9:00 - 18:00 (CLT)</p>
							</div>
							<a
								href="mailto:contacto@ingsimple.cl"
								className="inline-block text-lg font-medium underline underline-offset-4 transition-opacity hover:opacity-70"
							>
								contacto@ingsimple.cl
							</a>
						</motion.div>

						<motion.div
							className="flex items-center gap-4 lg:justify-end"
							{...fadeInUp}
							transition={{ ...fadeInUp.transition, delay: 0.2 }}
						>
							{socialLinks.map(({ label, icon: Icon, href }) => (
								<a
									key={label}
									href={href}
									target="_blank"
									rel="noopener noreferrer"
									className="hover:text-accent flex h-10 w-10 items-center justify-center rounded-full bg-black/10 text-black transition-all duration-300 hover:scale-110 hover:bg-black"
									aria-label={label}
								>
									<Icon className="h-4 w-4" />
								</a>
							))}
						</motion.div>
					</div>
				</div>
			</div>
		</footer>
	)
}
