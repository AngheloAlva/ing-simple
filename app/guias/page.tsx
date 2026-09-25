import type { Metadata } from "next"
import { ViewTransition, type ReactNode } from "react"

import { GuiasExplorer } from "@/components/guias/explorer"
import { GuiasHero } from "@/components/guias/hero"
import { FinalCta } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { Nav } from "@/components/nav"
import { getAllGuias } from "@/lib/guias/fs"
import { createMetadata } from "@/lib/metadata"
import { InView } from "@/lib/motion"
import { breadcrumbJsonLd } from "@/lib/seo/json-ld"
import { DIRECTIONAL_CLASSES } from "@/lib/view-transitions"

export const metadata: Metadata = createMetadata({
	title: "Guías",
	description:
		"Guías prácticas de IA, cumplimiento, reportabilidad y automatización para pymes: por dónde empezar, sin humo.",
	path: "/guias",
})

interface PageProps {
	searchParams: Promise<{ servicio?: string | string[] }>
}

export default async function GuiasPage({ searchParams }: PageProps): Promise<ReactNode> {
	const { servicio } = await searchParams
	const initialServicio = Array.isArray(servicio) ? servicio[0] : servicio
	const guias = await getAllGuias()

	return (
		<ViewTransition enter={DIRECTIONAL_CLASSES} exit={DIRECTIONAL_CLASSES} default="none">
			<>
				<JsonLd
					data={breadcrumbJsonLd([
						{ name: "Inicio", path: "/" },
						{ name: "Guías", path: "/guias" },
					])}
				/>
				<span id="top" className="sr-only" />
				<Nav />
				<main id="main-content" className="flex-1">
					<GuiasHero />
					<InView>
						<section className="mx-auto max-w-360 px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
							<GuiasExplorer
								guias={guias}
								{...(initialServicio !== undefined ? { initialServicio } : {})}
							/>
						</section>
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
