import { createMetadata, siteConfig } from "@/lib/metadata"

import { Testimonials } from "@/components/sections/home/testimonials"
import { HowItWorks } from "@/components/sections/home/how-it-works"
import { FinalCTA } from "@/components/sections/home/final-cta"
import { Services } from "@/components/sections/home/services"
import { Showcase } from "@/components/sections/home/showcase"
import { Stats } from "@/components/sections/home/stats"
import { Hero } from "@/components/sections/home/hero"
import { FAQ } from "@/components/sections/home/faq"
import About from "@/components/sections/home/about"

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
			<Services />
			<Showcase />
			<Stats />
			<Testimonials />
			<About />
			<FAQ />
			<FinalCTA />
		</main>
	)
}
