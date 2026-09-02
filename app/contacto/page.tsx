import { Nav } from "@/components/nav"
import { Footer } from "@/components/footer"
import { ContactoSection } from "@/components/contacto-section"
import { InView } from "@/lib/motion"
import { createMetadata } from "@/lib/metadata"
import { SERVICES } from "@/lib/services"
import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = createMetadata({
	title: "Contacto",
	description:
		"Contáctanos para transformar tu negocio con soluciones digitales simples y efectivas. Desarrollo web, reportabilidad, automatizaciones y capacitaciones.",
	path: "/contacto",
})

interface PageProps {
	searchParams: Promise<{ servicio?: string | string[] }>
}

export default async function ContactoPage({ searchParams }: PageProps): Promise<ReactNode> {
	const { servicio } = await searchParams
	const slug = Array.isArray(servicio) ? servicio[0] : servicio
	const shortName = SERVICES.find((s) => s.slug === slug)?.shortName

	return (
		<>
			<span id="top" className="sr-only" />
			<Nav />
			<main id="main-content" className="flex-1">
				<ContactoSection initialServicio={shortName ?? ""} />
			</main>
			<InView>
				<Footer />
			</InView>
		</>
	)
}
