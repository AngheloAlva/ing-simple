import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"

// A twelve-cubby sorter on a work table, built for the operation as it was.
// Orders fill the cubbies, then spill into improvised patches on the table (a
// shared clipboard, an email tray, a phone) and finally pile up on top.
//
// Parts: table (top, four legs, front and side aprons), sorter (plinth, back,
// three shelves, top, five walls per row, a label strip under every cubby),
// clipboard (board, clip, two rivets), wire tray (base, four walls), phone
// (body, screen, camera), and one solid per order: 12 folders, 6 sheets,
// 6 envelopes, 3 messages and 3 folders on the pile.
//
// The page renders `sequence` in order: static art, order items (moved by the
// model) and patch parts (shown once their patch is opened).
const width = 440,
	height = 500
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
const table = plan(-62, -30, 124, 64, 1.5)
const P = k.fitProjection([...k.boxCorners(table, 0, 30), ...k.boxCorners(plan(-47, -26, 94, 22), 30, 104)], width, height, {
	pad: 8,
	azimuth: 62,
	elevation: 32,
})
let parts = 0
const solid = (name, p, z, h, tone = "mid", extra = {}) => {
	parts++
	return `<g data-part="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 4, Math.min(0.5, h / 3)), { tone, ...extra })}</g>`
}
const line = (d, tone = "lo", extra = {}) => k.lineSvg(d, { tone, ...extra })
const segment = (a, b) => k.pathOf([k.iso(a, P), k.iso(b, P)])
const dots = (points, z) =>
	k.dotsSvg(
		points.map(([x, y]) => k.iso([x, y, z], P)),
		{ size: 0.5, tone: "mid" }
	)
const sequence = []
const add = (svg) => sequence.push({ kind: "static", svg })
const item = (index, svg) => sequence.push({ kind: "item", index, svg })
const patch = (id, svg) => sequence.push({ kind: "patch", id, svg })
let order = 0
const next = () => order++

// ---------------------------------------------------------------- table
const legs = k
	.corners(table, 6)
	.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
add(`<path class="iso-halo" d="${k.haloOf(plan(-58, -26, 116, 58, 4), 0, 2, P)}"/>`)
add(
	legs
		.slice(0, 3)
		.map(([x, y], i) => solid(`leg-${i}`, plan(x - 3, y - 3, 6, 6, 0.6), 0, 26))
		.join("")
)
add(solid("apron-front", plan(-54, 30.5, 108, 2), 20, 6, "lo"))
add(solid("apron-right", plan(55.5, -24, 2, 54), 20, 6, "lo"))
add(solid(`leg-3`, plan(legs[3][0] - 3, legs[3][1] - 3, 6, 6, 0.6), 0, 26))
add(solid("table-top", table, 26, 4))
add(line(k.planOutline(k.insetPlan(table, 3), 30, P), "faint"))

// ---------------------------------------------------------------- sorter
add(`<path class="iso-halo" d="${k.haloOf(plan(-49, -28, 98, 26, 2), 30, 1, P)}"/>`)
add(solid("sorter-plinth", plan(-47, -26, 94, 22, 0.8), 30, 3, "lo"))
add(solid("sorter-back", plan(-47, -26, 94, 2), 33, 58))
const cubbies = []
for (let r = 0; r < 3; r++) {
	const s = 33 + r * 18.5
	add(solid(`shelf-${r}`, plan(-47, -24, 94, 20, 0.4), s, 1.5))
	for (let c = 0; c < 4; c++) {
		const x0 = -45 + c * 23
		add(solid(`label-${r}-${c}`, plan(x0 + 6, -4, 9, 0.5, 0.2), s + 0.2, 1.1, "hi"))
	}
	for (let c = 0; c <= 4; c++) {
		add(solid(`wall-${r}-${c}`, plan(-47 + c * 23, -24, 2, 20, 0.3), s + 1.5, 17, c === 0 ? "hi" : "mid"))
		if (c === 4) break
		// Cubbies fill in reading order: top row first, left to right.
		const slot = (2 - r) * 4 + c
		cubbies[slot] = { r, c, s }
		const x0 = -45 + c * 23
		const folder = [
			solid(`folder-${slot}`, plan(x0 + 2.5, -21, 16, 15, 0.4), s + 1.5, 2.6, "hi"),
			solid(`folder-${slot}-tab`, plan(x0 + 4, -6.6, 6, 1, 0.3), s + 1.5, 3.6, "hi"),
			line(segment([x0 + 5, -18, s + 4.1], [x0 + 15, -18, s + 4.1]), "faint", { free: true }),
		].join("")
		sequence.push({ kind: "item", slot, svg: folder })
	}
}
add(solid("sorter-top", plan(-47.5, -26.5, 95, 23, 0.8), 88.5, 2.5))
add(dots(k.corners(plan(-47.5, -26.5, 95, 23), 2.5), 91))
// Cubby folders are emitted per row above; map their slot to order indices.
for (const entry of sequence) if (entry.kind === "item" && entry.slot !== undefined) entry.index = entry.slot

