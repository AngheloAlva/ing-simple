const WORDS_PER_MINUTE = 200

/**
 * Rough strip of code fences and JSX/HTML-like tags before counting words.
 * Good enough for an estimate — this is not a markdown parser.
 */
function stripMarkup(body: string): string {
	return body.replace(/```[\s\S]*?```/g, " ").replace(/<[^>]*>/g, " ")
}

/** Estimated reading time in whole minutes, at 200 words per minute, minimum 1. */
export function readingTimeMinutes(body: string): number {
	const words = stripMarkup(body)
		.split(/\s+/)
		.filter((word) => word.length > 0)

	return Math.max(1, Math.round(words.length / WORDS_PER_MINUTE))
}
