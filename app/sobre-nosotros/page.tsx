import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FinalCta } from "@/components/final-cta";
import { JsonLd } from "@/components/json-ld";
import { NosotrosStory } from "@/components/nosotros/story";
import { NosotrosMissionVision } from "@/components/nosotros/mission-vision";
import { NosotrosValues } from "@/components/nosotros/values";
import { NosotrosStack } from "@/components/nosotros/stack";
import { InView } from "@/lib/motion";
import { createMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Sobre nosotros",
  description:
    "Cada servicio de Ingeniería Simple nació de un problema real de un cliente. Nuestra historia, misión, valores y las herramientas con las que construimos.",
  path: "/sobre-nosotros",
});

export default function SobreNosotrosPage(): ReactNode {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", path: "/" },
          { name: "Sobre nosotros", path: "/sobre-nosotros" },
        ])}
      />
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="flex-1">
        <NosotrosStory />
        <InView>
          <NosotrosMissionVision />
        </InView>
        <InView>
          <NosotrosValues />
        </InView>
        <InView>
          <NosotrosStack />
        </InView>
        <FinalCta />
      </main>
      <InView>
        <Footer />
      </InView>
    </>
  );
}
