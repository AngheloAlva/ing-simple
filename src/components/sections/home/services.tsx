"use client"

import { ChevronRightIcon } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"
import type { ReactNode } from "react"

const easeOut = [0.16, 1, 0.3, 1] as const

interface Service {
	number: string
	title: string
	description: string
	image: string
}

const services: Service[] = [
	{
		number: "01",
		title: "Reportabilidad, Dashboards y Analítica",
		description:
			"Transformamos datos dispersos en información útil. Dashboards dinámicos, reportes automatizados y métricas claras para tomar decisiones informadas.",
		image: "/img/article-summary.webp",
	},
	{
		number: "02",
		title: "Cursos y Capacitaciones",
		description:
			"Formamos a equipos en Power BI, Power Apps, Excel avanzado y más. Capacitaciones prácticas adaptadas al nivel de cada organización.",
		image: "/img/research-papers.webp",
	},
	{
		number: "03",
		title: "Soluciones Web",
		description:
			"Desarrollamos sitios web modernos, rápidos y funcionales. Landing pages, sitios corporativos y portales enfocados en experiencia de usuario.",
		image: "/img/book-summary.webp",
	},
	{
		number: "04",
		title: "Soluciones Power Platform",
		description:
			"Creamos aplicaciones internas, automatizaciones y flujos inteligentes con Power Apps, Power Automate y SharePoint para reemplazar procesos manuales.",
		image: "/img/api-access.webp",
	},
]

function ServiceCard({ service, index }: { service: Service; index: number }): ReactNode {
	return (
		<motion.div
			className="bg-muted hover:bg-muted/80 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl p-2 transition-colors duration-300 md:grid-cols-2"
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			whileHover={{ scale: 1.01 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{
				duration: 0.6,
				delay: index * 0.1,
				ease: easeOut,
			}}
		>
			<div className="px-4 py-28">
				<span className="text-muted-foreground bg-foreground/5 group-hover:bg-foreground/10 mb-4 block w-fit rounded-md px-2 py-1 text-sm font-medium transition-colors duration-300">
					{service.number}
				</span>
				<h3 className="mb-4 text-2xl font-medium tracking-tight md:text-3xl">{service.title}</h3>
				<p className="text-muted-foreground max-w-md text-sm leading-relaxed">
					{service.description}
				</p>
			</div>

			<div className="relative aspect-4/3 w-full self-stretch overflow-hidden rounded-xl md:aspect-auto">
				<Image
					src={service.image}
					alt={service.title}
					fill
					sizes="(max-width: 768px) 100vw, 50vw"
					className="relative! h-full! w-full! object-cover grayscale md:absolute!"
				/>
			</div>
		</motion.div>
	)
}

export function Services(): ReactNode {
	return (
		<section className="bg-background px-6 py-16 md:py-32">
			<div className="mx-auto flex max-w-6xl flex-col gap-12 lg:flex-row lg:items-start lg:gap-16">
				{/* Sticky left column */}
				<motion.div
					className="lg:sticky lg:top-60 lg:w-96 lg:shrink-0"
					initial={{ opacity: 0, x: -30 }}
					whileInView={{ opacity: 1, x: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, ease: easeOut }}
				>
					<h2 className="mb-4 text-2xl font-medium tracking-tight md:mb-6 md:text-3xl lg:text-4xl">
						Nuestras Líneas de Servicio
					</h2>
					<p className="text-muted-foreground mb-6 max-w-sm text-base md:mb-8 md:text-lg">
						Cuatro áreas especializadas para acompañar tu transformación digital de forma integral.
					</p>
					<a
						href="#"
						className="bg-foreground group text-background inline-flex w-full items-center justify-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium transition-all duration-500 ease-out hover:rounded-[50px] sm:w-auto"
					>
						<span>Conoce Nuestros Servicios</span>
						<span className="bg-background text-foreground flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110">
							<ChevronRightIcon className="relative left-px h-4 w-4" />
						</span>
					</a>
				</motion.div>

				{/* Scrolling right column */}
				<div className="flex min-w-0 flex-1 flex-col gap-6 md:gap-32">
					{services.map((service, index) => (
						<ServiceCard key={service.number} service={service} index={index} />
					))}
				</div>
			</div>
		</section>
	)
}
