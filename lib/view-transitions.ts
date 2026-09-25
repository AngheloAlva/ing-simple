import type { ViewTransitionClassPerType } from "react"

/**
 * Shared vocabulary for the three animated journeys: the home services section to
 * a service page, the guide list to a guide, and the case grid to a case.
 *
 * Deliberately plain data — no `"use client"`, no JSX — because the pages that
 * consume it are server components. React's `<ViewTransition>` renders on both
 * sides of the client boundary, so only the names and class maps have to be
 * shared; each page renders its own boundary. A boundary in the layout would
 * never mount or unmount, and enter/exit only fire on mount and unmount.
 */

/**
 * Transition types carried by a link through `next/link`'s `transitionTypes`
 * prop, which becomes `React.addTransitionType` inside the navigation transition:
 * `nav-forward` when the user goes deeper into a list, `nav-back` when a link
 * sends them back to the list they came from. The browser's own back and forward
 * buttons carry no type at all, which is why every rule in `app/globals.css` has
 * a `default` branch and the shared morph is what still plays on that path.
 */
export const NAV_FORWARD = "nav-forward"
export const NAV_BACK = "nav-back"

const DETAIL_ROOTS = ["/servicios/", "/guias/", "/casos/"]

/** Browser back and forward carry no transition type, so this only describes link navigations. */
export function navLinkTransitionTypes(href: string, pathname: string): string[] {
	if (pathname === href || pathname.startsWith(`${href}/`)) return [NAV_BACK]

	const currentRoot = DETAIL_ROOTS.find((root) => pathname.startsWith(root))
	const destinationRoot = DETAIL_ROOTS.find((root) => href.startsWith(root))
	if (currentRoot && currentRoot === destinationRoot) return []
	if (destinationRoot) return [NAV_FORWARD]
	return []
}

/**
 * `view-transition-name` for the fixed site header. The isolation rules in
 * `app/globals.css` are keyed on this literal, and `lib/view-transitions.test.ts`
 * fails if the two ever drift apart.
 */
export const SITE_NAV_TRANSITION_NAME = "site-nav"

/**
 * The `enter` and `exit` class map every directional page boundary passes to
 * `<ViewTransition>`. Keys are transition types; values are the CSS classes
 * defined in `app/globals.css`. They happen to be spelled identically today, but
 * they are separate contracts, so they are written out instead of derived.
 *
 * `default: "none"` is load-bearing. Without it each of these boundaries would
 * cross-fade on every transition in the app — theme changes, background
 * revalidations, the entrance animations elsewhere on the page — because a
 * `<ViewTransition>` with no explicit class falls back to the browser default for
 * every trigger.
 */
export const DIRECTIONAL_CLASSES: ViewTransitionClassPerType = {
	[NAV_FORWARD]: "nav-forward",
	[NAV_BACK]: "nav-back",
	default: "none",
}

/**
 * Shared-element name prefixes, one per flow.
 *
 * A `view-transition-name` has to be unique among everything mounted at once:
 * two elements sharing one name make React throw, and two names that differ only
 * where the eye cannot see it make a morph pair the wrong two elements. Every
 * call site therefore builds its name through `viewTransitionName` rather than
 * concatenating by hand, and each prefix is scoped to the one flow that can have
 * both halves on screen.
 */
export const SERVICE_VISUAL_PREFIX = "service-visual"
export const GUIA_COVER_PREFIX = "guia-cover"
export const CASE_VISUAL_PREFIX = "case-visual"

/** The one shape every shared-element name is built with: `<prefix>-<id>`. */
export function viewTransitionName(prefix: string, id: string): string {
	return `${prefix}-${id}`
}
