import { createMetadata, siteConfig } from "@/lib/metadata"

import { Testimonials } from "@/components/testimonials"
import { HowItWorks } from "@/components/how-it-works"
import { FinalCTA } from "@/components/final-cta"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Stats } from "@/components/stats"
import { Hero } from "@/components/hero"
import { FAQ } from "@/components/faq"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: `${siteConfig.name} - ${siteConfig.tagline}`,
	description: siteConfig.description,
	path: "/",
})

export default function HomePage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<Hero />
			<HowItWorks />
			<Features />
			<Stats />
			<Testimonials />
			<Pricing />
			<FAQ />
			<FinalCTA />
		</main>
	)
}
