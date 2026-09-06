/**
 * Configurable taxonomy for guide topics — the equivalent of
 * `CATEGORY_LABELS` in `lib/portfolio-data.ts`. Slugs are what frontmatter
 * and URLs use; labels are what people read.
 */
export const TEMAS = {
	"ia": "IA en procesos",
	"cumplimiento": "Cumplimiento y datos",
	"reportabilidad": "Reportabilidad",
	"automatizacion": "Automatización",
	"desarrollo-web": "Desarrollo web",
	"capacitaciones": "Capacitaciones",
} as const

export type TemaSlug = keyof typeof TEMAS

export const TEMA_SLUGS = Object.keys(TEMAS) as TemaSlug[]
