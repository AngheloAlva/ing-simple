import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import {
	ENTRANCE_STAGGER,
	ELAPSED,
	EXEC_GEOMETRY,
	GESTION_BY_MONTH,
	KPIS,
	PLAN_BY_MONTH,
	PROJECTED_BY_MONTH,
	PROJECTION_START_X,
	ROW_STAGGER,
	PanelReportability,
} from "./reportability"

describe("Reportability panel", () => {
	it("renders four KPI cards, each with a distinct visual treatment and a numeric annotation", () => {
		const html = renderToStaticMarkup(<PanelReportability />)

		// One card per kind, no duplicates.
		expect(KPIS).toHaveLength(4)
		expect(new Set(KPIS.map((k) => k.kind)).size).toBe(4)
		for (const kpi of KPIS) {
			expect(kpi.delta, `${kpi.label} lacks a numeric secondary annotation`).toMatch(/\d/)
			expect(html).toContain(`data-kpi="${kpi.kind}"`)
		}

		// Classify each micro-visual by its structural marker; four cards,
		// four different signatures: pacing track (track + month ticks), paired
		// mini columns, zero-centered diverging columns, projection scale (dots).
		const start = html.indexOf("grid-cols-2")
		const end = html.indexOf("grid min-h-0 flex-1 grid-cols-1")
		const kpiRegion = html.slice(start, end)
		const svgs = kpiRegion.match(/<svg viewBox="0 0 96 32"[\s\S]*?<\/svg>/g) ?? []
		expect(svgs).toHaveLength(4)
		const signatures = new Set(
			svgs.map((svg) => svg.match(/data-visual="([^"]+)"/)?.[1] ?? "unknown")
		)
		expect(signatures).not.toContain("unknown")
		expect(signatures.size).toBe(4)

		// Shapes must differ structurally, not only by label: twelve discrete
		// month cells, paired columns, zero-centered columns and a bullet chart.
		const cells = svgs.find((s) => s.includes('data-visual="month-cells"')) ?? ""
		expect((cells.match(/<rect/g) ?? []).length).toBe(12)
		const paired = svgs.find((s) => s.includes('data-visual="paired-columns"')) ?? ""
		expect((paired.match(/<rect/g) ?? []).length).toBe(ELAPSED * 2)
		const bullet = svgs.find((s) => s.includes('data-visual="projection-bullet"')) ?? ""
		expect((bullet.match(/<line/g) ?? []).length).toBe(2)
		expect((bullet.match(/<rect/g) ?? []).length).toBe(2)
	})

	it("gives the deviation micro-visual real bar amplitude on a fixed ±10% domain", () => {
		const html = renderToStaticMarkup(<PanelReportability />)
		const start = html.indexOf("grid-cols-2")
		const end = html.indexOf("grid min-h-0 flex-1 grid-cols-1")
		const kpiRegion = html.slice(start, end)
		const devSvg =
			kpiRegion.match(/<svg viewBox="0 0 96 32"[\s\S]*?<\/svg>/g)?.find((s) =>
				s.includes('data-visual="zero-centered-columns"'),
			) ?? ""
		expect(devSvg).not.toBe("")
		// Five elapsed months, each a real rect (not dashes), zero line visible.
		const rects = devSvg.match(/<rect[^>]*>/g) ?? []
		expect(rects).toHaveLength(ELAPSED)
		// Every bar has visible amplitude and enough width to read as a bar.
		const attr = (rect: string, name: string): number =>
			Number.parseFloat(rect.match(new RegExp(`${name}="([\\d.]+)"`))?.[1] ?? "0")
		for (const rect of rects) {
			expect(attr(rect, "height")).toBeGreaterThanOrEqual(2)
			expect(attr(rect, "width")).toBeGreaterThanOrEqual(9)
		}
	})

	it("renders the month axis as real HTML below the chart, elapsed vs future", () => {
		const html = renderToStaticMarkup(<PanelReportability />)
		const execSvg = html.match(/<svg viewBox="0 0 600 200"[\s\S]*?<\/svg>/)?.[0]
		expect(execSvg).toBeDefined()
		// The vertically-scaled SVG no longer carries text labels.
		expect(execSvg).not.toContain("<text")

		// A 12-column axis row sits after the chart, one label per month.
		const axis = html.match(/<div[^>]*grid-cols-12[\s\S]*?<\/div>/)?.[0]
		expect(axis).toBeDefined()
		const spans = axis!.match(/<span[^>]*>[^<]*<\/span>/g) ?? []
		expect(spans).toHaveLength(12)
		// Elapsed months read in the foreground; future months stay muted.
		const elapsedSpans = spans.filter((s) => s.includes("text-foreground"))
		expect(elapsedSpans).toHaveLength(ELAPSED)
		expect(spans.length - elapsedSpans.length).toBe(12 - ELAPSED)
	})

	it("starts the dashed projection at the boundary after the last actual month", () => {
		const html = renderToStaticMarkup(<PanelReportability />)
		const points = html.match(
			/<polyline points="([^"]+)"[^>]*stroke-dasharray="4 4"/,
		)?.[1]
		expect(points).toBeDefined()

		const firstX = Number.parseFloat(points!.split(" ")[0]!)
		// The previous defect: the line began at the center of the last actual
		// month, floating inside the actuals. It must start past that center.
		const lastActualCenterX =
			EXEC_GEOMETRY.padLeft + (ELAPSED - 1) * EXEC_GEOMETRY.slot + EXEC_GEOMETRY.slot / 2
		expect(firstX).toBeGreaterThan(lastActualCenterX)
		expect(firstX).toBeCloseTo(PROJECTION_START_X, 5)
	})

	it("gives every future month a plan bar plus a distinct projected bar", () => {
		// One dataset: the run-rate projection derives from the remaining plan.
		expect(PLAN_BY_MONTH).toHaveLength(12)
		expect(GESTION_BY_MONTH).toHaveLength(ELAPSED)
		expect(PROJECTED_BY_MONTH).toHaveLength(12 - ELAPSED)
		for (let i = 0; i < PROJECTED_BY_MONTH.length; i++) {
			const plan = PLAN_BY_MONTH[ELAPSED + i]!
			expect(PROJECTED_BY_MONTH[i]).toBeGreaterThan(0)
			expect(PROJECTED_BY_MONTH[i]).toBeLessThan(plan)
		}

		// In the execution chart (viewBox 0 0 600 200) each future month paints
		// a dashed-outline projected bar in the gestión slot.
		const html = renderToStaticMarkup(<PanelReportability />)
		const execSvg = html.match(/<svg viewBox="0 0 600 200"[\s\S]*?<\/svg>/)?.[0]
		expect(execSvg).toBeDefined()
		expect(execSvg!.match(/stroke-dasharray="3 3"/g) ?? []).toHaveLength(12 - ELAPSED)
	})

	it("staggers the entrance: KPI cards, then chart tiles, then table rows", () => {
		const html = renderToStaticMarkup(<PanelReportability />)

		// Every staggered item mounts hidden with the recipe's lift: 4 KPI
		// cards, 3 chart/table tiles and 6 deviation-table rows.
		expect(html.match(/opacity:0;transform:translateY\(12px\)/g) ?? []).toHaveLength(13)

		// The staggered items exist in depth-first reading order: 4 KPI cards,
		// then execution chart → waterfall → table, whose 6 rows carry their
		// own tighter stagger inside the table tile.
		expect((html.match(/data-kpi="/g) ?? []).length).toBe(4)
		expect(html.indexOf("Ejecución mensual")).toBeLessThan(html.indexOf("Puente plan → gestión"))
		expect(html.indexOf("Puente plan → gestión")).toBeLessThan(html.indexOf("Ejecución por área"))
		expect((html.match(/<li\b/g) ?? []).length).toBe(6)

		// Subtle stagger, tighter for the rows, inside the ~6 s panel budget.
		expect(ENTRANCE_STAGGER).toBeGreaterThanOrEqual(0.05)
		expect(ENTRANCE_STAGGER).toBeLessThanOrEqual(0.08)
		expect(ROW_STAGGER).toBeLessThan(ENTRANCE_STAGGER)

		// The rows' container inherits the panel's animated state (the site's
		// entrance recipe), so they begin when the table tile (the 7th staggered
		// item) enters, and the last row starts by ~0.6 s after the first.
		const rowStart = 6 * ENTRANCE_STAGGER
		expect(rowStart).toBeCloseTo(0.36, 5)
		expect(rowStart + 5 * ROW_STAGGER).toBeLessThanOrEqual(0.6)
	})
})
