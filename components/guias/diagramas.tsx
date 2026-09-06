import type { ComponentType, ReactNode } from "react"

import { AutomationFlow } from "@/components/diagrams/flow/automation-flow"
import { TrainingProgram } from "@/components/diagrams/program/training-program"
import { ReportabilityReport } from "@/components/diagrams/report/reportability-report"

/**
 * Registry consumed by the `Diagrama` MDX block (`mdx-components.tsx`).
 * Every entry is a zero-config diagram already used elsewhere on the site
 * (`components/service-diagrams.tsx`) — none take page-specific props, so
 * they render standalone inside a guide's article column. `nombre` in the
 * MDX author's `<Diagrama nombre="..." />` maps directly to a key here.
 *
 * Add a new diagram by importing it and adding one entry; `DIAGRAMA_NAMES`
 * (used by `content/guias/README.md`) stays in sync automatically.
 */
export const DIAGRAMAS: Record<string, ComponentType> = {
	"flujo-automatizacion": AutomationFlow,
	"reporte-gerencial": ReportabilityReport,
	"programa-capacitacion": TrainingProgram,
}

export const DIAGRAMA_NAMES = Object.keys(DIAGRAMAS)

export type DiagramaNombre = keyof typeof DIAGRAMAS

/** Renders `DIAGRAMAS[nombre]`, or a dev-only warning for an unknown name. */
export function resolveDiagrama(nombre: string): ReactNode {
	const Diagrama = DIAGRAMAS[nombre]

	if (Diagrama) return <Diagrama />

	if (process.env.NODE_ENV !== "production") {
		return (
			<div className="border-destructive/50 bg-destructive/5 text-destructive mt-6 rounded-sm border border-dashed p-4 text-sm">
				<p className="font-semibold tracking-tight">Diagrama desconocido: &quot;{nombre}&quot;</p>
				<p className="mt-1 text-[13px] leading-relaxed">
					Nombres disponibles: {DIAGRAMA_NAMES.join(", ")}.
				</p>
			</div>
		)
	}

	return null
}
