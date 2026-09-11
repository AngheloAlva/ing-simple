import { describe, expect, it } from "vitest"

import { oklchToHex } from "@/lib/service-accent"

/**
 * Test-only inverse of the OKLCH -> sRGB conversion (standard OKLab math,
 * see https://bottosson.github.io/posts/oklab/). Used to verify round-trip
 * accuracy without hand-typing expected hex values, since `ImageResponse`
 * (Satori) cannot render `oklch()` and the OG routes need real hex strings.
 */
function hexToOklch(hex: string): [number, number, number] {
	const r = Number.parseInt(hex.slice(1, 3), 16) / 255
	const g = Number.parseInt(hex.slice(3, 5), 16) / 255
	const b = Number.parseInt(hex.slice(5, 7), 16) / 255

	const toLinear = (c: number): number => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)

	const rLin = toLinear(r)
	const gLin = toLinear(g)
	const bLin = toLinear(b)

	const l = 0.4122214708 * rLin + 0.5363325363 * gLin + 0.0514459929 * bLin
	const m = 0.2119034982 * rLin + 0.6806995451 * gLin + 0.1073969566 * bLin
	const s = 0.0883024619 * rLin + 0.2817188376 * gLin + 0.6299787005 * bLin

	const l_ = Math.cbrt(l)
	const m_ = Math.cbrt(m)
	const s_ = Math.cbrt(s)

	const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_
	const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_
	const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_

	const C = Math.sqrt(A * A + B * B)
	const H = ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360

	return [L, C, H]
}

describe("oklchToHex", () => {
	const cases: [string, [number, number, number]][] = [
		["oklch(0.374509 0.149664 259.6115)", [0.374509, 0.149664, 259.6115]],
		["oklch(0.62 0.19 259.6115)", [0.62, 0.19, 259.6115]],
		["oklch(0.85 0.17 92)", [0.85, 0.17, 92]],
		["oklch(0.56 0.135 85)", [0.56, 0.135, 85]],
		["oklch(0.3745 0.1497 305)", [0.3745, 0.1497, 305]],
		["oklch(0.5 0.085 205)", [0.5, 0.085, 205]],
	]

	it.each(cases)("round-trips %s to a hex colour close to the source OKLCH", (input, [L, C, H]) => {
		const hex = oklchToHex(input)
		expect(hex).toMatch(/^#[0-9a-f]{6}$/)

		const [rL, rC, rH] = hexToOklch(hex)
		expect(rL).toBeCloseTo(L, 1)
		// Chroma can get clamped at the sRGB gamut boundary, so tolerance is looser.
		expect(Math.abs(rC - C)).toBeLessThan(0.05)
		// Hue is unstable near-grey; only check it once there's real chroma.
		if (C > 0.02) {
			const hueDiff = Math.min(Math.abs(rH - H), 360 - Math.abs(rH - H))
			expect(hueDiff).toBeLessThan(5)
		}
	})

	it("clamps out-of-gamut input instead of throwing or overflowing a byte", () => {
		expect(oklchToHex("oklch(0.9 0.4 259.6115)")).toMatch(/^#[0-9a-f]{6}$/)
	})
})
