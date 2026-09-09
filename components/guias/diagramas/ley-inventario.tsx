"use client"

import { EASE } from "@/components/diagrams/visual/constants"
import { useEntrance } from "@/components/diagrams/visual/use-entrance"
import { useReducedMotion } from "@/lib/motion"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"
import type { ReactNode } from "react"

/**
 * `ley-inventario` — guide diagram for
 * `ley-21719-que-hacer-antes-del-1-de-diciembre.mdx`. Five scattered sources
 * feeding one registro de actividades de tratamiento; "Base de licitud" is
 * the column the guide is actually teaching, so its header carries the
 * primary accent. Sources arrive first, the table settles in after.
 */

const KICKER = "text-muted-foreground font-mono text-[11px] tracking-[0.02em] uppercase"

const SOURCES = ["Formulario del sitio", "WhatsApp de ventas", "Facturación", "CRM", "Nómina"]

type Row = [dato: string, paraQue: string, base: string, acceso: string, plazo: string]

const ROWS: Row[] = [
	["Nombre, correo, teléfono", "Responder cotizaciones", "Interés legítimo", "Ventas", "12 meses"],
	[
		"RUT, dirección de despacho",
		"Facturar y despachar",
		"Contrato",
		"Administración",
		"6 años (plazo tributario)",
	],
	[
		"Datos de remuneraciones",
		"Pagar sueldos",
		"Obligación legal",
		"Personas",
		"Contrato + plazo legal",
	],
]

const COLUMNS = ["Dato", "Para qué", "Base de licitud", "Acceso", "Plazo"] as const

function InventoryTable({ show, reduced }: { show: boolean; reduced: boolean }): ReactNode {
	return (
		<motion.div
			className="border-border overflow-x-auto rounded-sm border"
			initial={reduced ? false : { opacity: 0, y: 8 }}
			animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
			transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
		>
			<table className="w-full min-w-[34rem] border-collapse text-[11px] sm:text-xs">
				<thead className="bg-muted/40">
					<tr>
						{COLUMNS.map((col) => (
							<th
								key={col}
								className={
									col === "Base de licitud"
										? "text-primary border-border border-b px-2.5 py-2 text-left font-semibold"
										: "border-border border-b px-2.5 py-2 text-left font-semibold"
								}
							>
								{col}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{ROWS.map((row) => (
						<tr key={row[0]} className="border-border border-b last:border-0">
							{row.map((cell, i) => (
								<td
									key={i}
									className={
										i === 2
											? "text-foreground bg-primary/5 px-2.5 py-2 align-top font-medium"
											: "text-muted-foreground px-2.5 py-2 align-top"
									}
								>
									{cell}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</motion.div>
	)
}

function SourceChip({
	source,
	index,
	show,
	reduced,
	stacked,
}: {
	source: string
	index: number
	show: boolean
	reduced: boolean
	stacked?: boolean
}): ReactNode {
	return (
		<motion.div
			className={stacked ? "flex items-center gap-2" : undefined}
			initial={reduced ? false : { opacity: 0, x: stacked ? -8 : 0, y: stacked ? 0 : 6 }}
			animate={
				show ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: stacked ? -8 : 0, y: stacked ? 0 : 6 }
			}
			transition={{ duration: reduced ? 0 : 0.35, ease: EASE, delay: reduced ? 0 : index * 0.07 }}
		>
			<span
				className={
					stacked
						? "border-border bg-background w-40 truncate rounded-sm border px-2.5 py-1.5 text-[11px] font-medium"
						: "border-border bg-background rounded-sm border px-2.5 py-1 text-[11px] font-medium"
				}
			>
				{source}
			</span>
			{stacked && (
				<ArrowRight
					className="text-muted-foreground/50 h-3 w-3 shrink-0"
					strokeWidth={1.75}
					aria-hidden="true"
				/>
			)}
		</motion.div>
	)
}

const STAGE_MS = [500, 1000]

export function LeyInventario(): ReactNode {
	const reduced = useReducedMotion()
	const { ref, stage } = useEntrance(STAGE_MS, reduced)
	const showSources = stage >= 1
	const showTable = stage >= 2

	return (
		<div ref={ref} className="border-border bg-muted/40 rounded-sm border p-4 sm:p-5">
			{/* Desktop: sources as a stacked rail, each pointing into the table. */}
			<div className="hidden sm:flex sm:items-start sm:gap-4">
				<div className="flex shrink-0 flex-col gap-2 pt-1">
					<p className={`${KICKER} mb-0.5`}>Fuentes</p>
					{SOURCES.map((source, i) => (
						<SourceChip
							key={source}
							source={source}
							index={i}
							show={showSources}
							reduced={reduced}
							stacked
						/>
					))}
				</div>

				<div className="min-w-0 flex-1 pt-1">
					<p className={`${KICKER} mb-2`}>Registro de actividades de tratamiento</p>
					<InventoryTable show={showTable} reduced={reduced} />
				</div>
			</div>

			{/* Mobile: sources as a wrapped chip row above the table. */}
			<div className="sm:hidden">
				<p className={`${KICKER} mb-2`}>Fuentes</p>
				<div className="flex flex-wrap gap-1.5">
					{SOURCES.map((source, i) => (
						<SourceChip
							key={source}
							source={source}
							index={i}
							show={showSources}
							reduced={reduced}
						/>
					))}
				</div>

				<p className={`${KICKER} mt-4 mb-2`}>Registro de actividades de tratamiento</p>
				<InventoryTable show={showTable} reduced={reduced} />
			</div>
		</div>
	)
}
