const LONG_DATE_FORMATTER = new Intl.DateTimeFormat("es-CL", {
	day: "numeric",
	month: "long",
	year: "numeric",
	timeZone: "UTC",
})

/**
 * Formats an ISO "YYYY-MM-DD" date as a long Spanish date, e.g.
 * "6 de septiembre de 2026". Parsed as UTC midnight so the calendar day
 * never shifts with the server's local timezone.
 */
export function formatGuiaDate(isoDate: string): string {
	const date = new Date(`${isoDate}T00:00:00.000Z`)
	return LONG_DATE_FORMATTER.format(date)
}
