import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/components/diagrams/program/training-program", () => ({ TrainingProgram: () => null }))
vi.mock("@/components/diagrams/report/reportability-report", () => ({
	ReportabilityReport: () => null,
}))
vi.mock("@/components/diagrams/site/web-solution", () => ({ WebSolution: () => null }))

import { TrainingProgram } from "@/components/diagrams/program/training-program"
import { ReportabilityReport } from "@/components/diagrams/report/reportability-report"
import { WebSolution } from "@/components/diagrams/site/web-solution"
import { SERVICE_VISUALS } from "@/components/service-diagrams"
import { AutomationFlow } from "@/components/diagrams/flow/automation-flow"
import { AutomationStation } from "./automation-station"
import art from "./art.json"

describe("Anatomy automation pilot", () => {
	it("keeps the original automation visual live and the Anatomy pilot disconnected", () => {
		expect(SERVICE_VISUALS).toEqual({
			"/servicios/automatizaciones": AutomationFlow,
			"/servicios/capacitaciones": TrainingProgram,
			"/servicios/reportabilidad": ReportabilityReport,
			"/servicios/desarrollo-web": WebSolution,
		})
	})

	it("renders a detailed figure and accessible controls without JavaScript", () => {
		const html = renderToStaticMarkup(<AutomationStation />)
		expect(art.parts).toBeGreaterThanOrEqual(40)
		expect(art.parts).toBeLessThanOrEqual(80)
		expect(html).toContain('role="img"')
		expect(html).toContain("Estación clasificadora")
		expect(html).toContain('aria-label="Tipo de solicitud"')
		expect(html).toMatch(/aria-pressed="true"[^>]*>Datos completos/)
		expect(html).toMatch(/aria-pressed="false"[^>]*>Faltan datos/)
		expect(html).toContain('aria-label="Pausar demostración"')
		expect(html).toContain('aria-label="Reiniciar demostración"')
		expect(html).toContain("Sin datos reales")
		expect(html).toContain("Entrada")
		expect(html).not.toContain("NaN")
		// The overhead bridge must occlude the reader's top, not the reverse.
		expect(html.indexOf('data-piece="reader-housing"')).toBeLessThan(
			html.indexOf('data-piece="reader-bridge"')
		)
	})
})
