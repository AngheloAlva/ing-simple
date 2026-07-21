import { CurtainImage } from "@/components/curtain-image";
import { Kicker } from "@/components/corner-plus";
import {
  DUOTONE_BASE,
  DUOTONE_CONTAINER,
  DuotoneOverlay,
} from "@/components/duotone";
import type { ReactNode } from "react";

const PROBLEMS: { title: string; body: string }[] = [
  {
    title: "Datos dispersos",
    body: "La información vive repartida en planillas y sistemas que no se hablan entre sí. Sin una vista clara, las decisiones se toman a ciegas.",
  },
  {
    title: "Procesos manuales",
    body: "Tareas repetitivas que consumen horas del equipo y deberían estar automatizadas, escalando errores en lugar de resultados.",
  },
];

const CUT_CLIP =
  "polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)";

export function Challenge(): ReactNode {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        <div
          className={`relative aspect-[4/3] w-full overflow-hidden sm:aspect-square lg:order-2 ${DUOTONE_CONTAINER}`}
          style={{ clipPath: CUT_CLIP }}
        >
          <CurtainImage
            src="/value-prop.jpg"
            alt="Procesos y datos dispersos en una organización"
            className={`absolute inset-0 h-full w-full ${DUOTONE_BASE}`}
          />
          <DuotoneOverlay />
        </div>

        <div className="lg:order-1">
          <Kicker>El desafío</Kicker>
          <h2 className="mt-5 max-w-2xl text-balance font-serif text-3xl font-normal leading-[1.12] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
            Digitalizar tu negocio te da una ventaja real,{" "}
            <span className="font-sans font-semibold tracking-tight">
              pero cada herramienta suelta
            </span>{" "}
            suma otra{" "}
            <span className="font-sans font-semibold tracking-tight">
              isla que nadie conecta
            </span>
          </h2>

          <dl className="mt-10">
            {PROBLEMS.map((item) => (
              <div
                key={item.title}
                className="border-t border-dotted border-border py-5"
              >
                <dt className="text-sm font-semibold tracking-tight">
                  {item.title}
                </dt>
                <dd className="mt-1.5 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
