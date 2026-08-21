import { CornerPlus } from "@/components/corner-plus";
import type { Service } from "@/lib/services";
import type { ReactNode } from "react";

export function ServicioProcess({ service }: { service: Service }): ReactNode {
  const steps = service.page.process;

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <p className="text-sm font-medium text-muted-foreground">
          Cómo trabajamos
        </p>
        <h2 className="mt-4 text-balance font-serif text-3xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          Un proceso claro,{" "}
          <span className="font-sans font-semibold tracking-tight">
            sin sorpresas
          </span>
        </h2>
      </div>

      <div className="relative border-t border-border">
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />

        <ol className="grid sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="border-b border-dotted border-border px-1 py-8 sm:px-6 lg:border-b-0 lg:py-10 lg:[&:not(:first-child)]:border-l"
            >
              <p className="text-xs font-medium text-primary">
                Paso {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 text-base font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </li>
          ))}
        </ol>
      </div>

      {/* Stack used to deliver this service */}
      <div className="mt-14 flex flex-col items-center gap-5 border-t border-dotted border-border pt-10">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Herramientas que usamos
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-2.5">
          {service.page.tools.map((tool) => (
            <li
              key={tool}
              className="border border-dotted border-border px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
            >
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
