import { CasosConfidentiality } from "@/components/casos/confidentiality"
import { CasosGrid } from "@/components/casos/grid"
import { CasosHero } from "@/components/casos/hero"
import { CasosStats } from "@/components/casos/stats"
import { FinalCta } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { Nav } from "@/components/nav"
import { InView } from "@/lib/motion"
import { createMetadata } from "@/lib/metadata"
import { breadcrumbJsonLd } from "@/lib/seo/json-ld"
import { DIRECTIONAL_CLASSES } from "@/lib/view-transitions"
import type { Metadata } from "next"
import { ViewTransition, type ReactNode } from "react"

export const metadata: Metadata = createMetadata({
	title: "Casos de éxito: proyectos a medida en producción",
	description:
		"Proyectos a medida en producción para empresas como OTC, Busanc, AIEP y Grupo CAEMP: el problema de partida, la solución y los resultados de cada uno.",
	path: "/casos",
})

export default function CasosPage(): ReactNode {
	return (
		<ViewTransition enter={DIRECTIONAL_CLASSES} exit={DIRECTIONAL_CLASSES} default="none">
			<>
				<JsonLd
					data={breadcrumbJsonLd([
						{ name: "Inicio", path: "/" },
						{ name: "Casos", path: "/casos" },
					])}
				/>
				<span id="top" className="sr-only" />
				<Nav />
				<main id="main-content" className="flex-1">
					<CasosHero />
					<InView>
						<CasosStats />
					</InView>
					<InView>
						<CasosGrid />
					</InView>
					<InView>
						<CasosConfidentiality />
					</InView>
					<FinalCta />
				</main>
				<InView>
					<Footer />
				</InView>
			</>
		</ViewTransition>
	)
}
