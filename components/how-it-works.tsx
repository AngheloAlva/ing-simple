import { AsciiIcon, type Shape } from "@/components/ascii-icon";
import { CornerPlus } from "@/components/corner-plus";
import type { ReactNode } from "react";

type Step = {
  shape: Shape;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    shape: "scan",
    title: "Diagnóstico",
    description:
      "Analizamos tus procesos actuales para identificar oportunidades de mejora y digitalización.",
  },
  {
    shape: "clipboard",
    title: "Propuesta",
    description:
      "Diseñamos una solución a medida adaptada a tus necesidades, presupuesto y objetivos.",
  },
  {
    shape: "bolt",
    title: "Implementación",
    description:
      "Desarrollamos e implementamos la solución con acompañamiento continuo hasta lograr resultados.",
  },
];

export function HowItWorks(): ReactNode {
  return (
    <section className="mx-auto max-w-360 px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="max-w-2xl">
        <h2 className="text-balance text-3xl font-semibold leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.75rem]">
          ¿Cómo trabajamos?
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Un proceso simple y transparente, de principio a fin.
        </p>
      </div>

      <div className="relative mt-8 border border-border lg:mt-10">
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        <ol className="grid divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STEPS.map((step, index) => {
            return (
              <li
                key={step.title}
                className="relative overflow-hidden p-6 sm:p-8"
              >
                <AsciiIcon
                  shape={step.shape}
                  cols={26}
                  fill
                  className="pointer-events-none absolute right-0 top-0 aspect-square h-[90%] opacity-25"
                />

                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="text-4xl font-semibold tracking-tight text-foreground/15 tabular-nums sm:text-5xl"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3 className="mt-5 text-lg font-semibold tracking-tight">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
