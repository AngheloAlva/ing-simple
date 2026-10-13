import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"

// Anatomy Figure: a document sorter, not a diagram of an abstract pipeline.
// Parts: 8 feet/pads, base, 4 deck supports, deck, 3 input walls, 3 paper
// sheets, 2 guides, 2 tray floors + 6 rims, 6 gantry mounts/posts/caps,
// crossbar + 2 collars + reader + lens, console mount/body/bezel/display,
// 2 keys, ruler, label plate and the moving request. All have real thickness.
const W = 640,
	H = 350
const BASE = { x: -150, y: -78, w: 300, d: 156, r: 7 }
const P = k.fitProjection([...k.boxCorners(BASE, -15, 0), [-100, -48, 52], [-20, 36, 76]], W, H, {
	pad: 34,
	azimuth: 55,
	elevation: 32,
})
const layers = { back: [], front: [], card: [] }
let parts = 0
const plan = (x, y, w, d, r = 1) => ({ x, y, w, d, r })
const line = (layer, d, tone = "lo", free = false) =>
	layers[layer].push(k.lineSvg(d, { tone, free }))
const dots = (layer, points, z) =>
	layers[layer].push(
		k.dotsSvg(
			points.map(([x, y]) => k.iso([x, y, z], P)),
			{ size: 0.55, tone: "mid" }
		)
	)
function slab(layer, name, p, z, h, tone = "mid", extra = "") {
	parts++
	layers[layer].push(
		`<g data-piece="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 4, Math.min(h / 3, 0.7)), { tone, lit: layer === "card" })}${extra}</g>`
	)
}
function screws(layer, p, z) {
	dots(layer, k.corners(p, 3), z)
}

layers.back.push(`<path class="iso-halo" d="${k.haloOf(BASE, -15, 4, P)}"/>`)
for (const [i, [x, y]] of k
	.corners(BASE, 22)
	.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
	.entries()) {
	slab("back", `foot-pad-${i}`, plan(x - 9, y - 8, 18, 16, 2), -15, 3, "lo")
	slab("back", `foot-${i}`, plan(x - 7, y - 6, 14, 12, 1.5), -12, 5, "lo")
}
slab("back", "base", BASE, -7, 7, "lo")
line("back", k.planOutline(k.insetPlan(BASE, 4), 0, P), "faint")
screws("back", k.insetPlan(BASE, 8), 0)
for (const [i, [x, y]] of [
	[-130, -54],
	[112, -54],
	[-130, 43],
	[112, 43],
].entries()) {
	slab("back", `deck-support-${i}`, plan(x, y, 18, 14, 2), 0, 11)
}
const deck = plan(-136, -64, 272, 128, 4)
slab("back", "transport-deck", deck, 11, 6)
line("back", k.planOutline(k.insetPlan(deck, 3), 17, P), "faint")
screws("back", k.insetPlan(deck, 3), 17)

// Open-front inlet: printed lines are the only deliberately free line ends.
for (const [i, p] of [
	plan(-130, -22, 3, 44),
	plan(-130, -25, 31, 3),
	plan(-130, 22, 31, 3),
].entries()) {
	slab("back", `inlet-rim-${i}`, p, 17, 5, "lo")
}
for (let i = 0; i < 3; i++) {
	const p = plan(-125 + i, -16 + i, 26, 32, 1)
	slab("back", `queued-sheet-${i}`, p, 17 + i * 0.9, 0.9, "lo")
	if (i === 2)
		for (let row = 0; row < 4; row++)
			line("back", k.lineOnTop([-118, -9 + row * 5], [-105, -9 + row * 5], 19.7, P), "faint", true)
}
for (const y of [-23, 20]) {
	const p = plan(-97, y, 111, 3, 0.5)
	slab("back", `guide-${y}`, p, 17, 2, "lo")
	dots(
		"back",
		[
			[-93, y + 1.5],
			[9, y + 1.5],
		],
		19
	)
}
for (const [name, y] of [
	["registered", -59],
	["review", 4],
]) {
	const p = plan(55, y, 75, 55, 2)
	slab("back", `${name}-tray`, p, 17, 0.3, "lo")
	line("back", k.planOutline(k.insetPlan(p, 4), 17.3, P), "faint")
	// Open toward the incoming carriage; no wall crosses its lateral path.
	for (const [i, rim] of [
		plan(55, name === "review" ? 15 : -57, 2, 42),
		plan(128, y + 2, 2, 51),
	].entries())
		slab("back", `${name}-rim-${i}`, rim, 17.3, 3, "lo")
	slab(
		name === "review" ? "front" : "back",
		`${name}-outer-rim`,
		plan(55, name === "review" ? y + 53 : y, 75, 2),
		17.3,
		3,
		"lo"
	)
}

