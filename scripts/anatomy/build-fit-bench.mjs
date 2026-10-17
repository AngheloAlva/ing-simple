import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"
import { homeProjection } from "./home-camera.mjs"

// A fixed die: incompatible processes hit its rim and return to manual work.
// The admitted specimen waits in a rear loading pocket until both attempts end.
const scene = JSON.parse(
	readFileSync(new URL("../../components/diagrams/anatomy-fit/scene.json", import.meta.url), "utf8")
)
const width = 480,
	// Taller than the desks: this card's legend is one row shorter, so its SVG box is
	// taller and the extra viewBox height keeps the shared on-screen scale.
	height = 288
const bed = { x: -130, y: -86, w: 260, d: 150, r: 6 }
const P = homeProjection(
	[
		...k.boxCorners(bed, -12, 0),
		[-111, -21, 52],
		[-69, 21, 52],
		[64, -11, 52],
		[116, 11, 52],
		[-14, -74, 60],
		[14, -46, 60],
	],
	width,
	height
)
const layers = { base: [], rear: [], fitting: [], cross: [], bar: [], front: [] }
const plan = (x, y, w, d, r = 1) => ({ x, y, w, d, r })
let parts = 0
function slab(layer, name, p, z, h, tone = "mid", inner = "") {
	parts++
	layers[layer].push(
		`<g data-piece="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 4, Math.min(h / 3, 0.65)), { tone, lit: layer === "fitting", inner })}</g>`
	)
}
const line = (layer, d, tone = "lo", free = false) =>
	layers[layer].push(k.lineSvg(d, { tone, free }))
const screws = (layer, points, z) =>
	layers[layer].push(
		k.dotsSvg(
			points.map(([x, y]) => k.iso([x, y, z], P)),
			{ size: 0.6, tone: "mid" }
		)
	)

layers.base.push(`<path class="iso-halo" d="${k.haloOf(bed, -12, 5, P)}"/>`)
for (const [i, [x, y]] of k
	.corners(bed, 20)
	.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
	.entries()) {
	slab("base", `foot-pad-${i}`, plan(x - 8, y - 7, 16, 14, 2), -12, 3, "lo")
	slab("base", `foot-${i}`, plan(x - 6, y - 5, 12, 10, 1.5), -9, 4, "lo")
}
slab("base", "bed", bed, -5, 5, "lo")
line("base", k.planOutline(k.insetPlan(bed, 4), 0, P), "faint")
screws("base", k.corners(bed, 10), 0)
for (const y of [-34, 24]) {
	slab("base", `datum-rail-${y}`, plan(-34, y, 68, 10, 1), 0, 8)
}
slab("base", "loading-pocket", plan(-20, scene.homes.square.y - 20, 40, 40, 1), 0, 4, "lo")
for (const [i, p] of [plan(-20, -80, 40, 2), plan(-20, -78, 2, 38), plan(18, -78, 2, 38)].entries())
	slab("base", `loading-rim-${i}`, p, 4, 3, "lo")
