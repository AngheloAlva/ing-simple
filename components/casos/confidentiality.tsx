import { CornerPlus } from "@/components/corner-plus";
import { IllustrationPlate } from "@/components/illustration-plate";
import type { ReactNode } from "react";

type Item = {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

const ITEMS: Item[] = [
  {
    title: "Confidencialidad primero",
    description:
      "Muchos de estos sistemas son internos y están bajo acuerdo. No exponemos datos, usuarios ni las pantallas productivas reales de nuestros clientes.",
    image: "/img/cases/confidentiality.png",
    imageAlt:
      "Una carpeta sellada con una banda negra y una pila de hojas boca abajo sobre el escritorio",
  },
  {
    title: "Mockups fieles a lo real",
    description:
      "Reconstruimos a mano la interfaz de cada proyecto, fiel a la estructura, los módulos y los flujos que efectivamente construimos y pusimos en producción.",
    image: "/img/cases/faithful-mockups.png",
    imageAlt: "Una mano completa a lápiz el trazado de una pantalla sobre una hoja",
  },
  {
    title: "Sin datos sensibles",
    description:
      "Lo que ves es representativo: los nombres y números son ilustrativos. La arquitectura y las decisiones técnicas detrás de cada caso, en cambio, son reales.",
    image: "/img/cases/no-sensitive-data.png",
    imageAlt:
      "Una hoja donde los renglones de texto se convierten en bloques vacíos que salen de la página",
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
            return (
              <div
                key={item.title}
                className={`relative ${i > 0 ? "border-t border-border" : ""}`}
              >
                {i > 0 && (
                  <>
                    <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
                    <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
                  </>
                )}

                {/* The plate runs the full inner width of the panel and carries no
                    padding of its own: it is the item's image, not an inset
                    thumbnail. Only the first one needs the panel's top radius,
                    because every other plate meets a divider line.

                    `object-cover`, not the component's default `object-contain`:
                    the assets for this family are generated wide, at the plate's
                    own 3:2, so there is no letterbox to preserve. See the task
                    document — the "square or 4:3, never 16:9" constraint of the
                    other two families existed because their asset had to survive
                    both a 16/9 frame and a square nav tile, and that reason does
                    not hold here. */}
                <IllustrationPlate
                  src={item.image}
                  alt={item.imageAlt}
                  sizes="(min-width: 1024px) 45vw, 92vw"
                  className="object-cover"
                  frame={`aspect-[3/2] w-full${i === 0 ? " rounded-t-sm" : ""}`}
                />

                <div className="px-6 py-7 sm:px-8 sm:py-8">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
