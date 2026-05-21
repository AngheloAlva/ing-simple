import type { Metadata } from "next"
import type { ReactNode } from "react"

import { createMetadata } from "@/lib/metadata"

import { CasosHero } from "@/components/sections/casos/hero"
import { CasosLogoWall } from "@/components/sections/casos/logo-wall"
import { CasosStats } from "@/components/sections/casos/stats"
import { CasosGrid } from "@/components/sections/casos/grid"
import { CasosConfidentiality } from "@/components/sections/casos/confidentiality"
import { CasosCTA } from "@/components/sections/casos/cta"

export const metadata: Metadata = createMetadata({
	title: "Casos - IngSimple",
	description:
		"Proyectos reales en producción con clientes de turismo, industria y operaciones. Mostramos el cliente, contamos el problema y el resultado real.",
	path: "/casos",
})

export default function CasosPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<CasosHero />
			<CasosLogoWall />
			<CasosStats />
			<CasosGrid />
			<CasosConfidentiality />
			<CasosCTA />
		</main>
	)
}
