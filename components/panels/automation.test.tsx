import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PanelAutomation } from "./automation";

describe("PanelAutomation", () => {
  it("presents the same ordered process and branch outcomes in compact and desktop views", () => {
    const html = renderToStaticMarkup(<PanelAutomation />);
    for (const label of [
      "Cuando llega una solicitud", "Validar datos", "Condición",
      "Origen de datos", "Plantilla", "Aprobado", "Guardar registro",
      "Notificar al equipo", "Rechazado", "Solicitar revisión",
    ]) {
      expect(html.split(label).length - 1).toBe(2);
    }
    expect(html).toContain("@[1040px]:hidden");
    expect(html).toContain("@[1040px]:block");
    expect(html).toContain('viewBox="0 0 1040 470"');
  });
});
