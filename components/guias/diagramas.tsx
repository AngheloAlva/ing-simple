import type { ComponentType, ReactNode } from "react"

import { IaPasoQueCambia } from "@/components/guias/diagramas/ia-paso-que-cambia"
import { IaQueProceso } from "@/components/guias/diagramas/ia-que-proceso"
import { LeyInventario } from "@/components/guias/diagramas/ley-inventario"
import { LeyLineaDeTiempo } from "@/components/guias/diagramas/ley-linea-de-tiempo"
import { ReporteTresCapas } from "@/components/guias/diagramas/reporte-tres-capas"

/**
 * Registry consumed by the `Diagrama` MDX block (`mdx-components.tsx`).
 * Every entry lives under `components/guias/diagramas/` and explains one
 * concept of the guide that names it — never a service hero visual. `nombre`
 * in the MDX author's `<Diagrama nombre="..." />` maps directly to a key here.
 *
 * Add a new diagram by creating a file under `components/guias/diagramas/`,
 * importing it and adding one entry; `DIAGRAMA_NAMES` (used by
 * `content/guias/README.md`) stays in sync automatically.
 */
export const DIAGRAMAS: Record<string, ComponentType> = {
	"ia-que-proceso": IaQueProceso,
	"ia-paso-que-cambia": IaPasoQueCambia,
	"ley-linea-de-tiempo": LeyLineaDeTiempo,
	"ley-inventario": LeyInventario,
	"reporte-tres-capas": ReporteTresCapas,
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
