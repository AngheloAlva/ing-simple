"use client"

import { motion } from "motion/react"
import {
	Gauge,
	Sigma,
	Cloud,
	Brain,
	Boxes,
	Layers,
	Table2,
	Filter,
	Sparkles,
	Workflow,
	PieChart,
	Database,
	BarChart3,
	LineChart,
	ChevronRight,
	FileSpreadsheet,
	type LucideIcon,
} from "lucide-react"

type Cell = { r: number; c: number; Icon: LucideIcon }

const easeOut = [0.16, 1, 0.3, 1] as const

const logoCells: Cell[] = [
	{ r: 0, c: 1, Icon: BarChart3 },
	{ r: 0, c: 5, Icon: PieChart },
	{ r: 0, c: 8, Icon: LineChart },
	{ r: 1, c: 0, Icon: Database },
	{ r: 1, c: 6, Icon: Table2 },
	{ r: 1, c: 9, Icon: Cloud },
	{ r: 2, c: 1, Icon: FileSpreadsheet },
	{ r: 2, c: 9, Icon: Filter },
	{ r: 3, c: 0, Icon: Sigma },
	{ r: 3, c: 10, Icon: Gauge },
	{ r: 4, c: 2, Icon: Boxes },
	{ r: 4, c: 5, Icon: Workflow },
	{ r: 4, c: 8, Icon: Brain },
	{ r: 5, c: 1, Icon: Layers },
	{ r: 5, c: 6, Icon: Sparkles },
	{ r: 5, c: 9, Icon: BarChart3 },
]

const COLS = 11
const ROWS = 6

const isTextZone = (r: number, c: number) => r >= 2 && r <= 3 && c >= 3 && c <= 7

const cellHash = (r: number, c: number) => {
	const h = Math.sin(r * 127.1 + c * 311.7) * 43758.5453
	return h - Math.floor(h)
}

export function ReportabilityCTA() {
	return (
		<section className="bg-background flex w-full items-center justify-center overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
			<div className="relative mx-auto w-full max-w-6xl">
				<div
					className="grid gap-1.5 sm:gap-2 md:gap-3 lg:gap-4"
					style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
				>
					{Array.from({ length: ROWS * COLS }).map((_, idx) => {
						const r = Math.floor(idx / COLS)
						const c = idx % COLS
						const logo = logoCells.find((l) => l.r === r && l.c === c)
						const inTextZone = isTextZone(r, c)
						const showEmpty = !inTextZone && cellHash(r, c) > 0.35

						if (inTextZone) {
							return <div key={idx} className="aspect-square" aria-hidden />
						}

						if (logo) {
							const Icon = logo.Icon
							return (
								<motion.div
									key={idx}
									initial={{ opacity: 0, scale: 0.85 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.4, delay: (r + c) * 0.03, ease: "easeOut" }}
									className="border-border bg-background flex aspect-square items-center justify-center rounded-xl border shadow-sm sm:rounded-2xl"
								>
									<Icon className="text-muted-foreground h-1/2 w-1/2" strokeWidth={1.5} />
								</motion.div>
							)
						}

						if (!showEmpty) {
							return <div key={idx} className="aspect-square" aria-hidden />
						}

						return (
							<motion.div
								key={idx}
								initial={{ opacity: 0, scale: 0.85 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: (r + c) * 0.03, ease: "easeOut" }}
								className="bg-muted aspect-square rounded-xl sm:rounded-2xl"
							/>
						)
					})}
				</div>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.3 }}
					className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
				>
					<h2 className="text-foreground max-w-[22ch] text-xl leading-tight font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
						Conectá todas tus fuentes de datos
					</h2>
					<p className="text-muted-foreground mt-3 max-w-md text-sm sm:text-base">
						Power BI, Excel, SQL, Snowflake, APIs y planillas — unificamos tus datos en dashboards
						que el negocio entiende y usa.
					</p>
					<motion.a
						href="/contacto"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.4, ease: easeOut }}
						className="group mt-6 inline-flex w-full items-center justify-center gap-3 rounded-md bg-blue-600 py-3 pr-3 pl-5 font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-500 ease-out hover:rounded-[50px] hover:shadow-xl hover:shadow-blue-600/40 sm:w-auto"
					>
						<span>Agenda tu Diagnóstico</span>
						<span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 transition-all duration-300 group-hover:scale-110">
							<ChevronRight className="relative left-px h-4 w-4" />
						</span>
					</motion.a>
				</motion.div>
			</div>
		</section>
	)
}
