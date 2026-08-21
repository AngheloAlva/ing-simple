import type { IncludesVariant } from "@/components/servicios/modules/registry";
import type { Service, ServiceInclude } from "@/lib/services";
import { Zap } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

const PANEL_RADIUS = "2px";

/** Deterministic decorative bar heights per card (no runtime randomness). */
const SPARK_SETS = [
  [40, 65, 50, 80, 60, 90],
  [30, 55, 70, 45, 85, 65],
  [60, 40, 75, 55, 90, 70],
  [50, 80, 45, 70, 55, 85],
  [70, 50, 85, 60, 40, 75],
  [45, 70, 55, 90, 65, 80],
];

/** Reportabilidad — KPI-style dashboard tiles with a decorative mini chart. */
function DashboardLayout({ items }: { items: ServiceInclude[] }): ReactNode {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const bars = SPARK_SETS[i % SPARK_SETS.length] ?? [];
        return (
          <article
            key={item.title}
            className="rounded-lg border border-border/60 bg-background p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div
                className="flex h-6 items-end gap-[3px] text-primary"
                aria-hidden="true"
              >
                {bars.map((height, j) => (
                  <span
                    key={j}
                    className="w-1 rounded-t-sm bg-current"
                    style={{ height: `${height}%`, opacity: 0.35 + j * 0.12 }}
                  />
                ))}
              </div>
            </div>
            <h3 className="mt-3 text-base font-semibold tracking-tight">
              {item.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </article>
        );
      })}
    </div>
  );
}

/** Capacitaciones — a course curriculum: full-width numbered module rows. */
function SyllabusLayout({ items }: { items: ServiceInclude[] }): ReactNode {
  return (
    <div className="mx-auto max-w-4xl border-t border-border">
      {items.map((item, i) => (
        <article
          key={item.title}
          className="grid gap-2 border-b border-dotted border-border py-6 sm:grid-cols-[110px_1fr_1.2fr] sm:items-baseline sm:gap-6 sm:py-7"
        >
          <p className="text-xs font-medium uppercase tracking-widest text-primary">
            Módulo {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="text-base font-semibold tracking-tight">
            {item.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.desc}
          </p>
        </article>
      ))}
    </div>
  );
}

/** Soluciones Web — every item lives inside a mini browser window. */
function BrowserLayout({ items }: { items: ServiceInclude[] }): ReactNode {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <article
          key={item.title}
          className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-lg shadow-black/[0.04]"
        >
          <div className="flex items-center gap-1.5 border-b border-border/60 px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-border" />
            <span className="h-2 w-2 rounded-full bg-primary/60" />
            <span className="ml-2 truncate rounded bg-muted/60 px-2 py-0.5 text-[10px] text-muted-foreground">
              ingsimple.cl/{item.title.toLowerCase().split(" ")[0]}
            </span>
          </div>
          <div className="p-6">
            <h3 className="text-base font-semibold tracking-tight">
              {item.title}
            </h3>
            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}

/** Automatizaciones — a connected pipeline of steps running downward. */
function FlowLayout({ items }: { items: ServiceInclude[] }): ReactNode {
  return (
    <div className="mx-auto max-w-3xl">
      <ol className="relative border-l border-dotted border-border pl-8 sm:pl-10">
        {items.map((item, i) => (
          <li
            key={item.title}
            className={`relative ${i < items.length - 1 ? "pb-9" : ""}`}
          >
            <span
              className="absolute -left-8 top-0.5 flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full border border-primary/50 bg-background text-primary sm:-left-10"
              aria-hidden="true"
            >
              <Zap className="h-3 w-3" strokeWidth={2} />
            </span>
            <div className="sm:flex sm:items-baseline sm:gap-6">
              <h3 className="text-base font-semibold tracking-tight sm:w-64 sm:shrink-0">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:mt-0">
                {item.desc}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

const LAYOUTS: Record<
  IncludesVariant,
  ({ items }: { items: ServiceInclude[] }) => ReactNode
> = {
  dashboard: DashboardLayout,
  syllabus: SyllabusLayout,
  browser: BrowserLayout,
  flow: FlowLayout,
};

/** Fallback for slugs without a registered variant: the cut-panel mosaic. */
function MosaicLayout({ items }: { items: ServiceInclude[] }): ReactNode {
  const clip = { borderRadius: PANEL_RADIUS } as CSSProperties;
  return (
    <div className="bg-border p-px" style={clip}>
      <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-3" style={clip}>
        {items.map((item, i) => (
          <article key={item.title} className="bg-background p-7 sm:p-8 lg:p-10">
            <p className="text-xs font-medium text-primary">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-3 text-base font-semibold tracking-tight">
              {item.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ServicioIncludes({
  service,
  variant,
}: {
  service: Service;
  variant?: IncludesVariant | undefined;
}): ReactNode {
  const Layout = variant ? LAYOUTS[variant] : MosaicLayout;

  return (
    <section
      id="incluye"
      className="mx-auto max-w-[1440px] scroll-mt-24 px-5 pb-24 sm:px-8 sm:pb-32 lg:px-10"
    >
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
        <p className="text-sm font-medium text-muted-foreground">Qué incluye</p>
        <h2 className="mt-4 text-balance font-serif text-3xl font-normal leading-[1.1] tracking-[-0.01em] sm:text-4xl lg:text-[2.75rem]">
          Todo lo que cubre{" "}
          <span className="font-sans font-semibold tracking-tight">
            {service.shortName.toLowerCase()}
          </span>
        </h2>
      </div>

      <Layout items={service.page.includes} />
    </section>
  );
}
