import type { GuiaMeta } from "@/lib/guias/schema"

/**
 * Pure filtering logic for the `/guias` explorer (`components/guias/explorer.tsx`).
 * Kept out of the client component so it is unit-testable without React.
 */

/** Case- and accent-insensitive: "Automatización" and "automatizacion" match the same way. */
function normalize(text: string): string {
	return text
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
}

export interface GuiaFilter {
	/** A service slug, `"todos"`, or `undefined` — all three mean "no service filter". */
	servicio?: string
	query: string
}

/**
 * Filters guides by service (exact slug match) and a free-text query against
 * title, description and tags. An empty or whitespace-only query matches
 * everything.
 */
export function filterGuias(guias: GuiaMeta[], filter: GuiaFilter): GuiaMeta[] {
	const activeServicio =
		filter.servicio === undefined || filter.servicio === "todos" ? undefined : filter.servicio
	const normalizedQuery = normalize(filter.query)

	return guias.filter((guia) => {
		if (activeServicio !== undefined && guia.servicio !== activeServicio) return false
		if (normalizedQuery.length === 0) return true

		const haystack = normalize([guia.title, guia.description, ...guia.tags].join(" "))
		return haystack.includes(normalizedQuery)
	})
}
