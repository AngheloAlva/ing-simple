"use client"

import { motion } from "motion/react"

import Logo from "@/components/shared/logo"
import MagicTransform, {
	type MagicTransformResult,
} from "@/components/sections/case-study/magic-transformation"

import type { CaseStudy } from "@/lib/portfolio-data"

interface CaseStudyContextProps {
	caseStudy: CaseStudy
}

const MODULES: MagicTransformResult[] = [
	{ id: "ots", label: "OTs", color: "#0f766e", textColor: "#ffffff" },
	{ id: "carpetas", label: "Carpetas", color: "#1e3a8a", textColor: "#ffffff" },
	{ id: "permisos", label: "Permisos", color: "#14b8a6", textColor: "#0a0a0a" },
	{ id: "indicadores", label: "Indicadores", color: "#1e40af", textColor: "#ffffff" },
]

const BRAND_AXIS = "#0f766e"

export function CaseStudyContext({ caseStudy }: CaseStudyContextProps) {
	return (
		<section className="bg-background w-full px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
			<div className="mx-auto w-full max-w-6xl">
				<div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
					<div className="lg:col-span-4">
						<motion.span
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.4 }}
							className="text-muted-foreground text-xs font-medium tracking-[0.18em] uppercase"
						>
							01 — Punto de partida
						</motion.span>
						<motion.h2
							initial={{ opacity: 0, y: 18 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, amount: 0.5 }}
							transition={{ duration: 0.5, delay: 0.05 }}
							className="text-foreground mt-3 text-3xl font-medium tracking-tight sm:text-4xl"
						>
							El problema antes de OTC 360
						</motion.h2>
					</div>

					<div className="lg:col-span-8">
						<div className="flex flex-col gap-6">
							{caseStudy.problem.map((paragraph, i) => (
								<motion.p
									key={i}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, amount: 0.3 }}
									transition={{ duration: 0.5, delay: i * 0.08 }}
									className="text-muted-foreground text-base leading-relaxed sm:text-lg"
								>
									{paragraph}
								</motion.p>
							))}
						</div>
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.15 }}
					transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
					className="border-border bg-muted/40 mt-14 overflow-hidden rounded-2xl border"
				>
					<div className="border-border bg-background/60 flex items-center justify-between border-b px-5 py-3">
						<span className="text-muted-foreground text-[10px] font-medium tracking-[0.18em] uppercase">
							Papel, correos y planillas → OTC 360
						</span>
						<span className="text-muted-foreground text-[10px] font-medium tracking-[0.18em] uppercase">
							una sola plataforma
						</span>
					</div>

					<div className="px-2 py-4 sm:px-4 sm:py-6">
						<MagicTransform
							height={520}
							axisColor={BRAND_AXIS}
							centerSize={92}
							documentDuration={5}
							documentWidth={200}
							documentHeight={280}
							particleCount={22}
							results={MODULES}
							centerContent={
								<Logo
									className="h-10 w-auto"
									classNameIcon="text-accent"
									classNameText="text-foreground"
								/>
							}
						/>
					</div>

					<div className="border-border border-t px-5 py-3">
						<p className="text-muted-foreground text-center text-xs sm:text-sm">
							Papel, correos y Excel entran por la izquierda. Ingeniería Simple los procesa y los
							convierte en los seis módulos operativos de OTC 360.
						</p>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
