import { CutButton } from "@/components/cut-button";
import { portfolioProjects } from "@/lib/portfolio-data";
import type { Service } from "@/lib/services";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

const PANEL_RADIUS = "2px";

export function ServicioCases({ service }: { service: Service }): ReactNode {
  const clip = { borderRadius: PANEL_RADIUS } as CSSProperties;

  const related = portfolioProjects
    .filter(
      (project) =>
        project.category === service.page.caseCategory &&
        project.isFlagship &&
        project.caseStudy
    )
    .slice(0, 3);

  return (
    <section className="mx-auto max-w-[1440px] px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10">
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <p className="text-sm font-medium text-muted-foreground">
          Casos relacionados
        </p>
        <h2 className="mt-4 text-balance font-serif text-3xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          {related.length > 0 ? (
            <>
              Esto ya está{" "}
              <span className="font-sans font-semibold tracking-tight">
                funcionando en producción
              </span>
            </>
          ) : (
            <>
              Tu proyecto podría ser{" "}
              <span className="font-sans font-semibold tracking-tight">
                el primer caso publicado
              </span>
            </>
          )}
        </h2>
      </div>

      {related.length > 0 ? (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((project) => (
              <a
                key={project.id}
                href={`/casos/${project.id}`}
                className="focus-ring group block bg-border p-px transition-colors hover:bg-primary/40"
                style={clip}
              >
                <article
                  className="flex h-full flex-col bg-background p-7 sm:p-8"
                  style={clip}
                >
                  <p className="text-xs font-medium text-primary">
                    Caso de estudio
                  </p>
                  <h3 className="mt-3 flex items-start justify-between gap-3 text-lg font-semibold tracking-tight">
                    {project.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                    />
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {project.shortDescription}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <li
                        key={tech}
                        className="border border-dotted border-border px-2.5 py-1 text-[11px] font-medium text-muted-foreground"
                      >
                        {tech}
                      </li>
                    ))}
                  </ul>
                </article>
              </a>
            ))}
          </div>
          <div className="mt-10 flex justify-center">
            <CutButton variant="outline" icon="arrow" href="/casos">
              Ver todos los casos
            </CutButton>
          </div>
        </>
      ) : (
        <div className="bg-border p-px" style={clip}>
          <div
            className="flex flex-col items-center bg-background px-6 py-14 text-center sm:py-16"
            style={clip}
          >
            <p className="max-w-md text-balance text-base font-medium tracking-tight sm:text-lg">
              Estamos documentando nuestros casos de{" "}
              {service.shortName.toLowerCase()}.
            </p>
            <p className="mt-3 max-w-md text-balance text-sm leading-relaxed text-muted-foreground">
              Mientras tanto, cuéntanos tu situación: en una conversación de 30
              minutos te decimos qué haríamos en tu caso y con qué alcance.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <CutButton variant="solid" icon="arrow" href="/contacto">
                Cuéntanos tu caso
              </CutButton>
              <CutButton variant="outline" href="/casos">
                Ver casos de otras áreas
              </CutButton>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
