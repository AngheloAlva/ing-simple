import { InView, MotionSection } from "@/lib/motion"
import { createMetadata } from "@/lib/metadata"
import { faqJsonLd } from "@/lib/seo/json-ld"
import { HOME_FAQ } from "@/lib/home-faq"
import { DIRECTIONAL_CLASSES } from "@/lib/view-transitions"

import { ServicesStack } from "@/components/services-stack"
import { CaseStudy } from "@/components/case-study-feature"
import { HeroShowcase } from "@/components/hero-showcase"
import { HowItWorks } from "@/components/how-it-works"
import { HeroWaves } from "@/components/hero-waves"
import { TrustedBy } from "@/components/trusted-by"
import { Challenge } from "@/components/challenge"
import { FinalCta } from "@/components/final-cta"
import { JsonLd } from "@/components/json-ld"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Faq } from "@/components/faq"
import { Nav } from "@/components/nav"

import type { Metadata } from "next"
import { ViewTransition, type ReactNode } from "react"

export const metadata: Metadata = createMetadata({
	absoluteTitle: "Power BI, automatización y desarrollo web en Chile | Ingeniería Simple",
	description:
		"Ingeniería Simple ofrece reportes, automatización de procesos, sistemas web a medida y capacitaciones en Chile. Trabajamos contigo y compartimos avances desde el inicio.",
	path: "/",
})

// Plain literals (built server-side) passed as props to the client motion
// wrappers — kept inline to avoid importing values from a "use client" module.
const SOFT_EASE = [0.22, 1, 0.36, 1] as const
const RISE_IN = {
	hidden: { opacity: 0, y: 24, scale: 0.985 },
	visible: { opacity: 1, y: 0, scale: 1 },
}

export default function HomePage(): ReactNode {
	return (
		<ViewTransition enter={DIRECTIONAL_CLASSES} exit={DIRECTIONAL_CLASSES} default="none">
			<>
				<JsonLd data={faqJsonLd(HOME_FAQ)} />

				<span id="top" className="sr-only" />

				<Nav />
				<main id="main-content" className="flex-1">
					<div className="relative">
						<HeroWaves />
						<Hero />
						<MotionSection
							variants={RISE_IN}
							transition={{ duration: 0.85, delay: 0.55, ease: SOFT_EASE }}
							className="relative px-5 pb-40 sm:px-8 lg:px-10"
						>
							<HeroShowcase />
						</MotionSection>
					</div>

					<InView>
						<TrustedBy />
					</InView>

					<InView viewport={{ once: true, margin: "0px 0px -30% 0px" }}>
						<Challenge />
					</InView>

					<ServicesStack />

					<HowItWorks />

					<InView>
						<CaseStudy />
					</InView>

					<InView>
						<Faq />
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
