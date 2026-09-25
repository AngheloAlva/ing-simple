import { describe, expect, it } from "vitest"

import { isInternalHref } from "@/lib/href"

describe("isInternalHref", () => {
	it.each([
		["/", true],
		["/casos", true],
		["/casos/example-id", true],
		["/contacto?servicio=ia", true],
		["/#servicios", true],
		["//cdn.example.com/x", false],
		["https://example.com/x", false],
		["http://example.com/x", false],
		["mailto:hello@example.com", false],
		["tel:+123456789", false],
		["sms:+123456789", false],
		["custom:x", false],
		["#servicios", false],
		["", false],
		["./x", false],
		["../x", false],
		["x", false],
	] as const)("classifies %j as %j", (href, expected) => {
		expect(isInternalHref(href)).toBe(expected)
	})
})
