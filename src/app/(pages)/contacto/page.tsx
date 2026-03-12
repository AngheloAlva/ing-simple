import { createMetadata } from "@/lib/metadata"

import { ContactSection } from "@/components/sections/contacto/contact-section"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: "Contacto",
	description:
		"Contáctanos para transformar tu negocio con soluciones digitales simples y efectivas. Desarrollo web, reportabilidad, Power Platform y capacitaciones.",
	path: "/contacto",
})

export default function ContactoPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<ContactSection />
		</main>
	)
}
