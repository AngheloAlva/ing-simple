import { CornerPlus } from "@/components/corner-plus";
import { IllustrationPlate } from "@/components/illustration-plate";
import { EyeOff, Layers, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Item = {
  icon: LucideIcon;
  title: string;
  description: string;
  /** Ink plate for this item. Optional only while the remaining two are still
   *  being generated; when all three land the icon branch collapses and this
   *  becomes required. */
  image?: string;
  imageAlt?: string;
};

const ITEMS: Item[] = [
  {
    icon: ShieldCheck,
    title: "Confidencialidad primero",
    description:
      "Muchos de estos sistemas son internos y están bajo acuerdo. No exponemos datos, usuarios ni las pantallas productivas reales de nuestros clientes.",
  },
  {
    icon: Layers,
    title: "Mockups fieles a lo real",
    description:
      "Reconstruimos a mano la interfaz de cada proyecto, fiel a la estructura, los módulos y los flujos que efectivamente construimos y pusimos en producción.",
    image: "/img/cases/faithful-mockups.png",
    imageAlt: "Una mano completa a lápiz el trazado de una pantalla sobre una hoja",
  },
  {
    icon: EyeOff,
    title: "Sin datos sensibles",
    description:
      "Lo que ves es representativo: los nombres y números son ilustrativos. La arquitectura y las decisiones técnicas detrás de cada caso, en cambio, son reales.",
  },
];

export function CasosConfidentiality(): ReactNode {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Left — title + description. Pinned on lg: the right column carries
            three plates and runs far past this text. */}
        <div className="lg:sticky lg:top-24 lg:pt-6">
          <p className="text-sm font-medium text-muted-foreground">
            Cómo mostramos nuestro trabajo
          </p>
          <h2 className="mt-5 text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
            Proyectos privados, mostrados con{" "}
            <span className="font-sans font-semibold tracking-tight">
              respeto
            </span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Cuando no podemos mostrar la pantalla real, la reconstruimos. Así
            preservas la confidencialidad de tu operación sin perder la
            fidelidad de lo que se construyó.
          </p>
        </div>

        {/* Right — items stacked vertically inside the cross-cornered panel */}
        <div className="relative rounded-sm border border-border">
          <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
          <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
          <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
          <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`relative px-6 py-7 sm:px-8 sm:py-8 ${
                  i > 0 ? "border-t border-border" : ""
                }`}
              >
                {i > 0 && (
                  <>
                    <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
                    <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
                  </>
                )}
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                  {item.image ? (
                    <IllustrationPlate
                      src={item.image}
                      alt={item.imageAlt ?? ""}
                      sizes="(min-width: 640px) 208px, 92vw"
                      frame="border-border aspect-[16/9] w-full shrink-0 border sm:aspect-[4/3] sm:w-52"
                    />
                  ) : (
                    <span className="inline-grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border text-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
