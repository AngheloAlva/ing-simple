import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"
import { homeProjection } from "./home-camera.mjs"

// One person's desk: a resolved folder leaves; without the person, work piles up.
// Parts: desk (feet, legs, aprons, stretchers, top, mat); chair (feet, legs,
// seat, cushion, back posts, backrest); person (torso, neck, head, limbs);
// two document trays (bases, rims, nameplates); pencil rest and two pencils;
// four folders (cover, tab, sheet). No motor, lock, cable or machine failure.
const width = 480,
	height = 240
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
const desk = plan(-125, -30, 250, 95, 3)
const P = homeProjection(
	[...k.boxCorners(desk, -48, 4), [-20, -85, -48], [20, -85, 40]],
	width,
	height
)
const layers = { chair: [], person: [], desk: [], paper: [], stamp: [] }
let parts = 0
function slab(layer, name, p, z, h, tone = "mid", lit = false) {
	parts++
	layers[layer].push(
		`<g data-part="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 5, Math.min(0.45, h / 3)), { tone, lit })}</g>`
	)
}
const line = (layer, d, tone = "lo", free = false) =>
	layers[layer].push(k.lineSvg(d, { tone, free }))
const screws = (layer, p, z) =>
	layers[layer].push(
		k.dotsSvg(
			k.corners(p, 2).map(([x, y]) => k.iso([x, y, z], P)),
			{ size: 0.55, tone: "mid" }
		)
	)
const ordered = (points) => points.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
// A chair remains when its occupant disappears. The desk occludes the lower body.
layers.chair.push(`<path class="iso-halo" d="${k.haloOf(plan(-22, -87, 44, 52), -48, 5, P)}"/>`)
for (const [i, [x, y]] of ordered([
	[-15, -78],
	[15, -78],
	[-15, -43],
	[15, -43],
]).entries()) {
	slab("chair", `chair-foot-${i}`, plan(x - 3, y - 3, 6, 6), -48, 2, "lo")
	slab("chair", `chair-leg-${i}`, plan(x - 2, y - 2, 4, 4), -46, 36, "lo")
}
slab("chair", "seat", plan(-20, -82, 40, 44, 2), -10, 4)
slab("chair", "seat-cushion", plan(-18, -80, 36, 40, 3), -6, 2, "hi")
for (const x of [-15, 15]) slab("chair", `back-post-${x}`, plan(x - 2, -84, 4, 4), -10, 36)
slab("chair", "backrest", plan(-20, -85, 40, 5, 1.5), 5, 24, "hi")
line("chair", k.planOutline(plan(-17, -84, 34, 3, 0.5), 29, P), "faint")
// A small, human-shaped seated figure, not an operating switch or access token.
for (const x of [-7, 7]) {
	slab("person", `trouser-${x}`, plan(x - 3, -64, 6, 25, 1), -4, 5, "hi", true)
	slab("person", `shin-${x}`, plan(x - 3, -44, 6, 6, 1), -34, 30, "hi", true)
	slab("person", `shoe-${x}`, plan(x - 4, -44, 8, 12, 1), -37, 3, "mid")
}
slab("person", "torso", plan(-11, -70, 22, 13, 3), 1, 22, "hi", true)
slab("person", "neck", plan(-3, -65, 6, 6, 1), 23, 3, "hi", true)
slab("person", "head", plan(-7, -69, 14, 13, 5), 26, 13, "hi", true)
for (const x of [-15, 11]) slab("person", `arm-${x}`, plan(x, -63, 4, 30, 1), 11, 7, "hi", true)
// Real furniture, with structural rails and supported feet rather than a plinth.
layers.desk.push(`<path class="iso-halo" d="${k.haloOf(desk, -48, 6, P)}"/>`)
for (const [i, [x, y]] of ordered([
	[-110, -20],
	[110, -20],
	[-110, 52],
	[110, 52],
]).entries()) {
	slab("desk", `desk-foot-${i}`, plan(x - 5, y - 5, 10, 10, 1), -48, 3, "lo")
	slab("desk", `desk-leg-${i}`, plan(x - 3, y - 3, 6, 6), -45, 45)
}
for (const x of [-110, 110]) slab("desk", `stretcher-${x}`, plan(x - 2, -20, 4, 75), -32, 4, "lo")
for (const y of [-26, 56]) slab("desk", `apron-${y}`, plan(-113, y, 226, 4), -9, 9)
for (const x of [-116, 112]) slab("desk", `side-apron-${x}`, plan(x, -26, 4, 86), -9, 9)
slab("desk", "desktop", desk, 0, 4, "hi")
line("desk", k.planOutline(k.insetPlan(desk, 3), 4, P), "faint")
slab("desk", "writing-mat", plan(-36, -14, 72, 60, 1), 4, 1, "lo")
line("desk", k.planOutline(plan(-33, -11, 66, 54, 1), 5, P), "faint")
for (const [name, x] of [
	["incoming", -85],
	["resolved", 85],
]) {
	const tray = plan(x - 25, -18, 50, 54, 1)
	slab("desk", `${name}-tray`, tray, 4, 2, "lo")
	for (const [i, p] of [
		plan(x - 25, -18, 50, 2),
		plan(x - 25, -16, 2, 52),
		plan(x + 23, -16, 2, 52),
	].entries())
		slab("desk", `${name}-rim-${i}`, p, 6, 4, "mid")
	slab("desk", `${name}-plate`, plan(x - 18, 39, 36, 7), 4, 0.5, "lo")
	screws("desk", plan(x - 18, 39, 36, 7), 4.5)
	if (name === "resolved")
		layers.desk.push(
			k.faceTextSvg(k.topMatrix([x, 44], 4.5, P), "RESUELTAS", { size: 3, anchor: "middle" })
		)
}
slab("desk", "pencil-rest", plan(-33, 51, 55, 7, 1), 4, 1, "lo")
for (const y of [52, 55]) slab("desk", `pencil-${y}`, plan(-28, y, 43, 1.5, 0.3), 5, 1.5, "mid")
// One reusable folder at its incoming home. Live groups translate along camera axes.
slab("paper", "folder-cover", plan(-103, -8, 36, 32), 6, 1, "hi")
slab("paper", "folder-tab", plan(-101, -11, 10, 3), 6, 1, "hi")
slab("paper", "request-sheet", plan(-100, -5, 30, 26), 7, 1.5, "hi")
line("paper", k.planOutline(plan(-97, -2, 24, 20, 0), 8.5, P), "mid")
for (const y of [3, 8, 13]) line("paper", k.lineOnTop([-97, y], [-73, y], 8.5, P), "faint")
line(
	"stamp",
	k.pathOf(
		[
			[-92, 5, 8.6],
			[-87, 10, 8.6],
			[-77, 0, 8.6],
		].map((p) => k.iso(p, P))
	),
	"hi",
	true
)
// The folder is instantiated four times, not one.
parts += 9
const origin = k.iso([0, 0, 0], P)
const axes = [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1],
].map((point) => k.iso(point, P).map((v, i) => Number((v - origin[i]).toFixed(6))))
const content =
	JSON.stringify({
		width,
		height,
		parts,
		axes,
		...Object.fromEntries(Object.entries(layers).map(([name, items]) => [name, items.join("")])),
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-knowledge/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-knowledge-desk.mjs [--check]\nGenerate the knowledge-desk SVG layers, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error(
			"Knowledge desk art is stale; run node scripts/anatomy/build-knowledge-desk.mjs"
		)
	console.log(`Knowledge desk art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated knowledge desk · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
