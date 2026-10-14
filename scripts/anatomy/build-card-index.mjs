import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"

// A card index drawer for the processing-activity register. Each card is one
// activity; its tab names the legal basis. The card without a basis leaves
// the drawer for an upright stand labelled "Justificar o eliminar".
//
// Parts: drawer (four feet, plinth, back, left, right and front walls,
// follower block, rod in segments, label holder, pull), five cards with their
// tabs, and the stand (base, back and front slot blocks).
const scene = JSON.parse(
	readFileSync(new URL("../../components/diagrams/anatomy-card-index/scene.json", import.meta.url), "utf8")
)
const width = 560,
	height = 400
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
const P = k.fitProjection(
	[
		...k.boxCorners(plan(-42, -64, 84, 128), 0, 52 + scene.lift),
		...k.boxCorners(plan(44, -10, 74, 20), 0, 52 + scene.lift),
	],
	width,
	height,
	{ pad: 8, azimuth: 52, elevation: 30 }
)
let parts = 0
const solid = (name, p, z, h, tone = "mid", extra = {}) => {
	parts++
	return `<g data-part="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 4, Math.min(0.5, h / 3)), { tone, ...extra })}</g>`
}
const line = (d, tone = "lo", extra = {}) => k.lineSvg(d, { tone, ...extra })
const segment = (a, b) => k.pathOf([k.iso(a, P), k.iso(b, P)])
const faceText = (x, y, z, text, size, tone = "mid") =>
	k.faceTextSvg(k.sideMatrix([x, y], z, P, "left"), text, { size, tone, anchor: "middle" })

// ---------------------------------------------------------------- drawer, back half
const under = []
const box = plan(-40, -62, 80, 124, 1.2)
under.push(`<path class="iso-halo" d="${k.haloOf(plan(-40, -60, 84, 126, 4), 0, 2, P)}"/>`)
for (const [i, [x, y]] of k
	.corners(box, 6)
	.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
	.entries())
	under.push(solid(`foot-${i}`, plan(x - 4, y - 4, 8, 8, 1), 0, 4, "lo"))
under.push(solid("plinth", box, 4, 3))
under.push(solid("wall-back", plan(-40, -62, 80, 3, 0.6), 7, 23))
under.push(solid("wall-left", plan(-40, -59, 3, 118, 0.6), 7, 23, "hi"))
under.push(solid("follower", plan(-34, -56, 68, 6, 0.8), 7, 20, "lo"))
under.push(solid("follower-knob", plan(-4, -50, 8, 3, 1.2), 22, 4, "mid"))
const rod = (from, to) => solid(`rod-${from}`, plan(-1.2, from, 2.4, to - from, 1), 11, 2.4, "lo")

// ---------------------------------------------------------------- cards, back to front
const TAB_X = [-34, -13, 8]
const cardSvg = (card) => {
	const y = card.y
	const face = y + 1.05
	return [
		solid(`card-${card.id}`, plan(-34, y, 68, 1, 0.3), 8, 38, "hi"),
		faceText(0, face, 39, card.purpose, 3.6, "hi"),
		faceText(0, face, 33.5, card.source, 2.6),
		...[27, 23, 19].map((z) =>
			line(segment([-26, face, z], [26, face, z]), "faint", { free: true })
		),
		// Punched hole the drawer rod runs through.
		`<path class="card-hole" d="${k.pathOf(
			[
				[-2, face, 10.5],
				[2, face, 10.5],
				[2, face, 14],
				[-2, face, 14],
			].map((p) => k.iso(p, P)),
			true
		)}"/>`,
	].join("")
}
const ordered = [...scene.cards].sort((a, b) => a.y - b.y)
const slots = []
let rodFrom = -50
for (const card of ordered) {
	const x = TAB_X[card.tab]
	const tab = card.basis
		? [
				solid(`tab-${card.id}`, plan(x, card.y, 26, 1.2, 0.4), 46, 6, "mid"),
				faceText(x + 13, card.y + 1.25, 50.2, card.basis, 2.5, "hi"),
			].join("")
		: ""
	slots.push({ id: card.id, rod: rod(rodFrom, card.y), card: cardSvg(card), tab })
	rodFrom = card.y + 1
}
const rodLast = rod(rodFrom, 59)

// ---------------------------------------------------------------- drawer, front half
const front = []
front.push(solid("wall-right", plan(37, -59, 3, 118, 0.6), 7, 23))
front.push(solid("wall-front", plan(-40, 59, 80, 3, 0.6), 7, 23, "hi"))
front.push(line(k.planOutline(plan(-38, -60, 76, 120, 0.6), 30, P), "faint"))
front.push(solid("label-holder", plan(-14, 62, 28, 0.6, 0.3), 18, 9, "mid"))
front.push(faceText(0, 62.65, 21.5, "TRATAMIENTOS", 2.6, "hi"))
front.push(solid("pull", plan(-9, 62, 18, 2.6, 1.2), 11, 3.2, "hi"))
front.push(k.dotsSvg([[-12.5, 62.65, 22.5], [12.5, 62.65, 22.5]].map((p) => k.iso(p, P)), { size: 0.5, tone: "mid" }))

// ---------------------------------------------------------------- stand
const standBack = [
	`<path class="iso-halo" d="${k.haloOf(plan(44, -10, 74, 20, 3), 0, 2, P)}"/>`,
	solid("stand-base", plan(44, -9, 74, 18, 1), 0, 3, "lo"),
	solid("stand-slot-back", plan(46, -4, 70, 3.6, 0.6), 3, 9),
].join("")
const standFront = [
	solid("stand-slot-front", plan(46, 1.4, 70, 3.6, 0.6), 3, 9, "hi"),
	faceText(81, 9.05, 1.6, "JUSTIFICAR O ELIMINAR", 2.2, "hi"),
].join("")
const parked = scene.cards.find((card) => card.basis === null)

const unit = (v) => k.axisVector(P, v).map((n) => Number(n.toFixed(6)))
const content =
	JSON.stringify({
		width,
		height,
		parts,
		axes: { x: unit([1, 0, 0]), z: unit([0, 0, 1]) },
		under: under.join(""),
		slots,
		rodLast,
		front: front.join(""),
		standBack,
		parked: { id: parked.id, card: cardSvg(parked) },
		standFront,
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-card-index/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-card-index.mjs [--check]\nGenerate the card-index SVG layers, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error("Card index art is stale; run node scripts/anatomy/build-card-index.mjs")
	console.log(`Card index art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated card index · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
