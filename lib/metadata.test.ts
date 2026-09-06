import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const ORIGINAL_ENV = { ...process.env }

async function loadMetadataModule() {
	// `lib/metadata.ts` reads env vars at module-eval time, so each test that
	// changes env must re-import a fresh module instance.
	vi.resetModules()
	return import("@/lib/metadata")
}

describe("createMetadata", () => {
	afterEach(() => {
		process.env = { ...ORIGINAL_ENV }
	})

	it("sets a self-referencing canonical from the given path", async () => {
		const { createMetadata } = await loadMetadataModule()
		const metadata = createMetadata({ path: "/casos" })

		expect(metadata.alternates?.canonical).toBe("/casos")
	})

	it("uses the given title", async () => {
		const { createMetadata } = await loadMetadataModule()
		const metadata = createMetadata({ title: "Casos de estudio" })

		expect(metadata.title).toBe("Casos de estudio")
	})

	it("sets noindex/nofollow robots when noIndex is true", async () => {
		const { createMetadata } = await loadMetadataModule()
		const metadata = createMetadata({ path: "/x", noIndex: true })

		expect(metadata.robots).toEqual({ index: false, follow: false })
	})

	it("carries the shared Open Graph and Twitter fields so a page override keeps them", async () => {
		// Next.js replaces the whole `openGraph` / `twitter` object of the layout
		// with the page's one, so every page must restate the shared fields.
		const { createMetadata } = await loadMetadataModule()
		const metadata = createMetadata({ title: "Casos", path: "/casos" })

		expect(metadata.openGraph).toMatchObject({
			type: "website",
			locale: "es_CL",
			siteName: "Ingeniería Simple",
			title: "Casos",
		})
		expect(metadata.twitter).toMatchObject({
			card: "summary_large_image",
			title: "Casos",
		})
	})

	it("builds a title template ending in the brand name", async () => {
		const { baseMetadata } = await loadMetadataModule()
		const template = (baseMetadata.title as { template: string }).template

		expect(template.endsWith("| Ingeniería Simple")).toBe(true)
	})

	it("uses an absolute title verbatim for the tab, Open Graph and Twitter", async () => {
		const { createMetadata } = await loadMetadataModule()
		const metadata = createMetadata({
			absoluteTitle: "IngSimple — Soluciones simples",
			path: "/",
		})

		expect(metadata.title).toEqual({ absolute: "IngSimple — Soluciones simples" })
		expect(metadata.openGraph?.title).toBe("IngSimple — Soluciones simples")
		expect(metadata.twitter?.title).toBe("IngSimple — Soluciones simples")
	})

	it("does not set a robots override by default", async () => {
		const { createMetadata } = await loadMetadataModule()
		const metadata = createMetadata({ path: "/x" })

		expect(metadata.robots).toBeUndefined()
	})
})

describe("baseMetadata", () => {
	afterEach(() => {
		process.env = { ...ORIGINAL_ENV }
	})

	it("uses the es_CL Open Graph locale", async () => {
		const { baseMetadata } = await loadMetadataModule()

		expect(baseMetadata.openGraph?.locale).toBe("es_CL")
	})

	it("does not set explicit openGraph or twitter images (file-convention icons supply them)", async () => {
		const { baseMetadata } = await loadMetadataModule()

		expect(baseMetadata.openGraph?.images).toBeUndefined()
		expect(baseMetadata.twitter?.images).toBeUndefined()
	})

	it("includes localized keywords", async () => {
		const { baseMetadata } = await loadMetadataModule()
		const keywords = baseMetadata.keywords as string[]

		expect(keywords).toEqual(
			expect.arrayContaining([
				"Power BI Chile",
				"automatización de procesos Chile",
				"desarrollo web Chile",
				"capacitación Power BI",
				"Power Apps",
			]),
		)
	})

	describe("verification.google", () => {
		beforeEach(() => {
			delete process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
		})

		it("is omitted when the env var is unset", async () => {
			const { baseMetadata } = await loadMetadataModule()

			expect(baseMetadata.verification?.google).toBeUndefined()
		})

		it("is set from NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION when present", async () => {
			process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION = "abc123"
			const { baseMetadata } = await loadMetadataModule()

			expect(baseMetadata.verification?.google).toBe("abc123")
		})
	})
})
