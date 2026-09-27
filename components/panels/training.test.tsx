import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ENTRANCE_STAGGER, PanelTraining } from "./training";

describe("PanelTraining", () => {
  const html = renderToStaticMarkup(<PanelTraining />);

  it("presents one concrete course with identity, progress, timeline and payoff", () => {
    // Course identity: name plus modality, duration, level and instructor.
    for (const label of [
      "Power BI de básico a avanzado",
      "Equipo de control de gestión",
      "Online en vivo",
      "4 semanas · 8 sesiones",
      "Básico a avanzado",
      "Instructor IngSimple",
    ]) {
      expect(html.split(label).length - 1, `expected exactly one "${label}"`).toBe(1);
    }

    // Focal element: overall progress toward completion, derived from data.
    // "63%" appears twice: once as the visible figure and once as the bar's
    // inline width, which must agree with it.
    expect(html.split("63%").length - 1).toBe(2);
    expect(html).toContain("5 de 8 lecciones completadas");

    // Module/lesson breakdown, each item exactly once.
    for (const label of [
      "Conectar y transformar datos",
      "Modelado de datos",
      "Medidas con DAX",
      "Dashboards y publicación",
      "Origen de datos y Power Query",
      "Consultas con Power Query",
      "Relaciones y tablas de fechas",
      "Esquema estrella",
      "Medidas y KPIs",
      "Time intelligence",
      "Tableros interactivos",
      "Publicación y actualización automática",
    ]) {
      expect(html.split(label).length - 1, `expected exactly one "${label}"`).toBe(1);
    }

    // Per-item status: two modules completed, one in progress, one pending;
    // the current lesson carries its own "En curso" badge.
    expect(html.split("Completado").length - 1).toBe(2);
    expect(html.split("En curso").length - 1).toBe(2);
    expect(html.split("Pendiente").length - 1).toBe(1);

    // Completion outcome: the certificate, stated as the payoff.
    expect(html.split("Certificado IngSimple").length - 1).toBe(1);
    expect(html).toContain("faltan 3");
  });

  it("orders content by visual priority: identity, progress, timeline, certificate", () => {
    const indexOf = (needle: string): number => {
      const position = html.indexOf(needle);
      expect(position, `missing "${needle}"`).toBeGreaterThan(-1);
      return position;
    };

    const identity = indexOf("Power BI de básico a avanzado");
    const progress = indexOf("63%");
    const timeline = indexOf("Conectar y transformar datos");
    const currentLesson = indexOf("Time intelligence");
    const certificate = indexOf("Certificado IngSimple");

    expect(identity).toBeLessThan(progress);
    expect(progress).toBeLessThan(timeline);
    expect(timeline).toBeLessThan(currentLesson);
    expect(currentLesson).toBeLessThan(certificate);
  });

  it("reserves brand green for the certificate strip alone", () => {
    // The first green class must belong to the certificate strip's wrapper,
    // which sits after the entire module timeline — so identity, progress
    // bar and timeline carry no green at all.
    const lastTimelineItem = html.indexOf("Publicación y actualización automática");
    const firstGreen = html.indexOf("brand-green");
    expect(firstGreen).toBeGreaterThan(-1);
    expect(firstGreen).toBeGreaterThan(lastTimelineItem);
    expect(html).toContain("border-brand-green/30");
    expect(html).toContain("bg-brand-green/10");
  });

  it("fits the 520px desktop body: the timeline uses tightened vertical rhythm", () => {
    // The timeline must fit the 520px frame body without clipping: module
    // separators, the current-lesson row and lesson gaps all run one step
    // tighter than the version that clipped the last lesson row.
    expect(html).toContain("pb-2.5");
    expect(html).not.toContain("pb-3");
    expect(html).not.toContain("py-1.5");
    expect(html).toContain("mt-0.5");
  });

  it("avoids the previous panel's failure modes", () => {
    // No invented course catalogue, no "Bloqueado · 0 %", no repeated "recién".
    expect(html).not.toContain("Excel avanzado");
    expect(html).not.toContain("Power Apps");
    expect(html).not.toContain("Bloqueado");
    expect(html).not.toContain("recién");
    expect(html).not.toContain("Ruta de capacitación");

    // Quiet, consistent borders: one card radius family, tabular numerals.
    expect(html).not.toContain("rounded-sm");
    expect(html).not.toContain("rounded-xl");
    expect(html).toContain("rounded-lg");
    expect(html).toContain("tabular-nums");
  });

  it("staggers one entrance chain that ends on the certificate", () => {
    // Seven items mount hidden with the recipe's lift: header, progress hero,
    // four modules and the certificate strip.
    expect(html.match(/opacity:0;transform:translateY\(20px\)/g) ?? []).toHaveLength(7);

    // The chain's blocks exist in entrance order: header + progress hero,
    // then the four modules, the certificate strip last (order is asserted
    // in detail by the visual-priority test above).
    expect(html.indexOf("Power BI de básico a avanzado")).toBeLessThan(html.indexOf("63%"));
    expect(html.indexOf("63%")).toBeLessThan(html.indexOf("Conectar y transformar datos"));
    expect(html.indexOf("Publicación y actualización automática")).toBeLessThan(
      html.indexOf("Certificado IngSimple"),
    );

    // Subtle stagger within the ~6 s budget: the certificate (7th item of the
    // single chain) begins at 6 × ENTRANCE_STAGGER.
    expect(ENTRANCE_STAGGER).toBeGreaterThanOrEqual(0.05);
    expect(ENTRANCE_STAGGER).toBeLessThanOrEqual(0.08);
    expect(6 * ENTRANCE_STAGGER).toBeLessThanOrEqual(0.6);
  });
});
