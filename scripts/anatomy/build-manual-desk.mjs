import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"

// Manual processing: a copied field travels through review, returns for correction,
// then reaches dispatch. The worker stays present throughout.
// Parts: structural desk and chair, seated worker, source clipboard with supports,
// loading/review pads, dispatch tray, two folders and a three-part pencil.
const scene = JSON.parse(
	readFileSync(
		new URL("../../components/diagrams/anatomy-manual/scene.json", import.meta.url),
		"utf8"
	)
)
const width = 480,
	height = 240
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
const desk = plan(-125, -30, 250, 95, 3)
const P = k.fitProjection(
	[...k.boxCorners(desk, -48, 4), [-20, -85, -48], [20, -85, 40]],
	width,
	height,
	{ pad: 9, azimuth: 65, elevation: 26 }
)
const layers = { chair: [], person: [], desk: [], source: [], paper: [], pen: [] }
let parts = 0
function slab(layer, name, p, z, h, tone = "mid", lit = false) {
	parts++
	layers[layer].push(
		`<g data-part="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 5, Math.min(0.45, h / 3)), { tone, lit: layer !== "person" && lit })}</g>`
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
// The worker remains at the desk; this is repetitive work, not an absent colleague.
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
for (const [name, p] of [
	["loading-pad", plan(-102, 0, 48, 40, 1)],
	["review-pad", plan(-28, -2, 56, 44, 1)],
]) {
	slab("desk", name, p, 4, 1, "lo")
	line("desk", k.planOutline(k.insetPlan(p, 2), 5, P), "faint")
}
// Upright source document, physically supported behind the loading pad.
slab("source", "clipboard-base", plan(-104, -27, 52, 26, 1), 4, 2, "lo")
for (const x of [-99, -61])
	slab("source", `clipboard-bracket-${x}`, plan(x, -24, 3, 22), 6, 4, "mid")
slab("source", "clipboard-board", plan(-100, -22, 44, 3, 1), 6, 34, "hi")
const sourceOutline = k.pathOf(
	[
		[-96, -18.9, 10],
		[-60, -18.9, 10],
		[-60, -18.9, 36],
		[-96, -18.9, 36],
	].map((p) => k.iso(p, P)),
	true
)
layers.source.push(`<path class="iso-top" d="${sourceOutline}"/>`)
line("source", sourceOutline, "mid")
slab("source", "clipboard-clip", plan(-84, -24, 12, 7, 0.5), 40, 1.5, "mid")
screws("source", plan(-84, -24, 12, 7, 0.5), 41.5)
layers.source.push(
	k.faceTextSvg(k.sideMatrix([-78, -18.8], 30, P, "left"), "PEDIDO", {
		size: 3.5,
		anchor: "middle",
	})
)
layers.source.push(
	k.faceTextSvg(k.sideMatrix([-78, -18.8], 16, P, "left"), String(scene.sourceQuantity), {
		size: 12,
		anchor: "middle",
		tone: "hi",
	})
)
const out = scene.send
slab("desk", "dispatch-tray", plan(out.x - 25, -5, 50, 50, 1), 4, 2, "lo")
for (const [i, p] of [
	plan(out.x - 25, -5, 50, 2),
	plan(out.x - 25, -3, 2, 48),
	plan(out.x + 23, -3, 2, 48),
].entries())
	slab("desk", `dispatch-rim-${i}`, p, 6, 4)
slab("desk", "dispatch-plate", plan(out.x - 18, 48, 36, 7), 4, 0.5, "lo")
screws("desk", plan(out.x - 18, 48, 36, 7), 4.5)
layers.desk.push(
	k.faceTextSvg(k.topMatrix([out.x, 53], 4.5, P), "ENVÍOS", { size: 3.5, anchor: "middle" })
)
// One reusable paper geometry; the incoming second order remains blank.
const h = scene.load
slab("paper", "folder-cover", plan(h.x - 18, h.y - 16, 36, 32), h.z, 1, "hi")
slab("paper", "folder-tab", plan(h.x - 16, h.y - 19, 10, 3), h.z, 1, "hi")
slab("paper", "entry-sheet", plan(h.x - 15, h.y - 13, 30, 26), h.z + 1, 1.5, "hi")
line("paper", k.planOutline(plan(h.x - 12, h.y - 10, 24, 20, 0), h.z + 2.5, P), "mid")
line("paper", k.lineOnTop([h.x - 12, h.y - 6], [h.x + 12, h.y - 6], h.z + 2.5, P), "faint")
parts += 3 // A second cover, tab and sheet for the next order.
const pen = scene.penRest
slab("pen", "pencil-body", plan(pen.x - 1, pen.y - 6, 2, 12, 0.3), pen.z, 1.5, "hi", true)
slab("pen", "pencil-eraser", plan(pen.x - 1, pen.y + 6, 2, 2, 0.3), pen.z, 1.5, "mid")
slab("pen", "pencil-tip", plan(pen.x - 0.6, pen.y - 9, 1.2, 3, 0.2), pen.z, 1.2, "hi")
const origin = k.iso([0, 0, 0], P)
const axes = [
	[1, 0, 0],
	[0, 1, 0],
	[0, 0, 1],
].map((point) => k.iso(point, P).map((v, i) => Number((v - origin[i]).toFixed(6))))
const fieldTransform = k.topMatrix([h.x, h.y + 6], h.z + 2.6, P)
const content =
	JSON.stringify({
		width,
		height,
		parts,
		axes,
		fieldTransform,
		...Object.fromEntries(Object.entries(layers).map(([name, items]) => [name, items.join("")])),
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-manual/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-manual-desk.mjs [--check]\nGenerate the manual-processing SVG layers, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error("Manual desk art is stale; run node scripts/anatomy/build-manual-desk.mjs")
	console.log(`Manual desk art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated manual desk · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
