import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"
import { homeProjection } from "./home-camera.mjs"

// Three separate filing drawers hold one order's facts. Opening a drawer
// exposes its local record, but never fills the shared report in front.
// Per cabinet: four feet, plinth, back, two sides, lid, two closed lower drawers
// with grips, divider, two guide rails, drawer bottom/back/sides/front, two handle
// mounts and grip, record and tab. Taller than the desks, as a filing cabinet is.
// Shared report: board, sheet, clip feet/bar and three empty ruled fields.
const scene = JSON.parse(
	readFileSync(
		new URL("../../components/diagrams/anatomy-scattered/scene.json", import.meta.url),
		"utf8"
	)
)
const width = 480,
	height = 240
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
// Height of the two closed drawers below the one that opens.
const LIFT = 30
const board = plan(-48, 64, 96, 39, 1)
// Cabinets with their drawers fully open, plus the shared report in front.
const P = homeProjection(
	[...k.boxCorners(plan(-118, -38, 236, 86), -8, 46 + LIFT), ...k.boxCorners(board, 0, 5)],
	width,
	height,
	{ below: 28 }
)
let parts = 0
const layers = { report: [] }
const cabinets = []
function slab(layer, name, p, z, h, tone = "mid") {
	parts++
	layer.push(
		`<g data-part="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 4, Math.min(0.5, h / 3)), { tone })}</g>`
	)
}
const line = (layer, d, tone = "lo") => layer.push(k.lineSvg(d, { tone }))
const dots = (layer, points, z) =>
	layer.push(
		k.dotsSvg(
			points.map(([x, y]) => k.iso([x, y, z], P)),
			{ size: 0.55, tone: "mid" }
		)
	)