// ---------------------------------------------------------------- patches
order = 12
// Shared clipboard ("Planilla").
patch(
	"sheet",
	[
		solid("clipboard", plan(-58, 4, 30, 27, 1), 30, 1.2, "hi", { lit: true }),
		solid("clipboard-clip", plan(-49, 4.5, 12, 4, 0.6), 31.2, 1.8, "mid"),
		dots(
			[
				[-47.5, 6.5],
				[-38.5, 6.5],
			],
			33
		),
	].join("")
)
for (let i = 0; i < 6; i++) {
	const z = 31.2 + i * 0.55
	item(
		next(),
		[
			solid(`sheet-${i}`, plan(-56 + i * 0.5, 9 + i * 0.6, 24, 19, 0.2), z, 0.5, "hi", { crease: "none" }),
			line(segment([-53 + i * 0.5, 13 + i * 0.6, z + 0.5], [-38 + i * 0.5, 13 + i * 0.6, z + 0.5]), "faint", {
				free: true,
			}),
		].join("")
	)
}
// Email tray ("Correo"): base and back walls, envelopes, then the front walls.
patch(
	"mail",
	[
		solid("tray-base", plan(-18, 4, 32, 27, 1), 30, 1.2, "lo", { lit: true }),
		solid("tray-back", plan(-18, 4, 32, 1.5, 0.4), 31.2, 6),
		solid("tray-left", plan(-18, 5.5, 1.5, 25.5, 0.4), 31.2, 6, "hi"),
	].join("")
)
for (let i = 0; i < 6; i++) {
	const z = 31.2 + i * 0.85
	const e = plan(-15 + (i % 2) * 0.8, 8 + i * 0.4, 25, 17, 0.3)
	item(
		next(),
		[
			solid(`envelope-${i}`, e, z, 0.7, "hi", { crease: "none" }),
			line(
				k.pathOf([
					k.iso([e.x, e.y, z + 0.7], P),
					k.iso([e.x + e.w / 2, e.y + 7, z + 0.7], P),
					k.iso([e.x + e.w, e.y, z + 0.7], P),
				]),
				"faint"
			),
		].join("")
	)
}
patch(
	"mail",
	[
		solid("tray-right", plan(12.5, 5.5, 1.5, 25.5, 0.4), 31.2, 6),
		solid("tray-front", plan(-18, 29.5, 32, 1.5, 0.4), 31.2, 3.5, "hi"),
		...[-8, 2].map((x) => line(segment([x, 31.05, 31.6], [x, 31.05, 34.3]), "faint")),
	].join("")
)
// Phone ("WhatsApp"): body, screen and camera; messages land on the screen.
patch(
	"chat",
	[
		solid("phone", plan(24, 8, 15, 27, 2.6), 30, 2, "hi", { lit: true }),
		solid("phone-screen", plan(25.3, 10.5, 12.4, 22, 1.6), 32, 0.2, "lo", { crease: "none" }),
		dots([[31.5, 9.3]], 32),
	].join("")
)
for (let i = 0; i < 3; i++)
	item(next(), solid(`message-${i}`, plan(i % 2 ? 29 : 26.5, 12.5 + i * 6.5, 8.5, 4.5, 1.6), 32.2, 0.5, "hi"))
// Overflow pile on top of the sorter.
for (let i = 0; i < 3; i++) {
	const z = 91 + i * 2.6
	item(
		next(),
		[
			solid(`pile-${i}`, plan(-22 + i * 2.5, -24 + i * 1.2, 18, 16, 0.4), z, 2.6, "hi"),
			solid(`pile-${i}-tab`, plan(-20 + i * 2.5, -8.8 + i * 1.2, 6, 1, 0.3), z, 3.2, "hi"),
		].join("")
	)
}
for (const entry of sequence) delete entry.slot

const unit = (v) => k.axisVector(P, v).map((n) => Number(n.toFixed(6)))
const content =
	JSON.stringify({ width, height, parts, axes: { y: unit([0, 1, 0]), z: unit([0, 0, 1]) }, sequence }) + "\n"
const target = new URL("../../components/diagrams/anatomy-sorter/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-sorter.mjs [--check]\nGenerate the sorter SVG sequence, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error("Sorter art is stale; run node scripts/anatomy/build-sorter.mjs")
	console.log(`Sorter art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated sorter · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
