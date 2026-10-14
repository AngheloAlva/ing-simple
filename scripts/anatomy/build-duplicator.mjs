import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"

// A hand-cranked duplicator on its stand. Every turn of the crank takes one
// blank from the feed, prints the same document and lays it on the output
// tray; the copies with errors fall into the reject bin hanging on the stand.
//
// Parts: stand (four feet, cabinet, two door pulls, hour-meter bezel), reject
// bin (back, floor, two sides, front), base plate, feed (two posts, tray,
// one blank per copy), two side frames, drum cover, crank hub, copy counter,
// output tray (bracket, tray) and one printed copy per good copy. The crank arm, its
// knob, the moving sheet and the hour-meter needle are drawn by the page.
const scene = JSON.parse(
	readFileSync(new URL("../../components/diagrams/anatomy-duplicator/scene.json", import.meta.url), "utf8")
)
const width = 420,
	height = 500
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
const hub = [39.5, 2, 67]
const crankLength = 19
const P = k.fitProjection(
	[
		...k.boxCorners(plan(-44, -32, 90, 74), 0, 95),
		...[-1, 1].flatMap((s) => [
			[hub[0] + 4, hub[1] + s * (crankLength + 3), hub[2]],
			[hub[0] + 4, hub[1], hub[2] + s * (crankLength + 3)],
		]),
	],
	width,
	height,
	{ pad: 8, azimuth: 58, elevation: 30 }
)
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

// ---------------------------------------------------------------- stand and reject bin
const stand = []
const cabinet = plan(-40, -28, 80, 58, 1)
stand.push(`<path class="iso-halo" d="${k.haloOf(plan(-42, -30, 84, 74, 4), 0, 2, P)}"/>`)
for (const [i, [x, y]] of k
	.corners(cabinet, 5)
	.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
	.entries())
	stand.push(solid(`foot-${i}`, plan(x - 3.5, y - 3.5, 7, 7, 1), 0, 4, "lo"))
stand.push(solid("cabinet", cabinet, 4, 46))
stand.push(line(segment([0, 30.05, 8], [0, 30.05, 46]), "faint"))
stand.push(line(k.planOutline(plan(-37, -25, 74, 52, 0.6), 50, P), "faint"))
for (const x of [-4, 2.5]) stand.push(solid(`door-pull-${x}`, plan(x, 30, 1.5, 2, 0.4), 38, 7, "hi"))
stand.push(solid("meter-bezel", plan(13, 30, 18, 0.8, 0.6), 14, 18, "hi"))
// Reject bin hanging on the left door: back, floor and left side first.
stand.push(solid("bin-back", plan(-34, 30, 30, 1.2, 0.3), 20, 15))
stand.push(solid("bin-floor", plan(-34, 31.2, 30, 10, 0.4), 20, 1.5, "lo"))
stand.push(solid("bin-left", plan(-34, 31.2, 1.2, 10, 0.3), 21.5, 8, "hi"))
const crumpled = [0, 1].map((i) =>
	[
		solid(`reject-${i}`, plan(-30 + i * 11, 32.5 + i, 10, 7, 2.6), 21.5 + i * 0.8, 2.4, "hi"),
		line(
			k.pathOf(
				[
					[-28 + i * 11, 34 + i, 23.9 + i * 0.8],
					[-25 + i * 11, 36.5 + i, 23.9 + i * 0.8],
					[-22 + i * 11, 34.5 + i, 23.9 + i * 0.8],
				].map((p) => k.iso(p, P))
			),
			"mid"
		),
	].join("")
)
const binFront = [
	solid("bin-right", plan(-5.2, 31.2, 1.2, 10, 0.3), 21.5, 8),
	solid("bin-front", plan(-34, 40, 30, 1.2, 0.3), 21.5, 6, "hi"),
	...[-26, -19, -12].map((x) => line(segment([x, 41.25, 22.2], [x, 41.25, 26.8]), "faint")),
].join("")

