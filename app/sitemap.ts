import { getAllGuias } from "@/lib/guias/fs"
import { siteConfig } from "@/lib/metadata"
import { portfolioProjects } from "@/lib/portfolio-data"
import { CONTENT_UPDATED_AT, buildSitemap } from "@/lib/seo/sitemap"
import { SERVICES } from "@/lib/services"
import type { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const guias = await getAllGuias()
	return buildSitemap(siteConfig.url, SERVICES, portfolioProjects, CONTENT_UPDATED_AT, guias)
}
