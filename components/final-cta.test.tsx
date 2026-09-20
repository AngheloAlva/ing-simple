import { Children, type ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

type MotionElementProps = {
	children?: ReactNode
	className?: string
	initial?: unknown
	transition?: unknown
	variants?: unknown
	viewport?: unknown
	whileInView?: unknown
}

const { asciiWavesMock, motionElementProps } = vi.hoisted(() => ({
	asciiWavesMock: vi.fn((_props: unknown) => null),
	motionElementProps: [] as Array<{ tag: string; props: MotionElementProps }>,
}))

vi.mock("react", async (importOriginal) => {
	const react = await importOriginal<typeof import("react")>()
	return { ...react, useSyncExternalStore: () => true }
})

vi.mock("@/components/ascii-waves", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/components/ascii-waves")>()
	return { ...actual, default: asciiWavesMock }
})

vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>()
	const { createElement } = await import("react")

	return {
		...actual,
		motion: new Proxy(
			{},
			{
				get(_target, tag) {
					if (typeof tag !== "string") return undefined

					return (props: MotionElementProps) => {
						motionElementProps.push({ tag, props })
						return createElement(tag, { className: props.className }, props.children)
					}
				},
			},
		),
	}
})

import { resolveAsciiWavesColor } from "@/components/ascii-waves"
import { FinalCta } from "@/components/final-cta"

describe("FinalCta", () => {
	beforeEach(() => {
		asciiWavesMock.mockClear()
		motionElementProps.length = 0
	})

	it("renders its default contact call to action", () => {
		const html = renderToStaticMarkup(<FinalCta />)

		expect(html).toContain("¿Qué proceso te quita más tiempo hoy?")
		expect(html).toContain("Pide tu diagnóstico gratis")
		expect(html).toContain('href="/contacto"')
	})

	it("reveals the title, body, and button from a tight in-view content group", () => {
		renderToStaticMarkup(<FinalCta />)

		const contentGroup = motionElementProps.find(
			({ props }) => props.whileInView === "visible",
		)
		expect(contentGroup?.props).toMatchObject({
			initial: "hidden",
			whileInView: "visible",
			viewport: { once: true, amount: 0.35 },
			variants: {
				hidden: {},
				visible: { transition: { delayChildren: 0.08, staggerChildren: 0.14 } },
			},
		})
		expect(contentGroup?.props.className).toBe("flex flex-col items-center")
		expect(Children.count(contentGroup?.props.children)).toBe(3)

		const revealItems = motionElementProps.filter(
			({ props }) => JSON.stringify(props.variants).includes('"blur(3px)"'),
		)
		expect(revealItems.map(({ tag }) => tag)).toEqual(["h2", "p", "div"])
		for (const { props } of revealItems) {
			expect(props).toMatchObject({
				transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
				variants: {
					hidden: { opacity: 0, y: 12, filter: "blur(3px)" },
					visible: { opacity: 1, y: 0, filter: "blur(0px)" },
				},
			})
		}
	})

	it("uses supplied content and contact destination", () => {
		const html = renderToStaticMarkup(
			<FinalCta title="Custom title" body="Custom body" href="/contacto?servicio=ia" />,
		)

		expect(html).toContain("Custom title")
		expect(html).toContain("Custom body")
		expect(html).toContain('href="/contacto?servicio=ia"')
	})

	it("routes empty CTA space to the waves while keeping the button clickable", () => {
		const html = renderToStaticMarkup(<FinalCta />)

		expect(html).toContain("pointer-events-none relative z-10")
		expect(html).toContain("pointer-events-auto mt-8")
	})

	it("configures shared ASCII waves with the inherited CTA brand tint", () => {
		renderToStaticMarkup(<FinalCta />)

		expect(asciiWavesMock.mock.calls.at(-1)?.[0]).toMatchObject({
			characters: " .:-+*=%@#",
			elementSize: 9,
			noiseScale: 5,
			speed: 0.7,
			intensity: 0.7,
			waveTension: 0.5,
			waveTwist: 0.2,
			hasCursorInteraction: true,
			interactionIntensity: 2,
			invert: false,
			color: "var(--brand-tint)",
			className: "h-full w-full",
		})
	})

	it("keeps the decorative surface full width while preserving CTA layout", () => {
		const html = renderToStaticMarkup(<FinalCta />)

		expect(html).toContain("relative isolate overflow-hidden")
		expect(html).toContain("absolute inset-y-0 left-0 z-0 w-full")
		expect(html).toContain(
			"mask-image:linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
		)
		expect(html).toContain(
			"-webkit-mask-image:linear-gradient(to right, transparent 0%, black 7%, black 93%, transparent 100%)",
		)
		expect(html).toContain(
			"pointer-events-none relative z-10 mx-auto max-w-360 px-5 sm:px-8 lg:px-10",
		)
		expect(html).toContain("pointer-events-none absolute inset-0 z-1 dark:hidden")
		expect(html).toContain(
			"radial-gradient(ellipse 52% 58% at center, var(--background) 0%, var(--background) 28%, color-mix(in srgb, var(--background) 92%, transparent) 42%",
		)
		expect(html).toContain(
			"pointer-events-none absolute top-1/2 left-1/2 z-[-1] hidden h-[150%] w-[160%] -translate-x-1/2 -translate-y-1/2 dark:block",
		)
		expect(html).toContain("radial-gradient(ellipse at center, var(--background) 0%")
	})

})

describe("resolveAsciiWavesColor", () => {
	afterEach(() => {
		vi.unstubAllGlobals()
	})

	it("normalizes inherited custom properties to a concrete RGB literal", () => {
		const context = {
			fillStyle: "",
			fillRect: vi.fn(),
			getImageData: () => ({ data: new Uint8ClampedArray([12, 34, 56, 255]) }),
		}
		vi.stubGlobal("document", {
			createElement: () => ({
				width: 0,
				height: 0,
				getContext: () => context,
			}),
		})
		vi.stubGlobal("getComputedStyle", () => ({
			getPropertyValue: () => "oklch(0.6 0.2 250)",
		}))

		expect(resolveAsciiWavesColor("var(--primary)", {} as HTMLElement)).toBe("rgb(12, 34, 56)")
	})

	it("uses a safe literal when canvas normalization is unavailable", () => {
		vi.stubGlobal("document", {
			createElement: () => ({
				width: 0,
				height: 0,
				getContext: () => null,
			}),
		})

		expect(resolveAsciiWavesColor("var(--unresolved)", {} as HTMLElement)).toBe("#ffffff")
	})

	it("uses a safe literal when canvas normalization fails", () => {
		vi.stubGlobal("document", {
			createElement: () => ({
				width: 0,
				height: 0,
				getContext: () => ({
					fillStyle: "",
					fillRect: vi.fn(),
					getImageData: () => {
						throw new Error("Canvas readback failed")
					},
				}),
			}),
		})

		expect(resolveAsciiWavesColor("oklch(0.6 0.2 250)", {} as HTMLElement)).toBe("#ffffff")
	})
})
