import { describe, expect, it } from "vitest"

import { readingTimeMinutes } from "@/lib/guias/reading-time"

describe("readingTimeMinutes", () => {
	it("returns 1 minute for very short content", () => {
		expect(readingTimeMinutes("Solo unas pocas palabras aquí.")).toBe(1)
	})

	it("estimates using 200 words per minute", () => {
		const words = Array.from({ length: 400 }, () => "palabra").join(" ")
		expect(readingTimeMinutes(words)).toBe(2)
	})

	it("never returns less than 1 minute", () => {
		expect(readingTimeMinutes("")).toBe(1)
	})

	it("ignores JSX/MDX tags when counting words", () => {
		const body = '<Nota tipo="info" titulo="Ojo">Contenido corto</Nota>'
		expect(readingTimeMinutes(body)).toBe(1)
	})

	it("ignores code fences when counting words", () => {
		const code = "```ts\n" + Array.from({ length: 300 }, () => "const x = 1").join("\n") + "\n```"
		const body = `Texto real de la guía.\n\n${code}`
		expect(readingTimeMinutes(body)).toBe(1)
	})
})
