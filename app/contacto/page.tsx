import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ContactoSection } from "@/components/contacto-section";
import { InView } from "@/lib/motion";
import { createMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = createMetadata({
  title: "Contacto",
  description:
    "Contáctanos para transformar tu negocio con soluciones digitales simples y efectivas. Desarrollo web, reportabilidad, automatizaciones y capacitaciones.",
  path: "/contacto",
});

export default function ContactoPage(): ReactNode {
  return (
    <>
      <span id="top" className="sr-only" />
      <Nav />
      <main id="main-content" className="flex-1">
        <ContactoSection />
      </main>
      <InView>
        <Footer />
      </InView>
    </>
  );
}
