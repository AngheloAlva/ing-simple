import { readFileSync } from "node:fs";
import { join } from "node:path";
import { oklchToHex, serviceAccentFor } from "@/lib/service-accent";
import { getServiceBySlug, SERVICES } from "@/lib/services";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";

export const alt = "Ingeniería Simple — Soluciones simples para un mundo digital complejo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function logoDataUri(): string {
  const svg = readFileSync(join(process.cwd(), "public", "logo.svg"), "utf-8");
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function generateStaticParams(): { slug: string }[] {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

interface ImageProps {
  params: Promise<{ slug: string }>;
}

// Same layout as the site-wide OG image (`app/opengraph-image.tsx`), with the
// accent bar and headline swapped for the service's own colour and promise.
// `ImageResponse` (Satori) can't read CSS custom properties or parse
// `oklch()`, so the bar uses `oklchToHex` on the same light `brand-blue`
// value the `[data-service]` override in `app/globals.css` defines — the
// surface role, since the bar is a decorative fill, not text.
export default async function ServiceOpengraphImage({ params }: ImageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const accentHex = oklchToHex(serviceAccentFor(service.slug).light.brandBlue);
  const logo = logoDataUri();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          padding: "64px 72px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex" }}>
          <img src={logo} alt="" width={220} height={162} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              width: 120,
              height: 4,
              backgroundColor: accentHex,
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 600,
              color: "#0a0a0a",
              lineHeight: 1.15,
              maxWidth: 980,
            }}
          >
            {service.page.pageTitle}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#4b5563",
          }}
        >
          ingenieriasimple.cl · {service.title}
        </div>
      </div>
    ),
    { ...size },
  );
}
