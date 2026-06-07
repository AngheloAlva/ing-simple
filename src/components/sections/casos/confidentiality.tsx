"use client"

import { Eye, BarChart3, Code2 } from "lucide-react"
import { motion } from "motion/react"

const easeOut = [0.16, 1, 0.3, 1] as const

const items = [
	{
		icon: Eye,
		title: "Mostramos el cliente, no la pantalla",
		description:
			"Cuando la UI está bajo NDA, dejamos el logo del cliente visible y reemplazamos la captura por un mockup abstracto. La historia se cuenta sin comprometer al cliente.",
	},
	{
		icon: BarChart3,
		title: "Métricas reales y verificables",
		description:
			"Los números que mostramos vienen del proyecto en producción. Sin proyecciones, sin estimaciones de demo. Cifras reales del día a día operativo.",
	},
	{
		icon: Code2,
		title: "Stack y arquitectura abiertos",
		description:
			"Lo técnico se documenta sin restricciones: stack, decisiones de arquitectura y patrones aplicados. Es el conocimiento que aportamos, no el dato sensible del cliente.",
	},
]

export function CasosConfidentiality() {
	return (
		<section className="px-4 py-16 sm:px-6 sm:py-24">
			<div className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-100px" }}
					transition={{ duration: 0.6, ease: easeOut }}
					className="mb-12 flex flex-col items-start gap-3 md:mb-16"
				>
					<span className="text-accent text-xs font-medium tracking-[0.2em] uppercase">
						Cómo trabajamos
					</span>
					<h2 className="text-foreground max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
						Respetamos la confidencialidad sin perder transparencia
					</h2>
				</motion.div>

				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{items.map((item, i) => (
						<motion.li
							key={item.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true, margin: "-50px" }}
							transition={{ duration: 0.5, ease: easeOut, delay: i * 0.1 }}
							className="border-border bg-background rounded-2xl border p-6"
						>
							<item.icon strokeWidth={1} className="text-foreground mb-8 h-12 w-12" aria-hidden />
							<h3 className="text-foreground mb-2 text-lg font-semibold">{item.title}</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
						</motion.li>
					))}
				</ul>
			</div>
		</section>
	)
}
