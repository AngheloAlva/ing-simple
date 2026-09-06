import type { ReactNode } from "react"

interface JsonLdProps {
	data: object | object[]
}

/**
 * Renders one `<script type="application/ld+json">` tag from one or more
 * plain JSON-LD objects. `<` is escaped to `<` so no field value —
 * however it was authored — can ever close the script tag early.
 */
export function JsonLd({ data }: JsonLdProps): ReactNode {
	const json = JSON.stringify(data).replace(/</g, "\\u003c")

	return (
		// JSON-LD from our own static data; "<" is escaped above so no field
		// value can ever close the script tag early.
		<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
	)
}
