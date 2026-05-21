import { createMetadata } from "@/lib/metadata"

import { PortfolioContent } from "@/components/sections/portafolio/portfolio-content"
import { PortfolioCasosBanner } from "@/components/sections/portafolio/casos-banner"
import { PortfolioCTA } from "@/components/sections/portafolio/cta"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: "Portafolio - IngSimple",
	description:
		"Maquetas, prototipos y exploraciones de desarrollo web, Power Platform, capacitaciones y reportabilidad. Para proyectos en producción, mirá la sección de casos.",
	path: "/portafolio",
})

export default function PortafolioPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<PortfolioContent />
			<PortfolioCasosBanner />
			<PortfolioCTA />
		</main>
	)
}