// ---------------------------------------------------------------- machine, back half
const machineBack = []
machineBack.push(solid("base-plate", plan(-44, -32, 88, 64, 1.5), 50, 4))
machineBack.push(dots(k.corners(plan(-44, -32, 88, 64), 3), 54))
machineBack.push(
	k.faceTextSvg(k.sideMatrix([31, 32.05], 51, P, "left"), "DUPLICADORA", { size: 2.4, anchor: "middle" })
)
for (const x of [-20, 17]) machineBack.push(solid(`feed-post-${x}`, plan(x, -30, 3, 3, 0.6), 54, 22, "lo"))
machineBack.push(solid("feed-tray", plan(-26, -32, 52, 20, 0.8), 76, 2))
const feed = Array.from({ length: scene.copies }, (_, i) =>
	solid(`blank-${i}`, plan(-23, -30, 46, 16, 0.2), 78 + i * 0.35, 0.35, "hi", { crease: "none" })
)

// ---------------------------------------------------------------- machine, front half
const machineFront = []
machineFront.push(solid("frame-left", plan(-36, -12, 4, 26, 1), 54, 26, "hi"))
machineFront.push(solid("drum-cover", plan(-32, -11, 64, 24, 1.5), 58, 16, "hi"))
for (const y of [-6, -1, 4, 9])
	machineFront.push(line(segment([-29, y, 74], [29, y, 74]), "faint"))
// Exit slit the copies leave through.
machineFront.push(line(segment([-24, 13.05, 64.5], [24, 13.05, 64.5]), "mid"))
machineFront.push(solid("frame-right", plan(32, -12, 4, 26, 1), 54, 26))
machineFront.push(dots([[34, -10], [34, 12]], 80))
machineFront.push(solid("crank-hub", plan(36, -2, 3.5, 8, 2.5), 63, 8, "mid"))
machineFront.push(solid("counter", plan(30, -10, 10, 12, 0.6), 80, 6))
machineFront.push(solid("counter-window", plan(31.5, 2, 7, 0.5, 0.2), 81.2, 3.6, "lo", { crease: "none" }))
machineFront.push(solid("output-bracket", plan(-22, 13, 44, 4, 0.6), 54, 3, "lo"))
machineFront.push(solid("output-tray", plan(-24, 16, 48, 22, 0.8), 56, 1.5))
const outputBase = 57.5
const outputTop = outputBase + (scene.copies - scene.errors.length) * 0.35
const output = Array.from({ length: scene.copies - scene.errors.length }, (_, i) =>
	[
		solid(`copy-${i}`, plan(-20, 18, 40, 17, 0.2), outputBase + i * 0.35, 0.35, "hi", { crease: "none" }),
		...(i === scene.copies - scene.errors.length - 1
			? [-13, -9, -5].map((y) =>
					line(segment([-15, y + 36, outputTop], [8, y + 36, outputTop]), "faint", { free: true })
				)
			: []),
	].join("")
)

// The moving sheet, built at rest on the output tray; the page moves it.
const sheet = solid("moving-sheet", plan(-20, 18, 40, 17, 0.2), outputBase, 0.35, "hi")
const sheetRules = [23, 27, 31]
	.map((y) => line(segment([-15, y, outputBase + 0.35], [8, y, outputBase + 0.35]), "faint", { free: true }))
	.join("")
const smudge = `<path class="duplicator-smudge" d="${k.pathOf(
	[
		[-12, 22, outputBase + 0.37],
		[-4, 29, outputBase + 0.37],
		[4, 24, outputBase + 0.37],
		[11, 31, outputBase + 0.37],
	].map((p) => k.iso(p, P))
)}"/>`

const unit = (v) => k.axisVector(P, v).map((n) => Number(n.toFixed(6)))
const content =
	JSON.stringify({
		width,
		height,
		parts,
		axes: { x: unit([1, 0, 0]), y: unit([0, 1, 0]), z: unit([0, 0, 1]) },
		stand: stand.join(""),
		crumpled,
		machineBack: machineBack.join(""),
		feed,
		machineFront: machineFront.join(""),
		output,
		outputStep: 0.35,
		sheet: sheet + sheetRules,
		smudge,
		binFront,
		hub: k.iso(hub, P).map((n) => Number(n.toFixed(2))),
		crankLength,
		counterMatrix: k.sideMatrix([35, 2.55], 82.1, P, "left"),
		dialMatrix: k.sideMatrix([22, 30.85], 23, P, "left"),
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-duplicator/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-duplicator.mjs [--check]\nGenerate the duplicator SVG layers, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error("Duplicator art is stale; run node scripts/anatomy/build-duplicator.mjs")
	console.log(`Duplicator art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated duplicator · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
