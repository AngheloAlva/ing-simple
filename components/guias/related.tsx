import Link from "next/link"
import type { ReactNode } from "react"

import type { GuiaMeta } from "@/lib/guias/schema"
import { TEMAS } from "@/lib/guias/temas"

export function GuiasRelated({ guias }: { guias: GuiaMeta[] }): ReactNode {
	if (guias.length === 0) return null

	return (
		<section className="mx-auto max-w-prose px-5 pb-16 sm:px-8 lg:max-w-[calc(65ch+20rem)] lg:px-0">
			<h2 className="text-lg font-semibold tracking-tight">Sigue leyendo</h2>

			<div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{guias.map((guia) => (
					<Link
						key={guia.slug}
						href={`/guias/${guia.slug}`}
						className="group border-border bg-background hover:border-primary rounded-sm border p-4 transition-colors duration-200"
					>
						<span className="text-muted-foreground font-mono text-[10px] tracking-[0.1em] uppercase">
							{TEMAS[guia.tema]}
						</span>
						<p className="mt-2 text-sm font-semibold tracking-tight">{guia.title}</p>
					</Link>
				))}
			</div>
		</section>
	)
}
