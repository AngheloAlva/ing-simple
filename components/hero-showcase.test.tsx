import { createElement, type ReactNode } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("react", async (importOriginal) => {
  const react = await importOriginal<typeof import("react")>()
  return { ...react, useSyncExternalStore: () => true }
})

vi.mock("motion/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("motion/react")>()
  return {
    ...actual,
    motion: new Proxy(
      {},
      {
        get(_target, tag) {
          if (typeof tag !== "string") return undefined
          return ({
            children,
            className,
            role,
            id,
            "aria-labelledby": labelledBy,
            tabIndex,
          }: {
            children?: ReactNode
            className?: string
            role?: string
            id?: string
            "aria-labelledby"?: string
            tabIndex?: number
          }) =>
            createElement(
              tag,
              { className, role, id, "aria-labelledby": labelledBy, tabIndex },
              children,
            )
        },
      },
    ),
  }
})

import { HeroShowcase, PANEL_BY_SLUG, PANEL_DESCRIPTION } from "@/components/hero-showcase"
import { ReducedMotionProvider } from "@/lib/motion"
import { SERVICES } from "@/lib/services"

describe("HeroShowcase", () => {
  it("places the only tablist in chrome before the frame body, in canonical service order", () => {
    const html = renderToStaticMarkup(<HeroShowcase />)
    expect(html.match(/role="tablist"/g)).toHaveLength(1)

    // The chrome is everything before the panel. Asserting on the tabpanel is
    // structural; asserting on the body's height classes would break every time
    // the frame geometry is retuned, which says nothing about this contract.
    const bodyStart = html.indexOf('role="tabpanel"')
    expect(bodyStart).toBeGreaterThan(-1)
    expect(html.indexOf('role="tablist"')).toBeLessThan(bodyStart)

    let previous = -1
    for (const service of SERVICES) {
      const position = html.indexOf(service.shortName)
      expect(position).toBeGreaterThan(previous)
      previous = position
    }

    const chrome = html.slice(0, bodyStart)
    expect(chrome).not.toContain("Flujo automatizado")
    expect(chrome).not.toContain("Ruta de capacitación")
    expect(html).not.toContain("aria-controls")
  })

  it("hides the fabricated mock data from assistive technology", () => {
    const html = renderToStaticMarkup(<HeroShowcase />)

    // 645 characters of invented records used to reach the accessibility tree
    // as if they were real content.
    expect(html).toContain('aria-hidden="true"')
    expect(html).toContain('class="sr-only"')
    for (const service of SERVICES) {
      const description = PANEL_DESCRIPTION[service.slug] ?? ""
      expect(description.length, `missing description for ${service.slug}`).toBeGreaterThan(20)
    }
    expect(html).toContain(PANEL_DESCRIPTION[SERVICES[0]!.slug]!)
  })

  it("keeps service and panel slugs in sync", () => {
    expect(Object.keys(PANEL_BY_SLUG).sort()).toEqual(SERVICES.map(({ slug }) => slug).sort())
    for (const service of SERVICES) expect(PANEL_BY_SLUG[service.slug]).toBeTypeOf("function")
  })

  it("omits the pause control under reduced motion", () => {
    const html = renderToStaticMarkup(
      <ReducedMotionProvider>
        <HeroShowcase />
      </ReducedMotionProvider>,
    )
    expect(html).not.toContain('aria-label="Pausar el recorrido de servicios"')
    expect(html).not.toContain('aria-label="Reanudar el recorrido de servicios"')
  })
})