for (const source of scene.sources) {
	const x = source.x
	const back = [],
		drawer = [],
		front = []
	const base = plan(x - 30, -38, 60, 48, 1)
	back.push(`<path class="iso-halo" d="${k.haloOf(base, -8, 4, P)}"/>`)
	for (const [i, [fx, fy]] of k
		.corners(base, 5)
		.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
		.entries())
		slab(back, `foot-${i}`, plan(fx - 3, fy - 3, 6, 6), -8, 8, "lo")
	slab(back, "plinth", base, 0, 3)
	slab(back, "cabinet-back", plan(x - 29, -37, 58, 3), 3, 40 + LIFT)
	slab(back, "cabinet-left", plan(x - 29, -34, 3, 43), 3, 40 + LIFT, "hi")
	// Two closed drawers fill the lower carcass; only the top one ever opens.
	for (const [i, z] of [3, 3 + LIFT / 2].entries()) {
		slab(back, `lower-front-${i}`, plan(x - 26, 7, 52, 2), z + 0.5, LIFT / 2 - 1, "hi")
		slab(back, `lower-grip-${i}`, plan(x - 8, 9, 16, 2), z + LIFT / 2 - 7, 2, "hi")
	}
	slab(back, "divider", plan(x - 26, -34, 52, 43), 1 + LIFT, 2, "lo")
	// The opening is real: open-front casing with an independently sliding drawer.
	for (const dx of [-25, 23]) {
		slab(back, `guide-${dx}`, plan(x + dx, -33, 2, 40), 3 + LIFT, 2, "lo")
		dots(
			back,
			[
				[x + dx + 1, -30],
				[x + dx + 1, 4],
			],
			5 + LIFT
		)
	}
	slab(drawer, "drawer-bottom", plan(x - 24, -32, 48, 39), 5 + LIFT, 2)
	slab(drawer, "drawer-back", plan(x - 24, -32, 48, 2), 7 + LIFT, 13)
	slab(drawer, "drawer-left", plan(x - 24, -30, 2, 37), 7 + LIFT, 13)
	// Upright record sits in the drawer immediately behind its front, not floating.
	slab(drawer, "record", plan(x - 18, 0, 36, 1), 7 + LIFT, 31, "hi")
	slab(drawer, "record-tab", plan(x - 17, 0, 10, 1), 38 + LIFT, 3, "hi")
	const recordOutline = k.pathOf(
		[
			[x - 15, 1.1, 22 + LIFT],
			[x + 15, 1.1, 22 + LIFT],
			[x + 15, 1.1, 35 + LIFT],
			[x - 15, 1.1, 35 + LIFT],
		].map((point) => k.iso(point, P)),
		true
	)
	line(drawer, recordOutline, "faint")
	const numberTransform = k.sideMatrix([x, 1.2], 25 + LIFT, P, "left")
	// The foreground wall and handle paint after the record.
	const lip = []
	slab(lip, "drawer-right", plan(x + 22, -30, 2, 37), 7 + LIFT, 13)
	slab(lip, "drawer-front", plan(x - 25, 7, 50, 2), 5 + LIFT, 16, "hi")
	for (const dx of [-10, 8])
		slab(lip, `handle-mount-${dx}`, plan(x + dx, 9, 2, 3), 10 + LIFT, 3, "hi")
	slab(lip, "handle-grip", plan(x - 10, 12, 20, 2), 10 + LIFT, 3, "hi")
	// Tiny face fasteners belong to the handle mount plane, not a top surface.
	for (const dx of [-9, 9]) {
		const [cx, cy] = k.iso([x + dx, 14, 11.5 + LIFT], P)
		lip.push(
			`<circle class="cabinet-fastener" cx="${cx.toFixed(2)}" cy="${cy.toFixed(2)}" r="0.5"/>`
		)
	}
	slab(front, "cabinet-right", plan(x + 26, -34, 3, 43), 3, 40 + LIFT, "hi")
	slab(front, "cabinet-lid", plan(x - 30, -38, 60, 48, 1), 43 + LIFT, 3, "hi")
	line(front, k.planOutline(plan(x - 27, -35, 54, 42, 0.4), 46 + LIFT, P), "faint")
	dots(front, k.corners(base, 5), 46 + LIFT)
	cabinets.push({
		id: source.id,
		back: back.join(""),
		drawer: drawer.join(""),
		lip: lip.join(""),
		front: front.join(""),
		numberTransform,
	})
}
const report = layers.report
report.push(`<path class="iso-halo" d="${k.haloOf(board, -1, 2, P)}"/>`)
slab(report, "report-board", board, 0, 2, "hi")
slab(report, "report-sheet", plan(-44, 67, 88, 32, 0.3), 2, 0.7, "hi")
for (const x of [-8, 6]) slab(report, `clip-foot-${x}`, plan(x, 64, 2, 6), 2.7, 1.5)
slab(report, "report-clip", plan(-9, 64, 18, 4), 4.2, 1, "hi")
dots(
	report,
	[
		[-6, 66],
		[6, 66],
	],
	5.2
)
const fields = [-28, 0, 28].map((x, i) => {
	line(report, k.planOutline(plan(x - 11, 76, 22, 17, 0), 2.7, P), "mid")
	return { id: scene.sources[i].id, transform: k.topMatrix([x, 89], 2.8, P) }
})
// Anchor below the projected lower corner, not a world-space Y point:
// the board's right corner sits lower on screen than its centre.
const reportBottom = Math.max(...k.boxCorners(board, 0, 2).map((point) => k.iso(point, P)[1]))
const labelPoint = [k.iso([0, board.y + board.d / 2, 0], P)[0], reportBottom + 26]
const origin = k.iso([0, 0, 0], P)
const slide = k.iso([0, scene.drawerTravel, 0], P).map((v, i) => Number((v - origin[i]).toFixed(6)))
const content =
	JSON.stringify({
		width,
		height,
		parts,
		slide,
		cabinets,
		report: report.join(""),
		fields,
		labelPoint,
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-scattered/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-scattered-cabinet.mjs [--check]\nGenerate the scattered-data SVG layers, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error(
			"Scattered cabinet art is stale; run node scripts/anatomy/build-scattered-cabinet.mjs"
		)
	console.log(`Scattered cabinet art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated scattered cabinet · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
