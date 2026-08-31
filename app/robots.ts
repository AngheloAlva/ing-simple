import type { MetadataRoute } from "next";
import { isIndexable, siteConfig } from "@/lib/metadata";

export default function robots(): MetadataRoute.Robots {
  // Anything that is not the production deployment stays out of the index.
  // Previews are public URLs, and a crawled preview would compete with the
  // real site for its own pages.
  if (!isIndexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
