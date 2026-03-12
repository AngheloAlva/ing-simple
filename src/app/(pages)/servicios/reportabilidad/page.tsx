import { createMetadata } from "@/lib/metadata"

import { ReportabilityHowItWorks } from "@/components/sections/reportability/how-it-works"
import { ReportabilityFeatures } from "@/components/sections/reportability/features"
import { ReportabilityShowcase } from "@/components/sections/reportability/showcase"
import { ReportabilityHero } from "@/components/sections/reportability/hero"
import ReportabilityStats from "@/components/sections/reportability/stats"
import { ReportabilityCTA } from "@/components/sections/reportability/cta"
import ReportabilityFAQ from "@/components/sections/reportability/faq"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: "Reportabilidad, Dashboards y Analítica - IngSimple",
	description:
		"Transformamos datos dispersos en dashboards dinámicos, reportes automatizados e indicadores claros para tomar decisiones informadas.",
	path: "/servicios/reportabilidad",
})

export default function ReportabilidadPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<ReportabilityHero />
			<ReportabilityFeatures />
			<ReportabilityHowItWorks />
			<ReportabilityStats />
			<ReportabilityShowcase />
			<ReportabilityFAQ />
			<ReportabilityCTA />
		</main>
	)
}
