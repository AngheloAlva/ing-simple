import { readFileSync, writeFileSync } from "node:fs"
import * as k from "./vendor/iso-kit.mjs"

// An invoice gate on a bench. Invoices slide from a hopper onto rails under a
// reader; a dial gauge on the back panel shows the reading's confidence
// against a marked threshold; a diverter block sets the lane, and the invoice
// lands in the "Sistema" tray or in the "Revisión" tray where a person checks it.
//
// Parts: bench (four feet, top), hopper (base, two guides, six invoices),
// two rails, gantry (two posts, crossbar, arm, head, lens), dial panel (panel,
// two feet), diverter (track, block), two trays (base, four walls, label each,
// stacked invoices) and a loupe (lens, handle) beside the review tray. The
// dial face, needle, diverter offset and moving invoice are drawn by the page.
const scene = JSON.parse(
	readFileSync(new URL("../../components/diagrams/anatomy-invoice-gate/scene.json", import.meta.url), "utf8")
)
const width = 560,
	height = 380
const plan = (x, y, w, d, r = 0.6) => ({ x, y, w, d, r })
const P = k.fitProjection(
	[...k.boxCorners(plan(-90, -52, 160, 104), 0, 8), ...k.boxCorners(plan(-20, -48, 86, 6), 8, 66)],
	width,
	height,
	{ pad: 6, azimuth: 56, elevation: 32 }
)
let parts = 0
const solid = (name, p, z, h, tone = "mid", extra = {}) => {
	parts++
	return `<g data-part="${name}">${k.solidSvg(k.slabOf(p, z, h, P, 4, Math.min(0.5, h / 3)), { tone, ...extra })}</g>`
}
const round = (name, cx, cy, r, z, h, tone = "mid") => {
	parts++
	return `<g data-part="${name}">${k.solidSvg(k.cylinder(cx, cy, r, z, h, P, 28, 0.3), { tone })}</g>`
}
const line = (d, tone = "lo", extra = {}) => k.lineSvg(d, { tone, ...extra })
const segment = (a, b) => k.pathOf([k.iso(a, P), k.iso(b, P)])
const faceText = (x, y, z, text, size, tone = "hi") =>
	k.faceTextSvg(k.sideMatrix([x, y], z, P, "left"), text, { size, tone, anchor: "middle" })
const SHEET = 0.5
// An invoice: the sheet, a printed header and rows that stand for text.
const invoice = (name, cx, cy, z) =>
	[
		solid(name, plan(cx - 15, cy - 11, 30, 22, 0.2), z, SHEET, "hi", { crease: "none" }),
		k.faceTextSvg(k.topMatrix([cx - 11, cy - 6], z + SHEET, P), "FACTURA", { size: 2.4, tone: "mid" }),
		...[-1, 2.5, 6].map((dy) =>
			line(segment([cx - 11, cy + dy, z + SHEET], [cx + 9, cy + dy, z + SHEET]), "faint", { free: true })
		),
	].join("")

// ---------------------------------------------------------------- bench, hopper, rails
const back = []
const bench = plan(-90, -52, 160, 104, 1.5)
back.push(`<path class="iso-halo" d="${k.haloOf(plan(-88, -50, 160, 106, 5), 0, 2, P)}"/>`)
for (const [i, [x, y]] of k
	.corners(bench, 8)
	.sort((a, b) => k.depthOf([...a, 0], P) - k.depthOf([...b, 0], P))
	.entries())
	back.push(solid(`foot-${i}`, plan(x - 4, y - 4, 8, 8, 1), 0, 4, "lo"))
back.push(solid("bench", bench, 4, 4))
back.push(line(k.planOutline(k.insetPlan(bench, 3), 8, P), "faint"))
back.push(solid("hopper-base", plan(-82, -32, 34, 26, 0.8), 8, 1.5, "lo"))
back.push(solid("hopper-guide-back", plan(-82, -34, 34, 2, 0.4), 8, 10))
back.push(solid("hopper-guide-left", plan(-84, -32, 2, 26, 0.4), 8, 10, "hi"))
const hopper = scene.invoices.map((_, i) => invoice(`hopper-${i}`, -65, -19, 9.5 + i * SHEET))
const rails = [
	...[-31, -9].map((y) => solid(`rail-${y}`, plan(-82, y, 98, 2, 0.4), 8, 2, "lo")),
	k.dotsSvg([[-80, -30, 10], [14, -30, 10], [-80, -8, 10], [14, -8, 10]].map((p) => k.iso(p, P)), {
		size: 0.5,
		tone: "mid",
	}),
].join("")

