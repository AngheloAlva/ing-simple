import * as k from "./vendor/iso-kit.mjs"

// The four home challenge scenes sit side by side, so they share one camera and
// one world scale: a desk, a cabinet and a mold read at their relative sizes.
// Unlike fitProjection, the scale is fixed and the points are only centred.
export const HOME_CAMERA = { azimuth: 65, elevation: 26 }
export const HOME_SCALE = 1.06

// `below` reserves screen space under the scene for engraved labels.
export function homeProjection(points, width, height, { below = 0 } = {}) {
	const flat = points.map((point) => k.iso(point, { origin: [0, 0], scale: 1, ...HOME_CAMERA }))
	const xs = flat.map(([x]) => x)
	const ys = flat.map(([, y]) => y)
	const cx = (Math.min(...xs) + Math.max(...xs)) / 2
	const cy = (Math.min(...ys) + Math.max(...ys)) / 2
	const P = {
		origin: [width / 2 - cx * HOME_SCALE, (height - below) / 2 - cy * HOME_SCALE],
		scale: HOME_SCALE,
		...HOME_CAMERA,
	}
	const spill = flat.some(
		([x, y]) =>
			Math.abs((x - cx) * HOME_SCALE) > width / 2 ||
			Math.abs((y - cy) * HOME_SCALE) > (height - below) / 2
	)
	if (spill) throw new Error(`Scene does not fit ${width}×${height} at the shared home scale`)
	return P
}
