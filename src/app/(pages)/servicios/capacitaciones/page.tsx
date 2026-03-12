import { createMetadata } from "@/lib/metadata"

import { TrainingHowItWorks } from "@/components/sections/training/how-it-works"
import { TrainingFeatures } from "@/components/sections/training/features"
import TrainingPricing from "@/components/sections/training/pricing"
import { TrainingHero } from "@/components/sections/training/hero"
import { TrainingCTA } from "@/components/sections/training/cta"
import TrainingStats from "@/components/sections/training/stats"
import TrainingFAQ from "@/components/sections/training/faq"

import type { ReactNode } from "react"
import type { Metadata } from "next"

export const metadata: Metadata = createMetadata({
	title: "Capacitaciones y Formación - IngSimple",
	description:
		"Formación práctica en Power BI, Power Apps, Excel avanzado y Power Automate. Capacitaciones personalizadas para tu equipo.",
	path: "/servicios/capacitaciones",
})

export default function CapacitacionesPage(): ReactNode {
	return (
		<main id="main-content" className="flex-1">
			<TrainingHero />
			<TrainingFeatures />
			<TrainingHowItWorks />
			<TrainingPricing />
			<TrainingStats />
			<TrainingFAQ />
			<TrainingCTA />
		</main>
	)
}
