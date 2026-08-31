"use client"

import { motion, type Variants } from "motion/react"
import { softEase, useReducedMotion } from "@/lib/motion"
import { CornerPlus, Kicker } from "@/components/corner-plus"

interface Pillar {
	label: string
	title: string
	body: string
}

const pillars: Pillar[] = [
	{
		label: "Misión",
		title: "Simplificar la tecnología",
		body: "Entregar soluciones tecnológicas simples y efectivas que permitan a las organizaciones optimizar sus procesos, tomar mejores decisiones y enfocarse en lo que realmente importa: su negocio.",
	},
	{
		label: "Visión",
		title: "Potencia sin complejidad",
		body: "Ser el referente en transformación digital para organizaciones que buscan simplicidad sin sacrificar potencia. Que cada empresa pueda acceder a tecnología de primer nivel, sin complejidad innecesaria.",
	},
]

export function NosotrosMissionVision() {
	const reduce = useReducedMotion()

	const container: Variants = {
		hidden: {},
		visible: { transition: { staggerChildren: 0.12 } },
	}

	const item: Variants = {
		hidden: { opacity: 0, y: reduce ? 0 : 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6, ease: softEase },
		},
	}

	return (
		<section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
			<div className="max-w-2xl">
				<Kicker>Misión y visión</Kicker>
				<h2 className="mt-5 font-serif text-3xl leading-[1.12] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
					Para qué <span className="font-sans font-semibold tracking-tight">existimos</span>
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

				<div className="divide-border grid divide-y md:grid-cols-2 md:divide-x md:divide-y-0">
					{pillars.map(({ label, title, body }, i) => (
						<motion.article key={label} variants={item} className="p-8 sm:p-10">
							<div className="flex items-baseline gap-3">
								<p className="text-primary font-mono text-xs font-medium tabular-nums">
									{String(i + 1).padStart(2, "0")}
								</p>
								<p className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.1em] uppercase">
									{label}
								</p>
							</div>
							<h3 className="mt-3 font-serif text-2xl font-normal tracking-tight sm:text-3xl">
								{title}
							</h3>
							<p className="text-muted-foreground mt-4 max-w-md text-base leading-relaxed text-pretty">
								{body}
							</p>
						</motion.article>
					))}
				</div>
			</motion.div>
		</section>
	)
}
