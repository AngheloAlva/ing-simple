import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"

// A collation desk for the monthly report. Three stacked letter trays hold one
// area's version of the same total each; their sheets are carried one by one
// into a binder while a desk calendar advances. Beside them, a memo is stamped
// "Decidido" on day 2, long before the binder is complete.
//
// Parts: desk (top, four legs, four feet, two aprons, two stretchers), rack
// (four posts; per tier base, back, two sides, lip, label tab, three resting
// sheets and one carried sheet), binder (cover, clip base, clip lever),
// calendar (base, stand, page, header, two rings), memo, rubber stamp (rubber,
// mount, neck, knob), ink pad (case, pad) and a pencil (body, tip).
const scene = JSON.parse(
	readFileSync(
		new URL("../../components/diagrams/anatomy-report-desk/scene.json", import.meta.url),
		"utf8"
	)
)
const width = 440,
	height = 470
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
const desk = plan(-104, -64, 208, 128, 1.5)
const P = k.fitProjection(
	[...k.boxCorners(desk, -72, 0), ...k.boxCorners(plan(-92, -58, 70, 48), 0, 52)],
	width,
	height,
	{ pad: 8, azimuth: 66, elevation: 40 }
)
let parts = 0
function slab(layer, name, p, z, h, tone = "mid", extra = {}) {
	parts++
	layer.push(
		`<g data-part="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 4, Math.min(0.5, h / 3)), { tone, ...extra })}</g>`
	)
}
function round(layer, name, cx, cy, r, z, h, tone = "mid") {
	parts++
	layer.push(`<g data-part="${name}">${k.solidSvg(k.cylinder(cx, cy, r, z, h, P, 28, 0.3), { tone })}</g>`)
}
const line = (layer, d, tone = "lo", extra = {}) => layer.push(k.lineSvg(d, { tone, ...extra }))
const dots = (layer, points, z, size = 0.5) =>
	layer.push(
		k.dotsSvg(
			points.map(([x, y]) => k.iso([x, y, z], P)),
			{ size, tone: "mid" }
		)
	)
const segment = (a, b) => k.pathOf([k.iso(a, P), k.iso(b, P)])
const byDepth = (points) =>
	[...points].sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))

// ---------------------------------------------------------------- desk
const under = []
under.push(`<path class="iso-halo" d="${k.haloOf(plan(-100, -60, 200, 120, 4), -72, 2, P)}"/>`)
const legs = byDepth(k.corners(desk, 9))
const front = legs.pop()
for (const [i, [x, y]] of legs.entries()) {
	slab(under, `foot-${i}`, plan(x - 5, y - 5, 10, 10, 1), -72, 2, "lo")
	slab(under, `leg-${i}`, plan(x - 4, y - 4, 8, 8, 0.8), -70, 65)
}
// Aprons and stretchers run between the visible legs, under the top.
const [fx, fy] = front
slab(under, "stretcher-right", plan(fx - 1, -50, 2.5, 100), -56, 4, "lo")
slab(under, "apron-right", plan(fx - 1.5, -52, 3, 104), -16, 11)
slab(under, "stretcher-front", plan(-90, fy - 1, 180, 2.5), -56, 4, "lo")
slab(under, "apron-front", plan(-92, fy - 1.5, 184, 3), -16, 11)
slab(under, "foot-front", plan(fx - 5, fy - 5, 10, 10, 1), -72, 2, "lo")
slab(under, "leg-front", plan(fx - 4, fy - 4, 8, 8, 0.8), -70, 65)
slab(under, "desk-top", desk, -5, 5, "mid")
line(under, k.planOutline(k.insetPlan(desk, 4), 0, P), "faint")

// ---------------------------------------------------------------- rack
// Tray footprint shared by the three tiers; posts stand just outside it.
const tray = plan(-88, -54, 60, 40, 1)
const sheetPlan = plan(-82, -50, 48, 32, 0.3)
const rackBack = [],
	rackFront = [],
	tiers = []
