import type { Metadata } from "next";

/** The domain the finished site will live on, once it replaces the old one. */
const PRODUCTION_URL = "https://ingenieriasimple.cl";

/**
 * The origin every canonical, Open Graph tag and sitemap entry is built from.
 *
 * Only the production deployment claims the real domain. A preview resolves to
 * its own URL instead, so its canonicals can never point at pages the live site
 * does not have yet. Set `NEXT_PUBLIC_SITE_URL` to override this anywhere that
 * is not Vercel.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit !== undefined && explicit !== "") return explicit;

  if (process.env.VERCEL_ENV === "production") return PRODUCTION_URL;
  if (process.env.VERCEL_URL !== undefined && process.env.VERCEL_URL !== "") {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

/** True only where the site is meant to be crawled. */
export const isIndexable =
  process.env.VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

export const siteConfig = {
  name: "Ingeniería Simple",
  shortName: "IngSimple",
  description: "Soluciones simples para un mundo digital complejo",
  url: resolveSiteUrl(),
  creator: "@ingsimple",
  authors: [
    {
      name: "Ingeniería Simple",
      url: PRODUCTION_URL,
    },
  ],
  keywords: [
    "transformación digital",
    "dashboards",
    "analítica de datos",
    "Power BI",
    "capacitaciones",
    "automatización de procesos",
    "desarrollo web",
    "consultoría",
    "Power BI Chile",
    "automatización de procesos Chile",
    "desarrollo web Chile",
    "capacitación Power BI",
    "Power Apps",
  ],
} as const;

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [...siteConfig.authors],
  creator: siteConfig.creator,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: siteConfig.creator,
  },
  manifest: "/site.webmanifest",
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION !== undefined &&
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION !== "" && {
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
    }),
};

export function createMetadata({
  title,
  absoluteTitle,
  description,
  path = "/",
  noIndex = false,
}: {
  /** Page title, rendered through the `%s | Ingeniería Simple` template. */
  title?: string;
  /** Full title used verbatim, bypassing the template (home page). */
  absoluteTitle?: string;
  description?: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const socialTitle = absoluteTitle ?? title ?? siteConfig.name;
  const socialDescription = description ?? siteConfig.description;

  // Next.js merges metadata per top-level key: a page's `openGraph` or
  // `twitter` object replaces the layout's one wholesale, so the shared
  // fields (locale, siteName, card…) must be restated here on every page.
  return {
    title: absoluteTitle !== undefined ? { absolute: absoluteTitle } : title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      ...baseMetadata.openGraph,
      title: socialTitle,
      description: socialDescription,
      url,
    },
    twitter: {
      ...baseMetadata.twitter,
      title: socialTitle,
      description: socialDescription,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
