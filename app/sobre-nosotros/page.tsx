import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FinalCta } from "@/components/final-cta";
import { NosotrosStory } from "@/components/nosotros/story";
import { NosotrosMissionVision } from "@/components/nosotros/mission-vision";
import { NosotrosValues } from "@/components/nosotros/values";
import { NosotrosStack } from "@/components/nosotros/stack";
import { InView } from "@/lib/motion";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Sobre Nosotros",
  description:
    "Cada servicio de IngSimple nació de un problema real de un cliente. Nuestra historia, misión, valores y las herramientas con las que construimos.",
  path: "/sobre-nosotros",
});

export default function SobreNosotrosPage(): ReactNode {
  return (
    <>
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
