import { createMetadata } from "@/lib/metadata"

import { WebHowItWorks } from "@/components/sections/web/how-it-works"
import WebComparison from "@/components/sections/web/comparison"
import { WebFeatures } from "@/components/sections/web/features"
import { WebHero } from "@/components/sections/web/hero"
import WebStats from "@/components/sections/web/stats"
import WebFAQ from "@/components/sections/web/faq"
import WebCTA from "@/components/sections/web/cta"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: "Soluciones Web - IngSimple",
	description:
		"Diseñamos y desarrollamos sitios web modernos, rápidos y optimizados que representan a tu empresa y generan resultados reales.",
	path: "/servicios/desarrollo-web",
})

export default function DesarrolloWebPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<WebHero />
			<WebFeatures />
			<WebHowItWorks />
			<WebComparison />
			<WebStats />
			<WebFAQ />
			<WebCTA />
		</main>
	)
}
