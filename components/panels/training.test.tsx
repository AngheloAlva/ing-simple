import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ENTRANCE_STAGGER, PanelTraining } from "./training";

describe("PanelTraining", () => {
  const html = renderToStaticMarkup(<PanelTraining />);

  it("retains one course and all course metadata", () => {
    for (const label of [
      "Power BI de básico a avanzado", "Equipo de control de gestión",
      "Online en vivo", "4 semanas · 8 sesiones", "Básico a avanzado",
      "Instructor IngSimple",
    ]) {
      expect(html.split(label).length - 1).toBe(1);
    }
  });

  it("leads with the current lesson and a coherent fictional practical comparison", () => {
    expect(html).toContain("Lección actual");
    expect(html).toContain("Time intelligence");
    expect(html).toContain("Datos ficticios");
    expect(html).toContain("Abril");
    expect(html).toContain("Mayo");
    expect(html).toContain("10.000");
    expect(html).toContain("12.000");
    expect(html).toContain("+20%");
    expect(html).toContain("(12.000 − 10.000) / 10.000");
    expect(html.indexOf("Time intelligence")).toBeLessThan(html.indexOf("63%"));
    expect(html.indexOf("Time intelligence")).toBeLessThan(html.indexOf("Conectar y transformar datos"));
    expect(html).not.toContain("<button");
    expect(html).not.toContain("tabindex");
  });

  it("keeps derived semantic progress adjacent to the certificate before the curriculum", () => {
    expect(html.split("63%").length - 1).toBe(2);
    expect(html).toContain("5 de 8 lecciones completadas");
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="5"');
    expect(html).toContain('aria-valuemax="8"');
    expect(html).toContain("faltan 3");
    expect(html.indexOf("63%")).toBeLessThan(html.indexOf("Certificado IngSimple"));
    expect(html.indexOf("Certificado IngSimple")).toBeLessThan(html.indexOf("Conectar y transformar datos"));
  });

  it("retains a quiet four-module overview with coherent status counts", () => {
    for (const label of ["Conectar y transformar datos", "Modelado de datos", "Medidas con DAX", "Dashboards y publicación"]) {
      expect(html.split(label).length - 1).toBe(1);
    }
    expect(html.split("Completado").length - 1).toBe(2);
    expect(html.split("En curso").length - 1).toBe(2);
    expect(html.split("Pendiente").length - 1).toBe(1);
  });

  it("allows titles and metadata to reflow rather than truncating them", () => {
    expect(html).not.toContain("truncate");
    expect(html).not.toContain("whitespace-nowrap");
    expect(html).toContain("flex-wrap");
    expect(html).toContain("min-w-0");
    expect(html).not.toContain("overflow-hidden p-4");
  });

  it("preserves identity and avoids the previous failure modes", () => {
    for (const label of ["Excel avanzado", "Power Apps", "Bloqueado", "recién", "Ruta de capacitación", "rounded-sm", "rounded-xl"]) {
      expect(html).not.toContain(label);
    }
    expect(html).toContain("rounded-lg");
    expect(html).toContain("tabular-nums");
    expect(html).toContain("border-brand-green/30");
    expect(html).toContain("bg-brand-green/10");
    const beforeCertificate = html.slice(0, html.indexOf("border-brand-green/30"));
    const afterCertificate = html.slice(html.indexOf("Módulos del curso"));
    expect(beforeCertificate).not.toContain("brand-green");
    expect(afterCertificate).not.toContain("brand-green");
  });

  it("allocates desktop height to the practical preview without imposing a mobile minimum", () => {
    // Structural regression only: actual frame fit remains a browser check.
    expect(html).toContain("lg:flex-1");
    expect(html).toContain("lg:min-h-0");
    expect(html).toContain("lg:justify-center");
    expect(html).not.toContain("min-h-[");
    expect(html).toContain("space-y-1 lg:space-y-2");
    expect(html).toContain("pb-1 lg:pb-2");
  });

  it("preserves the shared stagger entrance recipe", () => {
    expect(html.match(/opacity:0;transform:translateY\(12px\)/g) ?? []).toHaveLength(7);
    expect(ENTRANCE_STAGGER).toBeGreaterThanOrEqual(0.05);
    expect(ENTRANCE_STAGGER).toBeLessThanOrEqual(0.08);
    expect(6 * ENTRANCE_STAGGER).toBeLessThanOrEqual(0.6);
  });
});
