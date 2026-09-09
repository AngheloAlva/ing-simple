"use client"

import { EASE } from "@/components/diagrams/visual/constants"
import { useEntrance } from "@/components/diagrams/visual/use-entrance"
import { useReducedMotion } from "@/lib/motion"
import { cn } from "@/lib/utils"
import { ArrowDown, FileSpreadsheet } from "lucide-react"
import { motion } from "motion/react"
import type { ReactNode } from "react"

/**
 * `reporte-tres-capas` — guide diagram for
 * `por-que-el-informe-del-mes-se-arma-a-mano.mdx`. "Hoy": one file holding
 * everything jumbled together. "Después": the same work separated into three
 * full-width rows, fuentes → modelo → presentación, each row's items as a
 * wrapping chip row so nothing wraps badly at narrow widths. The model row
 * keeps the primary outline and its "se actualiza solo" status.
 */

const KICKER = "text-muted-foreground font-mono text-[11px] tracking-[0.02em] uppercase"

const HOY_CHIPS = [
	"exportación de ventas",
	"copiar y pegar",
	"fórmulas",
	"corrección de nombres",
	"gráficos",
	"PDF por correo",
]

const FUENTES = ["Facturación", "ERP", "Planilla de operaciones"]
const MODELO = ["Limpieza", "Códigos homologados", "Cálculos únicos"]
const PRESENTACION = ["Ventas vs meta", "Margen por línea", "Cuentas por cobrar"]

function LayerRow({
	title,
	items,
	outlined,
	show,
	delay,
	reduced,
}: {
	title: string
	items: string[]
	outlined?: boolean
	show: boolean
	delay: number
	reduced: boolean
}): ReactNode {
	return (
		<motion.div
			className={cn(
				"flex flex-col gap-2 rounded-sm border p-3 sm:flex-row sm:items-start sm:gap-4",
				outlined ? "border-primary bg-background" : "border-border bg-background"
			)}
			initial={reduced ? false : { opacity: 0, y: 8 }}
			animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
			transition={{ duration: reduced ? 0 : 0.4, ease: EASE, delay: reduced ? 0 : delay }}
		>
			<p className="w-28 shrink-0 text-sm font-semibold tracking-tight">{title}</p>
			<div className="min-w-0 flex-1">
				<div className="flex flex-wrap gap-1.5">
					{items.map((item) => (
						<span
							key={item}
							className="border-border text-muted-foreground rounded-sm border px-2 py-1 text-[11px]"
						>
							{item}
						</span>
					))}
				</div>
				{outlined && (
					<p className="text-brand-green-text mt-2.5 flex items-start gap-1.5 text-[11px] leading-snug font-medium">
						<span
							className="bg-brand-green mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
							aria-hidden="true"
						/>
						<span>Se actualiza solo</span>
					</p>
				)}
			</div>
		</motion.div>
	)
}

function RowArrow({ show, reduced }: { show: boolean; reduced: boolean }): ReactNode {
	return (
		<motion.div
			className="text-muted-foreground/50 flex justify-center py-0.5"
			initial={reduced ? false : { opacity: 0 }}
			animate={show ? { opacity: 1 } : { opacity: 0 }}
			transition={{ duration: reduced ? 0 : 0.3, ease: EASE }}
		>
			<ArrowDown className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
		</motion.div>
	)
}

const STAGE_MS = [500, 1050]

export function ReporteTresCapas(): ReactNode {
	const reduced = useReducedMotion()
	const { ref, stage } = useEntrance(STAGE_MS, reduced)
	const showHoy = stage >= 1
	const showDespues = stage >= 2

	return (
		<div ref={ref} className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-5">
			{/* Hoy: everything jumbled into one file. */}
			<motion.div
				className="border-border bg-muted/40 flex-1 rounded-sm border p-4 sm:flex sm:flex-col"
				initial={reduced ? false : { opacity: 0, y: 8 }}
				animate={showHoy ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
				transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
			>
				<p className={`${KICKER} mb-3`}>Hoy</p>
				<div className="border-border bg-background rounded-sm border border-dashed p-3 sm:flex sm:flex-1 sm:flex-col sm:justify-center">
					<p className="flex items-center gap-1.5 font-mono text-[11px] font-medium">
						<FileSpreadsheet className="text-muted-foreground h-3.5 w-3.5" aria-hidden="true" />
						informe-agosto-FINAL-v3.xlsx
					</p>
					<div className="mt-3 flex flex-wrap gap-1.5">
						{HOY_CHIPS.map((chip) => (
							<span
								key={chip}
								className="border-border text-muted-foreground rounded-sm border px-2 py-1 text-[11px]"
							>
								{chip}
							</span>
						))}
					</div>
				</div>
			</motion.div>

			{/* Después: fuentes -> modelo -> presentación, stacked full-width rows. */}
			<div className="border-border bg-muted/40 flex-1 rounded-sm border p-4">
				<p className={`${KICKER} mb-3`}>Después</p>
				<div className="flex flex-col gap-2">
					<LayerRow
						title="Fuentes"
						items={FUENTES}
						show={showDespues}
						delay={0}
						reduced={reduced}
					/>
					<RowArrow show={showDespues} reduced={reduced} />
					<LayerRow
						title="Modelo"
						items={MODELO}
						outlined
						show={showDespues}
						delay={reduced ? 0 : 0.1}
						reduced={reduced}
					/>
					<RowArrow show={showDespues} reduced={reduced} />
					<LayerRow
						title="Presentación"
						items={PRESENTACION}
						show={showDespues}
						delay={reduced ? 0 : 0.2}
						reduced={reduced}
					/>
				</div>
			</div>
		</div>
	)
}