// The back post precedes the card. The near post and bridge wrap it in front.
for (const [layer, y] of [
	["back", -40],
	["front", 29],
]) {
	const mount = plan(-35, y - 2, 32, 15, 2)
	slab(layer, `${layer}-gantry-shoe`, mount, 17, 4)
	screws(layer, mount, 21)
	const post = plan(-29, y, 20, 11, 1)
	slab(layer, `${layer}-gantry-post`, post, 21, 43)
	line(layer, k.sideSeam(post, 59, P, 4), "faint")
	slab(layer, `${layer}-gantry-cap`, plan(-31, y - 1, 24, 13, 1.5), 64, 4)
}
// The reader hangs below the bridge: paint its top before the bridge covers it.
slab("front", "reader-housing", plan(-27, -16, 16, 32, 2), 58, 10)
slab("front", "reader-lens", plan(-11, -11, 0.7, 22, 0.1), 60, 4, "hi")
slab("front", "reader-bridge", plan(-31, -40, 24, 80, 2), 68, 8, "hi")
screws("front", plan(-31, -40, 24, 80, 2), 76)
for (const y of [-30, 24])
	slab("front", `bridge-collar-${y}`, plan(-32, y, 26, 6, 0.5), 76, 1, "lo")
for (let i = 0; i < 5; i++)
	line("front", k.planOutline(plan(-26, -11 + i * 5, 14, 1, 0.4), 76, P), "lo")

// Rear console, fastened to the deck; no floating screen or cables.
slab("back", "console-plinth", plan(-115, -59, 51, 28, 2), 17, 4)
slab("back", "console-case", plan(-111, -57, 43, 24, 2), 21, 20)
slab("back", "console-bezel", plan(-108, -54, 30, 18, 1), 41, 1, "hi")
slab("back", "console-display", plan(-105, -51, 24, 12, 0.5), 42, 0.2, "lo")
for (let row = 0; row < 3; row++)
	line("back", k.lineOnTop([-102, -48 + row * 3], [-85, -48 + row * 3], 42.2, P), "mid", true)
for (const y of [-50, -42]) slab("back", `console-key-${y}`, plan(-75, y, 4, 5, 0.5), 41, 1.3, "hi")
const ruler = plan(-124, 68, 200, 5, 0.5)
slab("back", "calibration-strip", ruler, 0, 0.6, "lo")
const ticks = k.topTicks(-119, 71, 5, 5, 68, 0.6, [1.8, 5], P)
line("back", ticks.minor, "lo")
line("back", ticks.major, "mid")
const label = plan(99, 67, 34, 7, 0.5)
slab("back", "serial-plate", label, 0, 0.6, "lo")
dots(
	"back",
	[
		[102, 70.5],
		[130, 70.5],
	],
	0.6
)
line("back", k.lineOnTop([106, 70.5], [126, 70.5], 0.6, P), "mid", true)

slab("card", "request", plan(-12, -11, 24, 22, 1), 17.3, 1, "hi")
for (let row = 0; row < 3; row++)
	line(
		"card",
		k.lineOnTop([-7, -5 + row * 5], [row === 2 ? 1 : 7, -5 + row * 5], 18.3, P),
		"mid",
		true
	)
const origin = k.iso([0, 0, 0], P)
const vector = (point) => k.iso(point, P).map((v, i) => Number((v - origin[i]).toFixed(6)))
const artifact =
	JSON.stringify({
		width: W,
		height: H,
		parts,
		xAxis: vector([1, 0, 0]),
		yAxis: vector([0, 1, 0]),
		...Object.fromEntries(Object.entries(layers).map(([key, value]) => [key, value.join("")])),
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-automation/art.json", import.meta.url)
if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== artifact)
		throw new Error("Automation art is stale; run node scripts/anatomy/build-automation.mjs")
	console.log(`Automation art is current · ${parts} solids`)
} else {
	writeFileSync(target, artifact)
	console.log(`Generated automation art · ${parts} solids · ${Buffer.byteLength(artifact)} bytes`)
}
