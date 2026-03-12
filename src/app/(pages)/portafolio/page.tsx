import { createMetadata } from "@/lib/metadata"

import { PortfolioContent } from "@/components/sections/portafolio/portfolio-content"
import { PortfolioCTA } from "@/components/sections/portafolio/cta"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: "Portafolio - IngSimple",
	description:
		"Explorá nuestros proyectos de desarrollo web, Power Platform, capacitaciones y reportabilidad. Soluciones reales para organizaciones.",
	path: "/portafolio",
})

export default function PortafolioPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<PortfolioContent />
			<PortfolioCTA />
		</main>
	)
}
