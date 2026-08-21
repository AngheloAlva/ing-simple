import { siteConfig } from "@/lib/metadata";
import { portfolioProjects } from "@/lib/portfolio-data";
import { SERVICES } from "@/lib/services";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/casos`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/sobre-nosotros`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/contacto`, priority: 0.7, changeFrequency: "yearly" },
    { url: `${base}/privacidad`, priority: 0.2, changeFrequency: "yearly" },
  ];

  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${base}${service.href}`,
    priority: 0.8,
    changeFrequency: "monthly",
  }));

  const casePages: MetadataRoute.Sitemap = portfolioProjects
    .filter((project) => project.isFlagship && project.caseStudy)
    .map((project) => ({
      url: `${base}/casos/${project.id}`,
      priority: 0.7,
      changeFrequency: "monthly",
    }));

  return [...staticRoutes, ...servicePages, ...casePages].map((route) => ({
    ...route,
    lastModified,
  }));
}
