import { CornerPlus } from "@/components/corner-plus";
import type { Service } from "@/lib/services";
import type { ReactNode } from "react";

export function ServicioProblem({ service }: { service: Service }): ReactNode {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="relative grid border-y border-border lg:grid-cols-[1.1fr_0.9fr]">
        <CornerPlus className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="right-0 top-0 translate-x-1/2 -translate-y-1/2" />
        <CornerPlus className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
        <CornerPlus className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

        {/* Left: the pain this service removes */}
        <div className="border-b border-border py-10 lg:border-b-0 lg:border-r lg:py-16 lg:pr-14">
          <p className="text-sm font-medium text-muted-foreground">
            El problema
          </p>
          <h2 className="mt-4 max-w-lg text-balance font-serif text-3xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-4xl">
            Te suena, ¿verdad?
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {service.page.problem}
          </p>
        </div>

        {/* Right: who should recognize themselves here */}
        <div className="relative py-10 lg:py-16 lg:pl-14">
          <CornerPlus className="left-0 top-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block" />
          <CornerPlus className="bottom-0 left-0 hidden -translate-x-1/2 translate-y-1/2 lg:block" />

          <h3 className="text-sm font-semibold tracking-tight">
            ¿Para quién es este servicio?
          </h3>
          <ul className="mt-6 space-y-5">
            {service.page.audience.map((profile) => (
              <li key={profile} className="flex items-start gap-3">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary"
                >
                  <path
                    d="M12 4v16M4 12h16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm leading-relaxed text-muted-foreground">
                  {profile}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
