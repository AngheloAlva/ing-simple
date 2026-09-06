import matter from "gray-matter"
import { z } from "zod"

import { readingTimeMinutes } from "@/lib/guias/reading-time"
import { guiaFrontmatterSchema, type GuiaMeta } from "@/lib/guias/schema"

/**
 * Pure core of the guides content layer — no filesystem access, so it is
 * directly unit-testable. `lib/guias/fs.ts` is the only module that touches
 * `node:fs` and reads from `content/guias`.
 */

/** `.mdx` files not starting with `_` (those are templates/partials). */
export function isGuiaFile(fileName: string): boolean {
	return fileName.endsWith(".mdx") && !fileName.startsWith("_")
}

/**
 * Parses one guide's raw MDX source into validated metadata and body.
 * Throws loudly, naming the slug and the exact validation issues, so a
 * guide with broken frontmatter fails the build instead of silently
 * rendering with missing fields.
 */
export function parseGuia(slug: string, raw: string): { meta: GuiaMeta; body: string } {
	const { data, content } = matter(raw)
	const result = guiaFrontmatterSchema.safeParse(data)

	if (!result.success) {
		throw new Error(`Invalid frontmatter for guía "${slug}": ${z.prettifyError(result.error)}`)
	}

	const meta: GuiaMeta = {
		...result.data,
		slug,
		readingTimeMinutes: readingTimeMinutes(content),
	}

	return { meta, body: content }
}

/**
 * Builds the published guide list from raw files: excludes drafts unless
 * `includeDrafts` is set, sorted by `publishedAt` descending (ties broken
 * by slug, ascending).
 */
export function listGuias(
	files: Array<{ slug: string; raw: string }>,
	options: { includeDrafts: boolean }
): GuiaMeta[] {
	return files
		.map(({ slug, raw }) => parseGuia(slug, raw).meta)
		.filter((meta) => options.includeDrafts || !meta.draft)
		.sort((a, b) => {
			if (a.publishedAt !== b.publishedAt) {
				return a.publishedAt < b.publishedAt ? 1 : -1
			}
			return a.slug.localeCompare(b.slug)
		})
}

/**
 * Guides related to `meta`: same `tema` first, then same `servicio`
 * (excluding whatever already matched by `tema`), always excluding `meta`
 * itself. Never pads with unrelated guides.
 */
export function getRelatedGuias(meta: GuiaMeta, all: GuiaMeta[], limit = 3): GuiaMeta[] {
	const others = all.filter((candidate) => candidate.slug !== meta.slug)

	const sameTema = others.filter((candidate) => candidate.tema === meta.tema)
	const sameServicio = others.filter(
		(candidate) =>
			candidate.tema !== meta.tema &&
			meta.servicio !== undefined &&
			candidate.servicio === meta.servicio
	)

	return [...sameTema, ...sameServicio].slice(0, limit)
}
