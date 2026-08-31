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
  name: "IngSimple",
  description: "Soluciones simples para un mundo digital complejo",
  url: resolveSiteUrl(),
  ogImage: "/og-image.png",
  creator: "@ingsimple",
  authors: [
    {
      name: "IngSimple",
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
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: siteConfig.creator,
  },
  manifest: "/site.webmanifest",
};

export function createMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image ?? siteConfig.ogImage;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: title ?? siteConfig.name,
      description: description ?? siteConfig.description,
      url,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title ?? siteConfig.name,
        },
      ],
    },
    twitter: {
      title: title ?? siteConfig.name,
      description: description ?? siteConfig.description,
      images: [ogImage],
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
