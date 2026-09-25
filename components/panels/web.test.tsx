import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PanelWeb } from "./web";

describe("Web requests showcase", () => {
  it("keeps the desktop table and compact records in the same scrolling region", () => {
    const html = renderToStaticMarkup(<PanelWeb />);
    const table = html.match(/<table\b[\s\S]*?<\/table>/)?.[0];
    const cards = html.match(/<div class="divide-y divide-border\/60 @min-\[760px\]:hidden"[^>]*>[\s\S]*?<\/article>\s*<\/div>/)?.[0];

    expect(table).toBeDefined();
    expect(cards).toBeDefined();
    expect(html).toContain('class="min-h-0 flex-1 overflow-y-auto" data-lenis-prevent="true"');
    expect(table).toContain("@min-[760px]:table");
    expect(cards).toContain("@min-[760px]:hidden");
    for (const label of ["Nombre del Proyecto", "Cliente", "Estado SC", "Estado Componentes", "Estado del Proyecto", "Fecha de Entrega"]) {
      expect(table).toContain(label);
      expect(cards).toContain(label);
    }
    for (const value of ["SC-7956", "Placas Concavex", "Minera Norte", "Aprobado", "En Desarrollo", "12-08-2026", "MINERÍA", "SC-7947", "Parrilla vibratoria"]) {
      expect(table).toContain(value);
      expect(cards).toContain(value);
    }
    expect((table?.match(/<tr\b/g) ?? []).length).toBe(11);
    expect((cards?.match(/<article\b/g) ?? []).length).toBe(10);
  });
});
