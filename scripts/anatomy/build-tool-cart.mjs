import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"

// A rolling tool cart with one drawer per paid tool. Each drawer holds six
// tools in a foam insert; the few in use are worn and untagged, the rest still
// carry their shop tag. Three licence cards stand on the worktop.
//
// Parts: four casters (plate, swivel, wheel), carcass (bottom, back, left,
// right, worktop, two runners per level), push handle (two brackets, bar),
// licence holder (base, three cards) and per drawer: floor, back, two sides,
// foam, front, label plate, two handle mounts, grip, plus six tools (handle,
// shaft) with a tag on every unused one.
const scene = JSON.parse(
	readFileSync(new URL("../../components/diagrams/anatomy-tool-cart/scene.json", import.meta.url), "utf8")
)
const width = 420,
	height = 520
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
const P = k.fitProjection(
	[
		...k.boxCorners(plan(-52, -32, 112, 68), 0, 138),
		// Open drawers reach forward only at drawer height.
		...k.boxCorners(plan(-50, 30, 100, scene.drawerTravel + 6), 56, 76),
	],
	width,
	height,
	{ pad: 8, azimuth: 64, elevation: 40 }
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
	layer.push(`<g data-part="${name}">${k.solidSvg(k.cylinder(cx, cy, r, z, h, P, 24, 0.3), { tone })}</g>`)
}
const line = (layer, d, tone = "lo", extra = {}) => layer.push(k.lineSvg(d, { tone, ...extra }))
const segment = (a, b) => k.pathOf([k.iso(a, P), k.iso(b, P)])
const dots = (layer, points, z) =>
	layer.push(
		k.dotsSvg(
			points.map(([x, y]) => k.iso([x, y, z], P)),
			{ size: 0.5, tone: "mid" }
		)
	)

// ---------------------------------------------------------------- base and carcass
const back = []
const body = plan(-50, -30, 100, 60, 1)
back.push(`<path class="iso-halo" d="${k.haloOf(plan(-50, -30, 112, 64, 6), 0, 2, P)}"/>`)
const casters = k
	.corners(body, 7)
	.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
for (const [i, [x, y]] of casters.entries()) {
	slab(back, `caster-wheel-${i}`, plan(x - 1.6, y - 4.5, 3.2, 9, 1.5), 0, 8, "lo")
	round(back, `caster-swivel-${i}`, x, y, 2.6, 8, 3, "lo")
	slab(back, `caster-plate-${i}`, plan(x - 5, y - 5, 10, 10, 0.8), 11, 1.5)
	dots(back, k.corners(plan(x - 5, y - 5, 10, 10), 1.6), 12.5)
}
slab(back, "carcass-bottom", body, 12.5, 3)
slab(back, "carcass-back", plan(-50, -30, 100, 3), 15.5, 102.5)
slab(back, "carcass-left", plan(-50, -27, 3, 57), 15.5, 102.5, "hi")
// Storage cabinet under the drawers: a hinged door with a vent and a pull.
slab(back, "door", plan(-48, 28, 96, 3, 0.8), 17, 37, "hi")
line(back, k.planOutline(plan(-45, 28, 90, 3.05, 0.4), 51.5, P), "faint")
for (const z of [26, 29, 32]) line(back, segment([-30, 31.05, z], [10, 31.05, z]), "faint")
for (const z of [20, 48]) slab(back, `door-hinge-${z}`, plan(-50, 28.5, 2, 3, 0.6), z, 4, "lo")
slab(back, "door-pull", plan(36, 31, 3, 3, 0.8), 30, 14, "mid")

