import { createMetadata } from "@/lib/metadata"

import { MissionVision } from "@/components/sections/nosotros/mission-vision"
import { NosotrosHero } from "@/components/sections/nosotros/hero"
import { NosotrosCta } from "@/components/sections/nosotros/cta"
import { Values } from "@/components/sections/nosotros/values"
import About from "@/components/sections/home/about"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: "Sobre Nosotros",
	description:
		"Conocé al equipo detrás de IngSimple. Nuestra misión, valores e historia transformando organizaciones con soluciones digitales simples y efectivas.",
	path: "/sobre-nosotros",
})

export default function SobreNosotrosPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<NosotrosHero />
			<MissionVision />
			<Values />
			<About displayNavigation={true} />
			<NosotrosCta />
		</main>
	)
}
