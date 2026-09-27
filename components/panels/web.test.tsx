import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ENTRANCE_STAGGER, ROW_BASE_DELAY, ROW_STAGGER, PanelWeb } from "./web";

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

  it("staggers the entrance: stat cards, then request rows in reading order", () => {
    const html = renderToStaticMarkup(<PanelWeb />);

    // The three stat cards start the chain (they mount hidden with the lift
    // too, so 3 + 10 lifts in total), and both request-row representations
    // mount hidden: the compact cards with the recipe's lift, the desktop
    // table rows fading in place (transforms are unreliable on <tr>).
    expect((html.match(/flex items-center justify-between gap-3 rounded-xl/g) ?? []).length).toBe(3);
    expect(html.match(/opacity:0;transform:translateY\(20px\)/g) ?? []).toHaveLength(13);
    const trs = html.match(/<tr\b[^>]*>/g) ?? [];
    expect(trs.filter((tr) => tr.includes('style="opacity:0"'))).toHaveLength(10);

    // Subtle stagger within the ~6 s budget: rows begin after the stat cards
    // and the last row starts by ~0.6 s after the first.
    expect(ENTRANCE_STAGGER).toBeGreaterThanOrEqual(0.05);
    expect(ENTRANCE_STAGGER).toBeLessThanOrEqual(0.08);
    expect(ROW_STAGGER).toBeGreaterThanOrEqual(0.05);
    expect(ROW_STAGGER).toBeLessThanOrEqual(0.08);
    expect(ROW_BASE_DELAY).toBeCloseTo(3 * ENTRANCE_STAGGER, 5);
    expect(ROW_BASE_DELAY + 9 * ROW_STAGGER).toBeCloseTo(0.6, 10);
  });
});
