import { createMetadata } from "@/lib/metadata"

import { PowerPlatformHowItWorks } from "@/components/sections/power-platform/how-it-works"
import { PowerPlatformComparison } from "@/components/sections/power-platform/comparison"
import { PowerPlatformFeatures } from "@/components/sections/power-platform/features"
import { PowerPlatformStats } from "@/components/sections/power-platform/stats"
import { PowerPlatformHero } from "@/components/sections/power-platform/hero"
import { PowerPlatformCTA } from "@/components/sections/power-platform/cta"
import PowerPlatformFAQ from "@/components/sections/power-platform/faq"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: "Power Platform - IngSimple",
	description:
		"Soluciones empresariales con Power Platform: apps, automatizaciones y dashboards sin código. Power BI, Power Apps, Power Automate y Power Pages.",
	path: "/servicios/power-platform",
})

export default function PowerPlatformPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<PowerPlatformHero />
			<PowerPlatformFeatures />
			<PowerPlatformHowItWorks />
			<PowerPlatformComparison />
			<PowerPlatformStats />
			<PowerPlatformFAQ />
			<PowerPlatformCTA />
		</main>
	)
}