rackBack.push(`<path class="iso-halo" d="${k.haloOf(plan(-92, -58, 68, 48, 3), 0, 1, P)}"/>`)
const postTop = 32 + 1.5 + 6
const posts = byDepth([
	[-90.5, -56.5],
	[-25.5, -56.5],
	[-90.5, -11.5],
	[-25.5, -11.5],
])
for (const [i, [x, y]] of posts.entries())
	slab(i < 2 ? rackBack : rackFront, `post-${i}`, plan(x - 1.3, y - 1.3, 2.6, 2.6, 0.5), 0, postTop, "lo")
const carried = scene.trays.map(() => ({}))
for (const t of [0, 1, 2]) {
	const z = t * 16
	const below = [],
		lip = []
	slab(below, `tier-${t}-base`, tray, z, 1.5)
	// Post sockets on the base corners.
	dots(below, k.corners(tray, 2.5), z + 1.5)
	slab(below, `tier-${t}-back`, plan(tray.x, tray.y, 60, 2), z + 1.5, 6)
	slab(below, `tier-${t}-left`, plan(tray.x, tray.y + 2, 2, 36), z + 1.5, 3.2)
	for (let s = 0; s < 3; s++)
		slab(below, `tier-${t}-sheet-${s}`, sheetPlan, z + 1.5 + s * 0.65, 0.65, "hi", { crease: "none" })
	slab(lip, `tier-${t}-right`, plan(tray.x + 58, tray.y + 2, 2, 36), z + 1.5, 3.2)
	slab(lip, `tier-${t}-lip`, plan(tray.x, tray.y + 38, 60, 2), z + 1.5, 1.7)
	slab(lip, `tier-${t}-tab`, plan(-66, tray.y + 40, 16, 0.6, 0.2), z + 1.6, 1.5, "hi")
	line(lip, segment([-63, tray.y + 40.65, z + 2.35], [-53, tray.y + 40.65, z + 2.35]), "faint")
	tiers.push({ below: below.join(""), lip: lip.join("") })
}

// The carried sheet, built at rest on its tier; the page translates it.
const sheetTransforms = []
for (const [i, source] of scene.trays.entries()) {
	const layer = []
	const z = source.z
	slab(layer, `carried-${source.id}`, sheetPlan, z, 0.65, "hi")
	const top = z + 0.65
	// Ruled rows stand for printed text: they end free on the sheet.
	for (const y of [-46, -42, -38])
		line(layer, segment([-78, y, top], [-56, y, top]), "faint", { free: true })
	line(layer, segment([-78, -27, top], [-38, -27, top]), "mid", { free: true })
	carried[i] = layer.join("")
	sheetTransforms.push(k.topMatrix([-50, -29.5], top, P))
}

// ---------------------------------------------------------------- calendar
const calendar = []
const base = plan(40, -46, 44, 22, 1.2)
calendar.push(`<path class="iso-halo" d="${k.haloOf(base, 0, 1, P)}"/>`)
slab(calendar, "calendar-base", base, 0, 5)
dots(calendar, k.corners(base, 3), 5)
slab(calendar, "calendar-stand", plan(46, -42, 32, 3, 0.4), 5, 26, "lo")
slab(calendar, "calendar-page", plan(44, -35, 36, 2, 0.4), 5, 40, "hi")
slab(calendar, "calendar-header", plan(44, -33, 36, 1, 0.3), 36, 9, "mid")
for (const x of [53, 71]) slab(calendar, `calendar-ring-${x}`, plan(x - 1.5, -35.5, 3, 3, 1), 43, 5, "lo")
// Torn stubs of the pages already turned, under the header.
line(calendar, segment([44, -32.95, 34.6], [80, -32.95, 34.6]), "faint")
const calendarMatrix = k.sideMatrix([62, -32.9], 13, P, "left")
const monthMatrix = k.sideMatrix([62, -31.9], 38.6, P, "left")

