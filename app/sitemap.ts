import { siteConfig } from "@/lib/metadata";
import { portfolioProjects } from "@/lib/portfolio-data";
import { CONTENT_UPDATED_AT, buildSitemap } from "@/lib/seo/sitemap";
import { SERVICES } from "@/lib/services";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return buildSitemap(siteConfig.url, SERVICES, portfolioProjects, CONTENT_UPDATED_AT);
}
