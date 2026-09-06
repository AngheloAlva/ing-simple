import { FinalCta } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { Nav } from "@/components/nav"
import { SERVICE_INCLUDES_VARIANTS, SERVICE_MODULES } from "@/components/servicios/modules/registry"
import { ServicioCases } from "@/components/servicios/related-cases"
import { ServicioFaq } from "@/components/servicios/service-faq"
import { ServicioHero } from "@/components/servicios/hero"
import { ServicioIncludes } from "@/components/servicios/includes"
import { ServicioProblem } from "@/components/servicios/problem"
import { ServicioProcess } from "@/components/servicios/process"
import { createMetadata } from "@/lib/metadata"
import { InView } from "@/lib/motion"
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo/json-ld"
import { contactHref, getServiceBySlug, SERVICES } from "@/lib/services"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

interface PageProps {
	params: Promise<{ slug: string }>
}

export function generateStaticParams(): { slug: string }[] {
	return SERVICES.map((service) => ({ slug: service.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params
	const service = getServiceBySlug(slug)

	if (!service) {
		return createMetadata({
			title: "Servicio no encontrado",
			path: `/servicios/${slug}`,
			noIndex: true,
		})
	}

	return createMetadata({
		title: service.page.seoTitle,
		description: service.page.seoDescription,
		path: service.href,
	})
}

export default async function ServicePage({ params }: PageProps): Promise<ReactNode> {
	const { slug } = await params
	const service = getServiceBySlug(slug)

	if (!service) {
		notFound()
	}

	const Module = SERVICE_MODULES[service.slug]
	const contact = contactHref(service.slug)

	return (
		<>
			<JsonLd
				data={[
					...serviceJsonLd(service),
					breadcrumbJsonLd([
						{ name: "Inicio", path: "/" },
						{ name: service.title, path: service.href },
					]),
				]}
			/>
			<span id="top" className="sr-only" />
			<Nav />
			<main id="main-content" className="flex-1">
				<ServicioHero
					shortName={service.shortName}
					slug={service.slug}
					href={service.href}
					page={service.page}
				/>
				<ServicioProblem problem={service.page.problem} audience={service.page.audience} />
				{Module ? (
					<InView>
						<Module contactHref={contact} />
					</InView>
				) : null}
				<ServicioIncludes
					shortName={service.shortName}
					items={service.page.includes}
					variant={SERVICE_INCLUDES_VARIANTS[service.slug]}
				/>
				<ServicioProcess slug={service.slug} steps={service.page.process} />
				<InView>
					<ServicioCases service={service} />
				</InView>
				<ServicioFaq serviceName={service.shortName} items={service.page.faq} />
				<FinalCta title={service.page.ctaTitle} body={service.page.ctaBody} href={contact} />
			</main>
			<InView>
				<Footer />
			</InView>
		</>
	)
}
