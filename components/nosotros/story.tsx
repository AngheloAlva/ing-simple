"use client"

import Image from "next/image"
import { motion, type Variants } from "motion/react"
import { softEase, useReducedMotion } from "@/lib/motion"
import { CutButton } from "@/components/cut-button"
import { Kicker } from "@/components/corner-plus"
import GradientText from "@/components/gradient-text"
import { brandGradient } from "@/lib/gradient"
import { DUOTONE_CONTAINER } from "@/components/duotone"

interface Chapter {
	year: string
	title: string
	detail: string
	image: string
	imageAlt: string
}

// The 4 real milestones of IngSimple, migrated from the previous site.
const chapters: Chapter[] = [
	{
		year: "2023",
		title: "Power BI",
		detail:
			"Comenzamos transformando datos en decisiones. Nuestros primeros dashboards y reportes en Power BI ayudaron a empresas a visualizar su información de forma clara y accionable.",
		image: "/img/about/power-bi.png",
		imageAlt: "Dashboards y reportes en Power BI",
	},
	{
		year: "2024",
		title: "Power Platform",
		detail:
			"Escalamos hacia Power Apps, Power Automate y SharePoint. Empezamos a digitalizar formularios, automatizar flujos y reemplazar procesos manuales con soluciones rápidas y escalables.",
		image: "/img/about/power-platform.png",
		imageAlt: "Automatización de procesos con Power Platform",
	},
	{
		year: "2024",
		title: "Capacitaciones",
		detail:
			"Abrimos nuestra línea de formación. Cursos prácticos de Power BI, Power Apps y Excel avanzado adaptados al nivel de cada equipo, con ejercicios reales y acompañamiento continuo.",
		image: "/img/about/training.png",
		imageAlt: "Capacitación de equipos",
	},
	{
		year: "2025",
		title: "Desarrollo Web",
		detail:
			"Incorporamos el desarrollo de sitios web modernos y funcionales. Landing pages, sitios corporativos y portales enfocados en experiencia de usuario y resultados concretos.",
		image: "/img/about/web.png",
		imageAlt: "Desarrollo web moderno",
	},
]

const meta = [
	{ value: "18", label: "Proyectos entregados" },
	{ value: "4", label: "Líneas de negocio" },
]

export function NosotrosStory() {
	const reduce = useReducedMotion()

	const container: Variants = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.1 } },
	}

	const timeline: Variants = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.14 } },
	}

	const item: Variants = {
		hidden: { opacity: 0, y: reduce ? 0 : 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.65, ease: softEase },
		},
	}

	const railVariant: Variants = {
		hidden: { scaleY: reduce ? 1 : 0 },
		visible: {
			scaleY: 1,
			transition: { duration: 1.1, ease: softEase },
		},
	}

	return (
		<section className="mx-auto w-full max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
			<div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
				{/* Left column — hero intro, sticky */}
				<div className="lg:sticky lg:top-24">
					<motion.div
						variants={container}
						initial="hidden"
						whileInView="visible"
						viewport={{ once: true, margin: "-80px" }}
					>
						<motion.div variants={item}>
							<Kicker>Sobre Nosotros</Kicker>
						</motion.div>
						<motion.h1
							variants={item}
							className="mt-5 font-serif text-4xl leading-[1.08] font-normal tracking-[-0.01em] text-balance sm:text-5xl lg:text-[3.5rem]"
						>
							Cada servicio nació de{" "}
							<GradientText
								inline
								className="font-sans font-semibold tracking-tight"
								colors={brandGradient}
								animationSpeed={6}
							>
								un problema real
							</GradientText>
						</motion.h1>
						<motion.p
							variants={item}
							className="text-muted-foreground mt-6 max-w-xl text-base leading-relaxed text-pretty sm:text-lg"
						>
							Empezamos con reportes porque un cliente no lograba ver sus números. Cada línea que
							vino después nació igual: de algo que a alguien no le estaba funcionando, no de un
							plan de negocios.
						</motion.p>
						<motion.div variants={item} className="mt-8">
							<CutButton variant="solid" icon="arrow" href="/contacto">
								Conversemos
							</CutButton>
						</motion.div>
						<motion.dl
							variants={item}
							className="border-border mt-10 flex gap-10 border-t border-dotted pt-6"
						>
							{meta.map((entry) => (
								<div key={entry.label}>
									<dt className="sr-only">{entry.label}</dt>
									<dd className="font-serif text-3xl font-normal tracking-tight tabular-nums sm:text-4xl">
										{entry.value}
									</dd>
									<p className="text-muted-foreground mt-1 text-sm">{entry.label}</p>
								</div>
							))}
						</motion.dl>
					</motion.div>
				</div>

				{/* Right column — history timeline */}
				<motion.div
					variants={timeline}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-80px" }}
				>
					<motion.h2
						variants={item}
						className="border-border mb-8 border-b border-dotted pb-3 font-serif text-2xl font-normal tracking-tight sm:text-[1.75rem]"
					>
						Nuestra historia
					</motion.h2>

					<div className="relative">
						<motion.div
							variants={railVariant}
							className="bg-border absolute top-1.5 bottom-1.5 left-[5px] w-px origin-top"
						/>
						<div className="space-y-14 sm:space-y-16">
							{chapters.map((chapter, i) => (
								<motion.article
									key={`${chapter.year}-${chapter.title}`}
									variants={item}
									className="relative pl-10 sm:pl-14"
								>
									<span className="bg-foreground ring-background absolute top-0.5 left-0 h-[11px] w-[11px] ring-4" />
									<p className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.1em] uppercase">
										{chapter.year}
									</p>
									<h3 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
										{chapter.title}
									</h3>
									<p className="text-muted-foreground mt-3 max-w-xl text-base leading-relaxed text-pretty">
										{chapter.detail}
									</p>
									<div
										className={`border-border relative mt-6 aspect-[16/9] w-full overflow-hidden border ${DUOTONE_CONTAINER}`}
									>
										{/*
										 * Tuned here instead of reusing DUOTONE_BASE: that one is
										 * calibrated for dark product screenshots, and these are 3D
										 * renders on a near-white ground. Grayscale leaves them almost
										 * entirely white and mix-blend-color keeps the backdrop's
										 * luminosity, so the shared values flattened every image into a
										 * solid blue rectangle. Compressing the tonal range first is
										 * what brings the illustration back.
										 */}
										<Image
											src={chapter.image}
											alt={chapter.imageAlt}
											fill
											sizes="(max-width: 1024px) 100vw, 55vw"
											className="object-cover [filter:grayscale(1)_contrast(1.2)_brightness(0.95)] dark:[filter:grayscale(1)_contrast(1.35)_brightness(0.4)]"
											priority={i === 0}
										/>
										<div className="absolute inset-0 bg-[#3b76ff] opacity-90 mix-blend-color dark:bg-[#1466ff]" />
										<div className="absolute inset-0 bg-[#9bc0ff] opacity-30 mix-blend-multiply dark:bg-[#0a235c] dark:opacity-45" />
										<div className="absolute inset-0 bg-white opacity-15 mix-blend-screen dark:opacity-0" />
									</div>
								</motion.article>
							))}
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
