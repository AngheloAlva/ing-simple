/**
 * Shared source of truth for the per-service accent colours, mirroring the
 * `[data-service="<slug>"]` overrides in `app/globals.css` (see
 * `lib/service-accent.test.ts` for the CSS-side guard and
 * `lib/service-accent-map.test.ts` for the drift check between the two).
 *
 * `app/globals.css` is the only source `data-service`-aware CSS reads from;
 * this module exists for consumers that cannot resolve a CSS custom
 * property at render time — `ImageResponse` (Satori) in the OG routes, and
 * any component that needs the raw value rather than the cascaded token.
 */

export type ServiceSlug = "reportabilidad" | "capacitaciones" | "desarrollo-web" | "automatizaciones"

export type ServiceAccentTheme = {
	/** Text-safe accent: headline gradient end stop, kickers, chip text, focus ring. */
	primary: string
	/** Surface/fill accent: buttons, panels, decorative fills. Always paired with `brandBlueForeground`. */
	brandBlue: string
	brandBlueForeground: string
	/** First stop of the headline gradient (`lib/gradient.ts`). */
	tint: string
}

export type ServiceAccent = {
	light: ServiceAccentTheme
	dark: ServiceAccentTheme
}

/** Verbatim copies of the values in `app/globals.css`. Never hand-edit one
 * side without the other — `lib/service-accent-map.test.ts` fails on drift. */
export const SERVICE_ACCENTS: Record<ServiceSlug, ServiceAccent> = {
	reportabilidad: {
		light: {
			tint: "oklch(0.8 0.17 90)",
			primary: "oklch(0.56 0.135 85)",
			brandBlue: "oklch(0.85 0.17 92)",
			brandBlueForeground: "oklch(0.145 0 0)",
		},
		dark: {
			tint: "oklch(0.92 0.16 95)",
			primary: "oklch(0.85 0.17 92)",
			brandBlue: "oklch(0.85 0.17 92)",
			brandBlueForeground: "oklch(0.145 0 0)",
		},
	},
	capacitaciones: {
		light: {
			tint: "oklch(0.7 0.16 305)",
			primary: "oklch(0.3745 0.1497 305)",
			brandBlue: "oklch(0.3745 0.1497 305)",
			brandBlueForeground: "oklch(0.985 0 0)",
		},
		dark: {
			tint: "oklch(0.8 0.126 305)",
			primary: "oklch(0.62 0.19 305)",
			brandBlue: "oklch(0.62 0.19 305)",
			brandBlueForeground: "oklch(0.985 0 0)",
		},
	},
	"desarrollo-web": {
		light: {
			tint: "oklch(0.7 0.18 350)",
			primary: "oklch(0.3745 0.1497 350)",
			brandBlue: "oklch(0.3745 0.1497 350)",
			brandBlueForeground: "oklch(0.985 0 0)",
		},
		dark: {
			tint: "oklch(0.8 0.13 350)",
			primary: "oklch(0.62 0.21 350)",
			brandBlue: "oklch(0.62 0.21 350)",
			brandBlueForeground: "oklch(0.985 0 0)",
		},
	},
	automatizaciones: {
		light: {
			tint: "oklch(0.75 0.11 205)",
			primary: "oklch(0.5 0.085 205)",
			brandBlue: "oklch(0.5 0.085 205)",
			brandBlueForeground: "oklch(0.985 0 0)",
		},
		dark: {
			tint: "oklch(0.86 0.09 205)",
			primary: "oklch(0.66 0.11 205)",
			brandBlue: "oklch(0.66 0.11 205)",
			brandBlueForeground: "oklch(0.985 0 0)",
		},
	},
}

/** Spreads onto a JSX element to scope its subtree's `--primary`/`--brand-blue`
 * tokens (and their `-foreground` pairs) to one service's accent. */
export function serviceAccentAttr(slug: ServiceSlug): { "data-service": ServiceSlug } {
	return { "data-service": slug }
}

export function isServiceSlug(slug: string): slug is ServiceSlug {
	return Object.hasOwn(SERVICE_ACCENTS, slug)
}

/** Accent for a catalog slug (`lib/services.ts`), which is typed as a plain
 * string. Throws instead of returning `undefined` so a service added to the
 * catalog without an accent fails loudly at build time, not with a crash
 * deep inside `ImageResponse`. */
export function serviceAccentFor(slug: string): ServiceAccent {
	if (!isServiceSlug(slug)) {
		throw new Error(`No service accent defined for slug "${slug}" (see lib/service-accent.ts)`)
	}
	return SERVICE_ACCENTS[slug]
}

function parseOklch(oklch: string): [number, number, number] {
	const match = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/.exec(oklch)
	if (!match) {
		throw new Error(`Not a valid oklch() string: ${oklch}`)
	}
	return [Number(match[1]), Number(match[2]), Number(match[3])]
}

function linearToSrgbByte(linear: number): number {
	const clamped = Math.min(1, Math.max(0, linear))
	const srgb = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055
	return Math.round(Math.min(1, Math.max(0, srgb)) * 255)
}

function toHexByte(value: number): string {
	return value.toString(16).padStart(2, "0")
}

/**
 * Converts an `oklch(L C H)` string to a 6-digit hex colour, via the
 * standard OKLab -> linear sRGB -> sRGB pipeline
 * (https://bottosson.github.io/posts/oklab/). `ImageResponse` (Satori)
 * cannot parse `oklch()`, so the OG image routes use this to render the
 * per-service accent instead of hand-typing a hex value that could drift
 * from `SERVICE_ACCENTS`. Out-of-gamut input is clamped, never thrown.
 */
export function oklchToHex(oklch: string): string {
	const [L, C, H] = parseOklch(oklch)
	const hueRadians = (H * Math.PI) / 180
	const a = C * Math.cos(hueRadians)
	const b = C * Math.sin(hueRadians)

	const l_ = L + 0.3963377774 * a + 0.2158037573 * b
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b
	const s_ = L - 0.0894841775 * a - 1.291485548 * b

	const l = l_ ** 3
	const m = m_ ** 3
	const s = s_ ** 3

	const rLinear = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
	const gLinear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
	const bLinear = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s

	return `#${toHexByte(linearToSrgbByte(rLinear))}${toHexByte(linearToSrgbByte(gLinear))}${toHexByte(linearToSrgbByte(bLinear))}`
}