// ---------------------------------------------------------------- drawers
// Built closed; the page slides each drawer group along +y.
const drawerArt = []
for (const drawer of scene.drawers) {
	const b = 56 + drawer.level * 21
	const inner = [],
		lip = []
	for (const x of [-47, 44]) slab(inner, `runner-${drawer.id}-${x}`, plan(x, -26, 3, 52), b + 1, 1.2, "lo")
	slab(inner, `${drawer.id}-floor`, plan(-45, -27, 90, 55), b + 2.2, 1.2)
	slab(inner, `${drawer.id}-back`, plan(-45, -27, 90, 2), b + 3.4, 14)
	slab(inner, `${drawer.id}-left`, plan(-45, -25, 2, 53), b + 3.4, 14, "hi")
	const foam = plan(-42, -24, 84, 46, 1)
	slab(inner, `${drawer.id}-foam`, foam, b + 3.4, 7, "lo", { crease: "none" })
	const top = b + 10.4
	for (let i = 0; i < drawer.tools; i++) {
		const cx = i % 2 === 0 ? -21 : 21
		const cy = -18 + Math.floor(i / 2) * 15
		const used = drawer.used.includes(i)
		// Cut-out in the foam the tool sits in.
		line(inner, k.planOutline(plan(cx - 19, cy - 4, 40, 8, 3.5), top, P), "faint")
		slab(inner, `${drawer.id}-tool-${i}-shaft`, plan(cx - 4, cy - 1, 22, 2, 0.9), top, 1.6, "mid")
		slab(inner, `${drawer.id}-tool-${i}-handle`, plan(cx - 18, cy - 3, 15, 6, 2.6), top, 3.6, "hi", {
			lit: used,
		})
		if (used) {
			// Wear: the grip lines of a handle in daily use.
			for (const dx of [-15, -12, -9])
				line(inner, segment([cx + dx, cy - 2.4, top + 3.6], [cx + dx, cy + 2.4, top + 3.6]), "mid")
		} else {
			// The shop tag hangs from the shaft on a short string.
			slab(inner, `${drawer.id}-tool-${i}-tag`, plan(cx + 8, cy + 2.8, 6, 4, 0.5), top, 0.4, "hi")
			line(inner, segment([cx + 9, cy + 1, top + 1.6], [cx + 10, cy + 2.8, top + 0.4]), "mid")
			dots(inner, [[cx + 10, cy + 3.8]], top + 0.4)
		}
	}
	slab(lip, `${drawer.id}-right`, plan(43, -25, 2, 53), b + 3.4, 14, "hi")
	slab(lip, `${drawer.id}-front`, plan(-48, 28, 96, 3, 0.8), b + 1, 19, "hi")
	line(lip, k.planOutline(plan(-45, 28, 90, 3.05, 0.4), b + 18, P), "faint")
	slab(lip, `${drawer.id}-label`, plan(-15, 31, 30, 0.6, 0.2), b + 3.5, 6, "mid")
	lip.push(
		k.faceTextSvg(k.sideMatrix([0, 31.65], b + 5.3, P, "left"), drawer.name.toUpperCase(), {
			size: 3.3,
			tone: "hi",
			anchor: "middle",
		})
	)
	for (const x of [-26, 23]) slab(lip, `${drawer.id}-mount-${x}`, plan(x, 31, 3, 3, 0.4), b + 13, 3.5, "mid")
	slab(lip, `${drawer.id}-grip`, plan(-26, 33.5, 52, 2.5, 1), b + 13, 3.5, "hi")
	drawerArt.push({ id: drawer.id, inner: inner.join(""), lip: lip.join("") })
}

// ---------------------------------------------------------------- front casing
const casing = []
slab(casing, "carcass-right", plan(47, -27, 3, 57), 15.5, 102.5, "mid")
for (const z of [55.5, 76.5, 97.5]) line(casing, segment([50.05, -26, z], [50.05, 29, z]), "faint")
slab(casing, "worktop", plan(-51, -31, 102, 62, 1.5), 118, 4)
line(casing, k.planOutline(plan(-47, -27, 94, 54, 1), 122, P), "faint")
for (const y of [-22, 20]) slab(casing, `handle-bracket-${y}`, plan(50, y, 7, 3, 0.4), 101, 4)
slab(casing, "handle-bar", plan(56, -24, 3.2, 49, 1.5), 100, 6, "hi")
// Licence holder: three cards, one per paid tool.
slab(casing, "licence-base", plan(-36, -18, 44, 12, 1), 122, 3)
for (const [i, drawer] of [...scene.drawers].reverse().entries()) {
	const x = -33 + i * 13
	slab(casing, `licence-${drawer.id}`, plan(x, -13 + i * 0.4, 11, 1.2, 0.3), 125, 13, "hi")
	for (const z of [134, 131])
		line(casing, segment([x + 2, -11.75 + i * 0.4, z], [x + 9, -11.75 + i * 0.4, z]), "faint", {
			free: true,
		})
}

const origin = k.iso([0, 0, 0], P)
const slide = k.iso([0, scene.drawerTravel, 0], P).map((v, i) => Number((v - origin[i]).toFixed(6)))
const content =
	JSON.stringify({
		width,
		height,
		parts,
		slide,
		back: back.join(""),
		drawers: drawerArt,
		casing: casing.join(""),
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-tool-cart/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-tool-cart.mjs [--check]\nGenerate the tool-cart SVG layers, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error("Tool cart art is stale; run node scripts/anatomy/build-tool-cart.mjs")
	console.log(`Tool cart art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated tool cart · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
