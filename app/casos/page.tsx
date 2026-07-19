import { CasosConfidentiality } from "@/components/casos-confidentiality";
import { CasosGrid } from "@/components/casos-grid";
import { CasosHero } from "@/components/casos-hero";
import { CasosStats } from "@/components/casos-stats";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { InView } from "@/lib/motion";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Casos de estudio",
  description:
    "Plataformas a medida en producción real: OTC 360, Busanc, Bimakers y más. Cada caso con su problema, solución, stack técnico y resultados.",
  path: "/casos",
});

export default function CasosPage(): ReactNode {
  return (
    <>
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="flex-1">
        <CasosHero />
        <InView>
          <CasosStats />
        </InView>
        <InView>
          <CasosGrid />
        </InView>
        <InView>
          <CasosConfidentiality />
        </InView>
        <FinalCta />
      </main>
      <InView>
        <Footer />
      </InView>
    </>
  );
}
