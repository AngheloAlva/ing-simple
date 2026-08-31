"use client"

import { TechGlyph } from "@/components/case-study/tech-icon"
import { Kicker } from "@/components/corner-plus"
import Link from "next/link"
import { StaggerInView, useStaggerEntrance } from "@/lib/motion"
import { motion } from "motion/react"
import type { ReactNode } from "react"

/* --------------------------------------------------------------------------
 * Con qué construimos — the stack, grouped by service line rather than poured
 * into one flat wall of logos. The tool's name and what we use it for carry
 * the meaning; the brand mark is a grayscale watermark behind them, the same
 * treatment `case-study/detail-tech-stack.tsx` already uses. That keeps a
 * vendor's product logo from standing in for our own service, and keeps ten
 * full-colour marks from fighting the palette.
 * ------------------------------------------------------------------------ */

type Tool = {
	name: string
	/** What it actually does for the client, not what the vendor calls it. */
	use: string
	/** Whether a brand mark is registered for it; without one, only text shows. */
	glyph?: boolean
}

type Line = {
	service: string
	href: string
	tools: Tool[]
}

const LINES: Line[] = [
	{
		service: "Reportabilidad",
		href: "/servicios/reportabilidad",
		tools: [
			{ name: "Power BI", use: "Los tableros que la gerencia abre cada mañana", glyph: true },
			{ name: "Power Query", use: "La limpieza del dato antes de que llegue al gráfico" },
			{ name: "Excel", use: "Donde todavía vive el dato de la mayoría", glyph: true },
		],
	},
	{
		service: "Automatizaciones",
		href: "/servicios/automatizaciones",
		tools: [
			{
				name: "Power Automate",
				use: "Los flujos que corren sin que nadie los empuje",
				glyph: true,
			},
			{ name: "Power Apps", use: "Formularios que reemplazan la planilla compartida", glyph: true },
			{ name: "SharePoint", use: "El repositorio detrás de casi toda Power Platform", glyph: true },
		],
	},
	{
		service: "Desarrollo Web",
		href: "/servicios/desarrollo-web",
		tools: [
			{ name: "Next.js", use: "El framework de todo lo que ponemos en producción", glyph: true },
			{ name: "TypeScript", use: "Tipos de punta a punta, del formulario a la base", glyph: true },
			{ name: "PostgreSQL", use: "La base de datos donde vive la operación", glyph: true },
			{
				name: "Recharts",
				use: "Los gráficos viven dentro del sistema, no en un informe aparte",
				glyph: true,
			},
			{
				name: "Tailwind CSS",
				use: "Interfaces consistentes sin estilos que se pudren",
				glyph: true,
			},
			{ name: "Vercel", use: "Despliegue, previews y monitoreo en producción", glyph: true },
		],
	},
]

function ToolCard({ tool }: { tool: Tool }): ReactNode {
	return (
		<article className="border-border/60 bg-background relative flex h-full flex-col overflow-hidden rounded-sm border p-5 sm:p-6">
			{tool.glyph ? (
				<span
					className="text-foreground pointer-events-none absolute -top-3 -right-3 opacity-[0.10] [filter:grayscale(1)] dark:opacity-[0.07]"
					aria-hidden="true"
				>
					<TechGlyph name={tool.name} className="h-20 w-20" />
				</span>
			) : null}
			<div className="relative">
				<h3 className="text-base font-semibold tracking-tight">{tool.name}</h3>
				<p className="text-muted-foreground mt-2 text-sm leading-relaxed">{tool.use}</p>
			</div>
		</article>
	)
}

export function NosotrosStack(): ReactNode {
	const { item, itemTransition } = useStaggerEntrance()

	return (
		<section className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
			<div className="max-w-2xl">
				<Kicker>Con qué construimos</Kicker>
				<h2 className="mt-5 font-serif text-3xl leading-[1.12] font-normal tracking-[-0.01em] text-balance sm:text-4xl lg:text-[2.75rem]">
					Cada línea tiene su{" "}
					<span className="font-sans font-semibold tracking-tight">herramienta</span>
				</h2>
				<p className="text-muted-foreground mt-4 text-sm leading-relaxed sm:text-base">
					No es una lista de todo lo que sabemos usar. Son las herramientas con las que
					efectivamente entregamos, agrupadas por el servicio al que sirven.
				</p>
			</div>

			<div className="mt-10 flex flex-col gap-10 lg:mt-14 lg:gap-12">
				{LINES.map((line) => (
					<div key={line.service}>
						<div className="border-border/60 mb-5 flex items-baseline justify-between gap-4 border-b border-dotted pb-3">
							<h3 className="text-muted-foreground font-mono text-[11px] font-medium tracking-[0.1em] uppercase">
								{line.service}
							</h3>
							<Link
								href={line.href}
								className="focus-ring text-muted-foreground hover:text-primary shrink-0 text-xs font-medium transition-colors duration-200"
							>
								Ver el servicio
							</Link>
						</div>
						<StaggerInView className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{line.tools.map((tool) => (
								<motion.div
									key={tool.name}
									variants={item}
									transition={itemTransition}
									className="h-full"
								>
									<ToolCard tool={tool} />
								</motion.div>
							))}
						</StaggerInView>
					</div>
				))}
			</div>
		</section>
	)
}