// ---------------------------------------------------------------- binder
const binder = []
const cover = plan(0, 2, 64, 46, 1.2)
binder.push(`<path class="iso-halo" d="${k.haloOf(cover, 0, 1, P)}"/>`)
slab(binder, "binder-cover", cover, 0, 1.2)
line(binder, k.planOutline(k.insetPlan(cover, 2.5), 1.2, P), "faint")
slab(binder, "binder-clip-base", plan(18, 3.5, 28, 4.5, 0.6), 1.2, 1.6)
slab(binder, "binder-clip-lever", plan(22, 4, 20, 2.6, 0.6), 2.8, 0.9, "hi")
dots(binder, [
	[20, 5.75],
	[44, 5.75],
], 2.8)
binder.push(k.faceTextSvg(k.topMatrix([32, 46], 1.2, P), "INFORME MENSUAL", { size: 2.6, anchor: "middle" }))

// ---------------------------------------------------------------- memo, ink pad, pencil
const memo = []
const sheet = plan(-96, 24, 50, 36, 0.3)
slab(memo, "ink-pad-case", plan(-30, 50, 22, 12, 1.2), 0, 2.4, "lo")
slab(memo, "ink-pad", plan(-28, 52, 18, 8, 0.8), 2.4, 0.3, "mid", { crease: "none" })
slab(memo, "pencil", plan(-36, 8, 2.6, 30, 1.2), 0, 2.6, "hi")
slab(memo, "pencil-ferrule", plan(-36, 8, 2.6, 3, 1.2), 0, 2.6, "mid")
slab(memo, "memo", sheet, 0, 0.6, "hi")
for (const [y, w] of [
	[30, 26],
	[34, 36],
	[38, 30],
])
	line(memo, segment([-90, y, 0.6], [-90 + w, y, 0.6]), "faint", { free: true })
line(memo, segment([-90, 27, 0.6], [-74, 27, 0.6]), "mid", { free: true })
const imprint = plan(-88, 42, 34, 14, 1)
const imprintOutline = k.planOutline(imprint, 0.62, P)
const imprintMatrix = k.topMatrix([-71, 51], 0.62, P)
const dayMatrix = k.topMatrix([-71, 54], 0.62, P)

// Rubber stamp, built resting on the memo; the page lifts it.
const stamp = []
slab(stamp, "stamp-rubber", imprint, 0.6, 1.4, "lo")
slab(stamp, "stamp-mount", plan(-87, 43, 32, 12, 1), 2, 4)
line(stamp, k.planOutline(plan(-85, 45, 28, 8, 0.6), 6, P), "faint")
round(stamp, "stamp-neck", -71, 49, 3, 6, 6)
round(stamp, "stamp-knob", -71, 49, 6.5, 12, 6, "hi")
const stampHalo = k.haloOf(plan(-89, 41, 36, 16, 3), 0.6, 1, P)

const unit = (v) => k.axisVector(P, v).map((n) => Number(n.toFixed(6)))
const content =
	JSON.stringify({
		width,
		height,
		parts,
		axes: { x: unit([1, 0, 0]), y: unit([0, 1, 0]), z: unit([0, 0, 1]) },
		under: under.join(""),
		rackBack: rackBack.join(""),
		tiers,
		rackFront: rackFront.join(""),
		carried,
		sheetTransforms,
		calendar: calendar.join(""),
		calendarMatrix,
		monthMatrix,
		binder: binder.join(""),
		memo: memo.join(""),
		imprintOutline,
		imprintMatrix,
		dayMatrix,
		stamp: stamp.join(""),
		stampHalo,
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-report-desk/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-report-desk.mjs [--check]\nGenerate the report-desk SVG layers, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error("Report desk art is stale; run node scripts/anatomy/build-report-desk.mjs")
	console.log(`Report desk art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated report desk · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
