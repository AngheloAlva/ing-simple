import { CaseStudy } from "@/components/case-study-feature"
import { Hero } from "@/components/hero"
import { HeroWaves } from "@/components/hero-waves"
import { Faq } from "@/components/faq"
import { JsonLd } from "@/components/json-ld"
import { ServicesStack } from "@/components/services-stack"
import { HowItWorks } from "@/components/how-it-works"
import { FinalCta } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { Nav } from "@/components/nav"
import { TrustedBy } from "@/components/trusted-by"
import { Challenge } from "@/components/challenge"
import { HeroShowcase } from "@/components/hero-showcase"
import { HOME_FAQ } from "@/lib/home-faq"
import { InView, MotionSection } from "@/lib/motion"
import { createMetadata } from "@/lib/metadata"
import { faqJsonLd } from "@/lib/seo/json-ld"
import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = createMetadata({
	absoluteTitle: "Ingeniería Simple | Power BI, automatización y desarrollo web en Chile",
	description:
		"Ingeniería Simple: transformación digital para empresas en Chile. Reportabilidad y dashboards, automatización de procesos, desarrollo web a medida y capacitaciones.",
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
						className="relative px-5 pb-32 sm:px-8 lg:px-10"
					>
						<HeroShowcase />
					</MotionSection>
				</div>
				<InView>
					<TrustedBy />
				</InView>
				{/* Taller than the viewport: the default -80px margin fires while the
				    section is still off screen, so the reveal is held until a real
				    part of it has been read. */}
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
	)
}
