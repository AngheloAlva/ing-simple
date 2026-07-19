import { CornerPlus } from "@/components/corner-plus";
import { EyeOff, Layers, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Item = {
  icon: LucideIcon;
  title: string;
  description: string;
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
        {/* Left — title + description */}
        <div className="lg:pt-6">
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
            preservás la confidencialidad de tu operación sin perder la
            fidelidad de lo que se construyó.
          </p>
        </div>

        {/* Right — items stacked vertically inside the cross-cornered panel */}
        <div className="relative border border-border">
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
                <div className="flex items-start gap-4">
                  <span className="inline-grid h-10 w-10 shrink-0 place-items-center border border-border text-foreground">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
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
