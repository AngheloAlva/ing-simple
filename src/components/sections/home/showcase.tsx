"use client"

import { ChevronRight as ChevronRightIcon } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"

import { portfolioProjects } from "@/lib/portfolio-data"

import type { ProjectCategory } from "@/lib/portfolio-data"

const easeOut = [0.16, 1, 0.3, 1] as const

const tabs: { key: ProjectCategory; label: string }[] = [
	{ key: "desarrollo-web", label: "Desarrollo Web" },
	{ key: "power-platform", label: "Power Platform" },
	{ key: "reportabilidad", label: "Reportabilidad" },
]

const FALLBACK_IMAGES = [
	"https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=600&q=80",
	"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
	"https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=600&q=80",
	"https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600&q=80",
	"https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&q=80",
	"https://images.unsplash.com/photo-1604079628040-94301bb21b91?w=600&q=80",
	"https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80",
	"https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=600&q=80",
]

const slidesByTab: Record<ProjectCategory, string[]> = tabs.reduce(
	(acc, tab) => {
		const projectImages = portfolioProjects
			.filter((p) => p.category === tab.key)
			.map((p, i) =>
				p.imageUrl?.includes("placeholder")
					? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]!
					: p.imageUrl
			)
		const filled =
			projectImages.length >= 6 ? projectImages : [...projectImages, ...FALLBACK_IMAGES].slice(0, 8)
		acc[tab.key] = filled
		return acc
	},
	{} as Record<ProjectCategory, string[]>
)

export function Showcase() {
	const [active, setActive] = useState<ProjectCategory>("desarrollo-web")
	const slides = slidesByTab[active]
	const loop = [...slides, ...slides]

	return (
		<section className="bg-background relative flex w-full flex-col items-center overflow-hidden py-16 sm:py-20">
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.25] dark:opacity-[0.08]"
				style={{
					backgroundImage:
						"linear-gradient(to right, rgb(0 0 0 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(0 0 0 / 0.06) 1px, transparent 1px)",
					backgroundSize: "42px 42px",
				}}
			/>

			<div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center sm:px-6 lg:px-8">
				<motion.h2
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.1 }}
					className="text-foreground mt-4 text-3xl leading-[1.05] font-medium tracking-tight sm:text-5xl md:text-6xl"
				>
					Proyectos que transforman
					<br />
					negocios y equipos.
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 12 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="text-muted-foreground mt-5 max-w-xl text-base sm:text-lg"
				>
					Una muestra continua de soluciones, plataformas y reportes desplegados día a día por
					equipos que confían en nuestro trabajo.
				</motion.p>

				<div className="border-border bg-background relative mt-8 flex items-center rounded-xl border p-1">
					{tabs.map((t) => (
						<button
							key={t.key}
							onClick={() => setActive(t.key)}
							className={`relative z-10 cursor-pointer rounded-xl px-5 py-2 text-sm font-medium transition-colors sm:px-6 ${
								active === t.key ? "text-foreground" : "text-muted-foreground hover:text-foreground"
							}`}
						>
							{active === t.key && (
								<motion.span
									layoutId="showcase-pill"
									transition={{ type: "spring", stiffness: 400, damping: 32 }}
									className="bg-muted absolute inset-0 -z-10 rounded-xl"
								/>
							)}
							{t.label}
						</button>
					))}
				</div>
			</div>

			<div className="relative mt-14 w-full overflow-hidden py-6 sm:mt-16">
				<motion.div
					animate={{ x: ["0%", "-50%"] }}
					transition={{ duration: 60, repeat: Infinity, ease: "linear", repeatType: "loop" }}
					className="flex w-max items-center will-change-transform"
				>
					{loop.map((src, i) => (
						<div key={i} className="flex shrink-0 items-center">
							<div className="border-border bg-background relative z-10 aspect-square w-65 rounded-2xl border p-2 shadow-[0_10px_40px_-12px_rgba(0,0,0,0.2)] sm:w-[320px] sm:rounded-3xl">
								<div className="bg-muted relative h-full w-full overflow-hidden rounded-xl sm:rounded-2xl">
									<AnimatePresence mode="wait">
										<motion.img
											key={`${active}-${i}`}
											src={src}
											alt=""
											loading="lazy"
											initial={{ scale: 0, opacity: 0, borderRadius: "100%" }}
											animate={{ scale: 1, opacity: 1, borderRadius: "0%" }}
											exit={{ scale: 0, opacity: 0, borderRadius: "100%" }}
											transition={{
												duration: 0.55,
												ease: [0.22, 1, 0.36, 1],
												delay: (i % slides.length) * 0.04,
											}}
											className="absolute inset-0 h-full w-full object-cover"
										/>
									</AnimatePresence>
								</div>
							</div>
							<div className="relative z-0 flex w-16 shrink-0 items-center sm:w-24">
								<span className="bg-accent absolute left-0 h-3 w-3 -translate-x-1/2 rounded-full" />
								<span className="border-border flex-1 border-t-2 border-dashed" />
								<span className="bg-accent absolute right-0 h-3 w-3 translate-x-1/2 rounded-full" />
							</div>
						</div>
					))}
				</motion.div>
			</div>

			<motion.a
				href="/portafolio"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.3, ease: easeOut }}
				className="bg-ring group shadow-ring/25 hover:shadow-ring/40 mt-8 inline-flex items-center justify-center gap-3 rounded-md py-3 pr-3 pl-5 font-medium text-white shadow-lg transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-lg"
			>
				<span>Ver Portafolio Completo</span>
				<span className="text-ring flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all duration-300 group-hover:scale-110">
					<ChevronRightIcon className="relative left-px h-4 w-4" />
				</span>
			</motion.a>
		</section>
	)
}
