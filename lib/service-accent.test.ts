import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf-8")

/** Extracts the body of a top-level CSS block by its selector, matched at
 * the start of a line so `.dark` doesn't also match inside `html.dark`. */
function extractBlock(selector: string): string {
	const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
	const match = new RegExp(`^${escaped}\\s*\\{([^}]*)\\}`, "m").exec(css)
	const body = match?.[1]
	if (body === undefined) {
		throw new Error(`Selector not found in app/globals.css: ${selector}`)
	}
	return body
}

const REQUIRED_ACCENT_TOKENS = [
	"--brand-tint",
	"--primary",
	"--primary-foreground",
	"--brand-blue",
	"--brand-blue-foreground",
	"--ring",
]

describe("app/globals.css service accent tokens", () => {
	it("defines --brand-tint in both the light and dark root blocks", () => {
		expect(extractBlock(":root")).toContain("--brand-tint:")
		expect(extractBlock(".dark")).toContain("--brand-tint:")
	})

	it("defines every accent token in the reportabilidad light override", () => {
		const block = extractBlock('[data-service="reportabilidad"]')
		for (const token of REQUIRED_ACCENT_TOKENS) {
			expect(block).toContain(`${token}:`)
		}
	})

	it("defines every accent token in the reportabilidad dark override", () => {
		const block = extractBlock('.dark [data-service="reportabilidad"]')
		for (const token of REQUIRED_ACCENT_TOKENS) {
			expect(block).toContain(`${token}:`)
		}
	})
})

/**
 * "As yellow as possible" guard (2026-09): on the service page, only text
 * (words, numbers, kickers, chip labels, link text, inline icon glyphs) may
 * sit on `primary` utilities. Every purely decorative fill — chart bars,
 * bar/progress fills, hover surfaces, active-tab indicators, timeline dots,
 * badge chrome, dashboard mockup panels — must use the `brand-blue` surface
 * token instead, so it renders Power BI yellow in the reportabilidad
 * override without risking body-text contrast. `text-primary`,
 * `ring-primary` and `primary-foreground` are allowed everywhere they occur
 * (the first two are always text/focus roles; the third only ever pairs
 * with a solid `bg-primary`, which this guard already forbids).
 */
describe("service page components have no decorative `primary` surfaces", () => {
	// `components/diagrams/report` is the hero visual of the reportabilidad page
	// (see components/service-diagrams.tsx). The other three diagram folders
	// join this list when their services get an accent.
	// `components/diagrams/visual` holds the tiles, input cards and frames every
	// hero diagram is built from, so it is scanned as well.
	const SCAN_DIRS = [
		"components/servicios",
		"components/diagrams/report",
		"components/diagrams/visual",
	]
	// `components/panels/reportability.tsx` is the dashboard mock the
	// reportabilidad module renders (see components/servicios/modules/anatomy.tsx).
	// Its siblings in `components/panels/` (web/training/automation) only ever
	// render inside the home page's hero showcase, not the service page tree.
	const SCAN_FILES = ["components/final-cta.tsx", "components/panels/reportability.tsx"]
	const SURFACE_PATTERN =
		/\b(?:bg|border|fill|stroke|from|via|to|shadow|divide|outline)-primary\b/g

	function collectFiles(dir: string): string[] {
		const absolute = join(process.cwd(), dir)
		const entries = readdirSync(absolute, { withFileTypes: true })
		return entries.flatMap((entry) => {
			const relative = join(dir, entry.name)
			if (entry.isDirectory()) return collectFiles(relative)
			if (entry.isFile() && /\.tsx?$/.test(entry.name)) return [relative]
			return []
		})
	}

	const files = [...SCAN_DIRS.flatMap(collectFiles), ...SCAN_FILES]

	it("scans at least the known service-page component directories", () => {
		expect(files.length).toBeGreaterThan(10)
	})

	it.each(files)("%s has no bg/border/fill/stroke/gradient/shadow/divide/outline-primary", (file) => {
		const source = readFileSync(join(process.cwd(), file), "utf-8")
		const matches = source.match(SURFACE_PATTERN) ?? []
		expect(matches).toEqual([])
	})
})
