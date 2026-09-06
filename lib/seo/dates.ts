/**
 * Parses a strict "<Spanish month> <year>" string (e.g. "Enero 2025") into an
 * ISO date anchored to the first day of that month ("2025-01-01").
 *
 * Returns `undefined` for anything that is not exactly one recognized month
 * name followed by a four-digit year — ranges ("Feb – Mar 2025"), relative
 * labels ("Hoy") and free text ("En producción desde Mayo 2026") are all
 * rejected on purpose so no date is ever fabricated from ambiguous copy.
 */
export function parseSpanishMonthYear(value: string): string | undefined {
	const months: Record<string, string> = {
		enero: "01",
		febrero: "02",
		marzo: "03",
		abril: "04",
		mayo: "05",
		junio: "06",
		julio: "07",
		agosto: "08",
		septiembre: "09",
		octubre: "10",
		noviembre: "11",
		diciembre: "12",
	}

	const match = /^([a-záéíóúñ]+)\s+(\d{4})$/i.exec(value.trim())
	if (!match) return undefined

	const [, monthName, year] = match
	const month = months[monthName!.toLowerCase()]
	if (month === undefined) return undefined

	return `${year}-${month}-01`
}
