"use client"

import { motion, type Variants } from "motion/react"
import { softEase, useReducedMotion } from "@/lib/motion"
import { CornerPlus, Kicker } from "@/components/corner-plus"

interface Value {
	title: string
	desc: string
}

const values: Value[] = [
	{
		title: "Simplicidad",
		desc: "Creemos que la mejor solución es la más simple. Eliminamos la complejidad innecesaria para que la tecnología trabaje para ti, no al revés.",
	},
	{
		title: "Transparencia",
		desc: "Sin letra pequeña, sin sorpresas. Comunicamos con claridad cada paso del proceso, los plazos y los costos desde el día uno.",
	},
	{
		title: "Impacto Real",
		desc: "No hacemos tecnología por hacer tecnología. Cada proyecto tiene un objetivo claro y un resultado medible para tu organización.",
	},
	{
		title: "Aprendizaje Continuo",
		desc: "Capacitamos a tu equipo para que sea autónomo. No creamos dependencia: transferimos conocimiento y construimos capacidades internas.",
	},
]

export function NosotrosValues() {
	const reduce = useReducedMotion()

	const container: Variants = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.1 } },
	}

	const item: Variants = {
		hidden: { opacity: 0, y: reduce ? 0 : 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: softEase },
		},
	}

	return (
		<section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
			<div className="max-w-2xl">
				<Kicker>Nuestros Valores</Kicker>
				<h2 className="mt-5 font-serif text-3xl leading-[1.12] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
					Lo que nos <span className="font-sans font-semibold tracking-tight">define</span>
				</h2>
			</div>

			<motion.div
				variants={container}
				initial="hidden"
				whileInView="visible"
				viewport={{ once: true, margin: "-80px" }}
				className="border-border relative mt-8 border lg:mt-10"
			>
				<CornerPlus className="top-0 left-0 -translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="top-0 right-0 translate-x-1/2 -translate-y-1/2" />
				<CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
				<CornerPlus className="right-0 bottom-0 translate-x-1/2 translate-y-1/2" />

				<div className="bg-border grid gap-px sm:grid-cols-2 lg:grid-cols-4">
					{values.map(({ title, desc }, i) => (
						<motion.div key={title} variants={item} className="bg-background p-6 sm:p-8">
							<p className="text-primary font-mono text-xs font-medium tabular-nums">
								{String(i + 1).padStart(2, "0")}
							</p>
							<h3 className="mt-4 text-lg font-semibold tracking-tight">{title}</h3>
							<p className="text-muted-foreground mt-2 text-sm leading-relaxed">{desc}</p>
						</motion.div>
					))}
				</div>
			</motion.div>
		</section>
	)
}
