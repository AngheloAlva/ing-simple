import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import {
  SERVICE_INCLUDES_VARIANTS,
  SERVICE_MODULES,
} from "@/components/servicios/modules/registry";
import { ServicioCases } from "@/components/servicios/related-cases";
import { ServicioFaq } from "@/components/servicios/service-faq";
import { ServicioHero } from "@/components/servicios/hero";
import { ServicioIncludes } from "@/components/servicios/includes";
import { ServicioProblem } from "@/components/servicios/problem";
import { ServicioProcess } from "@/components/servicios/process";
import { createMetadata, siteConfig } from "@/lib/metadata";
import { InView } from "@/lib/motion";
import { getServiceBySlug, SERVICES, type Service } from "@/lib/services";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams(): { slug: string }[] {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return createMetadata({
      title: "Servicio no encontrado",
      path: `/servicios/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: service.page.seoTitle,
    description: service.page.seoDescription,
    path: service.href,
  });
}

function buildJsonLd(service: Service): object[] {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: service.title,
      provider: {
        "@type": "Organization",
        name: "Ingeniería Simple SpA",
        url: siteConfig.url,
      },
      areaServed: { "@type": "Country", name: "Chile" },
      description: service.page.seoDescription,
      url: `${siteConfig.url}${service.href}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Inicio",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: service.shortName,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: service.page.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];
}

export default async function ServicePage({
  params,
}: PageProps): Promise<ReactNode> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const Module = SERVICE_MODULES[service.slug];

  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD from our own static data; "<" is escaped so no copy edit
        // can ever close the script tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(service)).replace(/</g, "\\u003c"),
        }}
      />
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="flex-1">
        <ServicioHero
          number={service.number}
          title={service.title}
          shortName={service.shortName}
          href={service.href}
          page={service.page}
        />
        <InView>
          <ServicioProblem service={service} />
        </InView>
        {Module ? (
          <InView>
            <Module />
          </InView>
        ) : null}
        <InView>
          <ServicioIncludes
            service={service}
            variant={SERVICE_INCLUDES_VARIANTS[service.slug]}
          />
        </InView>
        <InView>
          <ServicioProcess service={service} />
        </InView>
        <InView>
          <ServicioCases service={service} />
        </InView>
        <InView>
          <ServicioFaq
            serviceName={service.shortName}
            items={service.page.faq}
          />
        </InView>
        <FinalCta />
      </main>
      <InView>
        <Footer />
      </InView>
    </>
  );
}