// ---------------------------------------------------------------- gantry posts and dial panel
const gantryBack = [
	solid("post-left", plan(-18, -46, 4, 4, 0.6), 8, 36),
	solid("post-right", plan(14, -46, 4, 4, 0.6), 8, 36),
	solid("crossbar", plan(-20, -48, 40, 6, 0.8), 44, 4, "hi"),
].join("")
const panel = [
	solid("panel-foot-left", plan(28, -48, 6, 8, 0.6), 8, 2, "lo"),
	solid("panel-foot-right", plan(58, -48, 6, 8, 0.6), 8, 2, "lo"),
	solid("dial-panel", plan(26, -46, 40, 3, 0.8), 10, 56, "hi"),
	k.dotsSvg(
		[[29, -42.9, 63], [63, -42.9, 63], [29, -42.9, 13], [63, -42.9, 13]].map((p) => k.iso(p, P)),
		{ size: 0.5, tone: "mid" }
	),
].join("")

// ---------------------------------------------------------------- trays, back halves and stacks
const TRAYS = { system: { x: 6, label: "SISTEMA" }, review: { x: -38, label: "REVISIÓN" } }
const trayBack = (lane) => {
	const x = TRAYS[lane].x
	return [
		solid(`${lane}-tray-base`, plan(x, 18, 34, 30, 1), 8, 1.5, "lo"),
		solid(`${lane}-tray-back`, plan(x, 18, 34, 1.5, 0.4), 9.5, 4.5),
		solid(`${lane}-tray-left`, plan(x, 19.5, 1.5, 28.5, 0.4), 9.5, 4.5, "hi"),
	].join("")
}
const trayFront = (lane) => {
	const x = TRAYS[lane].x
	return [
		solid(`${lane}-tray-right`, plan(x + 32.5, 19.5, 1.5, 28.5, 0.4), 9.5, 4.5),
		solid(`${lane}-tray-front`, plan(x, 46.5, 34, 1.5, 0.4), 9.5, 3, "hi"),
		faceText(x + 17, 48.05, 10.3, TRAYS[lane].label, 2.4),
	].join("")
}
const counts = { system: 0, review: 0 }
for (const item of scene.invoices) counts[item.confidence >= scene.threshold ? "system" : "review"]++
const stack = (lane) =>
	Array.from({ length: counts[lane] }, (_, i) =>
		invoice(`${lane}-stack-${i}`, TRAYS[lane].x + 17, 32, 9.5 + i * SHEET)
	)

// ---------------------------------------------------------------- diverter, head, loupe
const diverterTrack = solid("diverter-track", plan(-34, 2, 68, 3, 0.6), 8, 2, "lo")
const diverterBlock = [
	solid("diverter-block", plan(-5, 0, 10, 7, 1), 10, 6, "hi"),
	line(segment([-3, 7.05, 14], [3, 7.05, 14]), "faint"),
].join("")
const head = [
	solid("arm", plan(-3, -44, 6, 24, 0.6), 40, 4, "mid"),
	solid("head", plan(-9, -27, 18, 14, 2), 30, 10, "hi"),
	round("lens", 0, -20, 4, 27, 3, "lo"),
	line(segment([-7, -12.95, 37], [7, -12.95, 37]), "faint"),
].join("")
const loupe = [
	solid("loupe-handle", plan(-58, 36, 12, 2.6, 1.2), 8, 2, "mid"),
	round("loupe-lens", -62, 37, 5, 8, 1.6, "hi"),
].join("")

// The moving invoice, built at rest under the reader (rails top at z 10).
const sheet = invoice("moving-invoice", 0, -19, 10)
const blur = `<path class="invoice-blur" d="${k.pathOf(
	[
		[-10, -21, 10.52],
		[-3, -16, 10.52],
		[4, -22, 10.52],
		[11, -15, 10.52],
	].map((p) => k.iso(p, P))
)}"/>`

const unit = (v) => k.axisVector(P, v).map((n) => Number(n.toFixed(6)))
const content =
	JSON.stringify({
		width,
		height,
		parts,
		axes: { x: unit([1, 0, 0]), y: unit([0, 1, 0]), z: unit([0, 0, 1]) },
		sheetZ: SHEET,
		back: back.join(""),
		hopper,
		rails,
		gantryBack,
		panel,
		dialMatrix: k.sideMatrix([46, -42.9], 42, P, "left"),
		trayBack: { system: trayBack("system"), review: trayBack("review") },
		stacks: { system: stack("system"), review: stack("review") },
		diverterTrack,
		diverterBlock,
		sheet,
		blur,
		trayFront: { system: trayFront("system"), review: trayFront("review") },
		loupe,
		head,
	}) + "\n"
const target = new URL("../../components/diagrams/anatomy-invoice-gate/art.json", import.meta.url)
if (process.argv.includes("--help"))
	console.log(
		"Usage: node scripts/anatomy/build-invoice-gate.mjs [--check]\nGenerate the invoice-gate SVG layers, or verify the saved artifact without writing."
	)
else if (process.argv.includes("--check")) {
	if (readFileSync(target, "utf8") !== content)
		throw new Error("Invoice gate art is stale; run node scripts/anatomy/build-invoice-gate.mjs")
	console.log(`Invoice gate art is current · ${parts} solids`)
} else {
	writeFileSync(target, content)
	console.log(`Generated invoice gate · ${parts} solids · ${Buffer.byteLength(content)} bytes`)
}