slab(
	"rear",
	"cavity-floor",
	plan(-16, -16, scene.opening.width, scene.opening.depth, 0),
	0,
	scene.opening.floor,
	"lo"
)
// True aperture: four separate walls, not a dark square painted on a slab.
slab("rear", "die-back", plan(-34, -34, 68, 18, 0.5), 8, 20, "hi")
slab("rear", "die-left", plan(-34, -16, 18, 32, 0.5), 8, 20, "hi")
slab("front", "die-right", plan(16, -16, 18, 32, 0.5), 8, 20, "hi")
slab("front", "die-front", plan(-34, 16, 68, 18, 0.5), 8, 20, "hi")
for (const [x, y] of [
	[-42, -26],
	[42, -26],
	[-42, 26],
	[42, 26],
]) {
	const layer = k.depthOf([x, y, 0], P) < 0 ? "rear" : "front"
	slab(layer, `clamp-foot-${x}-${y}`, plan(x - 7, y - 7, 14, 14, 1), 0, 4)
	slab(layer, `clamp-post-${x}-${y}`, plan(x - 4, y - 4, 8, 8, 0.5), 4, 24)
	const arm = plan(x < 0 ? x - 5 : x - 17, y - 5, 22, 10, 1)
	slab(layer, `clamp-arm-${x}-${y}`, arm, 28, 3)
	slab(layer, `clamp-head-${x}-${y}`, plan(x - 2.5, y - 2.5, 5, 5, 0.4), 31, 1.5, "hi")
	line(layer, k.lineOnTop([x - 2.5, y], [x + 2.5, y], 32.5, P), "mid")
}
for (const [name, x, layer] of [
	["cross", scene.homes.cross.x, "rear"],
	["bar", scene.homes.bar.x, "front"],
]) {
	const tray = plan(x - 30, -32, 60, 64, 2)
	slab(layer, `${name}-tray-support`, plan(x - 24, -26, 48, 52, 1), 0, 2, "lo")
	slab(layer, `${name}-tray`, tray, 2, 2, "lo")
	for (const [i, p] of [
		plan(x - 30, -32, 60, 2, 0.5),
		plan(x - 30, -30, 2, 60, 0.5),
		plan(x + 28, -30, 2, 60, 0.5),
	].entries())
		slab(layer, `${name}-tray-rim-${i}`, p, 4, 3, "lo")
	line(layer, k.planOutline(k.insetPlan(tray, 5), 4, P), "faint")
	if (name === "cross") {
		const outline = [
			[-9, -21],
			[9, -21],
			[9, -9],
			[21, -9],
			[21, 9],
			[9, 9],
			[9, 21],
			[-9, 21],
			[-9, 9],
			[-21, 9],
			[-21, -9],
			[-9, -9],
		].map(([px, py]) => [x + px, py])
		parts++
		// A concave specimen needs face-level painter ordering. A single
		// silhouette outline would expose rear edges through its notches.
		const { sinA, cosA } = k.cameraOf(P)
		const faces = outline
			.flatMap(([ax, ay], i) => {
				const [bx, by] = outline[(i + 1) % outline.length]
				const length = Math.hypot(bx - ax, by - ay)
				const nx = (by - ay) / length,
					ny = -(bx - ax) / length
				if (nx * cosA + ny * sinA <= 0) return []
				const shade = Math.min(3, Math.floor(((-nx * sinA + ny * cosA + 1) / 2) * 4))
				const d = k.pathOf(
					[
						[ax, ay, 4],
						[bx, by, 4],
						[bx, by, 16],
						[ax, ay, 16],
					].map((point) => k.iso(point, P)),
					true
				)
				return [
					{
						depth: k.depthOf([(ax + bx) / 2, (ay + by) / 2, 10], P),
						svg: `<g data-cross-face="${i}"><path class="iso-shade" data-shade="${shade}" d="${d}"/><path class="iso-line iso-edge" data-tone="hi" d="${d}"/></g>`,
					},
				]
			})
			.sort((a, b) => a.depth - b.depth)
			.map((face) => face.svg)
			.join("")
		const top = k.pathOf(
			outline.map(([px, py]) => k.iso([px, py, 16], P)),
			true
		)
		layers.cross.push(
			`<g data-piece="outside-cross">${faces}<g data-cross-top=""><path class="iso-top" d="${top}"/><path class="iso-line iso-edge" data-tone="hi" d="${top}"/></g></g>`
		)
	} else {
		slab("bar", "outside-bar", plan(x - 26, -11, 52, 22, 1), 4, 12, "hi")
		line("bar", k.planOutline(plan(x - 21, -6, 42, 12, 0.5), 16, P), "lo")
	}
}
const square = scene.homes.square
slab("fitting", "fitting-square", plan(-14, square.y - 14, 28, 28, 1), square.z, 20, "hi")
line("fitting", k.planOutline(plan(-10, square.y - 10, 20, 20, 1), square.z + 20, P), "lo")
const ruler = plan(-110, 49, 176, 5, 0.5)
slab("base", "ruler", ruler, 0, 0.6, "lo")
const ticks = k.topTicks(-106, 62, 7, 4, 49, 0.6, [1.5, 5], P)
line("base", ticks.minor, "lo")
line("base", ticks.major, "mid")
slab("base", "serial-plate", plan(83, 46, 31, 9, 0.6), 0, 0.6, "lo")
screws(
	"base",
	[
		[86, 50.5],
		[111, 50.5],
	],
	0.6
)
line("base", k.lineOnTop([90, 50.5], [107, 50.5], 0.6, P), "lo", true)

const origin = k.iso([0, 0, 0], P)
const vector = (point) => k.iso(point, P).map((v, i) => Number((v - origin[i]).toFixed(6)))
const xAxis = vector([1, 0, 0]),
	yAxis = vector([0, 1, 0]),
	zAxis = vector([0, 0, 1])
const content =
	JSON.stringify({
		width,
		height,
		parts,
		xAxis,
		yAxis,
		zAxis,
		...Object.fromEntries(Object.entries(layers).map(([key, value]) => [key, value.join("")])),
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-fit/art.json", import.meta.url)
if (process.argv.includes("--help")) {
	console.log(
		"Usage: node scripts/anatomy/build-fit-bench.mjs [--check]\nGenerate the Anatomy fit-bench SVG layers, or check the saved artifact without writing."
	)
} else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error("Fit bench art is stale; run node scripts/anatomy/build-fit-bench.mjs")
	console.log(`Fit bench art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated fit bench · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
