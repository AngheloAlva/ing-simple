import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { ArticleHeader } from "@/components/guias/article-header"
import { GuiaCover } from "@/components/guias/cover"
import { GuiasRelated } from "@/components/guias/related"
import { GuiaToc, GuiaTocMobile } from "@/components/guias/toc"
import { FinalCta } from "@/components/final-cta"
import { Footer } from "@/components/footer"
import { JsonLd } from "@/components/json-ld"
import { Nav } from "@/components/nav"
import { getRelatedGuias } from "@/lib/guias"
import { getAllGuias, getGuiaBySlug } from "@/lib/guias/fs"
import { compileGuia, extractHeadings } from "@/lib/guias/render"
import { createMetadata } from "@/lib/metadata"
import { InView } from "@/lib/motion"
import { breadcrumbJsonLd, guiaJsonLd } from "@/lib/seo/json-ld"
import { contactHref } from "@/lib/services"

interface PageProps {
	params: Promise<{ slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams(): Promise<{ slug: string }[]> {
	const guias = await getAllGuias()
	return guias.map((guia) => ({ slug: guia.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug } = await params
	const guia = await getGuiaBySlug(slug)

	if (!guia) {
		return createMetadata({
			title: "Guía no encontrada",
			path: `/guias/${slug}`,
			noIndex: true,
		})
	}

	return createMetadata({
		title: guia.meta.title,
		description: guia.meta.description,
		path: `/guias/${slug}`,
	})
}

export default async function GuiaDetailPage({ params }: PageProps): Promise<ReactNode> {
	const { slug } = await params
	const guia = await getGuiaBySlug(slug)

	if (!guia) notFound()

	const [content, allGuias] = await Promise.all([compileGuia(guia.body), getAllGuias()])
	const related = getRelatedGuias(guia.meta, allGuias)
	const headings = extractHeadings(guia.body)

	return (
		<>
			<JsonLd
				data={[
					breadcrumbJsonLd([
						{ name: "Inicio", path: "/" },
						{ name: "Guías", path: "/guias" },
						{ name: guia.meta.title, path: `/guias/${slug}` },
					]),
					guiaJsonLd(guia.meta),
				]}
			/>
			<span id="top" className="sr-only" />
			<Nav />
			<main id="main-content" className="flex-1">
				<GuiaCover
					src={guia.meta.portada}
					alt={guia.meta.portadaAlt}
					{...(guia.meta.portadaCredito !== undefined
						? { credito: guia.meta.portadaCredito }
						: {})}
				/>

				<div className="mx-auto max-w-360 px-5 pt-10 pb-16 sm:px-8 lg:px-10">
					<div className="mx-auto max-w-prose lg:grid lg:max-w-[calc(65ch+20rem)] lg:grid-cols-[minmax(0,65ch)_16rem] lg:gap-16">
						<div className="min-w-0">
							<ArticleHeader meta={guia.meta} />
							<div className="mb-8">
								<GuiaTocMobile headings={headings} />
							</div>
							<article>{content}</article>
						</div>

						<aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
							<GuiaToc headings={headings} />
						</aside>
					</div>
				</div>

				<GuiasRelated guias={related} />
				<FinalCta href={contactHref(guia.meta.servicio)} />
			</main>
			<InView>
				<Footer />
			</InView>
		</>
	)
}
