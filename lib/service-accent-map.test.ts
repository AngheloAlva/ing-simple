import { readFileSync } from "node:fs"
import { join } from "node:path"

import { describe, expect, it } from "vitest"

import { SERVICE_ACCENTS, serviceAccentFor, type ServiceSlug } from "@/lib/service-accent"
import { SERVICES } from "@/lib/services"

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf-8")

/** Extracts the body of a top-level CSS block by its selector, matched at
 * the start of a line so `.dark` doesn't also match inside `html.dark`.
 * Mirrors the helper in `lib/service-accent.test.ts` so both files stay in
 * sync with how `app/globals.css` is parsed. */
function extractBlock(selector: string): string {
	const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
	const match = new RegExp(`^${escaped}\\s*\\{([^}]*)\\}`, "m").exec(css)
	const body = match?.[1]
	if (body === undefined) {
		throw new Error(`Selector not found in app/globals.css: ${selector}`)
	}
	return body
}

/** Reads one `--token: value;` declaration out of a block body. */
function extractToken(block: string, token: string): string {
	const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
	const match = new RegExp(`${escaped}:\\s*([^;]+);`).exec(block)
	const value = match?.[1]
	if (value === undefined) {
		throw new Error(`Token ${token} not found in block`)
	}
	return value.trim()
}

const SLUGS = Object.keys(SERVICE_ACCENTS) as ServiceSlug[]

describe("SERVICE_ACCENTS covers the service catalog", () => {
	it("has exactly one accent per slug in lib/services.ts", () => {
		expect(SLUGS.sort()).toEqual(SERVICES.map((service) => service.slug).sort())
	})

	it.each(SERVICES.map((service) => service.slug))("resolves %s without a cast", (slug) => {
		expect(serviceAccentFor(slug)).toBe(SERVICE_ACCENTS[slug as ServiceSlug])
	})

	it("throws a descriptive error for a slug without an accent", () => {
		expect(() => serviceAccentFor("consultoria")).toThrow(/No service accent defined for slug "consultoria"/)
	})
})

/** Maps `lib/service-accent.ts` field names to their `app/globals.css` custom property. */
const CSS_TOKEN_BY_FIELD = {
	primary: "--primary",
	brandBlue: "--brand-blue",
	brandBlueForeground: "--brand-blue-foreground",
	tint: "--brand-tint",
} as const

describe("SERVICE_ACCENTS matches app/globals.css", () => {
	it.each(SLUGS)("%s light values equal the [data-service] override", (slug) => {
		const block = extractBlock(`[data-service="${slug}"]`)
		for (const [field, token] of Object.entries(CSS_TOKEN_BY_FIELD)) {
			const key = field as keyof typeof CSS_TOKEN_BY_FIELD
			expect(SERVICE_ACCENTS[slug].light[key]).toBe(extractToken(block, token))
		}
	})

	it.each(SLUGS)("%s dark values equal the .dark [data-service] override", (slug) => {
		const block = extractBlock(`.dark [data-service="${slug}"]`)
		for (const [field, token] of Object.entries(CSS_TOKEN_BY_FIELD)) {
			const key = field as keyof typeof CSS_TOKEN_BY_FIELD
			expect(SERVICE_ACCENTS[slug].dark[key]).toBe(extractToken(block, token))
		}
	})
})
