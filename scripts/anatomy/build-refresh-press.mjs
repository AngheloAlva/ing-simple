import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"

// A press with a timer. A desk clock is wired to the press's control box; at
// 06:00 the box lights and the ram lowers one die, engraved with the single
// definition, onto three area sheets at once: one stroke, one number.
//
// Parts: base (four feet, plate), two columns, beam, cylinder, control box,
// three sheets (with headers), die (plate, platen, piston), clock (body, two
// feet, two bells, hammer post) and the wire between clock and control box.
// Clock hands, the control light and the stamped numbers are drawn by the page.
const scene = JSON.parse(
	readFileSync(new URL("../../components/diagrams/anatomy-refresh-press/scene.json", import.meta.url), "utf8")
)
const width = 560,
	height = 420
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
const P = k.fitProjection(
	[...k.boxCorners(plan(-70, -40, 140, 80), 0, 9), ...k.boxCorners(plan(-52, -8, 104, 12), 9, 108)],
	width,
	height,
	{ pad: 8, azimuth: 56, elevation: 28 }
)
let parts = 0
const solid = (name, p, z, h, tone = "mid", extra = {}) => {
	parts++
	return `<g data-part="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 4, Math.min(0.5, h / 3)), { tone, ...extra })}</g>`
}
const round = (name, cx, cy, r, z, h, tone = "mid") => {
	parts++
	return `<g data-part="${name}">${k.solidSvg(k.cylinder(cx, cy, r, z, h, P, 32, 0.3), { tone })}</g>`
}
const line = (d, tone = "lo", extra = {}) => k.lineSvg(d, { tone, ...extra })
const segment = (a, b) => k.pathOf([k.iso(a, P), k.iso(b, P)])
const dots = (points) => k.dotsSvg(points.map((p) => k.iso(p, P)), { size: 0.5, tone: "mid" })
const TOP = 9
const SHEET = 0.6
const DIE_BOTTOM = TOP + SHEET + scene.stroke

// ---------------------------------------------------------------- base, left column, control box
const back = []
const base = plan(-70, -40, 140, 80, 1.5)
back.push(`<path class="iso-halo" d="${k.haloOf(plan(-68, -38, 140, 82, 5), 0, 2, P)}"/>`)
for (const [i, [x, y]] of k
	.corners(base, 7)
	.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
	.entries())
	back.push(solid(`foot-${i}`, plan(x - 4, y - 4, 8, 8, 1), 0, 4, "lo"))
back.push(solid("base", base, 4, 5))
back.push(line(k.planOutline(k.insetPlan(base, 3), TOP, P), "faint"))
back.push(dots(k.corners(plan(-70, -40, 140, 80), 3).map(([x, y]) => [x, y, TOP])))
back.push(solid("column-left-flange", plan(-52, -8, 12, 12, 1), TOP, 2, "lo"))
back.push(dots([[-51, -7, TOP + 2], [-41, 3, TOP + 2]]))
back.push(solid("column-left", plan(-50, -6, 8, 8, 0.8), TOP + 2, 89, "hi"))
back.push(solid("control-box", plan(-49, 2, 6, 4, 0.6), 40, 10))
back.push(line(segment([-48, 6.05, 43], [-44, 6.05, 43]), "faint"))

// ---------------------------------------------------------------- sheets
const sheets = scene.areas.map((area) => {
	const x = area.x
	return [
		solid(`sheet-${area.id}`, plan(x - 11, -14, 22, 28, 0.2), TOP, SHEET, "hi", { crease: "none" }),
		k.faceTextSvg(k.topMatrix([x - 8, 11.5], TOP + SHEET, P), area.name.toUpperCase(), { size: 2.4, tone: "mid" }),
		...[-9, -6].map((y) =>
			line(segment([x - 8, y, TOP + SHEET], [x + 8, y, TOP + SHEET]), "faint", { free: true })
		),
	].join("")
})
const numberMatrices = scene.areas.map((area) => k.topMatrix([area.x, 3.5], TOP + SHEET + 0.02, P))

// ---------------------------------------------------------------- die, built at rest (up)
const die = [
	solid("die", plan(-40, -18, 80, 36, 1), DIE_BOTTOM, 6, "hi"),
	k.faceTextSvg(k.sideMatrix([0, 18.05], DIE_BOTTOM + 3.6, P, "left"), scene.definition, {
		size: 2.5,
		tone: "hi",
		anchor: "middle",
	}),
	dots([
		[-37, 18.05, DIE_BOTTOM + 4.8],
		[37, 18.05, DIE_BOTTOM + 4.8],
	]),
	solid("platen", plan(-20, -8, 40, 18, 1), DIE_BOTTOM + 6, 3),
	round("piston", 0, 1, 3, DIE_BOTTOM + 9, 40, "lo"),
].join("")

// ---------------------------------------------------------------- right column, cylinder, beam
const front = [
	solid("column-right-flange", plan(40, -8, 12, 12, 1), TOP, 2, "lo"),
	dots([[41, -7, TOP + 2], [51, 3, TOP + 2]]),
	solid("column-right", plan(42, -6, 8, 8, 0.8), TOP + 2, 89),
	round("cylinder", 0, 1, 7, 50, 50, "hi"),
	line(segment([-7, 1, 58], [-7, 1, 92]), "faint"),
	solid("cylinder-cap", plan(-9, -8, 18, 18, 2), 96, 4, "mid"),
	// Hydraulic hose from the control box up to the cylinder head.
	k.wireSvg(k.iso([-46, 4, 50], P), k.iso([-9, 1, 97], P), {
		via: [k.iso([-46, 4, 92], P), k.iso([-30, 1, 97], P)],
		tone: "mid",
		size: 0.9,
	}),
	solid("beam", plan(-52, -8, 104, 12, 1), 100, 8, "hi"),
	dots([
		[-46, 4.05, 104],
		[46, 4.05, 104],
	]),
].join("")

// ---------------------------------------------------------------- clock and wire
const clock = [
	solid("clock-foot-left", plan(-64, 23, 4, 6, 1), TOP, 2, "lo"),
	solid("clock-foot-right", plan(-54, 23, 4, 6, 1), TOP, 2, "lo"),
	solid("clock-body", plan(-66, 22, 18, 8, 2.5), TOP + 2, 22, "hi"),
	round("bell-left", -61, 26, 2.6, TOP + 24, 3, "mid"),
	round("bell-right", -53, 26, 2.6, TOP + 24, 3, "mid"),
	solid("hammer-post", plan(-57.6, 25.4, 1.2, 1.2, 0.4), TOP + 24, 4.5, "lo"),
	k.wireSvg(k.iso([-48, 26, 20], P), k.iso([-46, 6, 41], P), {
		via: [k.iso([-40, 26, 20], P), k.iso([-40, 6, 41], P)],
		tone: "mid",
		size: 0.9,
	}),
].join("")

const content =
	JSON.stringify({
		width,
		height,
		parts,
		slide: k.axisVector(P, [0, 0, -scene.stroke]).map((n) => Number(n.toFixed(6))),
		back: back.join(""),
		sheets,
		numberMatrices,
		die,
		front,
		clock,
		clockMatrix: k.sideMatrix([-57, 30.05], 22, P, "left"),
		light: k.iso([-46, 6.06, 47], P).map((n) => Number(n.toFixed(2))),
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-refresh-press/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-refresh-press.mjs [--check]\nGenerate the refresh-press SVG layers, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error("Refresh press art is stale; run node scripts/anatomy/build-refresh-press.mjs")
	console.log(`Refresh press art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated refresh press · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
