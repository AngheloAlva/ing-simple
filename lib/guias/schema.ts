import { z } from "zod"

import { SERVICES } from "@/lib/services"
import { TEMA_SLUGS } from "@/lib/guias/temas"

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const SERVICE_SLUGS = SERVICES.map((service) => service.slug)

/**
 * `gray-matter` parses an unquoted YAML date (e.g. `publishedAt: 2026-09-06`)
 * into a JS `Date`, not a string. Coerce it back to an ISO date string before
 * the regex check runs, so both quoted and unquoted frontmatter dates work.
 */
function toIsoDateInput(value: unknown): unknown {
	if (value instanceof Date) {
		return value.toISOString().slice(0, 10)
	}
	return value
}

const isoDateSchema = z.preprocess(
	toIsoDateInput,
	z.string().regex(ISO_DATE_RE, "Debe tener el formato YYYY-MM-DD")
)

/**
 * Validates a guide's MDX frontmatter. A guide with invalid frontmatter must
 * fail loudly (see `parseGuia` in `lib/guias/index.ts`), never render with
 * silently missing fields.
 */
export const guiaFrontmatterSchema = z.object({
	title: z.string().min(1).max(90),
	description: z.string().min(1).max(200),
	publishedAt: isoDateSchema,
	updatedAt: isoDateSchema.optional(),
	tema: z.enum(TEMA_SLUGS),
	servicio: z.enum(SERVICE_SLUGS).optional(),
	tags: z.array(z.string()).default([]),
	draft: z.boolean().default(false),
	/** Every guide must have a cover; the path is checked against `public/img/guias/*` in `lib/guias/fs.ts`. */
	portada: z.string().startsWith("/img/guias/", "Debe empezar con /img/guias/"),
	portadaAlt: z.string().min(1).max(160),
	portadaCredito: z.string().min(1).optional(),
	/** Optional source photo for the interactive pixel-relief cover; see `components/guias/cover-relief.tsx`. */
	portadaRelieve: z.string().startsWith("/img/guias/", "Debe empezar con /img/guias/").optional(),
})

export type GuiaFrontmatter = z.infer<typeof guiaFrontmatterSchema>

export type GuiaMeta = GuiaFrontmatter & {
	slug: string
	readingTimeMinutes: number
}
